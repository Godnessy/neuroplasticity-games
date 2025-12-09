const Levels = {
    lastHour: null,
    lastMinute: null,
    
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
            timeAllowed: null,
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
            timeAllowed: null,
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
            timeAllowed: null,
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
            name: 'Introduction to 24-Hour Time (PM)',
            description: 'Learn afternoon hours in 24-hour format',
            research: 'Merzenich: Gradual complexity increase with familiar context',
            hands: ['hour', 'minute'],
            timeAllowed: null,
            showNumbers: true,
            minuteOptions: [0, 15, 30, 45],
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            show24Hour: true,
            pmOnly: true,
            questionsRequired: 10,
            hints: [
                'After 12:00 noon, we add 12 to the hour.',
                '1:00 PM = 13:00 in 24-hour time.',
                '6:00 PM = 18:00 (6 + 12).'
            ],
            mediatedPrompts: [
                'You\'re learning how adults tell time in many countries!',
                'This is the time format used in schedules and computers.',
                'Think: afternoon hours = hour + 12!'
            ]
        },
        {
            id: 8,
            name: 'Morning Hours in 24-Hour Format',
            description: 'Learn morning hours and midnight in 24-hour time',
            research: 'Arrowsmith: Symbol mapping between formats',
            hands: ['hour', 'minute'],
            timeAllowed: null,
            showNumbers: true,
            minuteOptions: [0, 15, 30, 45],
            hourOptions: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            show24Hour: true,
            amOnly: true,
            questionsRequired: 10,
            hints: [
                'Midnight is 00:00 in 24-hour time.',
                '1:00 AM = 01:00.',
                'Morning hours stay mostly the same, just add a zero in front!'
            ],
            mediatedPrompts: [
                'Midnight starts a new day at 00:00!',
                'Morning hours are easy - they look almost the same.',
                'Notice: 12:00 midnight = 00:00, 12:00 noon = 12:00!'
            ]
        },
        {
            id: 9,
            name: 'Mixed 12/24 Hour Conversion',
            description: 'Practice converting between both formats',
            research: 'Tallal: Rapid switching builds cognitive flexibility',
            hands: ['hour', 'minute'],
            timeAllowed: null,
            showNumbers: true,
            minuteOptions: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            show24Hour: true,
            mixedFormat: true,
            questionsRequired: 10,
            hints: [
                'Read the analog clock, then convert to the requested format.',
                'Remember: PM hours = add 12 (except 12 PM).',
                'AM hours mostly stay the same (except 12 AM = 00:00).'
            ],
            mediatedPrompts: [
                'You\'re becoming fluent in both time formats!',
                'This flexibility helps your brain adapt to different situations.',
                'Real world skill: reading train schedules and digital devices!'
            ]
        },
        {
            id: 10,
            name: 'Real-World 24-Hour Applications',
            description: 'Practice with schedules and timetables',
            research: 'Feuerstein: Bridging to real-world application',
            hands: ['hour', 'minute'],
            timeAllowed: null,
            showNumbers: false,
            minuteOptions: 'any',
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            show24Hour: true,
            realWorldContext: true,
            questionsRequired: 10,
            hints: [
                'Think about when this might happen in your day.',
                'Bus and train schedules use 24-hour time.',
                'TV programs often show times in 24-hour format.'
            ],
            mediatedPrompts: [
                'The bus leaves at 15:30 - that\'s 3:30 PM!',
                'Your favorite show is at 19:00 - that\'s 7:00 PM!',
                'You\'re mastering a crucial life skill!'
            ]
        },
        {
            id: 11,
            name: 'Time Calculations in 24-Hour',
            description: 'Add and subtract time in 24-hour format',
            research: 'Merzenich: Complex cognitive operations at mastery level',
            hands: ['hour', 'minute'],
            timeAllowed: null,
            showNumbers: false,
            minuteOptions: 'any',
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            show24Hour: true,
            questionType: 'calculation',
            questionsRequired: 10,
            hints: [
                'Add hours and minutes separately.',
                'If you go past 23:59, you start a new day at 00:00.',
                'Break complex calculations into steps.'
            ],
            mediatedPrompts: [
                'If the movie starts at 18:30 and lasts 2 hours, it ends at 20:30!',
                'You\'re doing mental math with time - excellent brain training!',
                'This helps with planning and scheduling in daily life.'
            ]
        },
        {
            id: 12,
            name: '24-Hour Time Master',
            description: 'Master all 24-hour time skills',
            research: 'Integration: Full neuroplastic adaptation achieved',
            hands: ['hour', 'minute'],
            timeAllowed: null,
            showNumbers: false,
            minuteOptions: 'any',
            hourOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            show24Hour: true,
            masterLevel: true,
            questionsRequired: 15,
            hints: [
                'You know this! Trust your training.',
                'Quick conversions show your brain has adapted.',
                'Apply everything you\'ve learned!'
            ],
            mediatedPrompts: [
                'You\'ve mastered both 12 and 24-hour time formats!',
                'Your brain can now effortlessly switch between systems.',
                'This cognitive flexibility will help you in many areas of life!'
            ]
        }
    ],

    getLevel(levelId) {
        return this.config.find(l => l.id === levelId) || this.config[0];
    },

    generateQuestion(levelConfig) {
        let hour = this.randomFromExcluding(levelConfig.hourOptions, this.lastHour);
        let minute;
        
        if (levelConfig.minuteOptions === 'any') {
            do {
                minute = Math.floor(Math.random() * 60);
            } while (minute === this.lastMinute && levelConfig.minuteOptions === 'any');
        } else {
            minute = this.randomFromExcluding(levelConfig.minuteOptions, this.lastMinute);
        }
        
        this.lastHour = hour;
        this.lastMinute = minute;
        
        const second = levelConfig.includeSecond ? Math.floor(Math.random() * 60) : null;
        
        let questionType = 'standard';
        let elapsedMinutes = 0;
        let isPM = false;
        
        if (levelConfig.show24Hour) {
            if (levelConfig.pmOnly) {
                isPM = true;
            } else if (levelConfig.amOnly) {
                isPM = false;
            } else if (levelConfig.mixedFormat || levelConfig.realWorldContext) {
                isPM = Math.random() > 0.5;
            }
        }
        
        if (levelConfig.questionType === 'elapsed' || levelConfig.questionType === 'calculation' || 
            (levelConfig.mixedQuestionTypes && Math.random() > 0.6)) {
            questionType = levelConfig.questionType === 'calculation' ? 'calculation' : 'elapsed';
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
        
        if (levelConfig.show24Hour) {
            const time24 = this.convertTo24Hour(hour, minute, isPM);
            
            if (levelConfig.realWorldContext) {
                const contexts = [
                    'The train departs at',
                    'The bus arrives at',
                    'The TV show starts at',
                    'The store closes at',
                    'School begins at'
                ];
                const context = this.randomFrom(contexts);
                prompt = `${context} this time. What is it in 24-hour format?`;
            } else if (levelConfig.mixedFormat) {
                const askFor24 = Math.random() > 0.5;
                prompt = askFor24 
                    ? 'What is this time in 24-hour format?'
                    : 'What is this time in 12-hour format (with AM/PM)?';
            } else {
                prompt = 'What time does this clock show? (Use 24-hour format)';
            }
            
            correctAnswer = {
                hour: hour,
                minute: minute,
                hour24: time24.hour,
                minute24: time24.minute,
                isPM: isPM
            };
        } else if (questionType === 'elapsed') {
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
            isPM,
            handCombination: `${hands.length}hands_${levelConfig.includeDistractors ? 'distract' : 'clean'}`
        };
    },

    convertTo24Hour(hour12, minute, isPM) {
        let hour24;
        if (hour12 === 12) {
            hour24 = isPM ? 12 : 0;
        } else {
            hour24 = isPM ? hour12 + 12 : hour12;
        }
        return { hour: hour24, minute: minute };
    },

    convertTo12Hour(hour24, minute) {
        let hour12;
        let isPM = false;
        
        if (hour24 === 0) {
            hour12 = 12;
            isPM = false;
        } else if (hour24 === 12) {
            hour12 = 12;
            isPM = true;
        } else if (hour24 > 12) {
            hour12 = hour24 - 12;
            isPM = true;
        } else {
            hour12 = hour24;
            isPM = false;
        }
        
        return { hour: hour12, minute: minute, isPM: isPM };
    },

    format24HourTime(hour, minute) {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
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
        const is24Hour = levelConfig && levelConfig.show24Hour;
        
        if (is24Hour) {
            const time12 = `${correct.hour}:${correct.minute.toString().padStart(2, '0')} ${correct.isPM ? 'PM' : 'AM'}`;
            const time24 = this.format24HourTime(correct.hour24, correct.minute24);
            
            if (isCorrect) {
                return `Yes! ${time12} = ${time24} in 24-hour format.`;
            } else {
                return `The correct answer is ${time24} (${time12}).`;
            }
        } else if (hourOnly) {
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

    randomFromExcluding(array, exclude) {
        if (array.length <= 1) return array[0];
        const filtered = array.filter(item => item !== exclude);
        if (filtered.length === 0) return array[0];
        return filtered[Math.floor(Math.random() * filtered.length)];
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

