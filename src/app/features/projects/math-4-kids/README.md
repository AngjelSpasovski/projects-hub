# Math 4 Kids

Math 4 Kids is a small arithmetic practice game for the Projects Hub portfolio.

## Features

- Addition, subtraction, multiplication, and mixed operation modes.
- Easy, standard, and challenge difficulty ranges.
- Answer validation with correct and wrong feedback.
- Score, attempts, streak, best streak, accuracy, and elapsed timer.
- Restart flow that resets the learning session.

## Architecture

- Standalone Angular component with signal-based state.
- Deterministic problem generation for stable tests.
- All visible labels are translated through `en.json` and `mk.json`.

## Future Work

- Add sound-free celebration animations with reduced-motion support.
- Add session goal selection, such as 10-question rounds.
- Persist best score locally if the portfolio needs progress history.
