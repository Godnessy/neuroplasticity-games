const KEYS = {
    ROBUX_COUNT: 'neuroplasticity_robux_count',
    ROBUX_LAST_UPDATE: 'neuroplasticity_robux_last_update',
    TOTAL_PLAY_TIME: 'neuroplasticity_total_play_time',
    LAST_GAME: 'neuroplasticity_last_game'
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

export const getTotalPlayTime = () => {
    try {
        const time = localStorage.getItem(KEYS.TOTAL_PLAY_TIME);
        return time ? parseInt(time, 10) : 0;
    } catch (e) {
        return 0;
    }
};

export const addPlayTime = (seconds) => {
    try {
        const current = getTotalPlayTime();
        localStorage.setItem(KEYS.TOTAL_PLAY_TIME, (current + seconds).toString());
    } catch (e) {
        console.error('Failed to save play time:', e);
    }
};

export const getLastGame = () => {
    try {
        return localStorage.getItem(KEYS.LAST_GAME) || null;
    } catch (e) {
        return null;
    }
};

export const setLastGame = (gameId) => {
    try {
        localStorage.setItem(KEYS.LAST_GAME, gameId);
    } catch (e) {
        console.error('Failed to save last game:', e);
    }
};

export const formatPlayTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};
