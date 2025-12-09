import { useNavigate } from 'react-router-dom';
import { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import * as Storage from '../../utils/storage';
import * as Levels from '../../utils/divideLevels';
import Header from '../../components/shared/Header';
import FeedbackModal from '../../components/shared/FeedbackModal';
import RobuxCounter from '../../components/shared/RobuxCounter';
import DivisionLegend from './DivisionLegend';

const initialState = {
    currentScreen: 'welcome',
    currentLevel: 1,
    currentQuestion: null,
    currentChoices: [],
    session: null,
    sessionStartTime: null,
    hintsUsed: 0,
    isProcessing: false,
    robuxCount: 0,
    settings: { questionsPerLevel: 10 },
    showFeedback: false,
    feedbackData: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SCREEN': return { ...state, currentScreen: action.payload };
        case 'SET_LEVEL': return { ...state, currentLevel: action.payload };
        case 'SET_QUESTION': return { ...state, currentQuestion: action.payload.question, currentChoices: action.payload.choices, hintsUsed: 0 };
        case 'SET_SESSION': return { ...state, session: action.payload };
        case 'SET_SESSION_START': return { ...state, sessionStartTime: action.payload };
        case 'INCREMENT_HINTS': return { ...state, hintsUsed: state.hintsUsed + 1 };
        case 'SET_PROCESSING': return { ...state, isProcessing: action.payload };
        case 'SET_ROBUX': return { ...state, robuxCount: action.payload };
        case 'SET_SETTINGS': return { ...state, settings: action.payload };
        case 'SHOW_FEEDBACK': return { ...state, showFeedback: true, feedbackData: action.payload };
        case 'HIDE_FEEDBACK': return { ...state, showFeedback: false, isProcessing: false };
        case 'UPDATE_SESSION': return { ...state, session: { ...state.session, ...action.payload } };
        default: return state;
    }
};

