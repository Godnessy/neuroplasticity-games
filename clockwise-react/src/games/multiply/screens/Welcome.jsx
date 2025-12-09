import RobuxCounter from '../RobuxCounter';

const Welcome = ({ robuxCount, onResetRobux, onStartNew, onContinue, hasContinue }) => {
    return (
        <section className="screen screen-welcome active">
            <div className="welcome-content">
                <div className="welcome-robux">
                    <RobuxCounter count={robuxCount} onReset={onResetRobux} />
                </div>
                <div className="welcome-icon">
                    <svg viewBox="0 0 100 100" width="120" height="120">
                        <text x="50" y="55" fontSize="50" textAnchor="middle" dominantBaseline="middle" fill="var(--color-primary)">×</text>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" strokeWidth="3"/>
                    </svg>
                </div>
                <h2>Welcome to MultiplyMaster</h2>
                <p className="welcome-subtitle">Learn multiplication through understanding</p>
                <div className="welcome-buttons">
                    <button className="btn btn-primary btn-large" onClick={onStartNew}>
                        Start Learning
                    </button>
                    {hasContinue && (
                        <button className="btn btn-secondary btn-large" onClick={onContinue}>
                            Continue
                        </button>
                    )}
                </div>
                <p className="welcome-info">No memorization needed - learn the tricks!</p>
            </div>
        </section>
    );
};

export default Welcome;
