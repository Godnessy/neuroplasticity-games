const Clock = {
    svgNS: 'http://www.w3.org/2000/svg',
    centerX: 150,
    centerY: 150,
    radius: 130,
    centerImageUrl: null,
    centerImageSize: 60,
    
    handColors: {
        hour: 'var(--color-hour)',
        minute: 'var(--color-minute)',
        second: 'var(--color-second)',
        extra1: '#9B59B6',
        extra2: '#E67E22',
        distractor: 'var(--color-distractor)'
    },

    setCenterImage(imageUrl, size = 60) {
        this.centerImageUrl = imageUrl;
        this.centerImageSize = size;
    },

    clearCenterImage() {
        this.centerImageUrl = null;
    },

    create(svgElement, options = {}) {
        const {
            showNumbers = false,
            showMinuteNumbers = true,
            hands = [],
            showTickMarks = true,
            centerImage = this.centerImageUrl,
            centerImageSize = this.centerImageSize
        } = options;

        svgElement.innerHTML = '';
        svgElement.setAttribute('viewBox', '0 0 340 340');
        this.centerX = 170;
        this.centerY = 170;

        this.drawFace(svgElement);
        
        if (showTickMarks) {
            this.drawTickMarks(svgElement, showMinuteNumbers);
        }

        if (showNumbers) {
            this.drawNumbers(svgElement);
        }

        hands.forEach(hand => {
            this.drawHand(svgElement, hand);
        });

        this.drawCenter(svgElement, centerImage, centerImageSize);
    },

    drawFace(svg) {
        const circle = document.createElementNS(this.svgNS, 'circle');
        circle.setAttribute('cx', this.centerX);
        circle.setAttribute('cy', this.centerY);
        circle.setAttribute('r', this.radius);
        circle.setAttribute('class', 'clock-face');
        svg.appendChild(circle);
    },

    drawCenter(svg, imageUrl, imageSize) {
        if (imageUrl) {
            const defs = document.createElementNS(this.svgNS, 'defs');
            const clipPath = document.createElementNS(this.svgNS, 'clipPath');
            clipPath.setAttribute('id', 'center-clip');
            const clipCircle = document.createElementNS(this.svgNS, 'circle');
            clipCircle.setAttribute('cx', this.centerX);
            clipCircle.setAttribute('cy', this.centerY);
            clipCircle.setAttribute('r', imageSize / 2);
            clipPath.appendChild(clipCircle);
            defs.appendChild(clipPath);
            svg.appendChild(defs);

            const image = document.createElementNS(this.svgNS, 'image');
            image.setAttribute('x', this.centerX - imageSize / 2);
            image.setAttribute('y', this.centerY - imageSize / 2);
            image.setAttribute('width', imageSize);
            image.setAttribute('height', imageSize);
            image.setAttribute('href', imageUrl);
            image.setAttribute('clip-path', 'url(#center-clip)');
            image.setAttribute('class', 'clock-center-image');
            image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            svg.appendChild(image);

            const ring = document.createElementNS(this.svgNS, 'circle');
            ring.setAttribute('cx', this.centerX);
            ring.setAttribute('cy', this.centerY);
            ring.setAttribute('r', imageSize / 2);
            ring.setAttribute('fill', 'none');
            ring.setAttribute('stroke', 'var(--color-primary)');
            ring.setAttribute('stroke-width', '3');
            ring.setAttribute('class', 'clock-center-ring');
            svg.appendChild(ring);
        } else {
            const center = document.createElementNS(this.svgNS, 'circle');
            center.setAttribute('cx', this.centerX);
            center.setAttribute('cy', this.centerY);
            center.setAttribute('r', 8);
            center.setAttribute('class', 'clock-center');
            svg.appendChild(center);
        }
    },

    drawTickMarks(svg, showMinuteNumbers = false) {
        for (let i = 0; i < 60; i++) {
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const isHour = i % 5 === 0;
            
            const innerRadius = isHour ? this.radius - 15 : this.radius - 8;
            const outerRadius = this.radius - 3;
            
            const x1 = this.centerX + innerRadius * Math.cos(angle);
            const y1 = this.centerY + innerRadius * Math.sin(angle);
            const x2 = this.centerX + outerRadius * Math.cos(angle);
            const y2 = this.centerY + outerRadius * Math.sin(angle);
            
            const line = document.createElementNS(this.svgNS, 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('class', 'clock-tick');
            line.setAttribute('stroke-width', isHour ? 3 : 1);
            svg.appendChild(line);

            if (showMinuteNumbers && isHour) {
                const minuteValue = i === 0 ? 0 : i;
                const textRadius = this.radius + 18;
                const textX = this.centerX + textRadius * Math.cos(angle);
                const textY = this.centerY + textRadius * Math.sin(angle);
                
                const text = document.createElementNS(this.svgNS, 'text');
                text.setAttribute('x', textX);
                text.setAttribute('y', textY);
                text.setAttribute('class', 'clock-minute-number');
                text.setAttribute('font-size', '12');
                text.setAttribute('fill', 'var(--color-text-muted)');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'central');
                text.textContent = minuteValue.toString().padStart(2, '0');
                svg.appendChild(text);
            }
        }
    },

    drawNumbers(svg) {
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = this.centerX + (this.radius - 30) * Math.cos(angle);
            const y = this.centerY + (this.radius - 30) * Math.sin(angle);
            
            const text = document.createElementNS(this.svgNS, 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            text.setAttribute('class', 'clock-number');
            text.setAttribute('font-size', '20');
            text.textContent = i;
            svg.appendChild(text);
        }
    },

    drawHand(svg, handConfig) {
        const {
            type,
            value,
            color,
            thickness,
            length,
            isDashed = false
        } = handConfig;

        let angle;
        let handLength;
        let strokeWidth;
        let handColor = color || this.handColors[type];

        switch (type) {
            case 'hour':
                const hourAngle = (value % 12) * 30;
                angle = hourAngle - 90;
                handLength = length || this.radius * 0.5;
                strokeWidth = thickness || 8;
                break;
            case 'minute':
                angle = (value * 6) - 90;
                handLength = length || this.radius * 0.7;
                strokeWidth = thickness || 5;
                break;
            case 'second':
                angle = (value * 6) - 90;
                handLength = length || this.radius * 0.8;
                strokeWidth = thickness || 2;
                break;
            case 'extra1':
            case 'extra2':
            case 'distractor':
                angle = (value * 6) - 90;
                handLength = length || this.radius * 0.6;
                strokeWidth = thickness || 4;
                break;
            default:
                return;
        }

        const radians = angle * (Math.PI / 180);
        const x2 = this.centerX + handLength * Math.cos(radians);
        const y2 = this.centerY + handLength * Math.sin(radians);

        const line = document.createElementNS(this.svgNS, 'line');
        line.setAttribute('x1', this.centerX);
        line.setAttribute('y1', this.centerY);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', handColor);
        line.setAttribute('stroke-width', strokeWidth);
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('class', `clock-hand clock-hand-${type}`);
        
        if (isDashed) {
            line.setAttribute('stroke-dasharray', '8 4');
        }

        svg.appendChild(line);
    },

    getHourAngleForTime(hour, minute) {
        return (hour % 12) * 30 + (minute / 60) * 30;
    },

    generateHandsForTime(hour, minute, second = null, options = {}) {
        const {
            includeMinute = true,
            includeSecond = false,
            includeDistractors = false,
            distractorCount = 0
        } = options;

        const hands = [];
        
        const hourValue = this.getHourAngleForTime(hour, includeMinute ? minute : 0) / 30;
        hands.push({
            type: 'hour',
            value: hourValue,
            color: this.handColors.hour
        });

        if (includeMinute) {
            hands.push({
                type: 'minute',
                value: minute,
                color: this.handColors.minute
            });
        }

        if (includeSecond && second !== null) {
            hands.push({
                type: 'second',
                value: second,
                color: this.handColors.second
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
                    color: i === 0 ? this.handColors.extra1 : this.handColors.extra2,
                    thickness: 4,
                    length: this.radius * (0.55 + Math.random() * 0.15)
                });
            }
        }

        return hands;
    },

    formatTime(hour, minute) {
        const h = hour.toString();
        const m = minute.toString().padStart(2, '0');
        return `${h}:${m}`;
    },

    parseTime(timeString) {
        const parts = timeString.split(':');
        if (parts.length !== 2) return null;
        
        const hour = parseInt(parts[0], 10);
        const minute = parseInt(parts[1], 10);
        
        if (isNaN(hour) || isNaN(minute)) return null;
        if (hour < 1 || hour > 12) return null;
        if (minute < 0 || minute > 59) return null;
        
        return { hour, minute };
    },

    generateLegend(hands, container) {
        container.innerHTML = '';
        
        const handTypes = {
            hour: 'Hour',
            minute: 'Minute',
            second: 'Second'
        };

        const uniqueTypes = [...new Set(hands.map(h => h.type))];
        
        uniqueTypes.forEach(type => {
            if (!handTypes[type] && !type.includes('extra') && type !== 'distractor') return;
            
            const item = document.createElement('div');
            item.className = 'legend-item';
            
            const line = document.createElement('span');
            line.className = `legend-line ${type}`;
            
            const hand = hands.find(h => h.type === type);
            if (hand) {
                line.style.backgroundColor = hand.color;
                if (hand.isDashed) {
                    line.style.background = `repeating-linear-gradient(90deg, ${hand.color} 0, ${hand.color} 4px, transparent 4px, transparent 8px)`;
                }
            }
            
            const label = document.createElement('span');
            label.textContent = handTypes[type] || (type.includes('extra') || type === 'distractor' ? 'Ignore (dashed)' : type);
            
            item.appendChild(line);
            item.appendChild(label);
            container.appendChild(item);
        });
    }
};

