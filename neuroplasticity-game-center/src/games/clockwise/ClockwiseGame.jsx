import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import * as Storage from '../../utils/storage';
import * as RobuxTimer from '../../utils/robuxTimerService';
import * as Statistics from '../../utils/statisticsService';
import Header from '../../components/shared/Header';
import Welcome from './screens/Welcome';
import Game from './screens/Game';
import LevelComplete from './screens/LevelComplete';
import Dashboard from './screens/Dashboard';
import Settings from './screens/Settings';
import Break from './screens/Break';
import BreakModal from '../../components/shared/BreakModal';

function ClockwiseGame() {
    const navigate = useNavigate();
    const {
        state,
        showScreen,
        updateSetting,
        startSession,
        processAnswer,
        advanceLevel,
        repeatLevel,
        goToPrevLevel,
        goToNextLevel,
        goHome,
        resetRobux,
        showHint,
        toggleNumbers,
        setSelectedHour,
        setSelectedMinute,
        dismissFeedback,
        hasContinue,
        continueGame,
        resetProgress,
        formatDuration,
        getSessionTime,
        generateQuestion,
        isPaused,
        recordActivity,
        currentSessionIdRef
    } = useGameState();

    const [showBreakModal, setShowBreakModal] = useState(false);
    const [breakSessionStats, setBreakSessionStats] = useState(null);
    const BREAK_REMINDER_TIME = 20 * 60; // 20 minutes in seconds

    // Check for 20-minute break reminder
    useEffect(() => {
        if (!state.sessionStartTime || state.currentScreen !== 'game' || isPaused || showBreakModal) return;

        const checkBreakTime = setInterval(() => {
            // Note: state.session is captured by closure and will have latest value
            const continuousTime = Statistics.getContinuousPlayTime();
            if (continuousTime >= BREAK_REMINDER_TIME) {
                const correctAnswers = (state.session?.answers || []).filter(a => a.correct).length;
                const totalAnswers = (state.session?.answers || []).length;
                const robuxEarned = RobuxTimer.getRobuxEarned();
                const playTime = RobuxTimer.getSessionDuration();

                setBreakSessionStats({
                    playTime,
                    questionsAnswered: totalAnswers,
                    correctAnswers,
                    robuxEarned
                });
                setShowBreakModal(true);
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(checkBreakTime);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.sessionStartTime, state.currentScreen, isPaused, showBreakModal, BREAK_REMINDER_TIME]);

    const handleExportData = () => {
        const data = Storage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clockwise-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleContinueAfterBreak = () => {
        showScreen('game');
        generateQuestion();
    };

    const handleGoHome = () => {
        goHome();
        navigate('/');
    };

    const handleTakeBreak = () => {
        // End session and navigate home
        if (currentSessionIdRef?.current) {
            const robuxEarned = RobuxTimer.getRobuxEarned();
            Statistics.endSession(currentSessionIdRef.current, robuxEarned, 'break_modal');
        }
        goHome();
        setShowBreakModal(false);
        navigate('/');
    };

    const handleContinuePlaying = () => {
        Statistics.resetContinuousPlayTimer();
        setShowBreakModal(false);
    };

    const renderScreen = () => {
        switch (state.currentScreen) {
            case 'welcome':
                return (
                    <Welcome
                        robuxCount={state.robuxCount}
                        onResetRobux={resetRobux}
                        onStartNew={() => startSession()}
                        onContinue={continueGame}
                        hasContinue={hasContinue()}
                    />
                );
            case 'game':
                return (
                    <>
                        <Game
                            currentLevel={state.currentLevel}
                            currentQuestion={state.currentQuestion}
                            session={state.session}
                            robuxCount={state.robuxCount}
                            settings={state.settings}
                            showingNumbers={state.showingNumbers}
                            selectedHour={state.selectedHour}
                            selectedMinute={state.selectedMinute}
                            showFeedback={state.showFeedback}
                            feedbackData={state.feedbackData}
                            characterIndex={state.characterIndex}
                            sessionTime={getSessionTime()}
                            onHome={handleGoHome}
                            onResetRobux={resetRobux}
                            onPrevLevel={goToPrevLevel}
                            onNextLevel={goToNextLevel}
                            onShowHint={showHint}
                            onToggleNumbers={toggleNumbers}
                            onSelectHour={setSelectedHour}
                            onSelectMinute={setSelectedMinute}
                            onProcessAnswer={processAnswer}
                            onDismissFeedback={dismissFeedback}
                            isProcessing={state.isProcessing}
                        />
                        {isPaused && (
                            <div className="pause-overlay" onClick={recordActivity}>
                                <div className="pause-content">
                                    <h2>⏸️ Paused</h2>
                                    <p>Game paused due to inactivity</p>
                                    <button className="btn btn-primary btn-large" onClick={recordActivity}>
                                        Resume
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                );
            case 'levelComplete':
                return (
                    <LevelComplete
                        session={state.session}
                        currentLevel={state.currentLevel}
                        duration={state.session?.duration || 0}
                        formatDuration={formatDuration}
                        onAdvance={advanceLevel}
                        onRepeat={repeatLevel}
                    />
                );
            case 'dashboard':
                return (
                    <Dashboard
                        onBack={() => showScreen('welcome')}
                        formatDuration={formatDuration}
                        onExport={handleExportData}
                        onReset={resetProgress}
                    />
                );
            case 'settings':
                return (
                    <Settings
                        settings={state.settings}
                        onBack={() => showScreen('welcome')}
                        onUpdateSetting={updateSetting}
                    />
                );
            case 'break':
                return (
                    <Break
                        onContinue={handleContinueAfterBreak}
                        onEnd={handleGoHome}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="app">
            <Header
                onSettings={() => showScreen('settings')}
                onDashboard={() => showScreen('dashboard')}
                onHome={() => navigate('/')}
            />
            <main className="main">
                {renderScreen()}
            </main>
            <BreakModal
                show={showBreakModal}
                sessionStats={breakSessionStats}
                onTakeBreak={handleTakeBreak}
                onContinue={handleContinuePlaying}
            />
        </div>
    );
}

export default ClockwiseGame;
