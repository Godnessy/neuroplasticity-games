import { useReducer, useCallback, useRef, useEffect } from 'react';
import * as Storage from '../utils/storage';
import * as Levels from '../utils/levels';
import { APP_CONFIG } from '../utils/config';

const initialState = {
    currentScreen: 'welcome',
    currentLevel: 1,
    currentQuestion: null,
    session: null,
    sessionStartTime: null,
    hintsUsed: 0,
    consecutiveCorrect: 0,
    isProcessing: false,
    lastRobuxMinute: 0,
    robuxCount: 0,
    settings: null,
    showFeedback: false,
    feedbackData: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SCREEN':
            return { ...state, currentScreen: action.payload };
        case 'SET_LEVEL':
            return { ...state, currentLevel: action.payload };
        case 'SET_QUESTION':
            return { ...state, currentQuestion: action.payload, hintsUsed: 0 };
        case 'SET_SESSION':
            return { ...state, session: action.payload };
        case 'SET_SESSION_START':
            return { ...state, sessionStartTime: action.payload, lastRobuxMinute: 0 };
        case 'INCREMENT_HINTS':
            return { ...state, hintsUsed: state.hintsUsed + 1 };
        case 'SET_PROCESSING':
            return { ...state, isProcessing: action.payload };
        case 'SET_ROBUX':
            return { ...state, robuxCount: action.payload };
        case 'SET_SETTINGS':
            return { ...state, settings: action.payload };
        case 'SET_CONSECUTIVE_CORRECT':
            return { ...state, consecutiveCorrect: action.payload };
        case 'SHOW_FEEDBACK':
            return { ...state, showFeedback: true, feedbackData: action.payload };
        case 'HIDE_FEEDBACK':
            return { ...state, showFeedback: false, isProcessing: false };
        case 'UPDATE_SESSION':
            return { ...state, session: { ...state.session, ...action.payload } };
        default:
            return state;
    }
};

