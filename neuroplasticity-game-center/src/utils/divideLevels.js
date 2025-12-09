/**
 * Division Game Levels
 * Division is the inverse of multiplication.
 * All questions generate whole number answers by using multiples of the divisor.
 */

export const levelsConfig = [
    {
        id: 1,
        name: 'Halves (÷2)',
        description: 'Dividing by 2 - splitting in half',
        divisor: 2,
        multiplierRange: [1, 10],
        questionsRequired: 15,
        hints: [
            '÷2 means splitting in half',
            'Think: what number doubled gives you this?',
            '12 ÷ 2 = ? Think: 2 × ? = 12'
        ],
        mediatedPrompts: [
            'Division is the opposite of multiplication!',
            'If you know 2×6=12, you know 12÷2=6!',
            'Your multiplication skills help with division!'
        ]
    },
    {
        id: 2,
        name: 'Tens (÷10)',
        description: 'Dividing by 10 - just remove the zero!',
        divisor: 10,
        multiplierRange: [1, 10],
        questionsRequired: 15,
        hints: [
            '÷10 just removes the zero at the end',
            '40 ÷ 10 = 4 (remove the 0)',
            'The pattern: 10→1, 20→2, 30→3...'
        ],
        mediatedPrompts: [
            'Dividing by 10 is super easy!',
            'Just like ×10 adds a zero, ÷10 removes it!',
            'You\'re seeing the connection!'
        ]
    },
    {
        id: 3,
        name: 'Fives (÷5)',
        description: 'Dividing by 5 - half of dividing by 10',
        divisor: 5,
        multiplierRange: [1, 10],
        questionsRequired: 15,
        hints: [
            'Think: how many 5s fit into this number?',
            '25 ÷ 5 = ? Count: 5, 10, 15, 20, 25 = five 5s!',
            '÷5 is double of ÷10'
        ],
        mediatedPrompts: [
            'The 5s table helps here!',
            'If 5×5=25, then 25÷5=5!',
            'You\'re mastering the key division facts!'
        ]
    },
    {
        id: 4,
        name: 'Threes (÷3)',
        description: 'Dividing by 3 - splitting into thirds',
        divisor: 3,
        multiplierRange: [1, 10],
        questionsRequired: 15,
        hints: [
            'Think: what times 3 equals this?',
            '15 ÷ 3 = ? Think: 3 × ? = 15',
            'Count by 3s: 3, 6, 9, 12, 15...'
        ],
        mediatedPrompts: [
            'Use your 3s multiplication knowledge!',
            'Division and multiplication are partners!',
            'You\'re building strong number sense!'
        ]
    },
    {
        id: 5,
        name: 'Fours (÷4)',
        description: 'Dividing by 4 - half of half',
        divisor: 4,
        multiplierRange: [1, 10],
        questionsRequired: 15,
        hints: [
            '÷4 is like halving twice',
            '20 ÷ 4 = ? Half of 20 is 10, half of 10 is 5!',
            'Or think: 4 × ? = 20'
        ],
        mediatedPrompts: [
            'Dividing by 4 = halving twice!',
            'Your doubling skills work backwards too!',
            'Multiple strategies make you flexible!'
        ]
    },
    {
        id: 6,
        name: 'Sixes (÷6)',
        description: 'Dividing by 6 - using your 6s facts',
        divisor: 6,
        multiplierRange: [1, 10],
        questionsRequired: 15,
        hints: [
            'Think: what times 6 equals this?',
            '42 ÷ 6 = ? Think: 6 × ? = 42',
            'Use your 6s multiplication table!'
        ],
        mediatedPrompts: [
            'Your 6s table knowledge helps!',
            'Every multiplication fact has a division partner!',
            'You\'re connecting the facts!'
        ]
    },
    {
        id: 7,
        name: 'Sevens (÷7)',
        description: 'Dividing by 7 - the tricky one!',
        divisor: 7,
        multiplierRange: [1, 10],
        questionsRequired: 15,
        hints: [
            'Think: what times 7 equals this?',
            '49 ÷ 7 = ? Think: 7 × ? = 49',
            'Count by 7s if needed: 7, 14, 21, 28...'
        ],
        mediatedPrompts: [
            '7s can be tricky, but you\'ve got this!',
            'Use your multiplication knowledge!',
            'Practice makes these automatic!'
        ]
    },
    {
        id: 8,
        name: 'Eights (÷8)',
        description: 'Dividing by 8 - half, half, half!',
        divisor: 8,
        multiplierRange: [1, 10],
        questionsRequired: 15,
        hints: [
            '÷8 is like halving three times',
            '64 ÷ 8 = ? Or think: 8 × ? = 64',
            'Use your 8s multiplication facts!'
        ],
        mediatedPrompts: [
            'Dividing by 8 = halving three times!',
            'Or just use your 8s table knowledge!',
            'You have multiple strategies!'
        ]
    },
    {
        id: 9,
        name: 'Nines (÷9)',
        description: 'Dividing by 9 - almost dividing by 10!',
        divisor: 9,
        multiplierRange: [1, 10],
        questionsRequired: 15,
        hints: [
            'Think: what times 9 equals this?',
            '81 ÷ 9 = ? Think: 9 × ? = 81',
            'The 9s have cool patterns - digits add to 9!'
        ],
        mediatedPrompts: [
            'Use your 9s multiplication knowledge!',
            'Remember the 9s patterns!',
            'You\'ve mastered all single-digit division!'
        ]
    }
];

