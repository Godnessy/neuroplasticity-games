const Levels = {
    config: [
        {
            id: 1,
            name: 'Hour Hand - Cardinal Positions',
            description: 'Learn to read the hour hand at 12, 3, 6, and 9',
            research: 'Arrowsmith: Single hand recognition develops visual processing. Starting with ONE hand builds foundational Symbol Relations.',
            hands: ['hour'],
            timeAllowed: null,
            showNumbers: true,
            minuteOptions: [0],
            hourOptions: [12, 3, 6, 9],
            questionsRequired: 20,
            hints: [
                'Look at where the single hand is pointing.',
                'This is the hour hand - the short, thick hand.',
                'Which number is the hand pointing to?'
            ],
            mediatedPrompts: [
                'You\'re learning to see where the hour hand points!',
                'The hour hand moves slowly around the clock.',
                'Great focus! Your brain is building new connections.'
            ]
        },
        {
            id: 2,
            name: 'Hour Hand - All Positions',
            description: 'Read the hour hand at any of the 12 positions',
            research: 'Arrowsmith: Expanding spatial orientation. Merzenich: Master at current level before adding complexity.',
            hands: ['hour'],
            timeAllowed: null,
            showNumbers: true,
            minuteOptions: [0],
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            questionsRequired: 20,
            hints: [
                'Which number is the hand pointing to?',
                'Count around from 12 if you need to.',
                'The hour hand tells us the hour.'
            ],
            mediatedPrompts: [
                'You can now read all 12 hour positions!',
                'Notice how the hour hand moves clockwise.',
                'Your visual-spatial skills are growing stronger.'
            ]
        },
        {
            id: 3,
            name: 'Two Hands - On the Hour',
            description: 'Now adding the minute hand - it points to 12 on the hour',
            research: 'Arrowsmith: Begin two-hand symbol relations. Tallal: Introduce new element gradually.',
            hands: ['hour', 'minute'],
            timeAllowed: null,
            showNumbers: true,
            minuteOptions: [0],
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            questionsRequired: 15,
            hints: [
                'A NEW hand appeared! The long thin hand is the minute hand.',
                'When the minute hand points to 12, it\'s exactly on the hour.',
                'Focus on the SHORT hand to tell the hour - ignore the long one for now.'
            ],
            mediatedPrompts: [
                'What do you notice about how these two hands work together?',
                'When it\'s exactly on the hour, the minute hand points straight up.',
                'You\'re now processing TWO pieces of information at once!'
            ]
        },
        {
            id: 4,
            name: 'Two Hands - Half Past',
            description: 'Learn half-past times (:30)',
            research: 'Tallal: Gradual difficulty increase',
            hands: ['hour', 'minute'],
            timeAllowed: 20,
            showNumbers: true,
            minuteOptions: [0, 30],
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            questionsRequired: 10,
            hints: [
                'When the minute hand points to 6, it means 30 minutes.',
                'Half past means the minute hand went halfway around.',
                'Notice the hour hand moves between numbers at :30.'
            ],
            mediatedPrompts: [
                'See how the hour hand is between two numbers? That\'s because 30 minutes have passed!',
                'Half past 3 means 3:30 - you\'re halfway to the next hour.',
                'Your brain is learning to see relationships between the hands!'
            ]
        },
        {
            id: 5,
            name: 'Quarter Hours',
            description: 'Learn quarter past (:15) and quarter to (:45)',
            research: 'Arrowsmith: Building relational concepts',
            hands: ['hour', 'minute'],
            timeAllowed: 15,
            showNumbers: true,
            minuteOptions: [0, 15, 30, 45],
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            questionsRequired: 10,
            hints: [
                'Minute hand at 3 = 15 minutes (quarter past).',
                'Minute hand at 9 = 45 minutes (quarter to).',
                'A quarter of 60 minutes is 15 minutes.'
            ],
            mediatedPrompts: [
                'Quarter past, half past, quarter to - you\'re dividing the clock into parts!',
                'Can you see how the clock is like a pie cut into four pieces?',
                'Real-world connection: Quarter past 3 is when many people have an afternoon snack!'
            ]
        },
        {
            id: 6,
            name: 'Five-Minute Intervals',
            description: 'Read times at 5-minute marks',
            research: 'Merzenich: Intensive repetition at competence edge',
            hands: ['hour', 'minute'],
            timeAllowed: 15,
            showNumbers: true,
            minuteOptions: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            questionsRequired: 10,
            hints: [
                'Each number on the clock = 5 minutes.',
                'Minute hand at 1 = 5 minutes, at 2 = 10 minutes.',
                'Count by 5s from 12 to where the minute hand points.'
            ],
            mediatedPrompts: [
                'You\'re now reading any 5-minute interval!',
                'Notice the pattern: each tick mark is 1 minute, each number is 5.',
                'This is like counting by 5s - a skill that helps in many areas!'
            ]
        },
        {
            id: 7,
            name: 'Three Hands - Adding Seconds',
            description: 'Recognize the second hand',
            research: 'Arrowsmith: Three-dimensional relationships (core Symbol Relations)',
            hands: ['hour', 'minute', 'second'],
            timeAllowed: 15,
            showNumbers: false,
            minuteOptions: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            includeSecond: true,
            questionsRequired: 10,
            hints: [
                'The thinnest hand is the second hand - you can ignore it for now.',
                'Focus on the hour (thick) and minute (medium) hands.',
                'Different colors help you tell the hands apart.'
            ],
            mediatedPrompts: [
                'Now you\'re processing THREE pieces of information!',
                'Your brain is learning to filter out what\'s not needed.',
                'This is advanced Symbol Relations training - like the Arrowsmith clocks exercise!'
            ]
        },
        {
            id: 8,
            name: 'Three Hands - Any Time',
            description: 'Read any minute with three hands visible',
            research: 'Merzenich: Pushing competence boundary',
            hands: ['hour', 'minute', 'second'],
            timeAllowed: 12,
            showNumbers: false,
            minuteOptions: 'any',
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            includeSecond: true,
            questionsRequired: 10,
            hints: [
                'Look at where the minute hand is between the numbers.',
                'Each small tick = 1 minute.',
                'The hour hand position tells you if it\'s closer to this hour or the next.'
            ],
            mediatedPrompts: [
                'You can now read any time with three hands!',
                'Notice how your brain automatically focuses on the right hands.',
                'This skill transfers to reading complex information in other areas!'
            ]
        },
        {
            id: 9,
            name: 'Selective Attention',
            description: 'Ignore distractor hands',
            research: 'Arrowsmith: Advanced Symbol Relations with selective attention',
            hands: ['hour', 'minute', 'second'],
            timeAllowed: 12,
            showNumbers: false,
            minuteOptions: 'any',
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            includeSecond: true,
            includeDistractors: true,
            distractorCount: 1,
            questionsRequired: 10,
            hints: [
                'The dashed hand is a distractor - ignore it!',
                'Focus only on the SOLID hands.',
                'Your brain can learn to filter out distractions.'
            ],
            mediatedPrompts: [
                'Excellent selective attention! You ignored the distractor.',
                'This trains your brain to focus on relevant information.',
                'The dashed hand tests your ability to filter - great job!'
            ]
        },
        {
            id: 10,
            name: 'Multiple Distractors',
            description: 'Filter multiple irrelevant hands',
            research: 'Arrowsmith: Maximum Symbol Relations complexity',
            hands: ['hour', 'minute', 'second'],
            timeAllowed: 10,
            showNumbers: false,
            minuteOptions: 'any',
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            includeSecond: true,
            includeDistractors: true,
            distractorCount: 2,
            questionsRequired: 10,
            hints: [
                'Multiple dashed hands - ignore them all!',
                'Only solid hands show the real time.',
                'Practice focusing only on what matters.'
            ],
            mediatedPrompts: [
                'Your selective attention is exceptional!',
                'Processing 5 hands and correctly filtering 2 - impressive!',
                'This level of focus helps with reading comprehension too!'
            ]
        },
        {
            id: 11,
            name: 'Elapsed Time',
            description: 'Calculate time differences',
            research: 'Feuerstein: Higher-order reasoning and bridging',
            hands: ['hour', 'minute'],
            timeAllowed: 15,
            showNumbers: false,
            minuteOptions: 'any',
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            questionType: 'elapsed',
            questionsRequired: 10,
            hints: [
                'Think about how the hands move forward.',
                'Add the minutes, then see if you pass an hour.',
                'It helps to imagine the minute hand moving.'
            ],
            mediatedPrompts: [
                'You\'re now reasoning about time, not just reading it!',
                'This skill helps plan your day and manage activities.',
                'Real-world connection: What time will dinner be ready if it takes 30 minutes?'
            ]
        },
        {
            id: 12,
            name: 'Time Master',
            description: 'Mixed challenges with all skills',
            research: 'Integration: All neuroplasticity principles combined',
            hands: ['hour', 'minute', 'second'],
            timeAllowed: 10,
            showNumbers: false,
            minuteOptions: 'any',
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            includeSecond: true,
            includeDistractors: true,
            distractorCount: 2,
            mixedQuestionTypes: true,
            questionsRequired: 10,
            hints: [
                'Use all your skills together!',
                'Break it down: identify hands, filter distractors, read time.',
                'You\'ve trained for this - trust your brain!'
            ],
            mediatedPrompts: [
                'You\'ve completed the full Symbol Relations progression!',
                'Your brain has physically changed through this training.',
                'These skills will help with reading, math, and problem-solving!'
            ]
        }
    ],

    getLevel(levelId) {
        return this.config.find(l => l.id === levelId) || this.config[0];
    },

    generateQuestion(levelConfig) {
        const hour = this.randomFrom(levelConfig.hourOptions);
        let minute;
        
        if (levelConfig.minuteOptions === 'any') {
            minute = Math.floor(Math.random() * 60);
        } else {
            minute = this.randomFrom(levelConfig.minuteOptions);
        }
        
        const second = levelConfig.includeSecond ? Math.floor(Math.random() * 60) : null;
        
        let questionType = 'standard';
        let elapsedMinutes = 0;
        
        if (levelConfig.questionType === 'elapsed' || 
            (levelConfig.mixedQuestionTypes && Math.random() > 0.6)) {
            questionType = 'elapsed';
            elapsedMinutes = this.randomFrom([15, 20, 30, 45]);
        }
        
        const includeMinute = levelConfig.hands.includes('minute');
        const hands = Clock.generateHandsForTime(hour, minute, second, {
            includeMinute: includeMinute,
            includeSecond: levelConfig.includeSecond,
            includeDistractors: levelConfig.includeDistractors,
            distractorCount: levelConfig.distractorCount || 0
        });
        
        let prompt, correctAnswer;
        
        if (questionType === 'elapsed') {
            prompt = `The clock shows the current time. What time will it be in ${elapsedMinutes} minutes?`;
            const newMinutes = minute + elapsedMinutes;
            const newHour = newMinutes >= 60 ? (hour % 12) + 1 : hour;
            const finalMinute = newMinutes % 60;
            correctAnswer = { hour: newHour === 0 ? 12 : newHour, minute: finalMinute };
        } else {
            const hourOnly = !levelConfig.hands.includes('minute');
            if (hourOnly) {
                prompt = 'What hour is the hand pointing to?';
            } else {
                prompt = levelConfig.includeDistractors 
                    ? 'Read the time shown by the SOLID hands. Ignore dashed hands.'
                    : 'What time does this clock show?';
            }
            correctAnswer = { hour, minute };
        }
        
        return {
            hour,
            minute,
            second,
            hands,
            prompt,
            correctAnswer,
            questionType,
            elapsedMinutes,
            handCombination: `${hands.length}hands_${levelConfig.includeDistractors ? 'distract' : 'clean'}`
        };
    },

    generateChoices(correctAnswer, levelConfig) {
        const choices = [correctAnswer];
        const usedTimes = new Set([`${correctAnswer.hour}:${correctAnswer.minute}`]);
        
        while (choices.length < 4) {
            let wrongHour, wrongMinute;
            const variation = Math.random();
            
            if (variation < 0.33) {
                wrongHour = correctAnswer.hour;
                if (levelConfig.minuteOptions === 'any') {
                    wrongMinute = (correctAnswer.minute + this.randomFrom([5, 10, 15, -5, -10, -15]) + 60) % 60;
                } else {
                    const options = levelConfig.minuteOptions.filter(m => m !== correctAnswer.minute);
                    wrongMinute = options.length > 0 ? this.randomFrom(options) : (correctAnswer.minute + 15) % 60;
                }
            } else if (variation < 0.66) {
                wrongHour = this.randomFrom(levelConfig.hourOptions.filter(h => h !== correctAnswer.hour));
                if (!wrongHour) wrongHour = (correctAnswer.hour % 12) + 1;
                wrongMinute = correctAnswer.minute;
            } else {
                wrongHour = this.randomFrom(levelConfig.hourOptions);
                if (levelConfig.minuteOptions === 'any') {
                    wrongMinute = Math.floor(Math.random() * 60);
                } else {
                    wrongMinute = this.randomFrom(levelConfig.minuteOptions);
                }
            }
            
            const timeKey = `${wrongHour}:${wrongMinute}`;
            if (!usedTimes.has(timeKey)) {
                usedTimes.add(timeKey);
                choices.push({ hour: wrongHour, minute: wrongMinute });
            }
        }
        
        return this.shuffle(choices);
    },

    getHint(levelConfig, hintIndex = 0) {
        const hints = levelConfig.hints || [];
        return hints[hintIndex % hints.length] || 'Look carefully at the clock hands.';
    },

    getMediatedPrompt(levelConfig) {
        const prompts = levelConfig.mediatedPrompts || [];
        return this.randomFrom(prompts) || 'Great work! Keep practicing!';
    },

    getExplanation(question, userAnswer, isCorrect, levelConfig = null) {
        const correct = question.correctAnswer;
        const hourOnly = levelConfig ? !levelConfig.hands.includes('minute') : (correct.minute === 0 && question.hands && question.hands.length === 1);
        
        if (hourOnly) {
            if (isCorrect) {
                return `The hand points to ${correct.hour}. That's ${correct.hour} o'clock!`;
            } else {
                return `Look where the hand is pointing. It points to ${correct.hour}, so the answer is ${correct.hour} o'clock.`;
            }
        }
        
        if (isCorrect) {
            if (correct.minute === 0) {
                return `The hour hand points to ${correct.hour}, and the minute hand is at 12. That's ${correct.hour} o'clock!`;
            }
            return `The hour hand is at ${correct.hour}, minute hand shows ${correct.minute} minutes. That's ${Clock.formatTime(correct.hour, correct.minute)}!`;
        } else {
            if (correct.minute === 0) {
                return `The hour hand points to ${correct.hour} (the short hand), and the minute hand is at 12. The correct time is ${correct.hour}:00.`;
            }
            const minutePosition = Math.floor(correct.minute / 5) || 12;
            return `The minute hand at ${minutePosition} means ${correct.minute} minutes. The hour hand between ${correct.hour} and ${(correct.hour % 12) + 1} means it's still ${correct.hour}. The correct time is ${Clock.formatTime(correct.hour, correct.minute)}.`;
        }
    },

    randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
};

