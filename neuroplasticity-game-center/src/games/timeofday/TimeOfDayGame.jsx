import { useNavigate } from 'react-router-dom';
import { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import * as Storage from '../../utils/storage';
import * as Levels from '../../utils/timeOfDayLevels';
import * as RobuxTimer from '../../utils/robuxTimerService';
import * as Statistics from '../../utils/statisticsService';
import * as GlobalTimer from '../../utils/globalSessionTimer';
import Header from '../../components/shared/Header';
import FeedbackModal from '../../components/shared/FeedbackModal';
import RobuxCounter from '../../components/shared/RobuxCounter';
import PeriodImage from './PeriodImage';
import BreakModal from '../../components/shared/BreakModal';

const initialState = {
    currentScreen: 'welcome',
    previousScreen: null,
    currentLevel: 1,
    currentQuestion: null,
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
        case 'SET_SCREEN': return { ...state, previousScreen: state.currentScreen, currentScreen: action.payload };
        case 'SET_LEVEL': return { ...state, currentLevel: action.payload };
        case 'SET_QUESTION': return { ...state, currentQuestion: action.payload, hintsUsed: 0 };
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

function TimeOfDayGame() {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [hintText, setHintText] = useState('');
    const [sessionTime, setSessionTime] = useState(GlobalTimer.getFormattedTime());
    const [isPaused, setIsPaused] = useState(false);
    const [showBreakModal, setShowBreakModal] = useState(false);
    const [breakSessionStats, setBreakSessionStats] = useState(null);
    const lastActivityRef = useRef(0);
    const pauseCheckRef = useRef(null);
    const currentSessionIdRef = useRef(null);
    const INACTIVITY_TIMEOUT = 2 * 60 * 1000;
    const BREAK_REMINDER_TIME = 20 * 60;

    useEffect(() => {
        dispatch({ type: 'SET_ROBUX', payload: Storage.getRobuxCount() });
        const savedSettings = Storage.getTimeOfDaySettings();
        dispatch({ type: 'SET_SETTINGS', payload: { ...state.settings, ...savedSettings } });
        const savedProgress = Storage.getTimeOfDayProgress();
        if (savedProgress.currentLevel) {
            dispatch({ type: 'SET_LEVEL', payload: savedProgress.currentLevel });
        }
        
        // Restore active game state if returning from stats
        const activeState = Storage.getActiveGameState('timeofday');
        if (activeState && activeState.currentScreen === 'game') {
            dispatch({ type: 'SET_SCREEN', payload: 'game' });
            dispatch({ type: 'SET_LEVEL', payload: activeState.currentLevel });
            dispatch({ type: 'SET_SESSION', payload: activeState.session });
            dispatch({ type: 'SET_SESSION_START', payload: activeState.sessionStartTime });
            if (activeState.currentQuestion) {
                dispatch({ type: 'SET_QUESTION', payload: activeState.currentQuestion });
            }
            // Restart the robux timer
            RobuxTimer.startTimer('timeofday');
            // Unfreeze the global timer (was frozen when going to stats)
            GlobalTimer.unfreezeTimer();
            // Create new statistics session
            currentSessionIdRef.current = Statistics.createSession('timeofday', activeState.currentLevel);
            Storage.clearActiveGameState('timeofday');
        }
        
        return () => {
            // End statistics session if active
            if (currentSessionIdRef.current) {
                const robuxEarned = RobuxTimer.getRobuxEarned();
                Statistics.endSession(currentSessionIdRef.current, robuxEarned, 'navigation');
                currentSessionIdRef.current = null;
            }
            RobuxTimer.stopTimer();
            // Freeze global timer when leaving game (will resume when entering another game)
            GlobalTimer.freezeTimer();
            if (pauseCheckRef.current) clearInterval(pauseCheckRef.current);
        };
    }, []);

    // Poll for robux updates
    useEffect(() => {
        const updateRobux = () => dispatch({ type: 'SET_ROBUX', payload: Storage.getRobuxCount() });
        const interval = setInterval(updateRobux, 1000);
        return () => clearInterval(interval);
    }, []);

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
                GlobalTimer.pauseTimer();
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

    const recordActivity = useCallback(() => {
        lastActivityRef.current = Date.now();
        // Record activity in global timer to prevent session timeout
        GlobalTimer.recordActivity();
        if (isPaused) {
            setIsPaused(false);
            RobuxTimer.resumeTimer();
            GlobalTimer.resumeTimer();
            // Start new statistics session when resuming from pause
            if (!currentSessionIdRef.current && state.currentLevel) {
                currentSessionIdRef.current = Statistics.createSession('timeofday', state.currentLevel);
            }
        }
    }, [isPaused, state.currentLevel]);

    useEffect(() => {
        if (!state.sessionStartTime || isPaused) return;
        const timer = setInterval(() => {
            // Use global timer for session time display
            setSessionTime(GlobalTimer.getFormattedTime());
        }, 1000);
        return () => clearInterval(timer);
    }, [state.sessionStartTime, isPaused]);

    // Check for 20-minute break reminder
    useEffect(() => {
        if (!state.sessionStartTime || state.currentScreen !== 'game' || isPaused || showBreakModal) return;

        const checkBreakTime = setInterval(() => {
            // Note: state.session is captured by closure and will have latest value
            const continuousTime = Statistics.getContinuousPlayTime();
            if (continuousTime >= BREAK_REMINDER_TIME) {
                const correctAnswers = (state.session?.answers || []).filter(a => a.correct).length;
                const totalAnswers = (state.session?.answers || []).length;
                const robuxEarned = RobuxTimer.getRobuxEarned();
                const playTime = RobuxTimer.getSessionDuration();

                setBreakSessionStats({
                    playTime,
                    questionsAnswered: totalAnswers,
                    correctAnswers,
                    robuxEarned
                });
                setShowBreakModal(true);
            }
        }, 5000);

        return () => clearInterval(checkBreakTime);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.sessionStartTime, state.currentScreen, isPaused, showBreakModal, BREAK_REMINDER_TIME]);

    const generateQuestion = useCallback((levelOverride = null) => {
        const level = levelOverride !== null ? levelOverride : state.currentLevel;
        const levelConfig = Levels.getLevel(level);
        const question = Levels.generateQuestion(levelConfig);
        dispatch({ type: 'SET_QUESTION', payload: question });
    }, [state.currentLevel]);

    const startSession = (level) => {
        const targetLevel = level || state.currentLevel;
        const levelConfig = Levels.getLevel(targetLevel);
        if (!levelConfig) return;
        
        dispatch({ type: 'SET_LEVEL', payload: targetLevel });
        const newSession = { level: targetLevel, startTime: Date.now(), answers: [], bestStreak: 0, currentStreak: 0 };
        dispatch({ type: 'SET_SESSION', payload: newSession });
        dispatch({ type: 'SET_SESSION_START', payload: Date.now() });
        setHintText('');

        // Start centralized robux timer
        RobuxTimer.startTimer('timeofday');
        
        // Start global session timer (continues across games)
        GlobalTimer.startSession();

        // Create statistics session
        currentSessionIdRef.current = Statistics.createSession('timeofday', targetLevel);

        const question = Levels.generateQuestion(levelConfig);
        dispatch({ type: 'SET_QUESTION', payload: question });
        dispatch({ type: 'SET_SCREEN', payload: 'game' });
    };

    const levelConfig = Levels.getLevel(state.currentLevel);

    const showHint = () => {
        if (state.currentQuestion?.hint) {
            setHintText(state.currentQuestion.hint);
            dispatch({ type: 'INCREMENT_HINTS' });
        }
    };

    const handleTakeBreak = () => {
        if (currentSessionIdRef.current) {
            const robuxEarned = RobuxTimer.getRobuxEarned();
            Statistics.endSession(currentSessionIdRef.current, robuxEarned, 'break_modal');
            currentSessionIdRef.current = null;
        }
        RobuxTimer.stopTimer();
        setShowBreakModal(false);
        navigate('/');
    };

    const handleContinuePlaying = () => {
        Statistics.resetContinuousPlayTimer();
        setShowBreakModal(false);
    };

    const processAnswer = useCallback((answer) => {
        if (state.isProcessing || !state.currentQuestion) return;
        recordActivity();
        dispatch({ type: 'SET_PROCESSING', payload: true });

        const isCorrect = answer === state.currentQuestion.correctAnswer;
        const questionsRequired = state.settings.questionsPerLevel;

        // Record answer in statistics
        if (currentSessionIdRef.current) {
            Statistics.addAnswerToSession(currentSessionIdRef.current, {
                correct: isCorrect,
                responseTime: 0, // TimeOfDay doesn't track individual response times
                level: state.currentLevel
            });
        }

        const correctCount = (state.session?.answers || []).filter(a => a.correct).length + (isCorrect ? 1 : 0);
        const newAnswers = [...(state.session?.answers || []), { correct: isCorrect }];
        const newStreak = isCorrect ? (state.session?.currentStreak || 0) + 1 : 0;
        const bestStreak = Math.max(state.session?.bestStreak || 0, newStreak);
        
        dispatch({ type: 'UPDATE_SESSION', payload: { 
            answers: newAnswers, currentStreak: newStreak, bestStreak,
            duration: Date.now() - state.session.startTime
        }});

        const { period, questionType } = state.currentQuestion;
        let explanation;
        if (questionType.includes('norwegian')) {
            explanation = isCorrect 
                ? `${period.english} = ${period.norwegian}` 
                : `The answer is ${period.english} = ${period.norwegian}`;
        } else {
            explanation = isCorrect 
                ? `Correct! ${period.english}` 
                : `The answer is ${period.english}`;
        }
        
        dispatch({ type: 'SHOW_FEEDBACK', payload: { isCorrect, explanation }});

        if (isCorrect) {
            setTimeout(() => {
                if (!state.showFeedback) return;
                
                dispatch({ type: 'HIDE_FEEDBACK' });
                
                if (correctCount >= questionsRequired) {
                    const nextLevel = state.currentLevel; // Single level game - stay on level 1
                    Storage.saveTimeOfDayProgress({ currentLevel: nextLevel });
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
            const nextLevel = state.currentLevel; // Single level game - stay on level 1
            Storage.saveTimeOfDayProgress({ currentLevel: nextLevel });
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
                                <span style={{ fontSize: '80px' }}>🌅</span>
                            </div>
                            <h2>Time of Day</h2>
                            <p className="welcome-subtitle">Learn times of day in English & Norwegian</p>
                            <button className="btn btn-primary btn-large" onClick={() => startSession()}>Start Learning</button>
                            <button className="btn btn-secondary" onClick={() => navigate('/stats?game=timeofday', { state: { from: '/timeofday' } })} style={{ marginTop: '10px' }}>
                                📊 View Statistics
                            </button>
                        </div>
                    </section>
                );
            case 'game':
                return (
                    <section className="screen screen-game active">
                        <div className="game-header">
                            <button className="btn btn-back" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'welcome' })}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <div className="level-info">
                                <span className="level-badge">{levelConfig.name}</span>
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
                        <div className="game-layout timeofday-layout">
                            <div className="game-content">
                                {state.currentQuestion?.showImage && (
                                    <PeriodImage periodKey={state.currentQuestion.periodKey} />
                                )}
                                {state.currentQuestion?.showWord && (
                                    <div className="word-display">
                                        <span className="big-word">{state.currentQuestion.showWord}</span>
                                    </div>
                                )}
                                <div className="prompt-container">
                                    <p className="prompt-text">{state.currentQuestion?.prompt || 'Answer the question!'}</p>
                                    {state.currentQuestion?.description && (
                                        <p className="question-description">{state.currentQuestion.description}</p>
                                    )}
                                    {hintText && <p className="hint-text">{hintText}</p>}
                                </div>
                                <div className="multiple-choice-grid">
                                    {state.currentQuestion?.choices.map((choice, i) => (
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
                            <button className="btn btn-back" onClick={() => {
                                GlobalTimer.unfreezeTimer();
                                dispatch({ type: 'SET_SCREEN', payload: state.previousScreen || 'welcome' });
                            }}>
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
                                            Storage.saveTimeOfDaySettings(newSettings);
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
                title="Time of Day"
                onSettings={() => {
                    GlobalTimer.freezeTimer();
                    dispatch({ type: 'SET_SCREEN', payload: 'settings' });
                }}
                onStatistics={() => {
                    GlobalTimer.freezeTimer();
                    // Save current game state before navigating
                    if (state.currentScreen === 'game' && state.session) {
                        Storage.saveActiveGameState('timeofday', {
                            currentScreen: state.currentScreen,
                            currentLevel: state.currentLevel,
                            session: state.session,
                            sessionStartTime: state.sessionStartTime,
                            currentQuestion: state.currentQuestion
                        });
                    }
                    navigate('/stats?game=timeofday', { state: { from: '/timeofday' } });
                }}
                onHome={() => navigate('/')}
            />
            <main className="main">
                {renderScreen()}
            </main>
            <BreakModal
                show={showBreakModal}
                sessionStats={breakSessionStats}
                onTakeBreak={handleTakeBreak}
                onContinue={handleContinuePlaying}
            />
        </div>
    );
}

export default TimeOfDayGame;