export const getLevel = (levelId) => {
    return levelsConfig.find(l => l.id === levelId) || levelsConfig[0];
};

// Track recent questions to avoid repeats
let recentQuestions = [];
const MAX_RECENT = 5;

export const resetRecentQuestions = () => {
    recentQuestions = [];
};

export const generateQuestion = (levelConfig) => {
    const { divisor, multiplierRange, hints, mediatedPrompts } = levelConfig;
    const [minMult, maxMult] = multiplierRange;
    
    let multiplier, dividend, attempts = 0;
    
    // Avoid repeating recent questions
    do {
        multiplier = Math.floor(Math.random() * (maxMult - minMult + 1)) + minMult;
        dividend = divisor * multiplier;
        attempts++;
    } while (recentQuestions.includes(`${dividend}/${divisor}`) && attempts < 20);
    
    // Track this question
    recentQuestions.push(`${dividend}/${divisor}`);
    if (recentQuestions.length > MAX_RECENT) {
        recentQuestions.shift();
    }
    
    const correctAnswer = multiplier;
    
    // Generate prompt
    const prompts = [
        `What is ${dividend} ÷ ${divisor}?`,
        `${dividend} divided by ${divisor} equals?`,
        `How many ${divisor}s are in ${dividend}?`
    ];
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    // Get a hint
    const hint = hints[Math.floor(Math.random() * hints.length)];
    
    // Get a mediated prompt
    const mediatedPrompt = mediatedPrompts[Math.floor(Math.random() * mediatedPrompts.length)];
    
    return {
        dividend,
        divisor,
        correctAnswer,
        prompt,
        hint,
        mediatedPrompt,
        // For display
        equation: `${dividend} ÷ ${divisor} = ?`
    };
};

export const generateChoices = (correctAnswer) => {
    const choices = [correctAnswer];
    const range = 5; // Generate wrong answers within ±5 of correct
    
    let attempts = 0;
    const maxAttempts = 50;
    
    while (choices.length < 4 && attempts < maxAttempts) {
        attempts++;
        let offset = Math.floor(Math.random() * range * 2) - range;
        if (offset === 0) offset = Math.random() > 0.5 ? 1 : -1;
        
        const wrongAnswer = correctAnswer + offset;
        
        // Only positive whole numbers, no duplicates
        if (wrongAnswer > 0 && !choices.includes(wrongAnswer)) {
            choices.push(wrongAnswer);
        }
    }
    
    // Fallback if we couldn't generate enough
    let fallback = 1;
    while (choices.length < 4) {
        if (!choices.includes(fallback) && fallback !== correctAnswer) {
            choices.push(fallback);
        }
        fallback++;
    }
    
    // Shuffle
    return choices.sort(() => Math.random() - 0.5);
};
