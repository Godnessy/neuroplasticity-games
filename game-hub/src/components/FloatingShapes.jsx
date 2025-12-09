import { useEffect, useState } from 'react';

const shapes = ['circle', 'square', 'triangle', 'star', 'diamond'];
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

const FloatingShapes = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate initial particles
        const initialParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 10 + Math.random() * 30,
            duration: 15 + Math.random() * 20,
            delay: Math.random() * -20
        }));
        setParticles(initialParticles);
    }, []);

    const renderShape = (shape, color, size) => {
        switch (shape) {
            case 'circle':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill={color} opacity="0.6" />
                    </svg>
                );
            case 'square':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <rect x="10" y="10" width="80" height="80" rx="10" fill={color} opacity="0.6" />
                    </svg>
                );
            case 'triangle':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <polygon points="50,10 90,90 10,90" fill={color} opacity="0.6" />
                    </svg>
                );
            case 'star':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <polygon 
                            points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" 
                            fill={color} 
                            opacity="0.6" 
                        />
                    </svg>
                );
            case 'diamond':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100">
                        <polygon points="50,5 95,50 50,95 5,50" fill={color} opacity="0.6" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="floating-shapes">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="floating-shape"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`
                    }}
                >
                    {renderShape(particle.shape, particle.color, particle.size)}
                </div>
            ))}
        </div>
    );
};

export default FloatingShapes;
