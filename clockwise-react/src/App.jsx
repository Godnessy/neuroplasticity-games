import { useGameState } from './hooks/useGameState';
import * as Storage from './utils/storage';
import Header from './components/Header';
import Welcome from './components/screens/Welcome';
import Game from './components/screens/Game';
import LevelComplete from './components/screens/LevelComplete';
import Dashboard from './components/screens/Dashboard';
import Settings from './components/screens/Settings';
import Break from './components/screens/Break';
import './index.css';

function App() {
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
        generateQuestion
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
                        onHome={goHome}
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
                );
            case 'levelComplete':
                return (
                    <LevelComplete
                        session={state.session}
                        currentLevel={state.currentLevel}
                        duration={state.session ? Date.now() - state.session.startTime : 0}
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
                        onEnd={goHome}
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
            />
            <main className="main">
                {renderScreen()}
            </main>
        </div>
    );
}

export default App;
