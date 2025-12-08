const KEYS = {
    SETTINGS: 'clockwise_settings',
    PROGRESS: 'clockwise_progress',
    SESSIONS: 'clockwise_sessions',
    CURRENT_SESSION: 'clockwise_current_session',
    ROBUX_COUNT: 'clockwise_robux_count',
    ROBUX_LAST_UPDATE: 'clockwise_robux_last_update'
};

const defaultSettings = {
    font: 'lexend',
    fontSize: 'normal',
    highContrast: false,
    clockSize: 'normal',
    inputMethod: 'text',
    audioEnabled: false,
    showTimer: true,
    alwaysShowNumbers: false,
    theme: 'ocean'
};

const defaultProgress = {
    currentLevel: 1,
    levelsCompleted: [],
    totalCorrect: 0,
    totalQuestions: 0,
    totalPlayTime: 0,
    sessionsCount: 0,
    levelAccuracies: {},
    responseTimes: [],
    errorPatterns: {},
    lastPlayed: null
};

export const getSettings = () => {
    try {
        const stored = localStorage.getItem(KEYS.SETTINGS);
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : { ...defaultSettings };
    } catch (e) {
        return { ...defaultSettings };
    }
};

export const saveSettings = (settings) => {
    try {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save settings:', e);
    }
};

export const getProgress = () => {
    try {
        const stored = localStorage.getItem(KEYS.PROGRESS);
        return stored ? { ...defaultProgress, ...JSON.parse(stored) } : { ...defaultProgress };
    } catch (e) {
        return { ...defaultProgress };
    }
};

export const saveProgress = (progress) => {
    try {
        localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
    } catch (e) {
        console.error('Failed to save progress:', e);
    }
};

export const getSessions = () => {
    try {
        const stored = localStorage.getItem(KEYS.SESSIONS);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const saveSessions = (sessions) => {
    try {
        const maxSessions = 50;
        const trimmed = sessions.slice(-maxSessions);
        localStorage.setItem(KEYS.SESSIONS, JSON.stringify(trimmed));
    } catch (e) {
        console.error('Failed to save sessions:', e);
    }
};

export const addSession = (session) => {
    const sessions = getSessions();
    sessions.push({
        ...session,
        timestamp: new Date().toISOString()
    });
    saveSessions(sessions);
};

export const getCurrentSession = () => {
    try {
        const stored = localStorage.getItem(KEYS.CURRENT_SESSION);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
};

export const saveCurrentSession = (session) => {
    try {
        localStorage.setItem(KEYS.CURRENT_SESSION, JSON.stringify(session));
    } catch (e) {
        console.error('Failed to save current session:', e);
    }
};

export const clearCurrentSession = () => {
    try {
        localStorage.removeItem(KEYS.CURRENT_SESSION);
    } catch (e) {
        console.error('Failed to clear current session:', e);
    }
};

export const exportData = () => {
    return {
        settings: getSettings(),
        progress: getProgress(),
        sessions: getSessions(),
        exportedAt: new Date().toISOString()
    };
};

export const resetProgress = () => {
    try {
        localStorage.removeItem(KEYS.PROGRESS);
        localStorage.removeItem(KEYS.SESSIONS);
        localStorage.removeItem(KEYS.CURRENT_SESSION);
    } catch (e) {
        console.error('Failed to reset progress:', e);
    }
};

export const updateErrorPattern = (level, handCombination, wasCorrect) => {
    const progress = getProgress();
    const key = `${level}_${handCombination}`;
    
    if (!progress.errorPatterns[key]) {
        progress.errorPatterns[key] = { attempts: 0, errors: 0 };
    }
    
    progress.errorPatterns[key].attempts++;
    if (!wasCorrect) {
        progress.errorPatterns[key].errors++;
    }
    
    saveProgress(progress);
};

export const getWeakAreas = () => {
    const progress = getProgress();
    const weakAreas = [];
    
    for (const [key, data] of Object.entries(progress.errorPatterns)) {
        if (data.attempts >= 3) {
            const errorRate = data.errors / data.attempts;
            if (errorRate > 0.4) {
                weakAreas.push({
                    key,
                    errorRate: Math.round(errorRate * 100),
                    attempts: data.attempts
                });
            }
        }
    }
    
    return weakAreas.sort((a, b) => b.errorRate - a.errorRate).slice(0, 5);
};

export const getRobuxCount = () => {
    try {
        const count = localStorage.getItem(KEYS.ROBUX_COUNT);
        return count ? parseInt(count, 10) : 0;
    } catch (e) {
        return 0;
    }
};

export const setRobuxCount = (count) => {
    try {
        localStorage.setItem(KEYS.ROBUX_COUNT, count.toString());
        localStorage.setItem(KEYS.ROBUX_LAST_UPDATE, Date.now().toString());
    } catch (e) {
        console.error('Failed to save Robux count:', e);
    }
};

export const getLastRobuxUpdate = () => {
    try {
        const lastUpdate = localStorage.getItem(KEYS.ROBUX_LAST_UPDATE);
        return lastUpdate ? parseInt(lastUpdate, 10) : Date.now();
    } catch (e) {
        return Date.now();
    }
};
