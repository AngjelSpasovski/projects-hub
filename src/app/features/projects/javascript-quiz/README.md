# JavaScript Quiz

## Goal

Turn the reviewed JavaScript interview notes in `JavaScript Materials for Quizz` into a focused, safe, and testable Angular quiz rather than executing legacy snippets.

## Features

- Six random questions per round from a reviewed bank of 26
- Randomized answer positions on every start
- Twenty-second timer per question
- Progress indicator and unanswered timeout handling
- Score and percentage summary
- Answer review with correct answers and explanations
- Restart flow

## Angular Concepts

- Standalone component
- Typed immutable question data
- Signals and computed score/progress state
- Timer cleanup through `OnDestroy`
- Template control flow and translated data keys

## Question Bank

The typed bank covers fundamentals, arrays, functions, ES6, objects, prototypes, scope, hoisting, and strict mode from `JavaScript Materials for Quizz`. It stays separate from component state so additional reviewed questions can be added without changing quiz behavior.

## Future Work

- Add categories and difficulty levels.
- Add categories, difficulty-balanced sessions, and LocalStorage score history.
- Expand the bank only after each source question is technically reviewed.
