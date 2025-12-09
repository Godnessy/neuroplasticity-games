const MultiplicationLegend = ({ currentTable }) => {
    // Key facts that help derive other tables
    const keyFacts = [
        { table: 2, tip: '×2 = Double it', color: '#3498db' },
        { table: 5, tip: '×5 = Half of ×10', color: '#2ecc71' },
        { table: 10, tip: '×10 = Add a zero', color: '#9b59b6' }
    ];

    // Derivation strategies
    const strategies = {
        3: '×3 = ×2 + one more',
        4: '×4 = Double twice',
        6: '×6 = ×5 + one more',
        7: '×7 = ×5 + ×2',
        8: '×8 = Double three times',
        9: '×9 = ×10 - one'
    };

    return (
        <div className="multiplication-legend">
            <img src="images/characters/freddy.png" alt="" className="legend-character corner-tl" />
            <img src="images/characters/bonnie.png" alt="" className="legend-character corner-tr" />
            <img src="images/characters/chica.png" alt="" className="legend-character corner-bl" />
            <img src="images/characters/foxy.png" alt="" className="legend-character corner-br" />
            
            <div className="legend-header">
                <h3>✖️ Multiplication Tricks ✖️</h3>
                <p>Use what you know!</p>
            </div>

            <div className="legend-section">
                <div className="section-title">🔑 Key Facts</div>
                <div className="key-facts">
                    {keyFacts.map(({ table, tip, color }) => (
                        <div 
                            key={table} 
                            className={`key-fact ${currentTable === table ? 'active' : ''}`}
                            style={{ borderColor: color }}
                        >
                            <span className="fact-table" style={{ color }}>{table}×</span>
                            <span className="fact-tip">{tip}</span>
                        </div>
                    ))}
                </div>
            </div>

            {currentTable && strategies[currentTable] && (
                <div className="legend-section">
                    <div className="section-title">💡 Current Strategy</div>
                    <div className="current-strategy">
                        <span className="strategy-table">{currentTable}×</span>
                        <span className="strategy-tip">{strategies[currentTable]}</span>
                    </div>
                </div>
            )}

            <div className="legend-section">
                <div className="section-title">📊 Quick Reference</div>
                <div className="quick-ref">
                    <div className="ref-row">
                        <span>×2</span><span>×5</span><span>×10</span>
                    </div>
                    {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} className="ref-row">
                            <span>{n * 2}</span>
                            <span>{n * 5}</span>
                            <span>{n * 10}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="legend-tip">
                <strong>💡 Remember:</strong> You don't need to memorize everything - use patterns!
            </div>
        </div>
    );
};

export default MultiplicationLegend;
