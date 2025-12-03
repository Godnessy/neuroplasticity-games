const App = {
    state: {
        currentScreen: 'welcome',
        currentLevel: 1,
        currentQuestion: null,
        session: null,
        timer: null,
        timerValue: 0,
        sessionStartTime: null,
        sessionTimerInterval: null,
        showingNumbers: false,
        hintsUsed: 0,
        selectedHour: null,
        selectedMinute: null,
        lastActivityTime: null,
        idleCheckInterval: null,
        consecutiveCorrect: 0,
        characterIndex: 0
    },

    elements: {},

    init() {
        this.cacheElements();
        this.loadSettings();
        this.loadProgress();
        this.bindEvents();
        this.initModules();
        this.checkContinue();
        this.loadCharacterImage();
    },

    cacheElements() {
        this.elements = {
            screens: {
                welcome: document.getElementById('screen-welcome'),
                game: document.getElementById('screen-game'),
                levelComplete: document.getElementById('screen-level-complete'),
                dashboard: document.getElementById('screen-dashboard'),
                settings: document.getElementById('screen-settings'),
                break: document.getElementById('screen-break')
            },
            clock: document.getElementById('clock-svg'),
            clockWrapper: document.getElementById('clock-wrapper'),
            legend: document.getElementById('hand-legend'),
            prompt: document.getElementById('prompt-text'),
            hint: document.getElementById('hint-text'),
            levelBadge: document.getElementById('current-level'),
            levelName: document.getElementById('level-name'),
            progressFill: document.getElementById('progress-fill'),
            questionsDone: document.getElementById('questions-done'),
            questionsTotal: document.getElementById('questions-total'),
            timerContainer: document.getElementById('timer-container'),
            timerRing: document.getElementById('timer-ring-progress'),
            timerText: document.getElementById('timer-text'),
            feedbackOverlay: document.getElementById('feedback-overlay'),
            feedbackIcon: document.getElementById('feedback-icon'),
            feedbackMessage: document.getElementById('feedback-message'),
            feedbackExplanation: document.getElementById('feedback-explanation'),
            inputHour: document.getElementById('input-hour'),
            inputMinute: document.getElementById('input-minute'),
            hourButtons: document.getElementById('hour-buttons'),
            minuteButtons: document.getElementById('minute-buttons'),
            multipleChoiceGrid: document.getElementById('multiple-choice-grid'),
            inputText: document.getElementById('input-text'),
            inputVisual: document.getElementById('input-visual'),
            inputMultiple: document.getElementById('input-multiple'),
            sessionTimerText: document.getElementById('session-timer-text')
        };
    },

    loadSettings() {
        const settings = Storage.getSettings();
        document.body.setAttribute('data-theme', settings.theme);
        document.body.setAttribute('data-font', settings.font);
        document.body.setAttribute('data-font-size', settings.fontSize);
        document.body.setAttribute('data-clock-size', settings.clockSize);
        if (settings.highContrast) {
            document.body.setAttribute('data-contrast', 'high');
        }
        
        document.getElementById('setting-font').value = settings.font;
        document.getElementById('setting-font-size').value = settings.fontSize;
        document.getElementById('setting-contrast').checked = settings.highContrast;
        document.getElementById('setting-clock-size').value = settings.clockSize;
        document.getElementById('setting-input').value = settings.inputMethod;
        document.getElementById('setting-audio').checked = settings.audioEnabled;
        document.getElementById('setting-timer').checked = settings.showTimer;
        document.getElementById('setting-numbers').checked = settings.alwaysShowNumbers;
        
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === settings.theme);
        });

        Audio.setEnabled(settings.audioEnabled);
    },

    loadProgress() {
        const progress = Storage.getProgress();
        this.state.currentLevel = progress.currentLevel;
    },

    initModules() {
        Audio.init();
        MemeReward.init();
        this.buildVisualSelectors();
    },

    loadCharacterImage() {
        const images = window.CLOCK_CENTER_IMAGES || [];
        if (images.length > 0) {
            this.state.characterIndex = (this.state.characterIndex + 1) % images.length;
            Clock.setCenterImage(images[this.state.characterIndex], 70);
        }
    },

    checkContinue() {
        const progress = Storage.getProgress();
        const continueBtn = document.getElementById('btn-continue');
        if (progress.currentLevel > 1 || progress.totalQuestions > 0) {
            continueBtn.style.display = 'inline-flex';
        }
    },

    bindEvents() {
        document.getElementById('btn-start-new').addEventListener('click', () => this.startNewGame());
        document.getElementById('btn-continue').addEventListener('click', () => this.continueGame());
        document.getElementById('btn-settings').addEventListener('click', () => this.showScreen('settings'));
        document.getElementById('btn-dashboard').addEventListener('click', () => this.showDashboard());
        document.getElementById('btn-back-settings').addEventListener('click', () => this.goBack());
        document.getElementById('btn-back-dashboard').addEventListener('click', () => this.goBack());
        
        document.getElementById('btn-submit-text').addEventListener('click', () => this.submitTextAnswer());
        document.getElementById('btn-submit-visual').addEventListener('click', () => this.submitVisualAnswer());
        document.getElementById('btn-hint').addEventListener('click', () => this.showHint());
        document.getElementById('btn-show-numbers').addEventListener('click', () => this.toggleNumbers());
        document.getElementById('btn-next').addEventListener('click', () => this.nextQuestion());
        
        document.getElementById('btn-next-level').addEventListener('click', () => this.advanceLevel());
        document.getElementById('btn-repeat-level').addEventListener('click', () => this.repeatLevel());
        document.getElementById('btn-prev-level').addEventListener('click', () => this.goToPrevLevel());
        document.getElementById('btn-next-level-nav').addEventListener('click', () => this.goToNextLevel());
        
        document.getElementById('btn-continue-break').addEventListener('click', () => this.continueAfterBreak());
        document.getElementById('btn-end-session').addEventListener('click', () => this.endSession());
        
        document.getElementById('btn-export-data').addEventListener('click', () => this.exportData());
        document.getElementById('btn-reset-progress').addEventListener('click', () => this.resetProgress());
        
        this.bindSettingsEvents();

        this.elements.inputHour.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.elements.inputMinute.focus();
        });
        this.elements.inputMinute.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.submitTextAnswer();
        });
    },

    bindSettingsEvents() {
        document.getElementById('setting-font').addEventListener('change', (e) => {
            this.updateSetting('font', e.target.value);
            document.body.setAttribute('data-font', e.target.value);
        });
        
        document.getElementById('setting-font-size').addEventListener('change', (e) => {
            this.updateSetting('fontSize', e.target.value);
            document.body.setAttribute('data-font-size', e.target.value);
        });
        
        document.getElementById('setting-contrast').addEventListener('change', (e) => {
            this.updateSetting('highContrast', e.target.checked);
            if (e.target.checked) {
                document.body.setAttribute('data-contrast', 'high');
            } else {
                document.body.removeAttribute('data-contrast');
            }
        });
        
        document.getElementById('setting-clock-size').addEventListener('change', (e) => {
            this.updateSetting('clockSize', e.target.value);
            document.body.setAttribute('data-clock-size', e.target.value);
        });
        
        document.getElementById('setting-input').addEventListener('change', (e) => {
            this.updateSetting('inputMethod', e.target.value);
        });
        
        document.getElementById('setting-audio').addEventListener('change', (e) => {
            this.updateSetting('audioEnabled', e.target.checked);
            Audio.setEnabled(e.target.checked);
        });
        
        document.getElementById('setting-timer').addEventListener('change', (e) => {
            this.updateSetting('showTimer', e.target.checked);
        });
        
        document.getElementById('setting-numbers').addEventListener('change', (e) => {
            this.updateSetting('alwaysShowNumbers', e.target.checked);
        });
        
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const theme = btn.dataset.theme;
                this.updateSetting('theme', theme);
                document.body.setAttribute('data-theme', theme);
            });
        });
    },

    updateSetting(key, value) {
        const settings = Storage.getSettings();
        settings[key] = value;
        Storage.saveSettings(settings);
    },

    showScreen(screenName) {
        Object.values(this.elements.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.elements.screens[screenName].classList.add('active');
        this.state.currentScreen = screenName;
    },

    goBack() {
        if (this.state.session) {
            this.showScreen('game');
        } else {
            this.showScreen('welcome');
        }
    },

    startNewGame() {
        const progress = Storage.getProgress();
        this.state.currentLevel = 1;
        progress.currentLevel = 1;
        Storage.saveProgress(progress);
        this.startSession();
    },

    continueGame() {
        this.startSession();
    },

    startSession() {
        this.state.session = {
            level: this.state.currentLevel,
            answers: [],
            startTime: Date.now(),
            bestStreak: 0,
            currentStreak: 0
        };
        this.state.sessionStartTime = Date.now();
        this.state.hintsUsed = 0;
        
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        this.elements.levelBadge.textContent = this.state.currentLevel;
        this.elements.levelName.textContent = levelConfig.name;
        this.elements.questionsTotal.textContent = levelConfig.questionsRequired;
        this.elements.questionsDone.textContent = '0';
        this.elements.progressFill.style.width = '0%';
        
        this.updateLevelNavButtons();
        this.startSessionTimer();
        this.startIdleDetection();
        this.state.consecutiveCorrect = 0;
        this.setInputMethod();
        this.showScreen('game');
        this.generateQuestion();
    },

    startSessionTimer() {
        this.stopSessionTimer();
        this.elements.sessionTimerText.textContent = '0:00';
        
        this.state.sessionTimerInterval = setInterval(() => {
            const elapsed = Date.now() - this.state.sessionStartTime;
            this.elements.sessionTimerText.textContent = this.formatDuration(elapsed);
        }, 1000);
    },

    stopSessionTimer() {
        if (this.state.sessionTimerInterval) {
            clearInterval(this.state.sessionTimerInterval);
            this.state.sessionTimerInterval = null;
        }
    },

    startIdleDetection() {
        this.state.lastActivityTime = Date.now();
        
        const activityHandler = () => {
            this.state.lastActivityTime = Date.now();
        };
        
        document.addEventListener('mousemove', activityHandler);
        document.addEventListener('keydown', activityHandler);
        document.addEventListener('click', activityHandler);
        document.addEventListener('touchstart', activityHandler);
        
        this.state.idleCheckInterval = setInterval(() => {
            const idleTime = Date.now() - this.state.lastActivityTime;
            if (idleTime >= 180000) {
                this.pauseForIdle();
            }
        }, 10000);
    },

    stopIdleDetection() {
        if (this.state.idleCheckInterval) {
            clearInterval(this.state.idleCheckInterval);
            this.state.idleCheckInterval = null;
        }
    },

    pauseForIdle() {
        this.stopTimer();
        this.stopSessionTimer();
        alert('Session paused due to inactivity. Click OK to continue.');
        this.state.lastActivityTime = Date.now();
        this.startSessionTimer();
    },

    setInputMethod() {
        const settings = Storage.getSettings();
        const method = settings.inputMethod;
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        const hourOnly = !levelConfig.hands.includes('minute');
        
        this.elements.inputText.style.display = method === 'text' ? 'flex' : 'none';
        this.elements.inputVisual.style.display = method === 'visual' ? 'flex' : 'none';
        this.elements.inputMultiple.style.display = method === 'multiple' ? 'flex' : 'none';
        
        const minuteInput = this.elements.inputMinute;
        const minuteSelector = document.querySelector('.minute-selector');
        const timeSeparator = document.querySelector('.time-separator');
        
        if (hourOnly) {
            minuteInput.style.display = 'none';
            if (timeSeparator) timeSeparator.style.display = 'none';
            if (minuteSelector) minuteSelector.style.display = 'none';
            minuteInput.value = '0';
        } else {
            minuteInput.style.display = '';
            if (timeSeparator) timeSeparator.style.display = '';
            if (minuteSelector) minuteSelector.style.display = '';
        }
    },

    buildVisualSelectors() {
        this.elements.hourButtons.innerHTML = '';
        for (let h = 1; h <= 12; h++) {
            const btn = document.createElement('button');
            btn.className = 'selector-btn';
            btn.textContent = h;
            btn.addEventListener('click', () => this.selectHour(h, btn));
            this.elements.hourButtons.appendChild(btn);
        }
        
        this.elements.minuteButtons.innerHTML = '';
        for (let m = 0; m < 60; m += 5) {
            const btn = document.createElement('button');
            btn.className = 'selector-btn';
            btn.textContent = m.toString().padStart(2, '0');
            btn.addEventListener('click', () => this.selectMinute(m, btn));
            this.elements.minuteButtons.appendChild(btn);
        }
    },

    selectHour(hour, btn) {
        this.elements.hourButtons.querySelectorAll('.selector-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.state.selectedHour = hour;
    },

    selectMinute(minute, btn) {
        this.elements.minuteButtons.querySelectorAll('.selector-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.state.selectedMinute = minute;
    },

    generateQuestion() {
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        const question = Levels.generateQuestion(levelConfig);
        this.state.currentQuestion = question;
        this.state.questionStartTime = Date.now();
        
        this.loadCharacterImage();
        this.hideInputError();
        
        const settings = Storage.getSettings();
        const showNumbers = settings.alwaysShowNumbers || levelConfig.showNumbers || this.state.showingNumbers;
        
        Clock.create(this.elements.clock, {
            showNumbers: showNumbers,
            showMinuteNumbers: true,
            hands: question.hands,
            showTickMarks: true
        });
        
        Clock.generateLegend(question.hands, this.elements.legend);
        
        this.elements.prompt.textContent = question.prompt;
        this.elements.hint.style.display = 'none';
        
        Audio.speakPrompt(question.prompt);
        
        this.resetInputs();
        
        if (settings.inputMethod === 'multiple') {
            this.generateMultipleChoice(question, levelConfig);
        }
        
        this.startTimer(levelConfig);
    },

    resetInputs() {
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        const hourOnly = !levelConfig.hands.includes('minute');
        
        this.elements.inputHour.value = '';
        this.elements.inputHour.placeholder = hourOnly ? 'Hour' : 'HH';
        this.elements.inputMinute.value = hourOnly ? '0' : '';
        this.state.selectedHour = null;
        this.state.selectedMinute = hourOnly ? 0 : null;
        this.elements.hourButtons.querySelectorAll('.selector-btn').forEach(b => b.classList.remove('selected'));
        this.elements.minuteButtons.querySelectorAll('.selector-btn').forEach(b => b.classList.remove('selected'));
    },

    generateMultipleChoice(question, levelConfig) {
        const choices = Levels.generateChoices(question.correctAnswer, levelConfig);
        const hourOnly = !levelConfig.hands.includes('minute');
        this.elements.multipleChoiceGrid.innerHTML = '';
        
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = hourOnly ? `${choice.hour} o'clock` : Clock.formatTime(choice.hour, choice.minute);
            btn.addEventListener('click', () => this.submitMultipleChoice(choice, btn));
            this.elements.multipleChoiceGrid.appendChild(btn);
        });
    },

    startTimer(levelConfig) {
        this.stopTimer();
        
        const settings = Storage.getSettings();
        if (!levelConfig.timeAllowed || !settings.showTimer) {
            this.elements.timerContainer.style.display = 'none';
            return;
        }
        
        const adjustedTime = Adaptive.adjustTimeLimit(
            levelConfig.timeAllowed,
            this.state.session.answers.slice(-5)
        );
        
        this.state.timerValue = adjustedTime;
        this.elements.timerContainer.style.display = 'flex';
        this.elements.timerText.textContent = adjustedTime;
        this.elements.timerRing.style.strokeDashoffset = '0';
        
        const circumference = 138.2;
        
        this.state.timer = setInterval(() => {
            this.state.timerValue--;
            this.elements.timerText.textContent = this.state.timerValue;
            
            const progress = (adjustedTime - this.state.timerValue) / adjustedTime;
            this.elements.timerRing.style.strokeDashoffset = circumference * progress;
            
            if (this.state.timerValue <= 0) {
                this.handleTimeout();
            }
        }, 1000);
    },

    stopTimer() {
        if (this.state.timer) {
            clearInterval(this.state.timer);
            this.state.timer = null;
        }
    },

    handleTimeout() {
        this.stopTimer();
        this.processAnswer(null, null, true);
    },

    submitTextAnswer() {
        const hour = parseInt(this.elements.inputHour.value, 10);
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        const hourOnly = !levelConfig.hands.includes('minute');
        
        if (isNaN(hour) || hour < 1 || hour > 12) {
            this.showInputError('Enter a valid hour (1-12)');
            this.elements.inputHour.focus();
            return;
        }
        
        if (hourOnly) {
            this.hideInputError();
            this.processAnswer(hour, 0);
            return;
        }
        
        const minute = parseInt(this.elements.inputMinute.value, 10);
        if (isNaN(minute) || minute < 0 || minute > 59) {
            this.showInputError('Enter valid minutes (0-59)');
            this.elements.inputMinute.focus();
            return;
        }
        
        this.hideInputError();
        this.processAnswer(hour, minute);
    },

    showInputError(message) {
        let errorEl = document.getElementById('input-error');
        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.id = 'input-error';
            errorEl.className = 'input-error';
            const submitBtn = document.getElementById('btn-submit-text');
            submitBtn.parentNode.insertBefore(errorEl, submitBtn);
        }
        const hint = Levels.getHint(Levels.getLevel(this.state.currentLevel), 0);
        errorEl.innerHTML = `<strong>${message}</strong><br><small>${hint}</small>`;
        errorEl.style.display = 'block';
    },

    hideInputError() {
        const errorEl = document.getElementById('input-error');
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    },

    submitVisualAnswer() {
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        const hourOnly = !levelConfig.hands.includes('minute');
        
        if (this.state.selectedHour === null) {
            return;
        }
        
        if (hourOnly) {
            this.processAnswer(this.state.selectedHour, 0);
            return;
        }
        
        if (this.state.selectedMinute === null) {
            return;
        }
        this.processAnswer(this.state.selectedHour, this.state.selectedMinute);
    },

    submitMultipleChoice(choice, btn) {
        this.elements.multipleChoiceGrid.querySelectorAll('.choice-btn').forEach(b => {
            b.disabled = true;
        });
        
        const correct = this.state.currentQuestion.correctAnswer;
        const isCorrect = choice.hour === correct.hour && choice.minute === correct.minute;
        
        btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        if (!isCorrect) {
            this.elements.multipleChoiceGrid.querySelectorAll('.choice-btn').forEach(b => {
                const time = b.textContent.split(':');
                if (parseInt(time[0]) === correct.hour && parseInt(time[1]) === correct.minute) {
                    b.classList.add('correct');
                }
            });
        }
        
        setTimeout(() => {
            this.processAnswer(choice.hour, choice.minute);
        }, 500);
    },

    processAnswer(hour, minute, timedOut = false) {
        this.stopTimer();
        
        const question = this.state.currentQuestion;
        const correct = question.correctAnswer;
        const isCorrect = !timedOut && hour === correct.hour && minute === correct.minute;
        
        const responseTime = Date.now() - this.state.questionStartTime;
        
        this.state.session.answers.push({
            question: { hour: question.hour, minute: question.minute },
            answer: timedOut ? null : { hour, minute },
            correct: isCorrect,
            responseTime,
            timedOut,
            hintsUsed: this.state.hintsUsed
        });
        
        if (isCorrect) {
            this.state.session.currentStreak++;
            if (this.state.session.currentStreak > this.state.session.bestStreak) {
                this.state.session.bestStreak = this.state.session.currentStreak;
            }
        } else {
            this.state.session.currentStreak = 0;
        }
        
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        Storage.updateErrorPattern(this.state.currentLevel, question.handCombination, isCorrect);
        
        this.showFeedback(isCorrect, question, timedOut);
    },

    async showFeedback(isCorrect, question, timedOut) {
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        const explanation = Levels.getExplanation(question, null, isCorrect, levelConfig);
        
        this.elements.feedbackIcon.innerHTML = isCorrect 
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
        
        this.elements.feedbackIcon.className = 'feedback-icon ' + (isCorrect ? 'correct' : 'incorrect');
        
        const messages = isCorrect 
            ? ['Correct!', 'Great job!', 'Well done!', 'That\'s right!', 'Excellent!']
            : timedOut 
                ? ['Time\'s up!', 'Out of time!']
                : ['Not quite.', 'Let\'s try again.', 'Almost!'];
        
        this.elements.feedbackMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
        this.elements.feedbackMessage.className = 'feedback-message ' + (isCorrect ? 'correct' : 'incorrect');
        this.elements.feedbackExplanation.textContent = explanation;
        
        Audio.speakFeedback(isCorrect, explanation);
        
        this.elements.feedbackOverlay.classList.add('active');
        
        if (isCorrect) {
            this.state.consecutiveCorrect++;
            if (this.state.consecutiveCorrect >= 3) {
                MemeReward.show();
                this.state.consecutiveCorrect = 0;
            }
        } else {
            this.state.consecutiveCorrect = 0;
        }
    },

    nextQuestion() {
        this.elements.feedbackOverlay.classList.remove('active');
        MemeReward.hide();
        
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        const answeredCount = this.state.session.answers.length;
        
        this.elements.questionsDone.textContent = answeredCount;
        this.elements.progressFill.style.width = `${(answeredCount / levelConfig.questionsRequired) * 100}%`;
        
        if (answeredCount >= levelConfig.questionsRequired) {
            this.completeLevelSession();
        } else {
            this.checkBreakTime();
            this.generateQuestion();
        }
    },

    checkBreakTime() {
        const sessionDuration = (Date.now() - this.state.sessionStartTime) / 1000 / 60;
        const breakMinutes = window.APP_CONFIG?.breakReminderMinutes || 15;
        
        if (sessionDuration >= breakMinutes && sessionDuration < breakMinutes + 1) {
            this.showScreen('break');
        }
    },

    continueAfterBreak() {
        this.showScreen('game');
        this.generateQuestion();
    },

    completeLevelSession() {
        this.stopSessionTimer();
        this.stopIdleDetection();
        const session = this.state.session;
        const accuracy = Adaptive.calculateSessionAccuracy(session);
        const duration = Date.now() - session.startTime;
        
        const progress = Storage.getProgress();
        progress.totalCorrect += session.answers.filter(a => a.correct).length;
        progress.totalQuestions += session.answers.length;
        progress.totalPlayTime += Math.round(duration / 1000);
        progress.sessionsCount++;
        progress.levelAccuracies[this.state.currentLevel] = accuracy;
        progress.lastPlayed = new Date().toISOString();
        
        Storage.saveProgress(progress);
        Storage.addSession({
            level: this.state.currentLevel,
            accuracy,
            duration,
            questionsAnswered: session.answers.length,
            bestStreak: session.bestStreak
        });
        
        document.getElementById('stat-accuracy').textContent = `${Math.round(accuracy * 100)}%`;
        document.getElementById('stat-time').textContent = this.formatDuration(duration);
        document.getElementById('stat-streak').textContent = session.bestStreak;
        
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        document.getElementById('mediated-text').textContent = Levels.getMediatedPrompt(levelConfig);
        
        const recommendation = Adaptive.getRecommendedAction(session, this.state.currentLevel);
        const nextLevelBtn = document.getElementById('btn-next-level');
        
        if (recommendation.action === 'advance' && this.state.currentLevel < 12) {
            nextLevelBtn.textContent = 'Continue to Next Level';
            nextLevelBtn.disabled = false;
        } else if (this.state.currentLevel >= 12) {
            nextLevelBtn.textContent = 'You\'ve Completed All Levels!';
            nextLevelBtn.disabled = true;
        } else {
            nextLevelBtn.textContent = 'Practice This Level Again';
        }
        
        this.showScreen('levelComplete');
    },

    advanceLevel() {
        const progress = Storage.getProgress();
        if (this.state.currentLevel < 12) {
            this.state.currentLevel++;
            progress.currentLevel = this.state.currentLevel;
            if (!progress.levelsCompleted.includes(this.state.currentLevel - 1)) {
                progress.levelsCompleted.push(this.state.currentLevel - 1);
            }
            Storage.saveProgress(progress);
        }
        this.startSession();
    },

    repeatLevel() {
        this.startSession();
    },

    goToPrevLevel() {
        if (this.state.currentLevel > 1) {
            this.state.currentLevel--;
            this.startSession();
        }
    },

    goToNextLevel() {
        if (this.state.currentLevel < 12) {
            this.state.currentLevel++;
            this.startSession();
        }
    },

    updateLevelNavButtons() {
        const prevBtn = document.getElementById('btn-prev-level');
        const nextBtn = document.getElementById('btn-next-level-nav');
        prevBtn.disabled = this.state.currentLevel <= 1;
        nextBtn.disabled = this.state.currentLevel >= 12;
    },

    showHint() {
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        const hint = Levels.getHint(levelConfig, this.state.hintsUsed);
        
        this.elements.hint.textContent = hint;
        this.elements.hint.style.display = 'block';
        this.state.hintsUsed++;
        
        Audio.speakHint(hint);
    },

    toggleNumbers() {
        this.state.showingNumbers = !this.state.showingNumbers;
        const question = this.state.currentQuestion;
        const settings = Storage.getSettings();
        const levelConfig = Levels.getLevel(this.state.currentLevel);
        
        Clock.create(this.elements.clock, {
            showNumbers: this.state.showingNumbers || settings.alwaysShowNumbers || levelConfig.showNumbers,
            showMinuteNumbers: true,
            hands: question.hands,
            showTickMarks: true
        });
        
        const btn = document.getElementById('btn-show-numbers');
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
            </svg>
            ${this.state.showingNumbers ? 'Hide Numbers' : 'Show Numbers'}
        `;
    },

    showDashboard() {
        const progress = Storage.getProgress();
        const sessions = Storage.getSessions();
        const report = Adaptive.generateProgressReport(progress, sessions);
        
        document.getElementById('dash-level').textContent = report.currentLevel;
        document.getElementById('dash-accuracy').textContent = `${report.overallAccuracy}%`;
        document.getElementById('dash-time').textContent = this.formatDuration(report.totalPlayTime * 1000);
        document.getElementById('dash-sessions').textContent = report.sessionsCompleted;
        
        this.renderAccuracyChart(report.levelBreakdown);
        this.renderResponseChart(sessions);
        this.renderPracticeAreas(report);
        this.renderSessionHistory(sessions);
        
        this.showScreen('dashboard');
    },

    renderAccuracyChart(levelBreakdown) {
        const container = document.getElementById('chart-accuracy');
        container.innerHTML = '';
        
        for (let i = 1; i <= 12; i++) {
            const accuracy = levelBreakdown[i] || 0;
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${Math.max(accuracy, 5)}%`;
            bar.style.backgroundColor = accuracy >= 75 ? 'var(--color-success)' : 
                                        accuracy >= 60 ? 'var(--color-warning)' : 'var(--color-error)';
            bar.title = `Level ${i}: ${accuracy}%`;
            
            const label = document.createElement('span');
            label.className = 'chart-bar-label';
            label.textContent = i;
            bar.appendChild(label);
            
            container.appendChild(bar);
        }
    },

    renderResponseChart(sessions) {
        const container = document.getElementById('chart-response');
        container.innerHTML = '';
        
        const recentSessions = sessions.slice(-10);
        if (recentSessions.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-muted);">No data yet</p>';
            return;
        }
        
        const maxDuration = Math.max(...recentSessions.map(s => s.duration || 0));
        
        recentSessions.forEach((session, i) => {
            const height = maxDuration > 0 ? ((session.duration || 0) / maxDuration) * 100 : 0;
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${Math.max(height, 5)}%`;
            bar.title = `Session ${i + 1}: ${this.formatDuration(session.duration)}`;
            container.appendChild(bar);
        });
    },

    renderPracticeAreas(report) {
        const container = document.getElementById('practice-areas');
        container.innerHTML = '';
        
        if (report.areasForImprovement.length === 0 && report.specificDifficulties.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Keep practicing to identify areas for improvement!';
            container.appendChild(li);
            return;
        }
        
        report.areasForImprovement.forEach(area => {
            const li = document.createElement('li');
            const levelConfig = Levels.getLevel(area.level);
            li.textContent = `Level ${area.level}: ${levelConfig.name} (${area.accuracy}% accuracy)`;
            container.appendChild(li);
        });
    },

    renderSessionHistory(sessions) {
        const container = document.getElementById('session-history');
        container.innerHTML = '';
        
        const recentSessions = sessions.slice(-5).reverse();
        
        if (recentSessions.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No sessions yet. Start playing!';
            container.appendChild(li);
            return;
        }
        
        recentSessions.forEach(session => {
            const li = document.createElement('li');
            const date = new Date(session.timestamp).toLocaleDateString();
            li.textContent = `${date} - Level ${session.level}: ${Math.round(session.accuracy * 100)}% accuracy`;
            container.appendChild(li);
        });
    },

    exportData() {
        const data = Storage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `clockwise-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    },

    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            Storage.resetProgress();
            this.state.currentLevel = 1;
            this.showScreen('welcome');
            document.getElementById('btn-continue').style.display = 'none';
        }
    },

    endSession() {
        this.state.session = null;
        this.stopTimer();
        this.stopSessionTimer();
        this.stopIdleDetection();
        this.showScreen('welcome');
    },

    formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());

