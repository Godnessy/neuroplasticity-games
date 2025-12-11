import * as Storage from './storage.js';
import * as GlobalTimer from './globalSessionTimer.js';

/**
 * Robux Timer Service
 *
 * Awards 1 robux per minute of play time.
 * Uses the Global Session Timer as the single source of truth for elapsed time.
 * No separate clock - just monitors the global timer and awards robux at each minute mark.
 */

// State - only tracks last awarded minute to prevent double-awarding
let lastAwardedMinute = 0;
let intervalId = null;
let isRunning = false;

/**
 * Start monitoring for robux awards
 * Uses the global timer's elapsed time - no separate clock
 */
export const startTimer = () => {
  // Stop any existing monitoring
  stopTimer();

  // Get current minute from global timer to set baseline
  const elapsed = GlobalTimer.getElapsedTime();
  lastAwardedMinute = Math.floor(elapsed / 60000);
  isRunning = true;

  // Check every second if we've crossed a minute boundary
  intervalId = setInterval(() => {
    const currentElapsed = GlobalTimer.getElapsedTime();
    const currentMinute = Math.floor(currentElapsed / 60000);

    // Award robux when crossing minute boundaries
    if (currentMinute > lastAwardedMinute) {
      const robuxToAward = currentMinute - lastAwardedMinute;
      lastAwardedMinute = currentMinute;
      const current = Storage.getRobuxCount();
      Storage.setRobuxCount(current + robuxToAward);
    }
  }, 1000);
};

/**
 * Stop monitoring for robux awards
 */
export const stopTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isRunning = false;
};

/**
 * Pause/Resume are no-ops now - the global timer handles all timing
 * These functions exist for API compatibility but do nothing
 */
export const pauseTimer = () => {
  // No-op: Global timer handles pause/freeze
};

export const resumeTimer = () => {
  // No-op: Global timer handles resume/unfreeze
};

/**
 * Get robux earned based on global timer elapsed time
 */
export const getRobuxEarned = () => {
  const elapsed = GlobalTimer.getElapsedTime();
  return Math.floor(elapsed / 60000);
};

/**
 * Get session duration from global timer
 */
export const getSessionDuration = () => {
  const elapsed = GlobalTimer.getElapsedTime();
  return Math.floor(elapsed / 1000);
};

/**
 * Get timer state (for debugging)
 */
export const getTimerState = () => {
  return {
    isRunning,
    lastAwardedMinute,
    globalElapsed: GlobalTimer.getElapsedTime(),
    robuxEarned: getRobuxEarned()
  };
};

/**
 * Force cleanup
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
