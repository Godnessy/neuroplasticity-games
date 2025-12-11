import { useEffect } from 'react';
import './BreakModal.css';

/**
 * Break Modal Component
 *
 * Shows after 20 minutes of continuous play to encourage healthy breaks.
 * Displays session stats and offers two choices:
 * - Take a Break: Ends session and returns to home
 * - Continue Playing: Resets the 20-minute timer and continues
 */
function BreakModal({ show, sessionStats, onTakeBreak, onContinue }) {
    useEffect(() => {
        // Prevent background scrolling when modal is open
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    if (!show) return null;

    const {
        playTime = 0,
        questionsAnswered = 0,
        correctAnswers = 0,
        robuxEarned = 0
    } = sessionStats || {};

    const accuracy = questionsAnswered > 0
        ? ((correctAnswers / questionsAnswered) * 100).toFixed(1)
        : 0;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        return `${mins} minute${mins !== 1 ? 's' : ''}`;
    };

    return (
        <div className="break-modal-overlay">
            <div className="break-modal">
                <div className="break-modal-header">
                    <div className="break-icon">⏰</div>
                    <h2>Great Job!</h2>
                    <p className="break-subtitle">You've been playing for 20 minutes</p>
                </div>

                <div className="break-stats">
                    <h3>Your Session Stats</h3>
                    <div className="break-stats-grid">
                        <div className="break-stat">
                            <div className="break-stat-icon">⏱️</div>
                            <div className="break-stat-label">Play Time</div>
                            <div className="break-stat-value">{formatTime(playTime)}</div>
                        </div>
                        <div className="break-stat">
                            <div className="break-stat-icon">📝</div>
                            <div className="break-stat-label">Questions</div>
                            <div className="break-stat-value">{questionsAnswered}</div>
                        </div>
                        <div className="break-stat">
                            <div className="break-stat-icon">✓</div>
                            <div className="break-stat-label">Accuracy</div>
                            <div className="break-stat-value">{accuracy}%</div>
                        </div>
                        <div className="break-stat">
                            <div className="break-stat-icon">💎</div>
                            <div className="break-stat-label">Robux Earned</div>
                            <div className="break-stat-value">{robuxEarned}</div>
                        </div>
                    </div>
                </div>

                <div className="break-message">
                    <p>Taking regular breaks helps your brain learn better!</p>
                    <p className="break-message-small">Research shows that spacing out practice improves long-term retention.</p>
                </div>

                <div className="break-actions">
                    <button
                        className="btn btn-break btn-primary"
                        onClick={onTakeBreak}
                    >
                        Take a Break
                    </button>
                    <button
                        className="btn btn-continue btn-secondary"
                        onClick={onContinue}
                    >
                        Continue Playing
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BreakModal;
