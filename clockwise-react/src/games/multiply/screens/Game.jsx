import { useState, useRef, useEffect } from 'react';
import RobuxCounter from '../RobuxCounter';
import FeedbackModal from '../FeedbackModal';
import MultiplicationLegend from '../MultiplicationLegend';
import VisualMultiplication from '../VisualMultiplication';
import { getLevel, getHint, generateChoices, getDerivationExplanation } from '../../utils/levels';

const Game = ({
    currentLevel,
    currentQuestion,
    session,
    robuxCount,
    settings,
    showFeedback,
    feedbackData,
    sessionTime,
    onHome,
    onResetRobux,
    onPrevLevel,
    onNextLevel,
    onShowHint,
    onProcessAnswer,
    onDismissFeedback,
    isProcessing
}) => {
    const [hintText, setHintText] = useState('');
    const [inputError, setInputError] = useState('');
    const [showDerivation, setShowDerivation] = useState(false);
    const answerInputRef = useRef(null);

    const levelConfig = getLevel(currentLevel);
    const questionsRequired = levelConfig.questionsRequired;
    const answeredCount = session?.answers?.length || 0;
    const progressPercent = (answeredCount / questionsRequired) * 100;

    useEffect(() => {
        if (settings?.inputMethod === 'text' && answerInputRef.current) {
            answerInputRef.current.focus();
        }
        setHintText('');
        setShowDerivation(false);
    }, [currentQuestion, settings?.inputMethod]);

    const handleHint = () => {
        const hint = onShowHint();
        setHintText(hint);
    };

    const handleShowDerivation = () => {
        setShowDerivation(true);
    };

    const handleSubmitText = () => {
        if (isProcessing) return;
        
        const answer = parseInt(answerInputRef.current?.value, 10);
        
        if (isNaN(answer) || answer < 0) {
            setInputError('Enter a valid number');
            answerInputRef.current?.focus();
            return;
        }
        
        setInputError('');
        onProcessAnswer(answer);
        answerInputRef.current.value = '';
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            e.preventDefault();
            e.stopPropagation();
            handleSubmitText();
        }
    };

    const handleMultipleChoice = (choice) => {
        if (isProcessing) return;
        onProcessAnswer(choice);
    };

    const renderTextInput = () => {
        return (
            <div className="input-mode input-text">
                <div className="equation-display">
                    <span className="equation">{currentQuestion?.a} × {currentQuestion?.b} = </span>
                    <input
                        type="number"
                        ref={answerInputRef}
                        className="answer-input"
                        min="0"
                        placeholder="?"
                        aria-label="Answer"
                        onKeyDown={handleKeyDown}
                    />
                </div>
                {inputError && (
                    <p className="input-error">{inputError}</p>
                )}
                <button className="btn btn-primary" onClick={handleSubmitText}>
                    Check Answer
                </button>
            </div>
        );
    };

    const renderMultipleChoice = () => {
        if (!currentQuestion) return null;
        
        const choices = generateChoices(currentQuestion.correctAnswer, levelConfig);
        
        return (
            <div className="input-mode input-multiple">
                <div className="equation-display">
                    <span className="equation">{currentQuestion?.a} × {currentQuestion?.b} = ?</span>
                </div>
                <div className="multiple-choice-grid">
                    {choices.map((choice, index) => (
                        <button
                            key={index}
                            className="choice-btn"
                            onClick={() => handleMultipleChoice(choice)}
                        >
                            {choice}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <section className="screen screen-game active">
            <div className="game-header">
                <button className="btn btn-back" aria-label="Return to home" onClick={onHome}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
                <div className="level-info">
                    <div className="level-nav">
                        <button 
                            className="level-nav-btn" 
                            aria-label="Previous level"
                            onClick={onPrevLevel}
                            disabled={currentLevel <= 1}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                        </button>
                        <span className="level-badge">Level <span>{currentLevel}</span></span>
                        <button 
                            className="level-nav-btn" 
                            aria-label="Next level"
                            onClick={onNextLevel}
                            disabled={currentLevel >= 12}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    </div>
                    <span className="level-name">{levelConfig.name}</span>
                </div>
                <div className="session-timer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                    </svg>
                    <span>{sessionTime}</span>
                </div>
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <span className="progress-text">{answeredCount}/{questionsRequired}</span>
                </div>
                <RobuxCounter count={robuxCount} onReset={onResetRobux} />
            </div>

            <div className="game-layout">
                <MultiplicationLegend currentTable={levelConfig.table} />
                <div className="game-content">
                    {currentQuestion?.showVisual && (
                        <div className="visual-container">
                            <VisualMultiplication 
                                a={currentQuestion.a} 
                                b={currentQuestion.b}
                                showGroups={currentQuestion.showGroups}
                            />
                        </div>
                    )}

                    {currentQuestion?.showDerivation && showDerivation && (
                        <div className="derivation-container">
                            <p className="derivation-text">
                                {getDerivationExplanation(
                                    currentQuestion.a, 
                                    currentQuestion.b, 
                                    currentQuestion.derivationMethod
                                )}
                            </p>
                        </div>
                    )}

                    <div className="prompt-container">
                        <p className="prompt-text">{currentQuestion?.prompt || 'Solve this!'}</p>
                        {hintText && <p className="hint-text" style={{ display: 'block' }}>{hintText}</p>}
                    </div>

                    <div className="answer-container">
                        {settings?.inputMethod === 'text' && renderTextInput()}
                        {settings?.inputMethod === 'multiple' && renderMultipleChoice()}
                    </div>

                    <div className="action-buttons">
                        <button className="btn btn-hint" onClick={handleHint}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            Need a hint?
                        </button>
                        {currentQuestion?.showDerivation && !showDerivation && (
                            <button className="btn btn-hint" onClick={handleShowDerivation}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                </svg>
                                Show Strategy
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <FeedbackModal
                show={showFeedback}
                data={feedbackData}
                onDismiss={onDismissFeedback}
            />
        </section>
    );
};

export default Game;
