import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/shared/Home';
import ClockwiseGame from './games/clockwise/ClockwiseGame';
import MultiplyGame from './games/multiply/MultiplyGame';
import DivideGame from './games/divide/DivideGame';
import TimeOfDayGame from './games/timeofday/TimeOfDayGame';
import StatisticsDashboard from './components/shared/StatisticsDashboard';
import * as Storage from './utils/storage';
import * as RobuxTimer from './utils/robuxTimerService';
import './index.css';

function AppContent() {
    const [robuxCount, setRobuxCount] = useState(0);
    const location = useLocation();

    useEffect(() => {
        // Poll for robux updates (works for same-tab and cross-tab)
        const updateRobux = () => setRobuxCount(Storage.getRobuxCount());
        updateRobux();
        const interval = setInterval(updateRobux, 1000);
        return () => clearInterval(interval);
    }, []);

    // Cleanup timer on navigation to ensure no orphaned timers
    useEffect(() => {
        return () => {
            // This will run when navigating away from any route
            // The individual game components will also call stopTimer on unmount
            // This is an extra safety net
            RobuxTimer.stopTimer();
        };
    }, [location.pathname]);

    const handleResetRobux = () => {
        Storage.setRobuxCount(0);
        setRobuxCount(0);
    };

    return (
        <Routes>
            <Route path="/" element={<Home robuxCount={robuxCount} onResetRobux={handleResetRobux} />} />
            <Route path="/stats" element={<StatisticsDashboard />} />
            <Route path="/clockwise/*" element={<ClockwiseGame />} />
            <Route path="/multiply/*" element={<MultiplyGame />} />
            <Route path="/divide/*" element={<DivideGame />} />
            <Route path="/timeofday/*" element={<TimeOfDayGame />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
