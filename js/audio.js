const Audio = {
    enabled: false,
    synth: null,

    init() {
        if ('speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
        }
    },

    setEnabled(enabled) {
        this.enabled = enabled;
    },

    speak(text, options = {}) {
        if (!this.enabled || !this.synth) return;

        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        const voices = this.synth.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) ||
                            voices.find(v => v.lang.startsWith('en')) ||
                            voices[0];
        
        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        this.synth.speak(utterance);
    },

    speakPrompt(prompt) {
        this.speak(prompt, { rate: 0.85 });
    },

    speakFeedback(isCorrect, explanation) {
        if (isCorrect) {
            this.speak('Correct!', { pitch: 1.1 });
        } else {
            this.speak('Not quite. ' + explanation, { rate: 0.8 });
        }
    },

    speakHint(hint) {
        this.speak('Hint: ' + hint, { rate: 0.8, pitch: 0.95 });
    },

    speakTime(hour, minute) {
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
        this.speak(timeText);
    },

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
};

