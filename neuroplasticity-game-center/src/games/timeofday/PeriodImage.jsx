/**
 * PeriodImage - Displays the time of day image
 */

import morningImg from './assets/morning.png';
import noonImg from './assets/noon.png';
import afternoonImg from './assets/midday.png';
import eveningImg from './assets/evening.png';
import nightImg from './assets/night.png';

const images = {
    morning: morningImg,
    noon: noonImg,
    afternoon: afternoonImg,
    evening: eveningImg,
    night: nightImg
};

const PeriodImage = ({ periodKey }) => {
    const imageSrc = images[periodKey];
    
    if (!imageSrc) {
        return (
            <div className="period-image-placeholder">
                <span>🌅</span>
                <p>Image not found</p>
            </div>
        );
    }

    return (
        <div className="period-image-container">
            <img 
                src={imageSrc} 
                alt={`${periodKey} time`} 
                className="period-image"
            />
        </div>
    );
};

export default PeriodImage;
