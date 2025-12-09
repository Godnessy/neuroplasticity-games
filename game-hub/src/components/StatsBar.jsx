import { formatPlayTime } from '../utils/storage';

const StatsBar = ({ totalPlayTime, gamesPlayed }) => {
    return (
        <div className="stats-bar">
            <div className="stat-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                </svg>
                <span className="stat-value">{formatPlayTime(totalPlayTime)}</span>
                <span className="stat-label">Total Play Time</span>
            </div>
            <div className="stat-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                </svg>
                <span className="stat-value">{gamesPlayed}</span>
                <span className="stat-label">Games Available</span>
            </div>
        </div>
    );
};

export default StatsBar;
