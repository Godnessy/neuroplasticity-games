import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Storage from '../../../utils/storage';
import { generateProgressReport } from '../../../utils/adaptive';
import { getLevel } from '../../../utils/levels';

const Dashboard = ({ onBack, formatDuration, onExport, onReset }) => {
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const progress = Storage.getProgress();
        const storedSessions = Storage.getSessions();
        const progressReport = generateProgressReport(progress, storedSessions);
        setReport(progressReport);
        setSessions(storedSessions);
    }, []);

    if (!report) return null;

    const renderAccuracyChart = () => {
        const bars = [];
        for (let i = 1; i <= 12; i++) {
            const accuracy = report.levelBreakdown[i] || 0;
            const color = accuracy >= 75 ? 'var(--color-success)' : 
                         accuracy >= 60 ? 'var(--color-warning)' : 'var(--color-error)';
            bars.push(
                <div 
                    key={i}
                    className="chart-bar"
                    style={{ 
                        height: `${Math.max(accuracy, 5)}%`,
                        backgroundColor: color
                    }}
                    title={`Level ${i}: ${accuracy}%`}
                >
                    <span className="chart-bar-label">{i}</span>
                </div>
            );
        }
        return bars;
    };

    const renderResponseChart = () => {
        const recentSessions = sessions.slice(-10);
        if (recentSessions.length === 0) {
            return <p style={{ color: 'var(--color-text-muted)' }}>No data yet</p>;
        }
        
        const maxDuration = Math.max(...recentSessions.map(s => s.duration || 0));
        
        return recentSessions.map((session, i) => {
            const height = maxDuration > 0 ? ((session.duration || 0) / maxDuration) * 100 : 0;
            return (
                <div 
                    key={i}
                    className="chart-bar"
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`Session ${i + 1}: ${formatDuration(session.duration)}`}
                />
            );
        });
    };

    const renderPracticeAreas = () => {
        if (report.areasForImprovement.length === 0 && report.specificDifficulties.length === 0) {
            return <li>Keep practicing to identify areas for improvement!</li>;
        }
        
        return report.areasForImprovement.map(area => {
            const levelConfig = getLevel(area.level);
            return (
                <li key={area.level}>
                    Level {area.level}: {levelConfig.name} ({area.accuracy}% accuracy)
                </li>
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
                        <span className="overview-value">{report.currentLevel}</span>
                    </div>
                    <div className="overview-card">
                        <h3>Overall Accuracy</h3>
                        <span className="overview-value">{report.overallAccuracy}%</span>
                    </div>
                    <div className="overview-card">
                        <h3>Total Time</h3>
                        <span className="overview-value">{formatDuration(report.totalPlayTime * 1000)}</span>
                    </div>
                    <div className="overview-card">
                        <h3>Sessions</h3>
                        <span className="overview-value">{report.sessionsCompleted}</span>
                    </div>
                </div>
                <div className="dashboard-charts">
                    <div className="chart-card">
                        <h3>Accuracy by Level</h3>
                        <div className="chart-container">
                            {renderAccuracyChart()}
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Response Time Trend</h3>
                        <div className="chart-container">
                            {renderResponseChart()}
                        </div>
                    </div>
                </div>
                <div className="dashboard-details">
                    <div className="detail-card">
                        <h3>Areas for Practice</h3>
                        <ul className="practice-areas">
                            {renderPracticeAreas()}
                        </ul>
                    </div>
                    <div className="detail-card">
                        <h3>Recent Sessions</h3>
                        <ul className="session-history">
                            {renderSessionHistory()}
                        </ul>
                    </div>
                </div>
                <div className="dashboard-actions">
                    <button className="btn btn-primary" onClick={() => navigate('/stats?game=clockwise')}>
                        📊 View Detailed Statistics
                    </button>
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
