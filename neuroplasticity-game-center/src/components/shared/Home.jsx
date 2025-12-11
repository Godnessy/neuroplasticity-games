import { Link } from 'react-router-dom';
import RobuxCounter from './RobuxCounter';

const games = [
    {
        id: 'clockwise',
        path: '/clockwise',
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
        character: 'freddy'
    },
    {
        id: 'multiply',
        path: '/multiply',
        name: 'MultiplyMaster',
        description: 'Master multiplication through understanding, not memorization',
        icon: (
            <svg viewBox="0 0 100 100" width="60" height="60">
                <text x="50" y="60" fontSize="50" textAnchor="middle" fill="currentColor" fontWeight="bold">×</text>
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
            </svg>
        ),
        levels: 11,
        skill: 'Multiplication',
        character: 'bonnie'
    },
    {
        id: 'divide',
        path: '/divide',
        name: 'DivideMaster',
        description: 'Learn division - the opposite of multiplication!',
        icon: (
            <svg viewBox="0 0 100 100" width="60" height="60">
                <text x="50" y="60" fontSize="50" textAnchor="middle" fill="currentColor" fontWeight="bold">÷</text>
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
            </svg>
        ),
        levels: 9,
        skill: 'Division',
        character: 'chica'
    },
    {
        id: 'timeofday',
        path: '/timeofday',
        name: 'Time of Day',
        description: 'Learn times of day in English and Norwegian',
        icon: (
            <svg viewBox="0 0 100 100" width="60" height="60">
                <circle cx="50" cy="35" r="20" fill="currentColor" opacity="0.8"/>
                <path d="M10 70 Q50 50 90 70" stroke="currentColor" strokeWidth="4" fill="none"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
            </svg>
        ),
        levels: 1,
        skill: 'Language & Time',
        character: 'foxy'
    }
];

const Home = ({ robuxCount, onResetRobux }) => {
    return (
        <div className="home">
            <header className="home-header">
                <div className="home-header-content">
                    <div className="logo-section">
                        <h1 className="logo">
                            <span className="logo-icon">🧠</span>
                            Neuroplasticity Games
                        </h1>
                        <p className="tagline">Train your brain through play!</p>
                    </div>
                    <div className="header-actions">
                        <Link to="/stats" className="btn-stats">
                            📊 View Statistics
                        </Link>
                        <RobuxCounter count={robuxCount} onReset={onResetRobux} />
                    </div>
                </div>
            </header>

            <main className="home-main">
                <section className="hero">
                    <h2>Choose Your Adventure</h2>
                    <p>Each game strengthens specific brain functions through fun, progressive challenges.</p>
                    <div className="hero-characters">
                        <img src="/images/characters/freddy.png" alt="" className="hero-char" />
                        <img src="/images/characters/bonnie.png" alt="" className="hero-char" />
                        <img src="/images/characters/chica.png" alt="" className="hero-char" />
                        <img src="/images/characters/foxy.png" alt="" className="hero-char" />
                    </div>
                </section>

                <section className="games-grid">
                    {games.map(game => (
                        <Link to={game.path} key={game.id} className={`game-card ${game.id}`}>
                            <div className="game-card-icon">{game.icon}</div>
                            <div className="game-card-content">
                                <h3>{game.name}</h3>
                                <p>{game.description}</p>
                                <div className="game-meta">
                                    <span>{game.levels} Levels</span>
                                    <span>{game.skill}</span>
                                </div>
                            </div>
                            <div className="game-card-character">
                                <img src={`/images/characters/${game.character}.png`} alt="" />
                            </div>
                            <span className="play-btn">Play →</span>
                        </Link>
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
                        <p>Built on research from:</p>
                        <ul>
                            <li><strong>Dr. Michael Merzenich</strong> - Brain plasticity</li>
                            <li><strong>Arrowsmith School</strong> - Cognitive exercises</li>
                        </ul>
                    </div>
                </section>
            </main>

            <footer className="home-footer">
                <p>Made with ❤️ for learners everywhere</p>
            </footer>
        </div>
    );
};

export default Home;
