# ClockWise - Clock Reading Game

A neuroplasticity-based clock reading game for children ages 6-14 with learning difficulties.

## Setup

### 1. Add FNAF Character Images
Place your character PNG images in `images/characters/`:
- `freddy.png`
- `bonnie.png`
- `chica.png`
- `foxy.png`

To change characters, edit `js/config.js`:
```javascript
window.CLOCK_CENTER_IMAGES = [
    'images/characters/your-image.png',
];
```

### 2. Set Meme API Key
Edit `js/config.js` and replace:
```javascript
window.MEME_API_KEY = null;
```
with:
```javascript
window.MEME_API_KEY = 'your_api_key_from_apileague';
```

### 3. Run
Open `index.html` in a browser or serve with any static file server.

## Research Foundation
- **Barbara Arrowsmith-Young**: Symbol Relations (12-level hand progression)
- **Michael Merzenich**: 75% accuracy targeting
- **Paula Tallal**: Adaptive pacing
- **Reuven Feuerstein**: Mediated learning prompts



