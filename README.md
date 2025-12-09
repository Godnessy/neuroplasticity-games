# Neuroplasticity Games

Educational games for children ages 6-14 with learning difficulties, built on neuroplasticity research.

## 🚀 Quick Start

```bash
cd neuroplasticity-game-center && npm install && npm run dev
```

Then open the URL shown in your terminal (usually `http://localhost:5173`) - the home screen lets you choose between games.

## 🎮 Games

### 🕐 ClockWise
**Skill**: Time Reading | **Levels**: 14

Progressive clock reading from single hour hand to 24-hour time:

| Level | Name | Description |
|-------|------|-------------|
| 1 | Hour Hand - Cardinal | Read hour hand at 12, 3, 6, 9 |
| 2 | Hour Hand - All | Read hour hand at any position |
| 3 | Two Hands - On the Hour | Both hands, :00 times |
| 4 | Half Past | :30 times |
| 5 | Quarter Hours | :15 and :45 |
| 6 | Five-Minute Intervals | :05, :10, :20, etc. |
| 7 | Any Minute | Precise minute reading |
| 8 | 24-Hour Introduction (PM) | Afternoon times in 24h format |
| 9 | Mixed 12/24 Hour | Convert between formats (5-min intervals) |
| 10 | Any Minute 12/24 Hour | Any minute, both formats |
| 11 | No Numbers - 24 Hour | Read without number guides |
| 12 | Real-World Applications | Schedules and timetables |
| 13 | Time Calculations | Add/subtract time |
| 14 | 24-Hour Time Master | Full mastery |

### ✖️ MultiplyMaster
**Skill**: Multiplication | **Levels**: 12

Learn multiplication through understanding, not memorization:

| Level | Name | Strategy |
|-------|------|----------|
| 1 | What is Multiplication? | Visual groups (2× table, 1-5) |
| 2 | Doubles (×2) | Full 2× table |
| 3 | Tens (×10) | Add zero pattern |
| 4 | Fives (×5) | Half of tens |
| 5 | Threes (×3) | ×2 + one more group |
| 6 | Fours (×4) | Double the double |
| 7 | Sixes (×6) | ×5 + one more group |
| 8 | Sevens (×7) | ×5 + ×2 |
| 9 | Eights (×8) | Triple double |
| 10 | Nines (×9) | ×10 - one group |
| 11 | Mixed Easy | 2s, 5s, 10s combined |
| 12 | Mixed All | All tables combined |

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
├── neuroplasticity-game-center/   # Main unified app
│   ├── src/
│   │   ├── components/shared/     # RobuxCounter, Header, Home, FeedbackModal
│   │   ├── games/
│   │   │   ├── clockwise/         # Clock reading game
│   │   │   │   ├── Clock.jsx
│   │   │   │   ├── TimeLegend.jsx
│   │   │   │   └── screens/       # Welcome, Game, LevelComplete, etc.
│   │   │   └── multiply/          # Multiplication game
│   │   │       ├── MultiplicationLegend.jsx
│   │   │       ├── VisualMultiplication.jsx
│   │   │       └── screens/
│   │   ├── hooks/                 # useGameState (shared game logic)
│   │   └── utils/                 # levels, storage, clock, adaptive
│   └── public/images/             # FNAF characters, Robux icon
├── _archive/                      # Old standalone versions (reference only)
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
