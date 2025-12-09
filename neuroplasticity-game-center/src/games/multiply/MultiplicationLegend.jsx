const MultiplicationLegend = ({ currentA, currentB }) => {
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div className="multiplication-table-container">
            <h3>Multiplication Table</h3>
            <table className="multiplication-table">
                <thead>
                    <tr>
                        <th>×</th>
                        {cols.map(c => <th key={c}>{c}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(r => (
                        <tr key={r}>
                            <th>{r}</th>
                            {cols.map(c => {
                                const isHighlighted = (r === currentA && c === currentB) || (r === currentB && c === currentA);
                                const isRowHighlight = r === currentA || r === currentB;
                                const isColHighlight = c === currentA || c === currentB;
                                return (
                                    <td 
                                        key={c} 
                                        className={`${isHighlighted ? 'highlight' : ''} ${isRowHighlight || isColHighlight ? 'dim-highlight' : ''}`}
                                    >
                                        {r * c}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MultiplicationLegend;
