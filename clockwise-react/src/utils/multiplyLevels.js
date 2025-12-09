/**
 * Multiplication Game Levels
 * Based on dyscalculia research: Start with 2x, 5x, 10x (key facts)
 * then derive other facts through understanding, not memorization
 */

export const levelsConfig = [
    // PHASE 1: Foundation - Understanding what multiplication means
    {
        id: 1,
        name: 'What is Multiplication?',
        description: 'Learn that multiplication is repeated addition',
        research: 'Arrowsmith: Build foundational symbol relations before complexity',
        table: 2,
        range: [1, 5],
        showVisual: true,
        showGroups: true,
        questionsRequired: 15,
        hints: [
            '2 × 3 means "2 groups of 3" or "3 + 3"',
            'Count the dots in each group',
            'Multiplication is just fast adding!'
        ],
        mediatedPrompts: [
            'You\'re learning that × means "groups of"!',
            'See how the dots are arranged in groups?',
            'Your brain is building new number connections!'
        ]
    },
    {
        id: 2,
        name: 'Doubles (×2)',
        description: 'Master the 2 times table - doubling numbers',
        research: 'Merzenich: Master at current level before adding complexity',
        table: 2,
        range: [1, 10],
        showVisual: true,
        showGroups: false,
        questionsRequired: 20,
        hints: [
            '×2 means double the number',
            'Think: the number + itself',
            '2 × 7 = 7 + 7'
        ],
        mediatedPrompts: [
            'Doubling is one of the most useful math skills!',
            'You can double anything - even big numbers!',
            'Your doubling skills are getting stronger!'
        ]
    },
    {
        id: 3,
        name: 'Tens (×10)',
        description: 'The easiest table - just add a zero!',
        research: 'Dyscalculia research: 10x is a key fact for deriving others',
        table: 10,
        range: [1, 10],
        showVisual: false,
        showPattern: true,
        questionsRequired: 15,
        hints: [
            '×10 just adds a zero to the end',
            '10 × 4 = 40 (4 with a 0)',
            'The pattern: 10, 20, 30, 40...'
        ],
        mediatedPrompts: [
            'The 10s are the easiest - just add zero!',
            'Notice the pattern? Every answer ends in 0!',
            'You\'ve mastered one of the key tables!'
        ]
    },
    {
        id: 4,
        name: 'Fives (×5)',
        description: 'Half of tens - ends in 0 or 5',
        research: 'Dyscalculia research: 5x is half of 10x - derive from known facts',
        table: 5,
        range: [1, 10],
        showVisual: false,
        showPattern: true,
        questionsRequired: 20,
        hints: [
            '×5 is half of ×10',
            '5 × 4 = half of 10 × 4 = half of 40 = 20',
            'Answers always end in 0 or 5'
        ],
        mediatedPrompts: [
            'See how 5s relate to 10s? Half!',
            'The pattern: 5, 10, 15, 20, 25...',
            'You now know THREE key tables!'
        ]
    },
    // PHASE 2: Deriving from key facts
    {
        id: 5,
        name: 'Threes (×3)',
        description: 'Double plus one more group',
        research: 'Tallal: Build on existing knowledge',
        table: 3,
        range: [1, 10],
        showDerivation: true,
        derivationMethod: 'double_plus_one',
        questionsRequired: 20,
        hints: [
            '×3 = ×2 + one more group',
            '3 × 4 = (2 × 4) + 4 = 8 + 4 = 12',
            'Double it, then add one more'
        ],
        mediatedPrompts: [
            'You\'re using your ×2 skills to learn ×3!',
            'This is how mathematicians think - build on what you know!',
            'Your brain is making connections!'
        ]
    },
    {
        id: 6,
        name: 'Fours (×4)',
        description: 'Double the double!',
        research: 'Arrowsmith: Symbol relations - connecting concepts',
        table: 4,
        range: [1, 10],
        showDerivation: true,
        derivationMethod: 'double_double',
        questionsRequired: 20,
        hints: [
            '×4 = double × double',
            '4 × 6 = 2 × (2 × 6) = 2 × 12 = 24',
            'Double it twice!'
        ],
        mediatedPrompts: [
            'Double-double! Your ×2 skills make ×4 easy!',
            'See how everything connects?',
            'You\'re thinking like a mathematician!'
        ]
    },
    {
        id: 7,
        name: 'Sixes (×6)',
        description: 'Five plus one more, or double threes',
        research: 'Multiple derivation paths for flexibility',
        table: 6,
        range: [1, 10],
        showDerivation: true,
        derivationMethod: 'five_plus_one',
        questionsRequired: 20,
        hints: [
            '×6 = ×5 + one more group',
            '6 × 7 = (5 × 7) + 7 = 35 + 7 = 42',
            'Or: ×6 = ×3 doubled'
        ],
        mediatedPrompts: [
            'Using your ×5 to figure out ×6!',
            'Multiple ways to solve - choose what works for you!',
            'Flexible thinking is powerful!'
        ]
    },
    {
        id: 8,
        name: 'Sevens (×7)',
        description: 'Five plus two more groups',
        research: 'Feuerstein: Mediated learning - guide the thinking process',
        table: 7,
        range: [1, 10],
        showDerivation: true,
        derivationMethod: 'five_plus_two',
        questionsRequired: 20,
        hints: [
            '×7 = ×5 + ×2',
            '7 × 8 = (5 × 8) + (2 × 8) = 40 + 16 = 56',
            'Break it into parts you know!'
        ],
        mediatedPrompts: [
            'Breaking problems into parts you know!',
            'This is real mathematical thinking!',
            'You\'re solving hard problems with easy steps!'
        ]
    },
    {
        id: 9,
        name: 'Eights (×8)',
        description: 'Double, double, double!',
        research: 'Pattern recognition strengthens neural pathways',
        table: 8,
        range: [1, 10],
        showDerivation: true,
        derivationMethod: 'triple_double',
        questionsRequired: 20,
        hints: [
            '×8 = double × double × double',
            '8 × 7 = 2 × 2 × 2 × 7 = 2 × 2 × 14 = 2 × 28 = 56',
            'Or: ×8 = ×10 - ×2'
        ],
        mediatedPrompts: [
            'Triple double! Your doubling superpower!',
            'Or think: 10 groups minus 2 groups',
            'Multiple strategies = flexible brain!'
        ]
    },
    {
        id: 10,
        name: 'Nines (×9)',
        description: 'Ten minus one - the finger trick!',
        research: 'Multi-sensory approaches aid retention',
        table: 9,
        range: [1, 10],
        showDerivation: true,
        derivationMethod: 'ten_minus_one',
        showFingerTrick: true,
        questionsRequired: 20,
        hints: [
            '×9 = ×10 - one group',
            '9 × 6 = (10 × 6) - 6 = 60 - 6 = 54',
            'Finger trick: digits always add to 9!'
        ],
        mediatedPrompts: [
            'The 9s have amazing patterns!',
            'Digits always add up to 9!',
            'You\'ve learned all the single-digit tables!'
        ]
    },
    // PHASE 3: Mixed practice and fluency
    {
        id: 11,
        name: 'Mixed Practice - Easy',
        description: 'Practice 2s, 5s, and 10s together',
        research: 'Interleaved practice strengthens retrieval',
        tables: [2, 5, 10],
        range: [1, 10],
        mixed: true,
        questionsRequired: 25,
        hints: [
            'Which table is this from?',
            'Use your key facts!',
            'You know these - trust yourself!'
        ],
        mediatedPrompts: [
            'Mixing it up helps your brain get faster!',
            'You\'re building automatic recall!',
            'These are becoming second nature!'
        ]
    },
    {
        id: 12,
        name: 'Mixed Practice - All Tables',
        description: 'All tables 2-10 mixed together',
        research: 'Fluency through varied practice',
        tables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
        range: [1, 10],
        mixed: true,
        timed: true,
        questionsRequired: 30,
        hints: [
            'Think about which strategy to use',
            'Break it down if needed',
            'You have all the tools!'
        ],
        mediatedPrompts: [
            'You\'ve mastered multiplication!',
            'Your brain has built strong number pathways!',
            'You can solve any multiplication problem!'
        ]
    }
];

