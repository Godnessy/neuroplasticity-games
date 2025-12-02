window.MEME_API_KEY = 'ef3abcc781f24bee80224127b96ade24';

window.CLOCK_CENTER_IMAGES = [
    'images/characters/freddy.png'
];

window.APP_CONFIG = {
    breakReminderMinutes: 15,
    maxSessionMinutes: 40,
    questionsPerLevel: 10,
    targetAccuracy: 0.75
};

function loadEnvConfig() {
    if (typeof process !== 'undefined' && process.env) {
        window.MEME_API_KEY = process.env.MEME_API_KEY || null;
    }
}
loadEnvConfig();

