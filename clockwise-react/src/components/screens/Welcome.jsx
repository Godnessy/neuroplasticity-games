import RobuxCounter from '../RobuxCounter';

const Welcome = ({ robuxCount, onResetRobux, onStartNew, onContinue, hasContinue }) => {
    return (
        <section className="screen screen-welcome active">
            <div className="welcome-content">
                <div className="welcome-robux">
                    <RobuxCounter count={robuxCount} onReset={onResetRobux} />
                </div>
                <div className="welcome-clock-icon">
                    <svg viewBox="0 0 100 100" width="120" height="120">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" strokeWidth="3"/>
                        <line x1="50" y1="50" x2="50" y2="20" stroke="var(--color-hour)" strokeWidth="4" strokeLinecap="round"/>
                        <line x1="50" y1="50" x2="70" y2="50" stroke="var(--color-minute)" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx="50" cy="50" r="4" fill="var(--color-primary)"/>
                    </svg>
                </div>
                <h2>Welcome to ClockWise</h2>
                <p className="welcome-subtitle">Learn to tell time through play</p>
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
                <p className="welcome-info">Designed for children ages 6-14</p>
            </div>
        </section>
    );
};

export default Welcome;
