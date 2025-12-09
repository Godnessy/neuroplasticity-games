import { useEffect, useMemo } from 'react';

const FeedbackModal = ({ show, data, onDismiss }) => {
    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.key === 'Enter' && show) {
                onDismiss();
            }
        };
        
        document.addEventListener('keyup', handleKeyUp);
        return () => document.removeEventListener('keyup', handleKeyUp);
    }, [show, onDismiss]);

    const message = useMemo(() => {
        if (!data) return '';
        const { isCorrect } = data;
        const messages = isCorrect 
            ? ['Correct!', 'Great job!', 'Well done!', 'That\'s right!', 'Excellent!', 'You got it!', 'Perfect!']
            : ['Not quite.', 'Try again!', 'Almost!', 'Keep trying!'];
        return messages[Math.floor(Math.random() * messages.length)];
    }, [data]);

    if (!show || !data) return null;

    const { isCorrect, explanation } = data;

    return (
        <div className={`feedback-overlay ${show ? 'active' : ''}`}>
            <div className="feedback-content">
                <div className={`feedback-icon ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                    )}
                </div>
                <p className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {message}
                </p>
                <p 
                    className="feedback-explanation"
                    dangerouslySetInnerHTML={{ __html: explanation }}
                />
                <button className="btn btn-primary" onClick={onDismiss}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;
