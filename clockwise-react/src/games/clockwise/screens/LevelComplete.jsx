import { getLevel, getMediatedPrompt } from '../../../utils/levels';
import { calculateSessionAccuracy, getRecommendedAction } from '../../../utils/adaptive';

const LevelComplete = ({ 
    session, 
    currentLevel, 
    duration,
    formatDuration,
    onAdvance, 
    onRepeat 
}) => {
    const levelConfig = getLevel(currentLevel);
    const accuracy = calculateSessionAccuracy(session);
    const recommendation = getRecommendedAction(session, currentLevel);
    const mediatedText = getMediatedPrompt(levelConfig);

    const canAdvance = recommendation.action === 'advance' && currentLevel < 12;
    const isComplete = currentLevel >= 12;

    return (
        <section className="screen screen-level-complete active">
            <div className="level-complete-content">
                <div className="celebration-icon">
                    <svg viewBox="0 0 100 100" width="100" height="100">
                        <circle cx="50" cy="50" r="45" fill="var(--color-success)" opacity="0.2"/>
                        <path d="M30 50 L45 65 L70 35" fill="none" stroke="var(--color-success)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2>Level Complete!</h2>
                <div className="level-stats">
                    <div className="stat">
                        <span className="stat-value">{Math.round(accuracy * 100)}%</span>
                        <span className="stat-label">Accuracy</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{formatDuration(duration)}</span>
                        <span className="stat-label">Time</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{session?.bestStreak || 0}</span>
                        <span className="stat-label">Best Streak</span>
                    </div>
                </div>
                <div className="mediated-prompt">
                    <p className="mediated-text">{mediatedText}</p>
                </div>
                <div className="level-complete-buttons">
                    <button 
                        className="btn btn-primary btn-large" 
                        onClick={onAdvance}
                        disabled={isComplete}
                    >
                        {isComplete 
                            ? "You've Completed All Levels!" 
                            : canAdvance 
                                ? 'Continue to Next Level' 
                                : 'Practice This Level Again'}
                    </button>
                    <button className="btn btn-secondary" onClick={onRepeat}>
                        Practice Again
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LevelComplete;
