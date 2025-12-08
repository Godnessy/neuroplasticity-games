let enabled = false;
let synth = null;

export const init = () => {
    if ('speechSynthesis' in window) {
        synth = window.speechSynthesis;
    }
};

export const setEnabled = (value) => {
    enabled = value;
};

export const speak = (text, options = {}) => {
    if (!enabled || !synth) return;

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    const voices = synth.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) ||
                        voices.find(v => v.lang.startsWith('en')) ||
                        voices[0];
    
    if (englishVoice) {
        utterance.voice = englishVoice;
    }

    synth.speak(utterance);
};

export const speakPrompt = (prompt) => {
    speak(prompt, { rate: 0.85 });
};

export const speakFeedback = (isCorrect, explanation) => {
    if (isCorrect) {
        speak('Correct!', { pitch: 1.1 });
    } else {
        speak('Not quite. ' + explanation, { rate: 0.8 });
    }
};

export const speakHint = (hint) => {
    speak('Hint: ' + hint, { rate: 0.8, pitch: 0.95 });
};

export const speakTime = (hour, minute) => {
    let timeText;
    if (minute === 0) {
        timeText = `${hour} o'clock`;
    } else if (minute === 15) {
        timeText = `quarter past ${hour}`;
    } else if (minute === 30) {
        timeText = `half past ${hour}`;
    } else if (minute === 45) {
        timeText = `quarter to ${hour === 12 ? 1 : hour + 1}`;
    } else {
        timeText = `${hour} ${minute}`;
    }
    speak(timeText);
};

export const stop = () => {
    if (synth) {
        synth.cancel();
    }
};
