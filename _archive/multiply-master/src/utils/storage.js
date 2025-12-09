const KEYS = {
    SETTINGS: 'multiplymaster_settings',
    PROGRESS: 'multiplymaster_progress',
    SESSIONS: 'multiplymaster_sessions',
    ROBUX_COUNT: 'neuroplasticity_robux_count', // Shared across games
    ROBUX_LAST_UPDATE: 'neuroplasticity_robux_last_update'
};

const defaultSettings = {
    font: 'lexend',
    fontSize: 'normal',
    highContrast: false,
    inputMethod: 'text',
    audioEnabled: false,
    showTimer: true,
    theme: 'purple'
};

const defaultProgress = {
    currentLevel: 1,
    levelsCompleted: [],
    totalCorrect: 0,
    totalQuestions: 0,
    totalPlayTime: 0,
    sessionsCount: 0,
    levelAccuracies: {},
    tableMastery: {}, // Track mastery per table
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

export const updateTableMastery = (table, wasCorrect) => {
    const progress = getProgress();
    if (!progress.tableMastery[table]) {
        progress.tableMastery[table] = { attempts: 0, correct: 0 };
    }
    progress.tableMastery[table].attempts++;
    if (wasCorrect) {
        progress.tableMastery[table].correct++;
    }
    saveProgress(progress);
};

export const getTableMastery = (table) => {
    const progress = getProgress();
    const data = progress.tableMastery[table];
    if (!data || data.attempts === 0) return 0;
    return data.correct / data.attempts;
};

export const resetProgress = () => {
    try {
        localStorage.removeItem(KEYS.PROGRESS);
        localStorage.removeItem(KEYS.SESSIONS);
    } catch (e) {
        console.error('Failed to reset progress:', e);
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
