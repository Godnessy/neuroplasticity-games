import { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import * as Storage from '../utils/storage';
import * as Levels from '../utils/levels';
import * as Adaptive from '../utils/adaptive';
import * as Audio from '../utils/audio';
import { APP_CONFIG, CLOCK_CENTER_IMAGES } from '../utils/config';
import * as RobuxTimer from '../utils/robuxTimerService';
import * as Statistics from '../utils/statisticsService';

const initialState = {
    currentScreen: 'welcome',
    currentLevel: 1,
    currentQuestion: null,
    session: null,
    timerValue: 0,
    sessionStartTime: null,
    showingNumbers: false,
    hintsUsed: 0,
    selectedHour: null,
    selectedMinute: null,
    consecutiveCorrect: 0,
    characterIndex: 0,
    isProcessing: false,
    lastAnswerCorrect: false,
    lastRobuxMinute: 0,
    modalShownTime: 0,
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
            return { ...state, currentQuestion: action.payload, hintsUsed: 0, showingNumbers: false };
        case 'SET_SESSION':
            return { ...state, session: action.payload };
        case 'SET_TIMER':
            return { ...state, timerValue: action.payload };
        case 'SET_SESSION_START':
            return { ...state, sessionStartTime: action.payload, lastRobuxMinute: 0 };
        case 'SET_SHOWING_NUMBERS':
            return { ...state, showingNumbers: action.payload };
        case 'INCREMENT_HINTS':
            return { ...state, hintsUsed: state.hintsUsed + 1 };
        case 'SET_SELECTED_HOUR':
            return { ...state, selectedHour: action.payload };
        case 'SET_SELECTED_MINUTE':
            return { ...state, selectedMinute: action.payload };
        case 'SET_PROCESSING':
            return { ...state, isProcessing: action.payload };
        case 'SET_LAST_ANSWER':
            return { ...state, lastAnswerCorrect: action.payload };
        case 'SET_MODAL_TIME':
            return { ...state, modalShownTime: action.payload };
        case 'SET_ROBUX':
            return { ...state, robuxCount: action.payload };
        case 'SET_SETTINGS':
            return { ...state, settings: action.payload };
        case 'SET_CONSECUTIVE_CORRECT':
            return { ...state, consecutiveCorrect: action.payload };
        case 'SET_CHARACTER_INDEX':
            return { ...state, characterIndex: action.payload };
        case 'SHOW_FEEDBACK':
            return { ...state, showFeedback: true, feedbackData: action.payload, modalShownTime: Date.now() };
        case 'HIDE_FEEDBACK':
            return { ...state, showFeedback: false, isProcessing: false };
        case 'RESET_INPUTS':
            return { ...state, selectedHour: null, selectedMinute: null };
        case 'UPDATE_SESSION':
            return { ...state, session: { ...state.session, ...action.payload } };
        case 'SET_LAST_ROBUX_MINUTE':
            return { ...state, lastRobuxMinute: action.payload };
        default:
            return state;
    }
};

