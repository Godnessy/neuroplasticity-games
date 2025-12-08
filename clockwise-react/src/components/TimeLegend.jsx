const TimeLegend = () => {
    const amHours = [
        { h12: '12', h24: '00' },
        { h12: '1', h24: '01' },
        { h12: '2', h24: '02' },
        { h12: '3', h24: '03' },
        { h12: '4', h24: '04' },
        { h12: '5', h24: '05' },
        { h12: '6', h24: '06' },
        { h12: '7', h24: '07' },
        { h12: '8', h24: '08' },
        { h12: '9', h24: '09' },
        { h12: '10', h24: '10' },
        { h12: '11', h24: '11' },
    ];

    const pmHours = [
        { h12: '12', h24: '12' },
        { h12: '1', h24: '13' },
        { h12: '2', h24: '14' },
        { h12: '3', h24: '15' },
        { h12: '4', h24: '16' },
        { h12: '5', h24: '17' },
        { h12: '6', h24: '18' },
        { h12: '7', h24: '19' },
        { h12: '8', h24: '20' },
        { h12: '9', h24: '21' },
        { h12: '10', h24: '22' },
        { h12: '11', h24: '23' },
    ];

    return (
        <div className="time-legend">
            <img src="images/characters/freddy.png" alt="" className="legend-character corner-tl" />
            <img src="images/characters/bonnie.png" alt="" className="legend-character corner-tr" />
            <img src="images/characters/chica.png" alt="" className="legend-character corner-bl" />
            <img src="images/characters/foxy.png" alt="" className="legend-character corner-br" />
            
            <div className="legend-header">
                <h3>🕐 Time Conversion Chart 🕐</h3>
                <p>12-Hour ↔ 24-Hour</p>
            </div>

            <div className="legend-columns">
                <div className="legend-column">
                    <div className="column-header am">☀️ AM (Morning)</div>
                    <div className="time-rows">
                        {amHours.map(({ h12, h24 }) => (
                            <div key={h24} className="time-row">
                                <span className="h12">{h12}</span>
                                <span className="arrow">→</span>
                                <span className="h24">{h24}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="legend-column">
                    <div className="column-header pm">🌙 PM (Afternoon/Night)</div>
                    <div className="time-rows">
                        {pmHours.map(({ h12, h24 }) => (
                            <div key={h24} className="time-row">
                                <span className="h12">{h12}</span>
                                <span className="arrow">→</span>
                                <span className="h24">{h24}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="legend-tip">
                <strong>💡 Tip:</strong> For PM times, add 12 to hours 1-11. Noon stays 12, Midnight becomes 00.
            </div>
        </div>
    );
};

export default TimeLegend;
