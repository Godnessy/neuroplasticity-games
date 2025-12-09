import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/shared/Home';
import ClockwiseGame from './games/clockwise/ClockwiseGame';
import MultiplyGame from './games/multiply/MultiplyGame';
import DivideGame from './games/divide/DivideGame';
import TimeOfDayGame from './games/timeofday/TimeOfDayGame';
import * as Storage from './utils/storage';
import './index.css';

function App() {
    const [robuxCount, setRobuxCount] = useState(0);

    useEffect(() => {
        // Poll for robux updates (works for same-tab and cross-tab)
        const updateRobux = () => setRobuxCount(Storage.getRobuxCount());
        updateRobux();
        const interval = setInterval(updateRobux, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleResetRobux = () => {
        Storage.setRobuxCount(0);
        setRobuxCount(0);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home robuxCount={robuxCount} onResetRobux={handleResetRobux} />} />
                <Route path="/clockwise/*" element={<ClockwiseGame />} />
                <Route path="/multiply/*" element={<MultiplyGame />} />
                <Route path="/divide/*" element={<DivideGame />} />
                <Route path="/timeofday/*" element={<TimeOfDayGame />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
