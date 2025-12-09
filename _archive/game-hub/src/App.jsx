import { useState, useEffect } from 'react';
import FloatingShapes from './components/FloatingShapes';
import GameCard from './components/GameCard';
import RobuxDisplay from './components/RobuxDisplay';
import StatsBar from './components/StatsBar';
import * as Storage from './utils/storage';
import './index.css';

const games = [
    {
        id: 'clockwise',
        name: 'ClockWise',
        description: 'Learn to read analog and digital clocks through progressive levels',
        icon: (
            <svg viewBox="0 0 100 100" width="60" height="60">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
                <line x1="50" y1="50" x2="50" y2="25" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <line x1="50" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="50" cy="50" r="4" fill="currentColor"/>
            </svg>
        ),
        levels: 12,
        skill: 'Time Reading',
        character: 'freddy',
        url: '/clockwise-react/'
    },
    {
        id: 'multiply-master',
        name: 'MultiplyMaster',
        description: 'Master multiplication through understanding, not memorization',
        icon: (
            <svg viewBox="0 0 100 100" width="60" height="60">
                <text x="50" y="60" fontSize="50" textAnchor="middle" fill="currentColor" fontWeight="bold">×</text>
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
            </svg>
        ),
        levels: 12,
        skill: 'Multiplication',
        character: 'bonnie',
        url: '/multiply-master/'
    }
];

function App() {
    const [robuxCount, setRobuxCount] = useState(0);
    const [totalPlayTime, setTotalPlayTime] = useState(0);

    useEffect(() => {
        setRobuxCount(Storage.getRobuxCount());
        setTotalPlayTime(Storage.getTotalPlayTime());
    }, []);

    const handleResetRobux = () => {
        Storage.setRobuxCount(0);
        setRobuxCount(0);
    };

    const handlePlayGame = (game) => {
        Storage.setLastGame(game.id);
        // For now, show alert - games need to be running on separate ports
        alert(`To play ${game.name}, run:\n\ncd ${game.id === 'clockwise' ? 'clockwise-react' : 'multiply-master'} && npm run dev\n\nThen visit http://localhost:5174`);
    };

    return (
        <div className="app">
            <FloatingShapes />
            
            <header className="header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1 className="logo">
                            <span className="logo-icon">🧠</span>
                            Neuroplasticity Games
                        </h1>
                        <p className="tagline">Train your brain through play!</p>
                    </div>
                    <RobuxDisplay count={robuxCount} onReset={handleResetRobux} />
                </div>
            </header>

            <main className="main">
                <section className="hero">
                    <div className="hero-content">
                        <h2>Choose Your Adventure</h2>
                        <p>Each game is designed to strengthen specific brain functions through fun, progressive challenges.</p>
                    </div>
                    <div className="hero-characters">
                        <img src="/images/characters/freddy.png" alt="" className="hero-char char-1" />
                        <img src="/images/characters/bonnie.png" alt="" className="hero-char char-2" />
                        <img src="/images/characters/chica.png" alt="" className="hero-char char-3" />
                        <img src="/images/characters/foxy.png" alt="" className="hero-char char-4" />
                    </div>
                </section>

                <StatsBar totalPlayTime={totalPlayTime} gamesPlayed={games.length} />

                <section className="games-grid">
                    {games.map(game => (
                        <GameCard 
                            key={game.id} 
                            game={game} 
                            onPlay={handlePlayGame}
                        />
                    ))}
                </section>

                <section className="info-section">
                    <div className="info-card">
                        <h3>🎯 How It Works</h3>
                        <ul>
                            <li><strong>Small Steps:</strong> Each level builds on the last</li>
                            <li><strong>Lots of Practice:</strong> Repetition builds neural pathways</li>
                            <li><strong>Always Supported:</strong> Hints and legends always available</li>
                            <li><strong>Earn Robux:</strong> 1 Robux for every minute you play!</li>
                        </ul>
                    </div>
                    <div className="info-card">
                        <h3>🧪 Science-Based</h3>
                        <p>Our games are built on research from:</p>
                        <ul>
                            <li><strong>Dr. Michael Merzenich</strong> - Brain plasticity pioneer</li>
                            <li><strong>Dr. Edward Taub</strong> - Constraint-induced therapy</li>
                            <li><strong>Arrowsmith School</strong> - Cognitive exercises</li>
                        </ul>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <p>Made with ❤️ for learners everywhere</p>
            </footer>
        </div>
    );
}

export default App;
