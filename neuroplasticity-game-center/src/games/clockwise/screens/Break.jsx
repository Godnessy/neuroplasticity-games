const Break = ({ onContinue, onEnd }) => {
    return (
        <section className="screen screen-break active">
            <div className="break-content">
                <div className="break-icon">
                    <svg viewBox="0 0 100 100" width="80" height="80">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" strokeWidth="2"/>
                        <path d="M50 25 L50 55 L70 55" fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                </div>
                <h2>Time for a Break!</h2>
                <p>You've been practicing for 15 minutes. Taking breaks helps your brain learn better!</p>
                <p className="break-suggestion">Try stretching, getting a drink, or looking at something far away for a minute.</p>
                <div className="break-buttons">
                    <button className="btn btn-primary btn-large" onClick={onContinue}>
                        I'm Ready to Continue
                    </button>
                    <button className="btn btn-secondary" onClick={onEnd}>
                        End Session
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Break;