function DivideGame() {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [hintText, setHintText] = useState('');
    const [sessionTime, setSessionTime] = useState('0:00');
    const [isPaused, setIsPaused] = useState(false);
    const robuxTimerRef = useRef(null);
    const lastRobuxMinuteRef = useRef(0);
    const isChangingLevelRef = useRef(false);
    const lastActivityRef = useRef(0);
    const pauseCheckRef = useRef(null);
    const pauseStartTimeRef = useRef(null);
    const totalPausedTimeRef = useRef(0);
    const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes

    useEffect(() => {
        dispatch({ type: 'SET_ROBUX', payload: Storage.getRobuxCount() });
        const savedSettings = Storage.getDivideSettings();
        dispatch({ type: 'SET_SETTINGS', payload: { ...state.settings, ...savedSettings } });
        const savedProgress = Storage.getDivideProgress();
        if (savedProgress.currentLevel) {
            dispatch({ type: 'SET_LEVEL', payload: savedProgress.currentLevel });
        }
        return () => {
            if (robuxTimerRef.current) clearInterval(robuxTimerRef.current);
            if (pauseCheckRef.current) clearInterval(pauseCheckRef.current);
        };
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
                pauseStartTimeRef.current = Date.now();
                if (robuxTimerRef.current) clearInterval(robuxTimerRef.current);
            }
        }, 1000);
        
        return () => {
            if (pauseCheckRef.current) clearInterval(pauseCheckRef.current);
        };
    }, [state.sessionStartTime, state.currentScreen, isPaused, INACTIVITY_TIMEOUT]);

    const recordActivity = useCallback(() => {
        lastActivityRef.current = Date.now();
        if (isPaused) {
            if (pauseStartTimeRef.current) {
                totalPausedTimeRef.current += Date.now() - pauseStartTimeRef.current;
                pauseStartTimeRef.current = null;
            }
            setIsPaused(false);
            if (state.session) {
                robuxTimerRef.current = setInterval(() => {
                    const elapsed = Date.now() - state.session.startTime - totalPausedTimeRef.current;
                    const minutes = Math.floor(elapsed / 60000);
                    if (minutes > lastRobuxMinuteRef.current) {
                        lastRobuxMinuteRef.current = minutes;
                        const newRobux = Storage.getRobuxCount() + 1;
                        Storage.setRobuxCount(newRobux);
                        dispatch({ type: 'SET_ROBUX', payload: newRobux });
                    }
                }, 1000);
            }
        }
    }, [isPaused, state.session]);

    useEffect(() => {
        if (!state.sessionStartTime || isPaused) return;
        const timer = setInterval(() => {
            const elapsed = Date.now() - state.sessionStartTime - totalPausedTimeRef.current;
            const mins = Math.floor(elapsed / 60000);
            const secs = Math.floor((elapsed % 60000) / 1000);
            setSessionTime(`${mins}:${secs.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(timer);
    }, [state.sessionStartTime, isPaused]);

    const generateQuestion = useCallback((levelOverride = null) => {
        const level = levelOverride !== null ? levelOverride : state.currentLevel;
        const levelConfig = Levels.getLevel(level);
        const question = Levels.generateQuestion(levelConfig);
        const choices = Levels.generateChoices(question.correctAnswer);
        dispatch({ type: 'SET_QUESTION', payload: { question, choices } });
    }, [state.currentLevel]);

    const startSession = (level) => {
        const targetLevel = level || state.currentLevel;
        const levelConfig = Levels.getLevel(targetLevel);
        if (!levelConfig) return;
        
        dispatch({ type: 'SET_LEVEL', payload: targetLevel });
        const newSession = { level: targetLevel, startTime: Date.now(), answers: [], bestStreak: 0, currentStreak: 0 };
        dispatch({ type: 'SET_SESSION', payload: newSession });
        dispatch({ type: 'SET_SESSION_START', payload: Date.now() });
        lastRobuxMinuteRef.current = 0;
        totalPausedTimeRef.current = 0;
        pauseStartTimeRef.current = null;
        setHintText('');

        if (robuxTimerRef.current) clearInterval(robuxTimerRef.current);
        robuxTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - newSession.startTime;
            const minutes = Math.floor(elapsed / 60000);
            if (minutes > lastRobuxMinuteRef.current) {
                lastRobuxMinuteRef.current = minutes;
                const newRobux = Storage.getRobuxCount() + 1;
                Storage.setRobuxCount(newRobux);
                dispatch({ type: 'SET_ROBUX', payload: newRobux });
            }
        }, 1000);

        const question = Levels.generateQuestion(levelConfig);
        const choices = Levels.generateChoices(question.correctAnswer);
        dispatch({ type: 'SET_QUESTION', payload: { question, choices } });
        dispatch({ type: 'SET_SCREEN', payload: 'game' });
    };

    const levelConfig = Levels.getLevel(state.currentLevel);

    const showHint = () => {
        if (state.currentQuestion?.hint) {
            setHintText(state.currentQuestion.hint);
            dispatch({ type: 'INCREMENT_HINTS' });
        }
    };

    const changeLevel = (newLevel) => {
        if (isChangingLevelRef.current) return;
        if (newLevel < 1 || newLevel > 9) return;
        
        isChangingLevelRef.current = true;
        
        dispatch({ type: 'SET_LEVEL', payload: newLevel });
        Storage.saveDivideProgress({ currentLevel: newLevel });
        
        const newLevelConfig = Levels.getLevel(newLevel);
        dispatch({ type: 'UPDATE_SESSION', payload: { answers: [], currentStreak: 0 } });
        setHintText('');
        Levels.resetRecentQuestions();
        
        const question = Levels.generateQuestion(newLevelConfig);
        const choices = Levels.generateChoices(question.correctAnswer);
        dispatch({ type: 'SET_QUESTION', payload: { question, choices } });
        
        setTimeout(() => {
            isChangingLevelRef.current = false;
        }, 300);
    };

    const processAnswer = useCallback((answer) => {
        if (state.isProcessing || !state.currentQuestion) return;
        recordActivity();
        dispatch({ type: 'SET_PROCESSING', payload: true });

        const isCorrect = answer === state.currentQuestion.correctAnswer;
        const questionsRequired = state.settings.questionsPerLevel;
        
        const correctCount = (state.session?.answers || []).filter(a => a.correct).length + (isCorrect ? 1 : 0);
        const newAnswers = [...(state.session?.answers || []), { correct: isCorrect }];
        const newStreak = isCorrect ? (state.session?.currentStreak || 0) + 1 : 0;
        const bestStreak = Math.max(state.session?.bestStreak || 0, newStreak);
        
        dispatch({ type: 'UPDATE_SESSION', payload: { 
            answers: newAnswers, currentStreak: newStreak, bestStreak,
            duration: Date.now() - state.session.startTime
        }});

        const { dividend, divisor, correctAnswer: correct } = state.currentQuestion;
        const explanation = isCorrect 
            ? `${dividend} ÷ ${divisor} = ${correct}` 
            : `The answer is ${dividend} ÷ ${divisor} = ${correct}`;
        dispatch({ type: 'SHOW_FEEDBACK', payload: { isCorrect, explanation }});

        if (isCorrect) {
            setTimeout(() => {
                if (!state.showFeedback) return;
                
                dispatch({ type: 'HIDE_FEEDBACK' });
                
                if (correctCount >= questionsRequired) {
                    const nextLevel = state.currentLevel < 9 ? state.currentLevel + 1 : state.currentLevel;
                    Storage.saveDivideProgress({ currentLevel: nextLevel });
                    dispatch({ type: 'SET_LEVEL', payload: nextLevel });
                    dispatch({ type: 'UPDATE_SESSION', payload: { answers: [], currentStreak: 0 } });
                    Levels.resetRecentQuestions();
                    generateQuestion(nextLevel);
                } else {
                    generateQuestion();
                }
            }, 1500);
        }
    }, [state.isProcessing, state.currentQuestion, state.session, state.settings.questionsPerLevel, state.currentLevel, state.showFeedback, generateQuestion, recordActivity]);

    const dismissFeedback = () => {
        if (!state.showFeedback) return;
        
        const wasCorrect = state.feedbackData?.isCorrect;
        dispatch({ type: 'HIDE_FEEDBACK' });
        
        if (!wasCorrect) return;
        
        const correctCount = (state.session?.answers || []).filter(a => a.correct).length;
        
        if (correctCount >= state.settings.questionsPerLevel) {
            const nextLevel = state.currentLevel < 9 ? state.currentLevel + 1 : state.currentLevel;
            Storage.saveDivideProgress({ currentLevel: nextLevel });
            dispatch({ type: 'SET_LEVEL', payload: nextLevel });
            dispatch({ type: 'UPDATE_SESSION', payload: { answers: [], currentStreak: 0 } });
            Levels.resetRecentQuestions();
            generateQuestion(nextLevel);
        } else {
            generateQuestion();
        }
    };

    const renderScreen = () => {
        switch (state.currentScreen) {
            case 'welcome':
                return (
                    <section className="screen screen-welcome active">
                        <div className="welcome-content">
                            <div className="welcome-robux">
                                <RobuxCounter count={state.robuxCount} onReset={() => { Storage.setRobuxCount(0); dispatch({ type: 'SET_ROBUX', payload: 0 }); }} />
                            </div>
                            <div className="welcome-icon">
                                <span style={{ fontSize: '80px' }}>➗</span>
                            </div>
                            <h2>DivideMaster</h2>
                            <p className="welcome-subtitle">Learn division through understanding</p>
                            <button className="btn btn-primary btn-large" onClick={() => startSession()}>Start Learning</button>
                        </div>
                    </section>
                );
            case 'game':
                return (
                    <section className="screen screen-game active">
                        <div className="game-header">
                            <button className="btn btn-back" onClick={() => navigate('/')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </button>
                            <div className="level-info">
                                <div className="level-nav">
                                    {state.currentLevel > 1 && (
                                        <button className="level-nav-btn" onClick={() => changeLevel(state.currentLevel - 1)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                                        </button>
                                    )}
                                    <span className="level-badge">Level {state.currentLevel}</span>
                                    {state.currentLevel < 9 && (
                                        <button className="level-nav-btn" onClick={() => changeLevel(state.currentLevel + 1)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                                        </button>
                                    )}
                                </div>
                                <span className="level-name">{levelConfig.name}</span>
                            </div>
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${(((state.session?.answers || []).filter(a => a.correct).length) / state.settings.questionsPerLevel) * 100}%` }}></div>
                                </div>
                                <span className="progress-text">{(state.session?.answers || []).filter(a => a.correct).length}/{state.settings.questionsPerLevel}</span>
                            </div>
                            <div className="session-timer">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 6v6l4 2"></path>
                                </svg>
                                <span>{sessionTime}</span>
                            </div>
                            <RobuxCounter count={state.robuxCount} showReset={false} />
                        </div>
                        <div className="game-layout">
                            <DivisionLegend divisor={levelConfig.divisor} />
                            <div className="game-content">
                                <div className="prompt-container">
                                    <p className="prompt-text">{state.currentQuestion?.prompt || 'Solve this!'}</p>
                                    {hintText && <p className="hint-text">{hintText}</p>}
                                </div>
                                <div className="equation-display">
                                    <span className="equation">{state.currentQuestion?.equation}</span>
                                </div>
                                <div className="multiple-choice-grid">
                                    {state.currentChoices.map((choice, i) => (
                                        <button key={i} className="choice-btn" onClick={() => processAnswer(choice)} disabled={state.isProcessing}>
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                                <button className="btn btn-hint" onClick={showHint}>Need a hint?</button>
                            </div>
                        </div>
                        <FeedbackModal show={state.showFeedback} data={state.feedbackData} onDismiss={dismissFeedback} />
                        {isPaused && (
                            <div className="pause-overlay" onClick={recordActivity}>
                                <div className="pause-content">
                                    <h2>⏸️ Paused</h2>
                                    <p>Game paused due to inactivity</p>
                                    <button className="btn btn-primary btn-large" onClick={recordActivity}>
                                        Resume
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                );
            case 'settings':
                return (
                    <section className="screen screen-settings active">
                        <div className="dashboard-header">
                            <button className="btn btn-back" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'welcome' })}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                                Back
                            </button>
                            <h2>Settings</h2>
                        </div>
                        <div className="dashboard-content">
                            <div className="dashboard-overview">
                                <div className="overview-card">
                                    <h3>Questions per Level</h3>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="30" 
                                        value={state.settings.questionsPerLevel}
                                        onChange={(e) => {
                                            const val = Math.min(30, Math.max(1, parseInt(e.target.value) || 10));
                                            const newSettings = { ...state.settings, questionsPerLevel: val };
                                            dispatch({ type: 'SET_SETTINGS', payload: newSettings });
                                            Storage.saveDivideSettings(newSettings);
                                        }}
                                        className="settings-number-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                );
            case 'dashboard':
                return (
                    <section className="screen screen-dashboard active">
                        <div className="dashboard-header">
                            <button className="btn btn-back" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'welcome' })}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                                Back
                            </button>
                            <h2>Progress Dashboard</h2>
                        </div>
                        <div className="dashboard-content">
                            <div className="dashboard-overview">
                                <div className="overview-card">
                                    <h3>Current Level</h3>
                                    <span className="overview-value">{state.currentLevel}</span>
                                </div>
                                <div className="overview-card">
                                    <h3>Robux Earned</h3>
                                    <span className="overview-value">{state.robuxCount}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <div className="app">
            <Header
                onSettings={() => dispatch({ type: 'SET_SCREEN', payload: 'settings' })}
                onDashboard={() => dispatch({ type: 'SET_SCREEN', payload: 'dashboard' })}
                onHome={() => navigate('/')}
            />
            <main className="main">
                {renderScreen()}
            </main>
        </div>
    );
}

export default DivideGame;