export const useGameState = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isPaused, setIsPaused] = useState(false);
    const questionTimerRef = useRef(null);
    const sessionTimerRef = useRef(null);
    const questionStartTimeRef = useRef(null);
    const lastActivityRef = useRef(0);
    const pauseCheckRef = useRef(null);
    const currentSessionIdRef = useRef(null);
    const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes

    useEffect(() => {
        const settings = Storage.getSettings();
        const progress = Storage.getProgress();
        const robux = Storage.getRobuxCount();

        dispatch({ type: 'SET_SETTINGS', payload: settings });
        dispatch({ type: 'SET_LEVEL', payload: progress.currentLevel });
        dispatch({ type: 'SET_ROBUX', payload: robux });

        Audio.init();
        Audio.setEnabled(settings.audioEnabled);

        document.body.setAttribute('data-theme', settings.theme);
        document.body.setAttribute('data-font', settings.font);
        document.body.setAttribute('data-font-size', settings.fontSize);
        document.body.setAttribute('data-clock-size', settings.clockSize);
        if (settings.highContrast) {
            document.body.setAttribute('data-contrast', 'high');
        }
    }, []);

    // Poll for robux updates
    useEffect(() => {
        const updateRobux = () => dispatch({ type: 'SET_ROBUX', payload: Storage.getRobuxCount() });
        const interval = setInterval(updateRobux, 1000);
        return () => clearInterval(interval);
    }, []);

    // Inactivity pause check
    useEffect(() => {
        if (!state.sessionStartTime || state.currentScreen !== 'game') {
            if (pauseCheckRef.current) clearInterval(pauseCheckRef.current);
            return;
        }
        
        lastActivityRef.current = Date.now();
        
        pauseCheckRef.current = setInterval(() => {
            if (Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT && !isPaused) {
                setIsPaused(true);
                RobuxTimer.pauseTimer();
                if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
                // End statistics session when pausing due to inactivity
                if (currentSessionIdRef.current) {
                    const robuxEarned = RobuxTimer.getRobuxEarned();
                    Statistics.endSession(currentSessionIdRef.current, robuxEarned, 'pause');
                    currentSessionIdRef.current = null;
                }
            }
        }, 1000);
        
        return () => {
            if (pauseCheckRef.current) clearInterval(pauseCheckRef.current);
        };
    }, [state.sessionStartTime, state.currentScreen, isPaused, INACTIVITY_TIMEOUT]);

    // Track activity
    const recordActivity = useCallback(() => {
        lastActivityRef.current = Date.now();
        if (isPaused) {
            setIsPaused(false);
            // Resume timers
            RobuxTimer.resumeTimer();
            if (state.session) {
                sessionTimerRef.current = setInterval(() => {
                    dispatch({ type: 'SET_TIMER', payload: Date.now() });
                }, 1000);
            }
            // Start new statistics session when resuming from pause
            if (!currentSessionIdRef.current && state.currentLevel) {
                currentSessionIdRef.current = Statistics.createSession('clockwise', state.currentLevel);
            }
        }
    }, [isPaused, state.session, state.currentLevel]);

    const showScreen = useCallback((screen) => {
        dispatch({ type: 'SET_SCREEN', payload: screen });
    }, []);

    const updateSetting = useCallback((key, value) => {
        const settings = Storage.getSettings();
        settings[key] = value;
        Storage.saveSettings(settings);
        dispatch({ type: 'SET_SETTINGS', payload: settings });

        if (key === 'theme') document.body.setAttribute('data-theme', value);
        if (key === 'font') document.body.setAttribute('data-font', value);
        if (key === 'fontSize') document.body.setAttribute('data-font-size', value);
        if (key === 'clockSize') document.body.setAttribute('data-clock-size', value);
        if (key === 'highContrast') {
            if (value) document.body.setAttribute('data-contrast', 'high');
            else document.body.removeAttribute('data-contrast');
        }
        if (key === 'audioEnabled') Audio.setEnabled(value);
    }, []);

    const generateQuestion = useCallback(() => {
        const levelConfig = Levels.getLevel(state.currentLevel);
        const question = Levels.generateQuestion(levelConfig);
        dispatch({ type: 'SET_QUESTION', payload: question });
        questionStartTimeRef.current = Date.now();
        
        if (levelConfig.timeAllowed) {
            startQuestionTimer(levelConfig.timeAllowed);
        }
    }, [state.currentLevel]);

    const startSession = useCallback((levelOverride = null) => {
        const level = levelOverride !== null ? levelOverride : state.currentLevel;
        
        if (levelOverride !== null) {
            dispatch({ type: 'SET_LEVEL', payload: level });
        }
        
        const session = {
            level: level,
            startTime: Date.now(),
            answers: [],
            currentStreak: 0,
            bestStreak: 0
        };
        
        dispatch({ type: 'SET_SESSION', payload: session });
        dispatch({ type: 'SET_SESSION_START', payload: Date.now() });
        dispatch({ type: 'SET_SCREEN', payload: 'game' });
        
        if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = setInterval(() => {
            dispatch({ type: 'SET_TIMER', payload: Date.now() });
        }, 1000);

        // Start centralized robux timer
        RobuxTimer.startTimer('clockwise');

        // Create statistics session
        currentSessionIdRef.current = Statistics.createSession('clockwise', level);

        const nextCharIndex = (state.characterIndex + 1) % CLOCK_CENTER_IMAGES.length;
        dispatch({ type: 'SET_CHARACTER_INDEX', payload: nextCharIndex });
        
        const levelConfig = Levels.getLevel(level);
        const question = Levels.generateQuestion(levelConfig);
        dispatch({ type: 'SET_QUESTION', payload: question });
        questionStartTimeRef.current = Date.now();
    }, [state.currentLevel, state.characterIndex, state.lastRobuxMinute]);

    const startQuestionTimer = useCallback((time) => {
        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        
        const session = state.session;
        const recentAnswers = session?.answers?.slice(-5) || [];
        const adjustedTime = Adaptive.adjustTimeLimit(time, recentAnswers);
        
        let remaining = adjustedTime;
        dispatch({ type: 'SET_TIMER', payload: remaining });
        
        questionTimerRef.current = setInterval(() => {
            remaining--;
            dispatch({ type: 'SET_TIMER', payload: remaining });
            
            if (remaining <= 0) {
                clearInterval(questionTimerRef.current);
                processAnswer(null, null, true);
            }
        }, 1000);
    }, [state.session]);

    const stopQuestionTimer = useCallback(() => {
        if (questionTimerRef.current) {
            clearInterval(questionTimerRef.current);
            questionTimerRef.current = null;
        }
    }, []);

    const processAnswer = useCallback((hour, minute, timedOut = false) => {
        stopQuestionTimer();
        dispatch({ type: 'SET_PROCESSING', payload: true });
        
        const question = state.currentQuestion;
        const correct = question.correctAnswer;
        const levelConfig = Levels.getLevel(state.currentLevel);
        
        let isCorrect;
        // Check if this question asked for 24-hour format
        const shouldUse24Hour = correct.askFor24Hour !== undefined 
            ? correct.askFor24Hour 
            : (levelConfig.show24Hour && correct.hour24 !== undefined);
        
        if (shouldUse24Hour) {
            isCorrect = !timedOut && hour === correct.hour24 && minute === correct.minute24;
        } else {
            isCorrect = !timedOut && hour === correct.hour && minute === correct.minute;
        }
        
        dispatch({ type: 'SET_LAST_ANSWER', payload: isCorrect });

        const responseTime = Date.now() - questionStartTimeRef.current;

        // Record answer in statistics
        if (currentSessionIdRef.current) {
            Statistics.addAnswerToSession(currentSessionIdRef.current, {
                correct: isCorrect,
                responseTime: responseTime,
                level: state.currentLevel
            });
        }

        if (isCorrect) {
            const newAnswers = [...state.session.answers, {
                question: { hour: question.hour, minute: question.minute },
                answer: timedOut ? null : { hour, minute },
                correct: isCorrect,
                responseTime,
                timedOut,
                hintsUsed: state.hintsUsed
            }];
            
            const newStreak = state.session.currentStreak + 1;
            const bestStreak = Math.max(newStreak, state.session.bestStreak);
            
            dispatch({ type: 'UPDATE_SESSION', payload: { 
                answers: newAnswers, 
                currentStreak: newStreak, 
                bestStreak 
            }});
            
            Storage.updateErrorPattern(state.currentLevel, question.handCombination, isCorrect);
            
            const progress = Storage.getProgress();
            progress.totalCorrect += 1;
            progress.totalQuestions += 1;
            progress.currentLevel = state.currentLevel;
            progress.lastPlayed = new Date().toISOString();
            Storage.saveProgress(progress);
            
            const newConsecutive = state.consecutiveCorrect + 1;
            dispatch({ type: 'SET_CONSECUTIVE_CORRECT', payload: newConsecutive >= 3 ? 0 : newConsecutive });
        } else {
            dispatch({ type: 'UPDATE_SESSION', payload: { currentStreak: 0 }});
            dispatch({ type: 'SET_CONSECUTIVE_CORRECT', payload: 0 });
        }
        
        let correctTimeStr;
        if (shouldUse24Hour) {
            correctTimeStr = `${correct.hour24}:${String(correct.minute24).padStart(2, '0')}`;
        } else {
            const ampm = correct.isPM ? 'PM' : 'AM';
            correctTimeStr = `${correct.hour}:${String(correct.minute).padStart(2, '0')} ${ampm}`;
        }
        
        const explanation = isCorrect 
            ? Levels.getExplanation(question, null, isCorrect, levelConfig)
            : `The correct answer is <strong style="color: var(--color-primary); font-size: 1.2em;">${correctTimeStr}</strong>`;
        
        Audio.speakFeedback(isCorrect, isCorrect ? '' : `The correct answer is ${correctTimeStr}`);
        
        dispatch({ type: 'SHOW_FEEDBACK', payload: { isCorrect, timedOut, explanation, question } });
        
        if (isCorrect) {
            const answeredCount = state.session.answers.length + 1;
            if (answeredCount >= levelConfig.questionsRequired) {
                setTimeout(() => {
                    dispatch({ type: 'HIDE_FEEDBACK' });
                    completeLevelSession();
                }, 1500);
            } else {
                generateQuestion();
                setTimeout(() => {
                    dispatch({ type: 'HIDE_FEEDBACK' });
                }, 1500);
            }
        } else {
            setTimeout(() => {
                dispatch({ type: 'HIDE_FEEDBACK' });
                dispatch({ type: 'RESET_INPUTS' });
            }, 1500);
        }
    }, [state.currentQuestion, state.currentLevel, state.session, state.hintsUsed, state.consecutiveCorrect, generateQuestion, stopQuestionTimer]);

    const completeLevelSession = useCallback(() => {
        if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);

        // End statistics session
        if (currentSessionIdRef.current) {
            const robuxEarned = RobuxTimer.getRobuxEarned();
            Statistics.endSession(currentSessionIdRef.current, robuxEarned, 'completion');
            currentSessionIdRef.current = null;
        }

        RobuxTimer.stopTimer();

        const session = state.session;
        const accuracy = Adaptive.calculateSessionAccuracy(session);
        const duration = Date.now() - session.startTime;
        
        const progress = Storage.getProgress();
        progress.totalCorrect += session.answers.filter(a => a.correct).length;
        progress.totalQuestions += session.answers.length;
        progress.totalPlayTime += Math.round(duration / 1000);
        progress.sessionsCount++;
        progress.levelAccuracies[state.currentLevel] = accuracy;
        progress.lastPlayed = new Date().toISOString();
        
        Storage.saveProgress(progress);
        Storage.addSession({
            level: state.currentLevel,
            accuracy,
            duration,
            questionsAnswered: session.answers.length,
            bestStreak: session.bestStreak
        });
        
        dispatch({ type: 'SET_SCREEN', payload: 'levelComplete' });
    }, [state.session, state.currentLevel]);

    const advanceLevel = useCallback(() => {
        const progress = Storage.getProgress();
        let newLevel = state.currentLevel;
        if (state.currentLevel < 12) {
            newLevel = state.currentLevel + 1;
            progress.currentLevel = newLevel;
            if (!progress.levelsCompleted.includes(state.currentLevel)) {
                progress.levelsCompleted.push(state.currentLevel);
            }
            Storage.saveProgress(progress);
        }
        startSession(newLevel);
    }, [state.currentLevel, startSession]);

    const repeatLevel = useCallback(() => {
        startSession(state.currentLevel);
    }, [state.currentLevel, startSession]);

    const goToPrevLevel = useCallback(() => {
        if (state.currentLevel > 1) {
            const newLevel = state.currentLevel - 1;
            dispatch({ type: 'SET_LEVEL', payload: newLevel });
            dispatch({ type: 'UPDATE_SESSION', payload: { level: newLevel } });
            const levelConfig = Levels.getLevel(newLevel);
            const question = Levels.generateQuestion(levelConfig);
            dispatch({ type: 'SET_QUESTION', payload: question });
        }
    }, [state.currentLevel]);

    const goToNextLevel = useCallback(() => {
        if (state.currentLevel < 14) {
            const newLevel = state.currentLevel + 1;
            dispatch({ type: 'SET_LEVEL', payload: newLevel });
            dispatch({ type: 'UPDATE_SESSION', payload: { level: newLevel } });
            const levelConfig = Levels.getLevel(newLevel);
            const question = Levels.generateQuestion(levelConfig);
            dispatch({ type: 'SET_QUESTION', payload: question });
        }
    }, [state.currentLevel]);

    const endSession = useCallback(() => {
        if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
        RobuxTimer.stopTimer();
        stopQuestionTimer();

        dispatch({ type: 'SET_SESSION', payload: null });
        dispatch({ type: 'SET_SCREEN', payload: 'welcome' });
    }, [stopQuestionTimer]);

    const goHome = useCallback(() => {
        if (state.session && state.session.answers.length > 0) {
            if (!confirm('Return to home? Your current level progress will be saved.')) {
                return;
            }
        }
        const progress = Storage.getProgress();
        progress.currentLevel = state.currentLevel;
        progress.lastPlayed = new Date().toISOString();
        Storage.saveProgress(progress);
        endSession();
    }, [state.session, state.currentLevel, endSession]);

    const resetRobux = useCallback(() => {
        if (confirm('Reset Robux counter to 0?')) {
            Storage.setRobuxCount(0);
            dispatch({ type: 'SET_ROBUX', payload: 0 });
        }
    }, []);

    const showHint = useCallback(() => {
        const levelConfig = Levels.getLevel(state.currentLevel);
        const hint = Levels.getHint(levelConfig, state.hintsUsed);
        dispatch({ type: 'INCREMENT_HINTS' });
        Audio.speakHint(hint);
        return hint;
    }, [state.currentLevel, state.hintsUsed]);

    const toggleNumbers = useCallback(() => {
        dispatch({ type: 'SET_SHOWING_NUMBERS', payload: !state.showingNumbers });
    }, [state.showingNumbers]);

    const setSelectedHour = useCallback((hour) => {
        dispatch({ type: 'SET_SELECTED_HOUR', payload: hour });
    }, []);

    const setSelectedMinute = useCallback((minute) => {
        dispatch({ type: 'SET_SELECTED_MINUTE', payload: minute });
    }, []);

    const dismissFeedback = useCallback(() => {
        if (Date.now() - state.modalShownTime > 300) {
            dispatch({ type: 'HIDE_FEEDBACK' });
            if (!state.lastAnswerCorrect) {
                dispatch({ type: 'RESET_INPUTS' });
            }
        }
    }, [state.modalShownTime, state.lastAnswerCorrect]);

    const hasContinue = useCallback(() => {
        const progress = Storage.getProgress();
        return progress.currentLevel > 1 || progress.totalQuestions > 0;
    }, []);

    const continueGame = useCallback(() => {
        const progress = Storage.getProgress();
        startSession(progress.currentLevel);
    }, [startSession]);

    const resetProgress = useCallback(() => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            Storage.resetProgress();
            dispatch({ type: 'SET_LEVEL', payload: 1 });
            dispatch({ type: 'SET_SCREEN', payload: 'welcome' });
        }
    }, []);

    const formatDuration = useCallback((ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    const getSessionTime = useCallback(() => {
        if (!state.sessionStartTime) return '0:00';
        const elapsed = RobuxTimer.getSessionDuration() * 1000; // Convert seconds to milliseconds
        return formatDuration(elapsed);
    }, [state.sessionStartTime, formatDuration]);

    return {
        state,
        dispatch,
        showScreen,
        updateSetting,
        startSession,
        generateQuestion,
        processAnswer,
        advanceLevel,
        repeatLevel,
        goToPrevLevel,
        goToNextLevel,
        endSession,
        goHome,
        resetRobux,
        showHint,
        toggleNumbers,
        setSelectedHour,
        setSelectedMinute,
        dismissFeedback,
        hasContinue,
        continueGame,
        resetProgress,
        formatDuration,
        getSessionTime,
        stopQuestionTimer,
        isPaused,
        recordActivity,
        currentSessionIdRef
    };
};
