import { useNavigate } from 'react-router-dom';
import { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import * as Storage from '../../utils/storage';
import * as Levels from '../../utils/multiplyLevels';
import Header from '../../components/shared/Header';
import FeedbackModal from '../../components/shared/FeedbackModal';
import RobuxCounter from '../../components/shared/RobuxCounter';
import MultiplicationLegend from './MultiplicationLegend';
import VisualMultiplication from './VisualMultiplication';

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
    settings: { inputMethod: 'multiple', showTimer: true },
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

function MultiplyGame() {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [hintText, setHintText] = useState('');
    const [sessionTime, setSessionTime] = useState('0:00');
    const robuxTimerRef = useRef(null);
    const lastRobuxMinuteRef = useRef(0);
    const isChangingLevelRef = useRef(false);

    useEffect(() => {
        dispatch({ type: 'SET_ROBUX', payload: Storage.getRobuxCount() });
        return () => {
            if (robuxTimerRef.current) clearInterval(robuxTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (!state.sessionStartTime) return;
        const timer = setInterval(() => {
            const elapsed = Date.now() - state.sessionStartTime;
            const mins = Math.floor(elapsed / 60000);
            const secs = Math.floor((elapsed % 60000) / 1000);
            setSessionTime(`${mins}:${secs.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(timer);
    }, [state.sessionStartTime]);

    const generateQuestion = useCallback(() => {
        const levelConfig = Levels.getLevel(state.currentLevel);
        const question = Levels.generateQuestion(levelConfig);
        const choices = Levels.generateChoices(question.correctAnswer, levelConfig);
        dispatch({ type: 'SET_QUESTION', payload: { question, choices } });
    }, [state.currentLevel]);

    const startSession = (level) => {
        const targetLevel = level || state.currentLevel;
        
        // Validate level exists
        const levelConfig = Levels.getLevel(targetLevel);
        if (!levelConfig) {
            console.error('Invalid level:', targetLevel);
            return;
        }
        
        dispatch({ type: 'SET_LEVEL', payload: targetLevel });
        const newSession = { level: targetLevel, startTime: Date.now(), answers: [], bestStreak: 0, currentStreak: 0 };
        dispatch({ type: 'SET_SESSION', payload: newSession });
        dispatch({ type: 'SET_SESSION_START', payload: Date.now() });
        lastRobuxMinuteRef.current = 0;
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
        const choices = Levels.generateChoices(question.correctAnswer, levelConfig);
        dispatch({ type: 'SET_QUESTION', payload: { question, choices } });
        dispatch({ type: 'SET_SCREEN', payload: 'game' });
        isChangingLevelRef.current = false;
    };

    // Change level without resetting session timer
    const changeLevel = (newLevel) => {
        if (isChangingLevelRef.current) return; // Prevent rapid clicks
        if (newLevel < 1 || newLevel > 12) return;
        
        isChangingLevelRef.current = true;
        
        const levelConfig = Levels.getLevel(newLevel);
        if (!levelConfig) {
            isChangingLevelRef.current = false;
            return;
        }
        
        dispatch({ type: 'SET_LEVEL', payload: newLevel });
        setHintText('');
        
        const question = Levels.generateQuestion(levelConfig);
        const choices = Levels.generateChoices(question.correctAnswer, levelConfig);
        dispatch({ type: 'SET_QUESTION', payload: { question, choices } });
        
        // Small delay before allowing another level change
        setTimeout(() => {
            isChangingLevelRef.current = false;
        }, 300);
    };

    const processAnswer = useCallback((answer) => {
        if (state.isProcessing || !state.currentQuestion) return;
        dispatch({ type: 'SET_PROCESSING', payload: true });

        const isCorrect = answer === state.currentQuestion.correctAnswer;
        const levelConfig = Levels.getLevel(state.currentLevel);
        
        const newAnswers = [...(state.session?.answers || []), { correct: isCorrect }];
        const newStreak = isCorrect ? (state.session?.currentStreak || 0) + 1 : 0;
        const bestStreak = Math.max(state.session?.bestStreak || 0, newStreak);
        
        dispatch({ type: 'UPDATE_SESSION', payload: { 
            answers: newAnswers, currentStreak: newStreak, bestStreak,
            duration: Date.now() - state.session.startTime
        }});

        const explanation = Levels.getDerivationExplanation(
            state.currentQuestion.a, state.currentQuestion.b, state.currentQuestion.derivationMethod
        );
        dispatch({ type: 'SHOW_FEEDBACK', payload: { isCorrect, explanation }});

        if (newAnswers.length >= levelConfig.questionsRequired) {
            setTimeout(() => {
                if (robuxTimerRef.current) clearInterval(robuxTimerRef.current);
                dispatch({ type: 'SET_SCREEN', payload: 'levelComplete' });
            }, 100);
        }
    }, [state.isProcessing, state.currentQuestion, state.session, state.currentLevel]);

    const dismissFeedback = () => {
        dispatch({ type: 'HIDE_FEEDBACK' });
        const levelConfig = Levels.getLevel(state.currentLevel);
        if ((state.session?.answers?.length || 0) < levelConfig.questionsRequired) {
            generateQuestion();
        }
    };

    const showHint = () => {
        const levelConfig = Levels.getLevel(state.currentLevel);
        dispatch({ type: 'INCREMENT_HINTS' });
        setHintText(Levels.getHint(levelConfig, state.hintsUsed));
    };

    const advanceLevel = () => {
        const accuracy = state.session?.answers?.length > 0
            ? state.session.answers.filter(a => a.correct).length / state.session.answers.length : 0;
        const nextLevel = accuracy >= 0.75 && state.currentLevel < 12 ? state.currentLevel + 1 : state.currentLevel;
        startSession(nextLevel);
    };

    const levelConfig = Levels.getLevel(state.currentLevel);

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
                                <span style={{ fontSize: '80px' }}>🧮</span>
                            </div>
                            <h2>MultiplyMaster</h2>
                            <p className="welcome-subtitle">Learn multiplication through understanding</p>
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
                                    {state.currentLevel < 12 && (
                                        <button className="level-nav-btn" onClick={() => changeLevel(state.currentLevel + 1)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                                        </button>
                                    )}
                                </div>
                                <span className="level-name">{levelConfig.name}</span>
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
                            <MultiplicationLegend currentA={state.currentQuestion?.a} currentB={state.currentQuestion?.b} />
                            <div className="game-content">
                                {state.currentQuestion?.showVisual && (
                                    <VisualMultiplication a={state.currentQuestion.a} b={state.currentQuestion.b} />
                                )}
                                <div className="prompt-container">
                                    <p className="prompt-text">{state.currentQuestion?.prompt || 'Solve this!'}</p>
                                    {hintText && <p className="hint-text">{hintText}</p>}
                                </div>
                                <div className="equation-display">
                                    <span className="equation">{state.currentQuestion?.a} × {state.currentQuestion?.b} = ?</span>
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
                    </section>
                );
            case 'levelComplete': {
                const accuracy = state.session?.answers?.length > 0
                    ? Math.round((state.session.answers.filter(a => a.correct).length / state.session.answers.length) * 100) : 0;
                return (
                    <section className="screen screen-level-complete active">
                        <div className="level-complete-content">
                            <h2>Level Complete!</h2>
                            <div className="level-stats">
                                <div className="stat"><span className="stat-value">{accuracy}%</span><span className="stat-label">Accuracy</span></div>
                                <div className="stat"><span className="stat-value">{state.session?.bestStreak || 0}</span><span className="stat-label">Best Streak</span></div>
                            </div>
                            <button className="btn btn-primary btn-large" onClick={advanceLevel}>
                                {accuracy >= 75 && state.currentLevel < 12 ? 'Next Level' : 'Try Again'}
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate('/')}>Back to Games</button>
                        </div>
                    </section>
                );
            }
            default:
                return null;
        }
    };

    return (
        <div className="app">
            <Header title="MultiplyMaster" onHome={() => navigate('/')} onSettings={() => {}} onDashboard={() => {}} />
            <main className="main">{renderScreen()}</main>
        </div>
    );
}

export default MultiplyGame;
