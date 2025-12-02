const Storage = {
    KEYS: {
        SETTINGS: 'clockwise_settings',
        PROGRESS: 'clockwise_progress',
        SESSIONS: 'clockwise_sessions',
        CURRENT_SESSION: 'clockwise_current_session'
    },

    defaultSettings: {
        font: 'lexend',
        fontSize: 'normal',
        highContrast: false,
        clockSize: 'normal',
        inputMethod: 'text',
        audioEnabled: false,
        showTimer: true,
        alwaysShowNumbers: false,
        theme: 'ocean'
    },

    defaultProgress: {
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
    },

    getSettings() {
        try {
            const stored = localStorage.getItem(this.KEYS.SETTINGS);
            return stored ? { ...this.defaultSettings, ...JSON.parse(stored) } : { ...this.defaultSettings };
        } catch (e) {
            return { ...this.defaultSettings };
        }
    },

    saveSettings(settings) {
        try {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    },

    getProgress() {
        try {
            const stored = localStorage.getItem(this.KEYS.PROGRESS);
            return stored ? { ...this.defaultProgress, ...JSON.parse(stored) } : { ...this.defaultProgress };
        } catch (e) {
            return { ...this.defaultProgress };
        }
    },

    saveProgress(progress) {
        try {
            localStorage.setItem(this.KEYS.PROGRESS, JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    },

    getSessions() {
        try {
            const stored = localStorage.getItem(this.KEYS.SESSIONS);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    },

    saveSessions(sessions) {
        try {
            const maxSessions = 50;
            const trimmed = sessions.slice(-maxSessions);
            localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(trimmed));
        } catch (e) {
            console.error('Failed to save sessions:', e);
        }
    },

    addSession(session) {
        const sessions = this.getSessions();
        sessions.push({
            ...session,
            timestamp: new Date().toISOString()
        });
        this.saveSessions(sessions);
    },

    getCurrentSession() {
        try {
            const stored = localStorage.getItem(this.KEYS.CURRENT_SESSION);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    },

    saveCurrentSession(session) {
        try {
            localStorage.setItem(this.KEYS.CURRENT_SESSION, JSON.stringify(session));
        } catch (e) {
            console.error('Failed to save current session:', e);
        }
    },

    clearCurrentSession() {
        try {
            localStorage.removeItem(this.KEYS.CURRENT_SESSION);
        } catch (e) {
            console.error('Failed to clear current session:', e);
        }
    },

    exportData() {
        return {
            settings: this.getSettings(),
            progress: this.getProgress(),
            sessions: this.getSessions(),
            exportedAt: new Date().toISOString()
        };
    },

    resetProgress() {
        try {
            localStorage.removeItem(this.KEYS.PROGRESS);
            localStorage.removeItem(this.KEYS.SESSIONS);
            localStorage.removeItem(this.KEYS.CURRENT_SESSION);
        } catch (e) {
            console.error('Failed to reset progress:', e);
        }
    },

    updateErrorPattern(level, handCombination, wasCorrect) {
        const progress = this.getProgress();
        const key = `${level}_${handCombination}`;
        
        if (!progress.errorPatterns[key]) {
            progress.errorPatterns[key] = { attempts: 0, errors: 0 };
        }
        
        progress.errorPatterns[key].attempts++;
        if (!wasCorrect) {
            progress.errorPatterns[key].errors++;
        }
        
        this.saveProgress(progress);
    },

    getWeakAreas() {
        const progress = this.getProgress();
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
    }
};

