/**
 * Visual representation of multiplication as groups
 * Shows dots arranged in groups to help understand multiplication concept
 */
const VisualMultiplication = ({ a, b, showGroups = true }) => {
    // a groups of b items
    const groups = a;
    const itemsPerGroup = b;
    
    // Limit visual for large numbers
    const maxGroups = 10;
    const maxItems = 10;
    const displayGroups = Math.min(groups, maxGroups);
    const displayItems = Math.min(itemsPerGroup, maxItems);
    
    const colors = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
        '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'
    ];

    if (!showGroups) {
        // Show as array/grid
        return (
            <div className="visual-multiplication grid-view">
                <div 
                    className="dot-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${displayItems}, 1fr)`,
                        gap: '4px'
                    }}
                >
                    {Array.from({ length: displayGroups * displayItems }).map((_, i) => (
                        <div 
                            key={i} 
                            className="dot"
                            style={{ 
                                backgroundColor: colors[Math.floor(i / displayItems) % colors.length],
                                animationDelay: `${i * 0.02}s`
                            }}
                        />
                    ))}
                </div>
                <p className="visual-label">{a} × {b} = {a * b}</p>
            </div>
        );
    }

    // Show as distinct groups
    return (
        <div className="visual-multiplication groups-view">
            <div className="groups-container">
                {Array.from({ length: displayGroups }).map((_, groupIndex) => (
                    <div 
                        key={groupIndex} 
                        className="group"
                        style={{ 
                            borderColor: colors[groupIndex % colors.length],
                            animationDelay: `${groupIndex * 0.1}s`
                        }}
                    >
                        <div className="group-dots">
                            {Array.from({ length: displayItems }).map((_, itemIndex) => (
                                <div 
                                    key={itemIndex} 
                                    className="dot"
                                    style={{ 
                                        backgroundColor: colors[groupIndex % colors.length],
                                        animationDelay: `${(groupIndex * displayItems + itemIndex) * 0.02}s`
                                    }}
                                />
                            ))}
                        </div>
                        <span className="group-count">{itemsPerGroup}</span>
                    </div>
                ))}
            </div>
            <p className="visual-label">
                {a} groups of {b} = {a} × {b} = <strong>{a * b}</strong>
            </p>
        </div>
    );
};

export default VisualMultiplication;
