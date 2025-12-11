import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Statistics from '../../utils/statisticsService';
import * as Storage from '../../utils/storage';
import './StatisticsDashboard.css';

const GAME_NAMES = {
    all: 'All Games',
    clockwise: 'ClockWise',
    multiply: 'MultiplyMaster',
    divide: 'DivideMaster',
    timeofday: 'Time of Day'
};

function StatisticsDashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [selectedGame, setSelectedGame] = useState('all');
    const [stats, setStats] = useState(null);
    const [expandedSessions, setExpandedSessions] = useState(new Set());

    // Read game filter from URL query parameter
    useEffect(() => {
        const gameParam = searchParams.get('game');
        if (gameParam && GAME_NAMES[gameParam]) {
            setSelectedGame(gameParam);
        }
    }, [searchParams]);

    useEffect(() => {
        loadStats();
    }, [selectedGame]);

    const loadStats = () => {
        if (selectedGame === 'all') {
            const allStats = Statistics.getAllGameStats();
            setStats(allStats);
        } else {
            const gameStats = Statistics.getGameStats(selectedGame);
            setStats({ games: { [selectedGame]: gameStats }, totals: null });
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const toggleSessionExpand = (sessionId) => {
        const newExpanded = new Set(expandedSessions);
        if (newExpanded.has(sessionId)) {
            newExpanded.delete(sessionId);
        } else {
            newExpanded.add(sessionId);
        }
        setExpandedSessions(newExpanded);
    };

    const exportData = () => {
        const data = Statistics.exportAllStats();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neuroplasticity-stats-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!stats) {
        return <div className="loading">Loading statistics...</div>;
    }

    const displayStats = selectedGame === 'all' ? stats.totals : stats.games[selectedGame]?.progress;
    const allSessions = selectedGame === 'all'
        ? Statistics.getRecentSessions(null, 50)
        : Statistics.getRecentSessions(selectedGame, 50);

    return (
        <div className="statistics-dashboard">
            <div className="dashboard-header">
                <button className="btn btn-back" onClick={() => navigate('/')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
                <h1>Statistics Dashboard</h1>
                <button className="btn btn-export" onClick={exportData}>
                    Export Data
                </button>
            </div>

            <div className="game-selector">
                <label htmlFor="game-select">Select Game:</label>
                <select
                    id="game-select"
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="game-select"
                >
                    {Object.entries(GAME_NAMES).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                    ))}
                </select>
            </div>

            <div className="summary-cards">
                <div className="summary-card">
                    <h3>Total Play Time</h3>
                    <div className="summary-value">
                        {displayStats ? formatTime(displayStats.totalPlayTime || 0) : '0m'}
                    </div>
                </div>
                <div className="summary-card">
                    <h3>Questions Answered</h3>
                    <div className="summary-value">
                        {displayStats ? (displayStats.totalCorrect || 0) + (displayStats.totalIncorrect || 0) : 0}
                    </div>
                </div>
                <div className="summary-card">
                    <h3>Accuracy</h3>
                    <div className="summary-value">
                        {displayStats && (displayStats.totalCorrect + displayStats.totalIncorrect) > 0
                            ? `${((displayStats.totalCorrect / (displayStats.totalCorrect + displayStats.totalIncorrect)) * 100).toFixed(1)}%`
                            : '0%'}
                    </div>
                </div>
                <div className="summary-card">
                    <h3>Robux Earned</h3>
                    <div className="summary-value">
                        {displayStats ? displayStats.totalRobuxEarned || 0 : 0}
                    </div>
                </div>
            </div>

            {selectedGame !== 'all' && stats.games[selectedGame]?.progress?.levelStats && (
                <div className="level-breakdown">
                    <h2>Level Breakdown</h2>
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>Level</th>
                                <th>Times Played</th>
                                <th>Correct</th>
                                <th>Incorrect</th>
                                <th>Accuracy</th>
                                <th>Play Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(stats.games[selectedGame].progress.levelStats)
                                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                .map(([level, data]) => (
                                    <tr key={level}>
                                        <td>Level {level}</td>
                                        <td>{data.timesPlayed}</td>
                                        <td>{data.correct}</td>
                                        <td>{data.incorrect}</td>
                                        <td>
                                            {data.correct + data.incorrect > 0
                                                ? `${((data.correct / (data.correct + data.incorrect)) * 100).toFixed(1)}%`
                                                : 'N/A'}
                                        </td>
                                        <td>{formatTime(data.playTime)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="session-history">
                <h2>Session History</h2>
                {allSessions.length === 0 ? (
                    <p className="no-sessions">No sessions recorded yet. Start playing to track your progress!</p>
                ) : (
                    <table className="stats-table sessions-table">
                        <thead>
                            <tr>
                                <th>Date/Time</th>
                                <th>Game</th>
                                <th>Level</th>
                                <th>Duration</th>
                                <th>Correct</th>
                                <th>Incorrect</th>
                                <th>Accuracy</th>
                                <th>Robux</th>
                                <th>Best Streak</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allSessions.map((session) => (
                                <>
                                    <tr key={session.sessionId}>
                                        <td>{formatDate(session.startTime)}</td>
                                        <td>{GAME_NAMES[session.gameName] || session.gameName}</td>
                                        <td>Level {session.level}</td>
                                        <td>{formatTime(session.duration)}</td>
                                        <td>{session.correctAnswers}</td>
                                        <td>{session.incorrectAnswers}</td>
                                        <td>
                                            {session.correctAnswers + session.incorrectAnswers > 0
                                                ? `${((session.correctAnswers / (session.correctAnswers + session.incorrectAnswers)) * 100).toFixed(1)}%`
                                                : 'N/A'}
                                        </td>
                                        <td>{session.robuxEarned}</td>
                                        <td>{session.bestStreak}</td>
                                        <td>
                                            <button
                                                className="btn-expand"
                                                onClick={() => toggleSessionExpand(session.sessionId)}
                                            >
                                                {expandedSessions.has(session.sessionId) ? '▼' : '▶'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedSessions.has(session.sessionId) && (
                                        <tr className="session-details">
                                            <td colSpan="10">
                                                <div className="session-detail-content">
                                                    <div className="detail-section">
                                                        <h4>Session Information</h4>
                                                        <p><strong>Session ID:</strong> {session.sessionId}</p>
                                                        <p><strong>Started:</strong> {formatDate(session.startTime)}</p>
                                                        <p><strong>Ended:</strong> {formatDate(session.endTime)}</p>
                                                        <p><strong>Ended by:</strong> {session.endedBy}</p>
                                                    </div>
                                                    <div className="detail-section">
                                                        <h4>Answer Timeline ({session.answers.length} answers)</h4>
                                                        <div className="answer-timeline">
                                                            {session.answers.map((answer, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className={`answer-indicator ${answer.correct ? 'correct' : 'incorrect'}`}
                                                                    title={`Answer ${idx + 1}: ${answer.correct ? 'Correct' : 'Incorrect'} ${answer.responseTime ? `(${(answer.responseTime / 1000).toFixed(1)}s)` : ''}`}
                                                                >
                                                                    {answer.correct ? '✓' : '✗'}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default StatisticsDashboard;
