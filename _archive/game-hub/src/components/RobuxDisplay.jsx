const RobuxDisplay = ({ count, onReset }) => {
    return (
        <div className="robux-display">
            <div className="robux-content">
                <img 
                    src="/images/robux.png" 
                    alt="Robux" 
                    className="robux-icon"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                <span className="robux-count">{count.toLocaleString()}</span>
                <span className="robux-label">Robux</span>
            </div>
            <div className="robux-info">
                <span className="robux-rate">+1 per minute of play</span>
                <button className="btn-reset" onClick={onReset} title="Reset Robux">
                    ↺
                </button>
            </div>
        </div>
    );
};

export default RobuxDisplay;
