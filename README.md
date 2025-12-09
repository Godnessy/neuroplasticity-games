# Neuroplasticity Games

Educational games for children ages 6-14 with learning difficulties, built on neuroplasticity research.

## 🚀 Quick Start

```bash
cd clockwise-react && npm install && npm run dev
```

Then open `http://localhost:5173` - the home screen lets you choose between games.

## 🎮 Games

### 🕐 ClockWise
**Skill**: Time Reading | **Levels**: 12

Progressive clock reading from single hour hand to 24-hour time:
1. Hour hand at cardinal positions (12, 3, 6, 9)
2. Hour hand at all positions
3. Two hands - on the hour
4. Half past times (:30)
5. Quarter hours (:15, :45)
6. Five-minute intervals
7. Any minute
8. Digital time matching
9. Time word problems
10. Elapsed time
11. 24-hour introduction
12. Full 24-hour mastery

### ✖️ MultiplyMaster
**Skill**: Multiplication | **Levels**: 12

Learn multiplication through understanding, not memorization:
1. What is multiplication? (visual groups)
2. Doubles (×2)
3. Tens (×10) - just add zero
4. Fives (×5) - half of tens
5. Threes (×3) - double plus one
6. Fours (×4) - double the double
7. Sixes (×6) - five plus one
8. Sevens (×7) - five plus two
9. Eights (×8) - triple double
10. Nines (×9) - ten minus one
11. Mixed practice (easy)
12. Mixed practice (all tables)

## 🧠 Scientific Foundation

### Dr. Michael Merzenich (Brain Plasticity Pioneer)
- **Principle**: The brain builds "skill upon skill, ability upon ability"
- **Application**: Progressive levels where each skill builds on the previous
- **Key insight**: Reducing cognitive noise through clear, focused exercises

### Dr. Edward Taub (Constraint-Induced Therapy)
- **Principle**: Intensive, repetitive practice drives neuroplastic change
- **Application**: High repetition with immediate feedback
- **Key insight**: The brain adapts when given focused, consistent practice

### Barbara Arrowsmith-Young (Arrowsmith School)
- **Principle**: Targeted cognitive exercises strengthen specific brain functions
- **Application**: Each game targets specific skills (spatial reasoning, number sense)
- **Key insight**: "The brain can change" - learning difficulties aren't permanent

### Dyscalculia Research
- **Principle**: Reduce memory demands; focus on "key facts"
- **Application**: Teach patterns (2x, 5x, 10x) then derive others
- **Key insight**: Understanding beats memorization

## 🎯 Core Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Small Steps** | Break skills into tiny progressions |
| **High Repetition** | Many easy reps build neural pathways |
| **Constant Support** | Legends and hints always visible |
| **Immediate Feedback** | Know instantly if correct |
| **Adaptive Difficulty** | Adjust based on performance |
| **Engagement** | FNAF characters, Robux rewards |

## 💎 Robux Reward System

Children earn **1 Robux per minute** of play time. This shared currency works across all games and is displayed in the Game Hub. The gamification increases engagement while learning happens through repetition.

## 📁 Project Structure

```
neuroplasticity-games/
├── game-hub/            # Main launcher with game selection
│   └── src/
│       ├── components/  # FloatingShapes, GameCard, RobuxDisplay
│       └── utils/       # Shared storage for Robux
├── clockwise-react/     # Clock reading game
│   └── src/
│       ├── components/  # Clock, TimeLegend, screens/
│       ├── hooks/       # useGameState
│       └── utils/       # levels, storage, clock, adaptive
├── multiply-master/     # Multiplication game
│   └── src/
│       ├── components/  # VisualMultiplication, Legend, screens/
│       ├── hooks/       # useGameState
│       └── utils/       # levels, storage
└── README.md
```

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: CSS with CSS Variables (theming)
- **State**: useReducer + custom hooks
- **Storage**: LocalStorage for progress/settings
- **Fonts**: Lexend, OpenDyslexic (accessibility)

## 🎨 Accessibility Features

- **Font Options**: Lexend (default), OpenDyslexic
- **Text Sizes**: Normal, Large, Extra Large
- **High Contrast Mode**: Enhanced visibility
- **Multiple Input Methods**: Text, visual selection, multiple choice
- **Audio Instructions**: Optional TTS support

## 📚 Research References

- Merzenich, M. - "Soft-Wired: How the New Science of Brain Plasticity Can Change Your Life"
- Arrowsmith-Young, B. - "The Woman Who Changed Her Brain"
- Emerson, J. & Babtie, P. - "The Dyscalculia Solution"
- Taub, E. - Constraint-Induced Movement Therapy research