export const useGameState = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const sessionTimerRef = useRef(null);
    const robuxTimerRef = useRef(null);
    const lastRobuxMinuteRef = useRef(0);

    useEffect(() => {
        const settings = Storage.getSettings();
        const progress = Storage.getProgress();
        const robux = Storage.getRobuxCount();
        
        dispatch({ type: 'SET_SETTINGS', payload: settings });
        dispatch({ type: 'SET_LEVEL', payload: progress.currentLevel });
        dispatch({ type: 'SET_ROBUX', payload: robux });
        
        return () => {
            if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
            if (robuxTimerRef.current) clearInterval(robuxTimerRef.current);
        };
    }, []);

    const showScreen = useCallback((screen) => {
        dispatch({ type: 'SET_SCREEN', payload: screen });
    }, []);

    const updateSetting = useCallback((key, value) => {
        const newSettings = { ...state.settings, [key]: value };
        dispatch({ type: 'SET_SETTINGS', payload: newSettings });
        Storage.saveSettings(newSettings);
    }, [state.settings]);

    const generateQuestion = useCallback(() => {
        const levelConfig = Levels.getLevel(state.currentLevel);
        const question = Levels.generateQuestion(levelConfig);
        dispatch({ type: 'SET_QUESTION', payload: question });
    }, [state.currentLevel]);

    const startSession = useCallback((levelOverride = null) => {
        const level = levelOverride !== null ? levelOverride : state.currentLevel;
        
        if (levelOverride !== null) {
            dispatch({ type: 'SET_LEVEL', payload: level });
        }
        
        const levelConfig = Levels.getLevel(level);
        
        const newSession = {
            level,
            startTime: Date.now(),
            answers: [],
            hintsUsed: 0,
            currentStreak: 0,
            bestStreak: 0
        };
        
        dispatch({ type: 'SET_SESSION', payload: newSession });
        dispatch({ type: 'SET_SESSION_START', payload: Date.now() });
        
        lastRobuxMinuteRef.current = 0;
        
        // Start robux timer
        if (robuxTimerRef.current) clearInterval(robuxTimerRef.current);
        robuxTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - newSession.startTime;
            const minutes = Math.floor(elapsed / 60000);
            
            if (minutes > lastRobuxMinuteRef.current) {
                lastRobuxMinuteRef.current = minutes;
                const currentRobux = Storage.getRobuxCount();
                const newRobux = currentRobux + 1;
                Storage.setRobuxCount(newRobux);
                dispatch({ type: 'SET_ROBUX', payload: newRobux });
            }
        }, 1000);
        
        // Generate first question
        const question = Levels.generateQuestion(levelConfig);
        dispatch({ type: 'SET_QUESTION', payload: question });
        
        showScreen('game');
    }, [state.currentLevel, showScreen]);

    const processAnswer = useCallback((answer) => {
        if (state.isProcessing || !state.currentQuestion) return;
        
        dispatch({ type: 'SET_PROCESSING', payload: true });
        
        const isCorrect = answer === state.currentQuestion.correctAnswer;
        const levelConfig = Levels.getLevel(state.currentLevel);
        
        // Update table mastery
        const table = levelConfig.table || (levelConfig.tables ? levelConfig.tables[0] : 2);
        Storage.updateTableMastery(table, isCorrect);
        
        // Update session
        const newAnswers = [...(state.session?.answers || []), {
            question: state.currentQuestion,
            answer,
            correct: isCorrect,
            timestamp: Date.now()
        }];
        
        let newStreak = isCorrect ? (state.session?.currentStreak || 0) + 1 : 0;
        let bestStreak = Math.max(state.session?.bestStreak || 0, newStreak);
        
        dispatch({ type: 'UPDATE_SESSION', payload: { 
            answers: newAnswers,
            currentStreak: newStreak,
            bestStreak
        }});
        
        // Save progress
        const progress = Storage.getProgress();
        progress.totalQuestions++;
        if (isCorrect) progress.totalCorrect++;
        Storage.saveProgress(progress);
        
        // Build explanation
        let explanation = `${state.currentQuestion.a} × ${state.currentQuestion.b} = ${state.currentQuestion.correctAnswer}`;
        if (state.currentQuestion.derivationMethod) {
            explanation = Levels.getDerivationExplanation(
                state.currentQuestion.a,
                state.currentQuestion.b,
                state.currentQuestion.derivationMethod
            );
        }
        
        // Show feedback
        dispatch({ type: 'SHOW_FEEDBACK', payload: {
            isCorrect,
            explanation
        }});
        
        // Check if level complete
        if (newAnswers.length >= levelConfig.questionsRequired) {
            setTimeout(() => {
                if (robuxTimerRef.current) clearInterval(robuxTimerRef.current);
                showScreen('levelComplete');
            }, 100);
        }
    }, [state.isProcessing, state.currentQuestion, state.session, state.currentLevel, showScreen]);

    const dismissFeedback = useCallback(() => {
        dispatch({ type: 'HIDE_FEEDBACK' });
        
        const levelConfig = Levels.getLevel(state.currentLevel);
        if ((state.session?.answers?.length || 0) < levelConfig.questionsRequired) {
            generateQuestion();
        }
    }, [state.currentLevel, state.session, generateQuestion]);

    const showHint = useCallback(() => {
        const levelConfig = Levels.getLevel(state.currentLevel);
        dispatch({ type: 'INCREMENT_HINTS' });
        return Levels.getHint(levelConfig, state.hintsUsed);
    }, [state.currentLevel, state.hintsUsed]);

    const advanceLevel = useCallback(() => {
        const accuracy = state.session?.answers?.length > 0
            ? state.session.answers.filter(a => a.correct).length / state.session.answers.length
            : 0;
        
        let nextLevel = state.currentLevel;
        if (accuracy >= 0.75 && state.currentLevel < 12) {
            nextLevel = state.currentLevel + 1;
        }
        
        const progress = Storage.getProgress();
        progress.currentLevel = nextLevel;
        if (!progress.levelsCompleted.includes(state.currentLevel)) {
            progress.levelsCompleted.push(state.currentLevel);
        }
        Storage.saveProgress(progress);
        
        startSession(nextLevel);
    }, [state.session, state.currentLevel, startSession]);

    const repeatLevel = useCallback(() => {
        startSession(state.currentLevel);
    }, [state.currentLevel, startSession]);

    const goToPrevLevel = useCallback(() => {
        if (state.currentLevel > 1) {
            startSession(state.currentLevel - 1);
        }
    }, [state.currentLevel, startSession]);

    const goToNextLevel = useCallback(() => {
        if (state.currentLevel < 12) {
            startSession(state.currentLevel + 1);
        }
    }, [state.currentLevel, startSession]);

    const goHome = useCallback(() => {
        if (robuxTimerRef.current) clearInterval(robuxTimerRef.current);
        
        const progress = Storage.getProgress();
        progress.currentLevel = state.currentLevel;
        progress.lastPlayed = new Date().toISOString();
        Storage.saveProgress(progress);
        
        showScreen('welcome');
    }, [state.currentLevel, showScreen]);

    const resetRobux = useCallback(() => {
        Storage.setRobuxCount(0);
        dispatch({ type: 'SET_ROBUX', payload: 0 });
    }, []);

    const hasContinue = useCallback(() => {
        const progress = Storage.getProgress();
        return progress.lastPlayed !== null;
    }, []);

    const continueGame = useCallback(() => {
        const progress = Storage.getProgress();
        startSession(progress.currentLevel);
    }, [startSession]);

    const resetProgress = useCallback(() => {
        Storage.resetProgress();
        dispatch({ type: 'SET_LEVEL', payload: 1 });
        showScreen('welcome');
    }, [showScreen]);

    const formatDuration = useCallback((ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    const getSessionTime = useCallback(() => {
        if (!state.sessionStartTime) return '0:00';
        const elapsed = Date.now() - state.sessionStartTime;
        return formatDuration(elapsed);
    }, [state.sessionStartTime, formatDuration]);

    return {
        state,
        showScreen,
        updateSetting,
        startSession,
        processAnswer,
        advanceLevel,
        repeatLevel,
        goToPrevLevel,
        goToNextLevel,
        goHome,
        resetRobux,
        showHint,
        dismissFeedback,
        hasContinue,
        continueGame,
        resetProgress,
        formatDuration,
        getSessionTime,
        generateQuestion
    };
};
