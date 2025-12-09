import { useNavigate } from 'react-router-dom';
import { useGameState } from '../../hooks/useGameState';
import * as Storage from '../../utils/storage';
import Header from '../../components/shared/Header';
import Welcome from './screens/Welcome';
import Game from './screens/Game';
import LevelComplete from './screens/LevelComplete';
import Dashboard from './screens/Dashboard';
import Settings from './screens/Settings';
import Break from './screens/Break';

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
        recordActivity
    } = useGameState();

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
        </div>
    );
}

export default ClockwiseGame;
