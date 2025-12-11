/**
 * Global Session Timer Service
 * 
 * This service manages a global session timer that:
 * 1. Persists across all games (switching games continues the timer)
 * 2. Can be frozen (when viewing stats) without affecting the pause mechanism
 * 3. Properly accounts for paused time (inactivity)
 * 4. Saves state to localStorage for persistence
 */

const STORAGE_KEY = 'neuroplasticity_global_session';
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes inactivity resets session

// In-memory state
let globalState = {
    isActive: false,           // Is there an active session?
    startTime: null,           // When the session started (timestamp)
    totalPausedTime: 0,        // Total time spent paused (inactivity)
    frozenElapsed: null,       // Elapsed time when frozen (for stats view)
    isFrozen: false,           // Is the timer frozen (stats view)?
    currentPauseStart: null,   // When current pause started (if paused)
    lastActivityTime: null,    // Last time user was active in a game
};

// Listeners for state changes
const listeners = new Set();

/**
 * Load state from localStorage
 */
const loadState = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Check if session is still valid (not older than 2 hours and not inactive for 10 minutes)
            const MAX_SESSION_AGE = 2 * 60 * 60 * 1000; // 2 hours
            const lastActivity = parsed.lastActivityTime || parsed.startTime;
            const inactiveTime = Date.now() - lastActivity;
            
            if (parsed.startTime && Date.now() - parsed.startTime < MAX_SESSION_AGE && inactiveTime < SESSION_TIMEOUT) {
                globalState = { ...globalState, ...parsed };
            } else {
                // Session expired or inactive too long, clear it
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    } catch (error) {
        console.error('Failed to load global session state:', error);
    }
};

/**
 * Save state to localStorage
 */
const saveState = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch (error) {
        console.error('Failed to save global session state:', error);
    }
};

/**
 * Notify all listeners of state change
 */
const notifyListeners = () => {
    const elapsed = getElapsedTime();
    listeners.forEach(callback => callback(elapsed, globalState.isActive));
};

/**
 * Start a new global session or continue existing one
 */
export const startSession = () => {
    // Check if session timed out (10 minutes of inactivity)
    if (globalState.isActive && globalState.lastActivityTime) {
        const inactiveTime = Date.now() - globalState.lastActivityTime;
        if (inactiveTime >= SESSION_TIMEOUT) {
            // Session timed out, start fresh
            globalState = {
                isActive: true,
                startTime: Date.now(),
                totalPausedTime: 0,
                frozenElapsed: null,
                isFrozen: false,
                currentPauseStart: null,
                lastActivityTime: Date.now(),
            };
            saveState();
            notifyListeners();
            return;
        }
    }
    
    if (!globalState.isActive) {
        globalState = {
            isActive: true,
            startTime: Date.now(),
            totalPausedTime: 0,
            frozenElapsed: null,
            isFrozen: false,
            currentPauseStart: null,
            lastActivityTime: Date.now(),
        };
        saveState();
    } else {
        // Continuing existing session - unfreeze if frozen
        if (globalState.isFrozen && globalState.frozenElapsed !== null) {
            // Calculate how much real time passed while frozen
            const currentElapsed = Date.now() - globalState.startTime - globalState.totalPausedTime;
            const timeFrozen = currentElapsed - globalState.frozenElapsed;
            
            // Add the frozen time to paused time so it doesn't count
            globalState.totalPausedTime += timeFrozen;
            globalState.isFrozen = false;
            globalState.frozenElapsed = null;
        }
        // Update last activity time when continuing session
        globalState.lastActivityTime = Date.now();
        saveState();
    }
    notifyListeners();
};

/**
 * End the global session
 */
export const endSession = () => {
    globalState = {
        isActive: false,
        startTime: null,
        totalPausedTime: 0,
        frozenElapsed: null,
        isFrozen: false,
        currentPauseStart: null,
        lastActivityTime: null,
    };
    saveState();
    notifyListeners();
};

/**
 * Record activity (user is actively playing)
 * Updates lastActivityTime to prevent session timeout
 */
export const recordActivity = () => {
    if (globalState.isActive) {
        globalState.lastActivityTime = Date.now();
        saveState();
    }
};

/**
 * Pause the timer (for inactivity)
 */
export const pauseTimer = () => {
    if (globalState.isActive && !globalState.currentPauseStart) {
        globalState.currentPauseStart = Date.now();
        saveState();
    }
};

/**
 * Resume the timer (after inactivity)
 */
export const resumeTimer = () => {
    if (globalState.isActive && globalState.currentPauseStart) {
        globalState.totalPausedTime += Date.now() - globalState.currentPauseStart;
        globalState.currentPauseStart = null;
        saveState();
    }
};

/**
 * Freeze the timer (for stats view) - saves current elapsed time
 */
export const freezeTimer = () => {
    if (globalState.isActive && !globalState.isFrozen) {
        globalState.frozenElapsed = getElapsedTime();
        globalState.isFrozen = true;
        saveState();
    }
};

/**
 * Unfreeze the timer (returning from stats view)
 * Adjusts start time to account for time spent in stats
 */
export const unfreezeTimer = () => {
    if (globalState.isActive && globalState.isFrozen && globalState.frozenElapsed !== null) {
        // Calculate how much real time passed while frozen
        const currentElapsed = Date.now() - globalState.startTime - globalState.totalPausedTime;
        const timeFrozen = currentElapsed - globalState.frozenElapsed;
        
        // Add the frozen time to paused time so it doesn't count
        globalState.totalPausedTime += timeFrozen;
        globalState.isFrozen = false;
        globalState.frozenElapsed = null;
        saveState();
    }
};

/**
 * Get the current elapsed time in milliseconds
 */
export const getElapsedTime = () => {
    if (!globalState.isActive || !globalState.startTime) {
        return 0;
    }
    
    // If frozen, return the frozen elapsed time
    if (globalState.isFrozen && globalState.frozenElapsed !== null) {
        return globalState.frozenElapsed;
    }
    
    let elapsed = Date.now() - globalState.startTime - globalState.totalPausedTime;
    
    // If currently paused, subtract the current pause duration
    if (globalState.currentPauseStart) {
        elapsed -= (Date.now() - globalState.currentPauseStart);
    }
    
    return Math.max(0, elapsed);
};

/**
 * Get elapsed time formatted as string (M:SS or H:MM:SS)
 */
export const getFormattedTime = () => {
    const elapsed = getElapsedTime();
    const totalSeconds = Math.floor(elapsed / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Check if session is active
 */
export const isSessionActive = () => globalState.isActive;

/**
 * Check if timer is frozen
 */
export const isTimerFrozen = () => globalState.isFrozen;

/**
 * Check if timer is paused
 */
export const isTimerPaused = () => globalState.currentPauseStart !== null;

/**
 * Subscribe to timer updates
 * @param {Function} callback - Called with (elapsedMs, isActive)
 * @returns {Function} Unsubscribe function
 */
export const subscribe = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

/**
 * Get the session start time
 */
export const getSessionStartTime = () => globalState.startTime;

/**
 * Get total paused time
 */
export const getTotalPausedTime = () => globalState.totalPausedTime;

// Initialize by loading state
loadState();

// Export for debugging
export const _getState = () => ({ ...globalState });