export const getLevel = (levelId) => {
    return levelsConfig.find(l => l.id === levelId) || levelsConfig[0];
};

export const generateQuestion = (levelConfig) => {
    let a, b;
    
    if (levelConfig.mixed && levelConfig.tables) {
        // Pick random table from the allowed tables
        const table = levelConfig.tables[Math.floor(Math.random() * levelConfig.tables.length)];
        a = table;
        b = Math.floor(Math.random() * (levelConfig.range[1] - levelConfig.range[0] + 1)) + levelConfig.range[0];
    } else {
        a = levelConfig.table;
        b = Math.floor(Math.random() * (levelConfig.range[1] - levelConfig.range[0] + 1)) + levelConfig.range[0];
    }
    
    // Randomly swap a and b for variety
    if (Math.random() > 0.5) {
        [a, b] = [b, a];
    }
    
    const correctAnswer = a * b;
    
    return {
        a,
        b,
        correctAnswer,
        prompt: `${a} × ${b} = ?`,
        showVisual: levelConfig.showVisual,
        showGroups: levelConfig.showGroups,
        showDerivation: levelConfig.showDerivation,
        derivationMethod: levelConfig.derivationMethod
    };
};

export const getHint = (levelConfig, hintIndex) => {
    const hints = levelConfig.hints || [];
    return hints[Math.min(hintIndex, hints.length - 1)] || 'Think about what you know!';
};

