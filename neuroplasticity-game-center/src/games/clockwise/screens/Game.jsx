import { useState, useRef, useEffect } from 'react';
import Clock from '../Clock';
import RobuxCounter from '../../../components/shared/RobuxCounter';
import FeedbackModal from '../../../components/shared/FeedbackModal';
import TimeLegend from '../TimeLegend';
import { getLevel, getHint, generateChoices } from '../../../utils/levels';
import { CLOCK_CENTER_IMAGES } from '../../../utils/config';

const Game = ({
    currentLevel,
    currentQuestion,
    session,
    robuxCount,
    settings,
    showingNumbers,
    selectedHour,
    selectedMinute,
    showFeedback,
    feedbackData,
    characterIndex,
    sessionTime,
    onHome,
    onResetRobux,
    onPrevLevel,
    onNextLevel,
    onShowHint,
    onToggleNumbers,
    onSelectHour,
    onSelectMinute,
    onProcessAnswer,
    onDismissFeedback,
    isProcessing
}) => {
    const [hintText, setHintText] = useState('');
    const [inputError, setInputError] = useState('');
    const hourInputRef = useRef(null);
    const minuteInputRef = useRef(null);

    const levelConfig = getLevel(currentLevel);
    const questionsRequired = levelConfig.questionsRequired;
    const answeredCount = session?.answers?.length || 0;
    const progressPercent = (answeredCount / questionsRequired) * 100;
    const centerImage = CLOCK_CENTER_IMAGES[characterIndex] || null;

    useEffect(() => {
        if (settings?.inputMethod === 'text' && hourInputRef.current) {
            hourInputRef.current.focus();
        }
    }, [currentQuestion, settings?.inputMethod]);

    const handleHint = () => {
        const hint = onShowHint();
        setHintText(hint);
    };

    const handleSubmitText = () => {
        if (isProcessing) return;
        
        const hour = parseInt(hourInputRef.current?.value, 10);
        const hourOnly = !levelConfig.hands.includes('minute');
        // Check if THIS question asks for 24-hour format (not just the level)
        const askFor24Hour = currentQuestion?.correctAnswer?.askFor24Hour !== undefined 
            ? currentQuestion.correctAnswer.askFor24Hour 
            : levelConfig.show24Hour;
        
        if (askFor24Hour) {
            if (isNaN(hour) || hour < 0 || hour > 23) {
                setInputError('Enter a valid hour (0-23 for 24-hour time)');
                hourInputRef.current?.focus();
                return;
            }
        } else {
            if (isNaN(hour) || hour < 1 || hour > 12) {
                setInputError('Enter a valid hour (1-12 for 12-hour time)');
                hourInputRef.current?.focus();
                return;
            }
        }
        
        if (hourOnly) {
            setInputError('');
            onProcessAnswer(hour, 0);
            hourInputRef.current.value = '';
            return;
        }
        
        const minute = parseInt(minuteInputRef.current?.value, 10);
        if (isNaN(minute) || minute < 0 || minute > 59) {
            setInputError('Enter valid minutes (0-59)');
            minuteInputRef.current?.focus();
            return;
        }
        
        setInputError('');
        onProcessAnswer(hour, minute);
        hourInputRef.current.value = '';
        minuteInputRef.current.value = '';
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            e.preventDefault();
            e.stopPropagation();
            handleSubmitText();
        }
    };

    const handleSubmitVisual = () => {
        if (isProcessing) return;
        
        const hourOnly = !levelConfig.hands.includes('minute');
        
        if (selectedHour === null) return;
        
        if (hourOnly) {
            onProcessAnswer(selectedHour, 0);
            return;
        }
        
        if (selectedMinute === null) return;
        onProcessAnswer(selectedHour, selectedMinute);
    };

    const handleMultipleChoice = (choice) => {
        if (isProcessing) return;
        onProcessAnswer(choice.hour, choice.minute);
    };

    const renderTextInput = () => {
        const hourOnly = !levelConfig.hands.includes('minute');
        
        return (
            <div className="input-mode input-text">
                <div className="time-input-group">
                    <input
                        type="number"
                        ref={hourInputRef}
                        className="time-input"
                        min={levelConfig.show24Hour ? 0 : 1}
                        max={levelConfig.show24Hour ? 23 : 12}
                        placeholder="HH"
                        aria-label="Hour"
                        onKeyDown={handleKeyDown}
                    />
                    {!hourOnly && (
                        <>
                            <span className="time-separator">:</span>
                            <input
                                type="number"
                                ref={minuteInputRef}
                                className="time-input"
                                min="0"
                                max="59"
                                placeholder="MM"
                                aria-label="Minutes"
                                onKeyDown={handleKeyDown}
                            />
                        </>
                    )}
                </div>
                {inputError && (
                    <p className="input-error">
                        <strong>{inputError}</strong>
                        <br />
                        <small>{getHint(levelConfig, 0)}</small>
                    </p>
                )}
                <button className="btn btn-primary" onClick={handleSubmitText}>
                    Check Answer
                </button>
            </div>
        );
    };

    const renderVisualInput = () => {
        const hourOnly = !levelConfig.hands.includes('minute');
        
        return (
            <div className="input-mode input-visual">
                <div className="visual-selector">
                    <div className="hour-selector">
                        <label>Hour:</label>
                        <div className="selector-buttons">
                            {levelConfig.hourOptions.map(h => (
                                <button
                                    key={h}
                                    className={`hour-btn ${selectedHour === h ? 'selected' : ''}`}
                                    onClick={() => onSelectHour(h)}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>
                    </div>
                    {!hourOnly && (
                        <div className="minute-selector">
                            <label>Minutes:</label>
                            <div className="selector-buttons">
                                {(levelConfig.minuteOptions === 'any' 
                                    ? [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
                                    : levelConfig.minuteOptions
                                ).map(m => (
                                    <button
                                        key={m}
                                        className={`minute-btn ${selectedMinute === m ? 'selected' : ''}`}
                                        onClick={() => onSelectMinute(m)}
                                    >
                                        {m.toString().padStart(2, '0')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button className="btn btn-primary" onClick={handleSubmitVisual}>
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
                <div className="multiple-choice-grid">
                    {choices.map((choice, index) => (
                        <button
                            key={index}
                            className="choice-btn"
                            onClick={() => handleMultipleChoice(choice)}
                        >
                            {choice.hour}:{choice.minute.toString().padStart(2, '0')}
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
                <TimeLegend />
                <div className="game-content">
                    <div className="clock-container">
                        <div className="clock-wrapper">
                            <Clock
                                hands={currentQuestion?.hands || []}
                                showNumbers={showingNumbers || settings?.alwaysShowNumbers || levelConfig.showNumbers}
                                showMinuteNumbers={true}
                                showTickMarks={true}
                                centerImage={centerImage}
                            />
                        </div>
                        {levelConfig.show24Hour && currentQuestion?.isPM !== undefined && (
                            <div className="ampm-indicator">
                                <span className={`ampm-badge ${currentQuestion.isPM ? 'pm' : 'am'}`}>
                                    {currentQuestion.isPM ? 'PM' : 'AM'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="prompt-container">
                        <p className="prompt-text">{currentQuestion?.prompt || 'What time is this?'}</p>
                        {hintText && <p className="hint-text" style={{ display: 'block' }}>{hintText}</p>}
                    </div>

                    <div className="answer-container">
                        {settings?.inputMethod === 'text' && renderTextInput()}
                        {settings?.inputMethod === 'visual' && renderVisualInput()}
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
                        <button className="btn btn-hint" onClick={onToggleNumbers}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                            {showingNumbers ? 'Hide Numbers' : 'Show Numbers'}
                        </button>
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
