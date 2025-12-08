export const handColors = {
    hour: 'var(--color-hour)',
    minute: 'var(--color-minute)',
    second: 'var(--color-second)',
    extra1: '#9B59B6',
    extra2: '#E67E22',
    distractor: 'var(--color-distractor)'
};

export const getHourAngleForTime = (hour, minute) => {
    return (hour % 12) * 30 + (minute / 60) * 30;
};

export const generateHandsForTime = (hour, minute, second = null, options = {}) => {
    const {
        includeMinute = true,
        includeSecond = false,
        includeDistractors = false,
        distractorCount = 0
    } = options;

    const hands = [];
    const radius = 130;
    
    const hourValue = getHourAngleForTime(hour, includeMinute ? minute : 0) / 30;
    hands.push({
        type: 'hour',
        value: hourValue,
        color: handColors.hour
    });

    if (includeMinute) {
        hands.push({
            type: 'minute',
            value: minute,
            color: handColors.minute
        });
    }

    if (includeSecond && second !== null) {
        hands.push({
            type: 'second',
            value: second,
            color: handColors.second
        });
    }

    if (includeDistractors && distractorCount > 0) {
        const usedPositions = [minute, second].filter(v => v !== null);
        
        for (let i = 0; i < distractorCount; i++) {
            let distractorValue;
            do {
                distractorValue = Math.floor(Math.random() * 60);
            } while (usedPositions.includes(distractorValue) || 
                     Math.abs(distractorValue - minute) < 5);
            
            usedPositions.push(distractorValue);
            
            hands.push({
                type: i === 0 ? 'extra1' : 'extra2',
                value: distractorValue,
                isDashed: true,
                color: i === 0 ? handColors.extra1 : handColors.extra2,
                thickness: 4,
                length: radius * (0.55 + Math.random() * 0.15)
            });
        }
    }

    return hands;
};

export const formatTime = (hour, minute) => {
    const h = hour.toString();
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
};

export const parseTime = (timeString) => {
    const parts = timeString.split(':');
    if (parts.length !== 2) return null;
    
    const hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10);
    
    if (isNaN(hour) || isNaN(minute)) return null;
    if (hour < 1 || hour > 12) return null;
    if (minute < 0 || minute > 59) return null;
    
    return { hour, minute };
};