export const getMediatedPrompt = (levelConfig) => {
    const prompts = levelConfig.mediatedPrompts || [];
    return prompts[Math.floor(Math.random() * prompts.length)] || 'Great work!';
};

export const generateChoices = (correctAnswer, levelConfig) => {
    const choices = [correctAnswer];
    const range = levelConfig.table ? levelConfig.table * 2 : 10;
    
    while (choices.length < 4) {
        // Generate plausible wrong answers
        const offset = Math.floor(Math.random() * range) - range/2;
        const wrongAnswer = correctAnswer + offset;
        
        if (wrongAnswer > 0 && wrongAnswer !== correctAnswer && !choices.includes(wrongAnswer)) {
            choices.push(wrongAnswer);
        }
    }
    
    // Shuffle
    return choices.sort(() => Math.random() - 0.5);
};

export const getDerivationExplanation = (a, b, method) => {
    const result = a * b;
    
    switch (method) {
        case 'double_plus_one':
            // 3 × b = (2 × b) + b
            return `${a} × ${b} = (2 × ${b}) + ${b} = ${2 * b} + ${b} = ${result}`;
        case 'double_double':
            // 4 × b = 2 × (2 × b)
            return `${a} × ${b} = 2 × (2 × ${b}) = 2 × ${2 * b} = ${result}`;
        case 'five_plus_one':
            // 6 × b = (5 × b) + b
            return `${a} × ${b} = (5 × ${b}) + ${b} = ${5 * b} + ${b} = ${result}`;
        case 'five_plus_two':
            // 7 × b = (5 × b) + (2 × b)
            return `${a} × ${b} = (5 × ${b}) + (2 × ${b}) = ${5 * b} + ${2 * b} = ${result}`;
        case 'triple_double':
            // 8 × b = 2 × 2 × 2 × b
            return `${a} × ${b} = 2 × 2 × 2 × ${b} = 2 × 2 × ${2 * b} = 2 × ${4 * b} = ${result}`;
        case 'ten_minus_one':
            // 9 × b = (10 × b) - b
            return `${a} × ${b} = (10 × ${b}) - ${b} = ${10 * b} - ${b} = ${result}`;
        default:
            return `${a} × ${b} = ${result}`;
    }
};
