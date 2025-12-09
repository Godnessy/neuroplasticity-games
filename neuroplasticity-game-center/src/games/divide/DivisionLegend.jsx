/**
 * DivisionLegend - Shows the division table for the current divisor
 */

const DivisionLegend = ({ divisor }) => {
    // Generate division facts for this divisor
    const facts = [];
    for (let i = 1; i <= 10; i++) {
        const dividend = divisor * i;
        facts.push({ dividend, divisor, result: i });
    }

    return (
        <div className="multiplication-legend">
            <h3>÷{divisor} Division Table</h3>
            <div className="legend-grid">
                {facts.map((fact, index) => (
                    <div key={index} className="legend-item">
                        <span className="legend-equation">
                            {fact.dividend} ÷ {fact.divisor} = {fact.result}
                        </span>
                    </div>
                ))}
            </div>
            <div className="legend-tip">
                <p>💡 Division is the opposite of multiplication!</p>
                <p>If {divisor} × 5 = {divisor * 5}, then {divisor * 5} ÷ {divisor} = 5</p>
            </div>
        </div>
    );
};

export default DivisionLegend;
