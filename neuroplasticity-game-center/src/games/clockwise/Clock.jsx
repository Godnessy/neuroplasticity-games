import { handColors } from '../../utils/clock';

const Clock = ({ 
    hands = [], 
    showNumbers = false, 
    showMinuteNumbers = true, 
    showTickMarks = true,
    centerImage = null,
    centerImageSize = 70
}) => {
    const centerX = 170;
    const centerY = 170;
    const radius = 130;

    const getHandProps = (hand) => {
        let angle, handLength, strokeWidth;
        const handColor = hand.color || handColors[hand.type];

        switch (hand.type) {
            case 'hour': {
                const hourAngle = (hand.value % 12) * 30;
                angle = hourAngle - 90;
                handLength = hand.length || radius * 0.5;
                strokeWidth = hand.thickness || 8;
                break;
            }
            case 'minute':
                angle = (hand.value * 6) - 90;
                handLength = hand.length || radius * 0.7;
                strokeWidth = hand.thickness || 5;
                break;
            case 'second':
                angle = (hand.value * 6) - 90;
                handLength = hand.length || radius * 0.8;
                strokeWidth = hand.thickness || 2;
                break;
            case 'extra1':
            case 'extra2':
            case 'distractor':
                angle = (hand.value * 6) - 90;
                handLength = hand.length || radius * 0.6;
                strokeWidth = hand.thickness || 4;
                break;
            default:
                return null;
        }

        const radians = angle * (Math.PI / 180);
        const x2 = centerX + handLength * Math.cos(radians);
        const y2 = centerY + handLength * Math.sin(radians);

        return {
            x1: centerX,
            y1: centerY,
            x2,
            y2,
            stroke: handColor,
            strokeWidth,
            strokeLinecap: 'round',
            strokeDasharray: hand.isDashed ? '8 4' : undefined,
            className: `clock-hand clock-hand-${hand.type}`
        };
    };

    const renderTickMarks = () => {
        const marks = [];
        for (let i = 0; i < 60; i++) {
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const isHour = i % 5 === 0;
            
            const innerRadius = isHour ? radius - 15 : radius - 8;
            const outerRadius = radius - 3;
            
            const x1 = centerX + innerRadius * Math.cos(angle);
            const y1 = centerY + innerRadius * Math.sin(angle);
            const x2 = centerX + outerRadius * Math.cos(angle);
            const y2 = centerY + outerRadius * Math.sin(angle);
            
            marks.push(
                <line
                    key={`tick-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="clock-tick"
                    strokeWidth={isHour ? 3 : 1}
                />
            );

            if (showMinuteNumbers && isHour) {
                const minuteValue = i === 0 ? 0 : i;
                const textRadius = radius + 18;
                const textX = centerX + textRadius * Math.cos(angle);
                const textY = centerY + textRadius * Math.sin(angle);
                
                marks.push(
                    <text
                        key={`minute-${i}`}
                        x={textX}
                        y={textY}
                        className="clock-minute-number"
                        fontSize="12"
                        fill="var(--color-text-muted)"
                        textAnchor="middle"
                        dominantBaseline="central"
                    >
                        {minuteValue.toString().padStart(2, '0')}
                    </text>
                );
            }
        }
        return marks;
    };

    const renderNumbers = () => {
        const numbers = [];
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = centerX + (radius - 30) * Math.cos(angle);
            const y = centerY + (radius - 30) * Math.sin(angle);
            
            numbers.push(
                <text
                    key={`num-${i}`}
                    x={x}
                    y={y}
                    className="clock-number"
                    fontSize="20"
                >
                    {i}
                </text>
            );
        }
        return numbers;
    };

    const renderCenter = () => {
        if (centerImage) {
            return (
                <>
                    <defs>
                        <clipPath id="center-clip">
                            <circle cx={centerX} cy={centerY} r={centerImageSize / 2} />
                        </clipPath>
                    </defs>
                    <image
                        x={centerX - centerImageSize / 2}
                        y={centerY - centerImageSize / 2}
                        width={centerImageSize}
                        height={centerImageSize}
                        href={centerImage}
                        clipPath="url(#center-clip)"
                        className="clock-center-image"
                        preserveAspectRatio="xMidYMid slice"
                    />
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r={centerImageSize / 2}
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="3"
                        className="clock-center-ring"
                    />
                </>
            );
        }
        
        return (
            <circle
                cx={centerX}
                cy={centerY}
                r={8}
                className="clock-center"
            />
        );
    };

    return (
        <svg viewBox="0 0 340 340" className="clock-svg">
            <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                className="clock-face"
            />
            
            {showTickMarks && renderTickMarks()}
            {showNumbers && renderNumbers()}
            
            {hands.map((hand, index) => {
                const props = getHandProps(hand);
                if (!props) return null;
                return <line key={index} {...props} />;
            })}
            
            {renderCenter()}
        </svg>
    );
};

export default Clock;
