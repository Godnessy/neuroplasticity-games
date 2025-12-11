import { useState, useEffect, useCallback } from 'react';
import * as GlobalTimer from '../utils/globalSessionTimer';

/**
 * React hook for using the global session timer
 * 
 * @returns {Object} Timer state and controls
 */
export const useGlobalSessionTimer = () => {
    const [sessionTime, setSessionTime] = useState(GlobalTimer.getFormattedTime());
    const [isActive, setIsActive] = useState(GlobalTimer.isSessionActive());

    // Update timer display every second
    useEffect(() => {
        const interval = setInterval(() => {
            if (GlobalTimer.isSessionActive() && !GlobalTimer.isTimerFrozen()) {
                setSessionTime(GlobalTimer.getFormattedTime());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Subscribe to timer state changes
    useEffect(() => {
        const unsubscribe = GlobalTimer.subscribe((elapsed, active) => {
            setIsActive(active);
            setSessionTime(GlobalTimer.getFormattedTime());
        });

        return unsubscribe;
    }, []);

    const startSession = useCallback(() => {
        GlobalTimer.startSession();
        setIsActive(true);
        setSessionTime(GlobalTimer.getFormattedTime());
    }, []);

    const endSession = useCallback(() => {
        GlobalTimer.endSession();
        setIsActive(false);
        setSessionTime('0:00');
    }, []);

    const pauseTimer = useCallback(() => {
        GlobalTimer.pauseTimer();
    }, []);

    const resumeTimer = useCallback(() => {
        GlobalTimer.resumeTimer();
        setSessionTime(GlobalTimer.getFormattedTime());
    }, []);

    const freezeTimer = useCallback(() => {
        GlobalTimer.freezeTimer();
    }, []);

    const unfreezeTimer = useCallback(() => {
        GlobalTimer.unfreezeTimer();
        setSessionTime(GlobalTimer.getFormattedTime());
    }, []);

    return {
        sessionTime,
        isActive,
        startSession,
        endSession,
        pauseTimer,
        resumeTimer,
        freezeTimer,
        unfreezeTimer,
        getElapsedMs: GlobalTimer.getElapsedTime,
        isPaused: GlobalTimer.isTimerPaused,
        isFrozen: GlobalTimer.isTimerFrozen,
    };
};

export default useGlobalSessionTimer;
