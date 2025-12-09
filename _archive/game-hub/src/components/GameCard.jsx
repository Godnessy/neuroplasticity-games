const GameCard = ({ game, onPlay }) => {
    return (
        <div className={`game-card ${game.id}`}>
            <div className="game-card-icon">
                {game.icon}
            </div>
            <div className="game-card-content">
                <h3>{game.name}</h3>
                <p className="game-description">{game.description}</p>
                <div className="game-meta">
                    <span className="game-levels">{game.levels} Levels</span>
                    <span className="game-skill">{game.skill}</span>
                </div>
            </div>
            <button 
                className="btn-play"
                onClick={() => onPlay(game)}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                </svg>
                Play
            </button>
            <div className="game-card-characters">
                <img 
                    src={`/images/characters/${game.character}.png`} 
                    alt="" 
                    className="game-character"
                />
            </div>
        </div>
    );
};

export default GameCard;
