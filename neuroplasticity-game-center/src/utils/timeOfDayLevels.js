/**
 * Time of Day Game Levels
 * Teaches children to recognize times of day in English and Norwegian
 */

export const timePeriods = {
    morning: {
        english: 'Morning',
        norwegian: 'Morgen',
        hourRange: [6, 11],
        image: 'morning.png',
        description: 'When the sun rises and we wake up',
        imageHint: 'The sun is low and rising - this is when we wake up and eat breakfast!',
        translationHint: 'Morgen sounds like "morning" - they come from the same old word!'
    },
    noon: {
        english: 'Noon',
        norwegian: 'Midt på dagen',
        hourRange: [12, 12],
        image: 'noon.png',
        description: 'When the sun is directly overhead - 12:00',
        imageHint: 'The sun is directly over your head - it\'s exactly 12 o\'clock!',
        translationHint: 'Midt på dagen means "middle of the day" - noon is 12:00!'
    },
    afternoon: {
        english: 'Afternoon',
        norwegian: 'Ettermiddag',
        hourRange: [13, 17],
        image: 'midday.png',
        description: 'The middle of the day after lunch',
        imageHint: 'The sun is high but past your head - it\'s after lunch time!',
        translationHint: 'Ettermiddag means "after midday" - it\'s the time after noon!'
    },
    evening: {
        english: 'Evening',
        norwegian: 'Kveld',
        hourRange: [18, 20],
        image: 'evening.png',
        description: 'When the sun sets and we have dinner',
        imageHint: 'The sun is setting and the sky turns orange and pink - dinner time!',
        translationHint: 'Kveld is evening - when we eat dinner and the sun goes down!'
    },
    night: {
        english: 'Night',
        norwegian: 'Natt',
        hourRange: [21, 5],
        image: 'night.png',
        description: 'When it\'s dark and we sleep',
        imageHint: 'It\'s dark outside with stars and moon - time to sleep!',
        translationHint: 'Natt sounds like "night" - when it\'s dark and we sleep!'
    }
};

export const levelsConfig = [
    {
        id: 1,
        name: 'Times of Day',
        description: 'Learn all times of day in English and Norwegian',
        focusPeriod: null, // Mixed - all periods
        questionsRequired: 15,
        questionTypes: ['image_to_english', 'image_to_norwegian', 'english_to_norwegian', 'norwegian_to_english'],
        hints: [
            'Morning = Morgen (sunrise, breakfast)',
            'Noon = Midt på dagen (sun overhead, 12:00)',
            'Afternoon = Ettermiddag (after lunch)',
            'Evening = Kveld (sunset, dinner)',
            'Night = Natt (dark, sleep)'
        ],
        mediatedPrompts: [
            'You\'re learning two languages at once!',
            'Look at the picture - what time of day is it?',
            'Think about what happens during this time!',
            'Norwegian and English have similar words!',
            'You\'re becoming bilingual!'
        ]
    }
];

export const getLevel = (levelId) => {
    return levelsConfig.find(l => l.id === levelId) || levelsConfig[0];
};

// Track recent questions to avoid repeats
let recentQuestions = [];
let lastQuestionType = null;
let questionTypeIndex = 0;
const MAX_RECENT = 5;

export const resetRecentQuestions = () => {
    recentQuestions = [];
    lastQuestionType = null;
    questionTypeIndex = 0;
};

const allPeriodKeys = ['morning', 'noon', 'afternoon', 'evening', 'night'];

export const generateQuestion = (levelConfig) => {
    const { focusPeriod, questionTypes, hints } = levelConfig;
    
    // Pick a period - for mixed levels, avoid repeating the same period
    let periodKey;
    if (focusPeriod) {
        periodKey = focusPeriod;
    } else {
        // For mixed levels, try to pick a different period than recent ones
        const recentPeriods = recentQuestions.map(q => q.split('-')[0]);
        const availablePeriods = allPeriodKeys.filter(p => !recentPeriods.includes(p));
        if (availablePeriods.length > 0) {
            periodKey = availablePeriods[Math.floor(Math.random() * availablePeriods.length)];
        } else {
            periodKey = allPeriodKeys[Math.floor(Math.random() * allPeriodKeys.length)];
        }
    }
    
    const period = timePeriods[periodKey];
    
    // Pick a question type - cycle through types to ensure variety
    // Don't repeat the same type twice in a row
    let questionType;
    if (questionTypes.length === 1) {
        questionType = questionTypes[0];
    } else {
        // Cycle through question types sequentially for better variety
        questionType = questionTypes[questionTypeIndex % questionTypes.length];
        questionTypeIndex++;
        
        // If we just used this type, skip to next
        if (questionType === lastQuestionType && questionTypes.length > 1) {
            questionType = questionTypes[questionTypeIndex % questionTypes.length];
            questionTypeIndex++;
        }
    }
    lastQuestionType = questionType;
    
    let prompt, correctAnswer, choices, showImage = false, showWord = null, description = '';
    
    switch (questionType) {
        case 'image_to_english':
            prompt = 'What time of day is this?';
            description = period.imageHint;
            correctAnswer = period.english;
            choices = allPeriodKeys.map(k => timePeriods[k].english);
            showImage = true;
            break;
            
        case 'image_to_norwegian':
            prompt = 'Hva tid på dagen er dette? (What time of day is this in Norwegian?)';
            description = period.imageHint;
            correctAnswer = period.norwegian;
            choices = allPeriodKeys.map(k => timePeriods[k].norwegian);
            showImage = true;
            break;
            
        case 'english_to_norwegian':
            prompt = `How do you say "${period.english}" in Norwegian?`;
            description = period.translationHint;
            correctAnswer = period.norwegian;
            choices = allPeriodKeys.map(k => timePeriods[k].norwegian);
            showWord = period.english;
            break;
            
        case 'norwegian_to_english':
            prompt = `How do you say "${period.norwegian}" in English?`;
            description = period.translationHint;
            correctAnswer = period.english;
            choices = allPeriodKeys.map(k => timePeriods[k].english);
            showWord = period.norwegian;
            break;
            
        default:
            prompt = 'What time of day is this?';
            description = period.imageHint;
            correctAnswer = period.english;
            choices = allPeriodKeys.map(k => timePeriods[k].english);
            showImage = true;
    }
    
    // Shuffle choices
    choices = choices.sort(() => Math.random() - 0.5);
    
    // Track this question
    const questionKey = `${periodKey}-${questionType}`;
    if (!recentQuestions.includes(questionKey)) {
        recentQuestions.push(questionKey);
        if (recentQuestions.length > MAX_RECENT) {
            recentQuestions.shift();
        }
    }
    
    const hint = hints[Math.floor(Math.random() * hints.length)];
    
    return {
        periodKey,
        period,
        questionType,
        prompt,
        description,
        correctAnswer,
        choices,
        showImage,
        showWord,
        hint,
        image: period.image
    };
};
