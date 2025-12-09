const RobuxCounter = ({ count, onReset, showReset = true, className = '' }) => {
    return (
        <div className={`robux-counter ${className}`}>
            <img 
                src="/images/robux.png" 
                alt="Robux" 
                className="robux-icon" 
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.insertAdjacentHTML('afterend', '<span class="robux-emoji">💎</span>');
                }}
            />
            <span className="robux-count">{count}</span>
            {showReset && (
                <button 
                    className="btn-reset-robux" 
                    title="Reset Robux"
                    onClick={onReset}
                >
                    ↺
                </button>
            )}
            <div className="robux-sparkle"></div>
        </div>
    );
};

export default RobuxCounter;
