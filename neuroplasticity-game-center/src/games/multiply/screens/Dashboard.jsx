import { useEffect, useState } from 'react';
import * as Storage from '../../utils/storage';
import { getLevel } from '../../utils/levels';

const Dashboard = ({ onBack, formatDuration, onExport, onReset }) => {
    const [progress, setProgress] = useState(null);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const storedProgress = Storage.getProgress();
        const storedSessions = Storage.getSessions();
        setProgress(storedProgress);
        setSessions(storedSessions);
    }, []);

    if (!progress) return null;

    const renderTableMastery = () => {
        const tables = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        return tables.map(table => {
            const mastery = Storage.getTableMastery(table);
            const percent = Math.round(mastery * 100);
            const color = percent >= 80 ? 'var(--color-success)' : 
                         percent >= 60 ? 'var(--color-warning)' : 'var(--color-error)';
            return (
                <div key={table} className="mastery-item">
                    <span className="mastery-table">{table}×</span>
                    <div className="mastery-bar">
                        <div 
                            className="mastery-fill" 
                            style={{ width: `${percent}%`, backgroundColor: color }}
                        />
                    </div>
                    <span className="mastery-percent">{percent}%</span>
                </div>
            );
        });
    };

    const renderSessionHistory = () => {
        const recentSessions = sessions.slice(-5).reverse();
        
        if (recentSessions.length === 0) {
            return <li>No sessions yet. Start playing!</li>;
        }
        
        return recentSessions.map((session, i) => {
            const date = new Date(session.timestamp).toLocaleDateString();
            return (
                <li key={i}>
                    {date} - Level {session.level}: {Math.round(session.accuracy * 100)}% accuracy
                </li>
            );
        });
    };

    return (
        <section className="screen screen-dashboard active">
            <div className="dashboard-header">
                <button className="btn btn-back" onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Progress Dashboard</h2>
            </div>
            <div className="dashboard-content">
                <div className="dashboard-overview">
                    <div className="overview-card">
                        <h3>Current Level</h3>
                        <span className="overview-value">{progress.currentLevel}</span>
                    </div>
                    <div className="overview-card">
                        <h3>Overall Accuracy</h3>
                        <span className="overview-value">
                            {progress.totalQuestions > 0 
                                ? Math.round((progress.totalCorrect / progress.totalQuestions) * 100) 
                                : 0}%
                        </span>
                    </div>
                    <div className="overview-card">
                        <h3>Total Time</h3>
                        <span className="overview-value">{formatDuration(progress.totalPlayTime * 1000)}</span>
                    </div>
                    <div className="overview-card">
                        <h3>Sessions</h3>
                        <span className="overview-value">{progress.sessionsCount}</span>
                    </div>
                </div>
                
                <div className="dashboard-section">
                    <h3>Table Mastery</h3>
                    <div className="mastery-grid">
                        {renderTableMastery()}
                    </div>
                </div>

                <div className="dashboard-section">
                    <h3>Recent Sessions</h3>
                    <ul className="session-history">
                        {renderSessionHistory()}
                    </ul>
                </div>

                <div className="dashboard-actions">
                    <button className="btn btn-secondary" onClick={onExport}>
                        Export Progress (JSON)
                    </button>
                    <button className="btn btn-danger" onClick={onReset}>
                        Reset All Progress
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
