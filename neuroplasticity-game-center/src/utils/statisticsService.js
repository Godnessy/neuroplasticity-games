/**
 * Statistics Service
 *
 * Centralized service for tracking detailed game statistics and sessions.
 * Stores data in localStorage with enhanced session tracking.
 */

// Active sessions map (in-memory)
const activeSessions = new Map();

// Track continuous play time for break modal
let continuousPlayStartTime = null;
let totalBreakTime = 0;

/**
 * Generate a unique session ID
 */
const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get storage key for a game
 */
const getStorageKey = (gameName, type) => {
    const gameKey = gameName.toLowerCase().replace(/\s+/g, '');
    return `${gameKey}_${type}`;
};

/**
 * Create a new session
 * @param {string} gameName - Name of the game
 * @param {number} level - Current level
 * @returns {string} sessionId
 */
export const createSession = (gameName, level) => {
    const sessionId = generateSessionId();
    const now = new Date();

    // Initialize continuous play timer if not already started
    if (!continuousPlayStartTime) {
        continuousPlayStartTime = Date.now();
        totalBreakTime = 0;
    }

    const session = {
        sessionId,
        gameName,
        date: now.toISOString().split('T')[0], // YYYY-MM-DD
        startTime: now.toISOString(),
        endTime: null,
        duration: 0,
        level,
        correctAnswers: 0,
        incorrectAnswers: 0,
        robuxEarned: 0,
        bestStreak: 0,
        currentStreak: 0,
        endedBy: null,
        answers: []
    };

    activeSessions.set(sessionId, session);

    return sessionId;
};

/**
 * Add an answer to a session
 * @param {string} sessionId - Session ID
 * @param {object} answerData - Answer data {correct, responseTime, level}
 */
export const addAnswerToSession = (sessionId, answerData) => {
    const session = activeSessions.get(sessionId);
    if (!session) {
        console.warn(`[Statistics] Session ${sessionId} not found`);
        return;
    }

    const answer = {
        correct: answerData.correct,
        responseTime: answerData.responseTime || 0,
        level: answerData.level || session.level,
        timestamp: Date.now()
    };

    session.answers.push(answer);

    if (answer.correct) {
        session.correctAnswers++;
        session.currentStreak++;
        session.bestStreak = Math.max(session.bestStreak, session.currentStreak);
    } else {
        session.incorrectAnswers++;
        session.currentStreak = 0;
    }

    };

/**
 * End a session and save to localStorage
 * @param {string} sessionId - Session ID
 * @param {number} robuxEarned - Robux earned in this session
 * @param {string} endReason - Reason for ending ('completion', 'pause', 'navigation', 'break_modal')
 */
export const endSession = (sessionId, robuxEarned = 0, endReason = 'completion') => {
    const session = activeSessions.get(sessionId);
    if (!session) {
        console.warn(`[Statistics] Session ${sessionId} not found for ending`);
        return;
    }

    const now = new Date();
    session.endTime = now.toISOString();
    session.duration = Math.round((new Date(session.endTime) - new Date(session.startTime)) / 1000);
    session.robuxEarned = robuxEarned;
    session.endedBy = endReason;

    // Save session to localStorage
    saveSessionToStorage(session);

    // Update progress
    updateProgress(session);

    // Remove from active sessions
    activeSessions.delete(sessionId);

    // Reset continuous play timer if ending due to break or navigation
    if (endReason === 'break_modal' || endReason === 'navigation') {
        continuousPlayStartTime = null;
        totalBreakTime = 0;
    }

    };

/**
 * Save session to localStorage
 */
const saveSessionToStorage = (session) => {
    try {
        const key = getStorageKey(session.gameName, 'enhanced_sessions');
        const stored = localStorage.getItem(key);
        const sessions = stored ? JSON.parse(stored) : [];

        // Add new session
        sessions.push(session);

        // Keep only last 100 sessions per game
        const trimmed = sessions.slice(-100);

        localStorage.setItem(key, JSON.stringify(trimmed));
    } catch (error) {
        console.error('[Statistics] Failed to save session:', error);
    }
};

/**
 * Update progress statistics
 */
const updateProgress = (session) => {
    try {
        const key = getStorageKey(session.gameName, 'enhanced_progress');
        const stored = localStorage.getItem(key);
        const progress = stored ? JSON.parse(stored) : {
            totalCorrect: 0,
            totalIncorrect: 0,
            totalPlayTime: 0,
            totalRobuxEarned: 0,
            sessionsCount: 0,
            lastPlayed: null,
            levelStats: {}
        };

        // Update totals
        progress.totalCorrect += session.correctAnswers;
        progress.totalIncorrect += session.incorrectAnswers;
        progress.totalPlayTime += session.duration;
        progress.totalRobuxEarned += session.robuxEarned;
        progress.sessionsCount++;
        progress.lastPlayed = session.endTime;

        // Update level-specific stats
        if (!progress.levelStats[session.level]) {
            progress.levelStats[session.level] = {
                correct: 0,
                incorrect: 0,
                playTime: 0,
                timesPlayed: 0
            };
        }

        progress.levelStats[session.level].correct += session.correctAnswers;
        progress.levelStats[session.level].incorrect += session.incorrectAnswers;
        progress.levelStats[session.level].playTime += session.duration;
        progress.levelStats[session.level].timesPlayed++;

        localStorage.setItem(key, JSON.stringify(progress));
    } catch (error) {
        console.error('[Statistics] Failed to update progress:', error);
    }
};

