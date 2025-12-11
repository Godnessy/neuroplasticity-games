import * as Storage from './storage.js';

/**
 * Centralized Robux Timer Service
 *
 * Singleton service to manage ONE global robux timer across all games.
 * Fixes the bug where multiple games running timers simultaneously caused
 * robux over-accumulation (4 games = 4x robux per minute).
 *
 * Key Features:
 * - Single timer instance (prevents multiple concurrent timers)
 * - Tracks current game, start time, paused time
 * - Awards 1 robux per minute of actual play time
 * - Proper cleanup methods
 */

// Singleton state
let timerState = {
  intervalId: null,
  sessionStartTime: null,
  totalPausedTime: 0,
  pauseStartTime: null,
  lastRobuxMinute: 0,
  currentGame: null,
  isRunning: false,
  isPaused: false
};

/**
 * Start the robux timer for a game
 * Stops any existing timer first to prevent multiple timers
 *
 * @param {string} gameName - Name of the game starting the timer
 */
export const startTimer = (gameName) => {
  // Stop any existing timer first
  stopTimer();

  // Initialize state for new session
  timerState.sessionStartTime = Date.now();
  timerState.totalPausedTime = 0;
  timerState.pauseStartTime = null;
  timerState.lastRobuxMinute = 0;
  timerState.currentGame = gameName;
  timerState.isRunning = true;
  timerState.isPaused = false;

  // Start the timer - checks every second
  timerState.intervalId = setInterval(() => {
    if (!timerState.isPaused && timerState.sessionStartTime) {
      // Calculate elapsed time minus paused time
      const elapsed = Date.now() - timerState.sessionStartTime - timerState.totalPausedTime;
      const currentMinute = Math.floor(elapsed / 60000);

      // Award 1 robux per minute
      if (currentMinute > timerState.lastRobuxMinute) {
        timerState.lastRobuxMinute = currentMinute;
        const current = Storage.getRobuxCount();
        const updated = current + 1;
        Storage.setRobuxCount(updated);

        console.log(`[RobuxTimer] ${gameName} - Earned 1 robux (Total: ${updated}, Minute: ${currentMinute})`);
      }
    }
  }, 1000);

  console.log(`[RobuxTimer] Started timer for ${gameName}`);
};

/**
 * Stop the robux timer completely
 * Clears interval and resets all state
 */
export const stopTimer = () => {
  if (timerState.intervalId) {
    clearInterval(timerState.intervalId);
    console.log(`[RobuxTimer] Stopped timer for ${timerState.currentGame}`);
  }

  // Reset state
  timerState.intervalId = null;
  timerState.sessionStartTime = null;
  timerState.totalPausedTime = 0;
  timerState.pauseStartTime = null;
  timerState.lastRobuxMinute = 0;
  timerState.currentGame = null;
  timerState.isRunning = false;
  timerState.isPaused = false;
};

/**
 * Pause the robux timer
 * Records pause start time but keeps interval running (in paused mode)
 */
export const pauseTimer = () => {
  if (timerState.isRunning && !timerState.isPaused) {
    timerState.isPaused = true;
    timerState.pauseStartTime = Date.now();
    console.log(`[RobuxTimer] Paused timer for ${timerState.currentGame}`);
  }
};

/**
 * Resume the robux timer from pause
 * Adds pause duration to total paused time
 */
export const resumeTimer = () => {
  if (timerState.isRunning && timerState.isPaused && timerState.pauseStartTime) {
    const pauseDuration = Date.now() - timerState.pauseStartTime;
    timerState.totalPausedTime += pauseDuration;
    timerState.pauseStartTime = null;
    timerState.isPaused = false;
    console.log(`[RobuxTimer] Resumed timer for ${timerState.currentGame} (Pause duration: ${Math.round(pauseDuration / 1000)}s)`);
  }
};

/**
 * Get current robux earned in this session
 *
 * @returns {number} Number of robux earned in current session
 */
export const getRobuxEarned = () => {
  if (!timerState.sessionStartTime) return 0;

  const elapsed = Date.now() - timerState.sessionStartTime - timerState.totalPausedTime;
  return Math.floor(elapsed / 60000);
};

/**
 * Get current session duration in seconds (excluding paused time)
 *
 * @returns {number} Duration in seconds
 */
export const getSessionDuration = () => {
  if (!timerState.sessionStartTime) return 0;

  const elapsed = Date.now() - timerState.sessionStartTime - timerState.totalPausedTime;
  return Math.floor(elapsed / 1000);
};

/**
 * Get timer state (for debugging)
 *
 * @returns {object} Current timer state
 */
export const getTimerState = () => {
  return {
    ...timerState,
    sessionDuration: getSessionDuration(),
    robuxEarned: getRobuxEarned()
  };
};

/**
 * Force cleanup - for emergency situations
 * Same as stopTimer but more explicit name
 */
export const cleanup = () => {
  stopTimer();
};

// Export default object with all methods
export default {
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer,
  getRobuxEarned,
  getSessionDuration,
  getTimerState,
  cleanup
};