/**
 * Get statistics for a specific game
 * @param {string} gameName - Name of the game
 * @returns {object} Game statistics
 */
export const getGameStats = (gameName) => {
    try {
        const progressKey = getStorageKey(gameName, 'enhanced_progress');
        const sessionsKey = getStorageKey(gameName, 'enhanced_sessions');

        const progress = JSON.parse(localStorage.getItem(progressKey) || 'null') || {
            totalCorrect: 0,
            totalIncorrect: 0,
            totalPlayTime: 0,
            totalRobuxEarned: 0,
            sessionsCount: 0,
            lastPlayed: null,
            levelStats: {}
        };

        const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');

        return {
            gameName,
            progress,
            sessions,
            accuracy: progress.totalCorrect + progress.totalIncorrect > 0
                ? (progress.totalCorrect / (progress.totalCorrect + progress.totalIncorrect) * 100).toFixed(1)
                : 0
        };
    } catch (error) {
        console.error(`[Statistics] Failed to get stats for ${gameName}:`, error);
        return null;
    }
};

/**
 * Get statistics for all games
 * @returns {object} All games statistics
 */
export const getAllGameStats = () => {
    const games = ['clockwise', 'multiply', 'divide', 'timeofday'];
    const allStats = {};

    games.forEach(game => {
        allStats[game] = getGameStats(game);
    });

    // Calculate totals
    const totals = {
        totalCorrect: 0,
        totalIncorrect: 0,
        totalPlayTime: 0,
        totalRobuxEarned: 0,
        totalSessions: 0
    };

    Object.values(allStats).forEach(gameStats => {
        if (gameStats) {
            totals.totalCorrect += gameStats.progress.totalCorrect;
            totals.totalIncorrect += gameStats.progress.totalIncorrect;
            totals.totalPlayTime += gameStats.progress.totalPlayTime;
            totals.totalRobuxEarned += gameStats.progress.totalRobuxEarned;
            totals.totalSessions += gameStats.progress.sessionsCount;
        }
    });

    return {
        games: allStats,
        totals
    };
};

/**
 * Get sessions for a specific date
 * @param {string} gameName - Name of the game (optional, null for all games)
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {array} Sessions for that date
 */
export const getSessionsByDate = (gameName, date) => {
    if (gameName) {
        const stats = getGameStats(gameName);
        return stats ? stats.sessions.filter(s => s.date === date) : [];
    } else {
        // Get sessions from all games
        const games = ['clockwise', 'multiply', 'divide', 'timeofday'];
        const allSessions = [];

        games.forEach(game => {
            const stats = getGameStats(game);
            if (stats) {
                const dateSessions = stats.sessions.filter(s => s.date === date);
                allSessions.push(...dateSessions);
            }
        });

        // Sort by start time
        return allSessions.sort((a, b) =>
            new Date(a.startTime) - new Date(b.startTime)
        );
    }
};

/**
 * Get recent sessions
 * @param {string} gameName - Name of the game (optional, null for all games)
 * @param {number} limit - Number of sessions to return
 * @returns {array} Recent sessions
 */
export const getRecentSessions = (gameName = null, limit = 10) => {
    if (gameName) {
        const stats = getGameStats(gameName);
        return stats ? stats.sessions.slice(-limit).reverse() : [];
    } else {
        // Get sessions from all games
        const games = ['clockwise', 'multiply', 'divide', 'timeofday'];
        const allSessions = [];

        games.forEach(game => {
            const stats = getGameStats(game);
            if (stats) {
                allSessions.push(...stats.sessions);
            }
        });

        // Sort by start time (most recent first) and limit
        return allSessions
            .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
            .slice(0, limit);
    }
};

/**
 * Get continuous play time in seconds (for break modal)
 * @returns {number} Seconds of continuous play
 */
export const getContinuousPlayTime = () => {
    if (!continuousPlayStartTime) return 0;

    const elapsed = Date.now() - continuousPlayStartTime - totalBreakTime;
    return Math.floor(elapsed / 1000);
};

/**
 * Reset continuous play timer (after break modal "Continue Playing")
 */
export const resetContinuousPlayTimer = () => {
    continuousPlayStartTime = Date.now();
    totalBreakTime = 0;
};

/**
 * Get session by ID (from active or stored sessions)
 * @param {string} sessionId - Session ID
 * @returns {object} Session object or null
 */
export const getSessionById = (sessionId) => {
    // Check active sessions first
    if (activeSessions.has(sessionId)) {
        return activeSessions.get(sessionId);
    }

    // Search in stored sessions
    const games = ['clockwise', 'multiply', 'divide', 'timeofday'];
    for (const game of games) {
        const stats = getGameStats(game);
        if (stats) {
            const session = stats.sessions.find(s => s.sessionId === sessionId);
            if (session) return session;
        }
    }

    return null;
};

/**
 * Export all statistics data
 * @returns {object} All statistics data
 */
export const exportAllStats = () => {
    const allStats = getAllGameStats();
    return {
        ...allStats,
        exportedAt: new Date().toISOString(),
        version: '2.0'
    };
};

// Export default object with all methods
export default {
    createSession,
    addAnswerToSession,
    endSession,
    getGameStats,
    getAllGameStats,
    getSessionsByDate,
    getRecentSessions,
    getContinuousPlayTime,
    resetContinuousPlayTimer,
    getSessionById,
    exportAllStats
};
