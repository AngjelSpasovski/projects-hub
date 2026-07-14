import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'mixed';
type Difficulty = 'easy' | 'standard' | 'challenge';
type Feedback = 'idle' | 'correct' | 'wrong';

interface OperationOption {
  id: Operation;
  icon: string;
  labelKey: string;
}

interface DifficultyOption {
  id: Difficulty;
  labelKey: string;
  max: number;
}

interface Problem {
  left: number;
  right: number;
  operator: '+' | '-' | 'x';
  answer: number;
}

const OPERATIONS: OperationOption[] = [
  { id: 'addition', icon: '+', labelKey: 'MATH_4_KIDS.OPERATIONS.ADDITION' },
  { id: 'subtraction', icon: '-', labelKey: 'MATH_4_KIDS.OPERATIONS.SUBTRACTION' },
  { id: 'multiplication', icon: 'x', labelKey: 'MATH_4_KIDS.OPERATIONS.MULTIPLICATION' },
  { id: 'mixed', icon: '?', labelKey: 'MATH_4_KIDS.OPERATIONS.MIXED' }
];

const DIFFICULTIES: DifficultyOption[] = [
  { id: 'easy', labelKey: 'MATH_4_KIDS.DIFFICULTY.EASY', max: 10 },
  { id: 'standard', labelKey: 'MATH_4_KIDS.DIFFICULTY.STANDARD', max: 20 },
  { id: 'challenge', labelKey: 'MATH_4_KIDS.DIFFICULTY.CHALLENGE', max: 50 }
];

@Component({
  selector: 'app-math-4-kids',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './math-4-kids.component.html',
  styleUrl: './math-4-kids.component.scss'
})
export class Math4KidsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private timerId: ReturnType<typeof setInterval> | null = null;

  readonly operations = OPERATIONS;
  readonly difficulties = DIFFICULTIES;
  readonly operation = signal<Operation>('addition');
  readonly difficulty = signal<Difficulty>('easy');
  readonly round = signal(1);
  readonly problem = signal<Problem>(this.createProblem('addition', 'easy', 1));
  readonly answerInput = signal('');
  readonly score = signal(0);
  readonly attempts = signal(0);
  readonly streak = signal(0);
  readonly bestStreak = signal(0);
  readonly seconds = signal(0);
  readonly feedback = signal<Feedback>('idle');
  readonly lastAnswer = signal<number | null>(null);

  readonly accuracy = computed(() => {
    const attempts = this.attempts();
    return attempts === 0 ? '100%' : `${Math.round((this.score() / attempts) * 100)}%`;
  });
  readonly displayTime = computed(() => this.formatTime(this.seconds()));
  readonly canSubmit = computed(() => this.answerInput().trim().length > 0);

  constructor() {
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  selectOperation(operation: Operation): void {
    this.operation.set(operation);
    this.restart();
  }

  selectDifficulty(difficulty: Difficulty): void {
    this.difficulty.set(difficulty);
    this.restart();
  }

  updateAnswer(value: string): void {
    this.answerInput.set(value.replace(/[^\d-]/g, '').slice(0, 4));
  }

  submitAnswer(): void {
    const answer = Number(this.answerInput());

    if (!this.canSubmit() || Number.isNaN(answer)) {
      return;
    }

    this.startTimer();
    this.attempts.update((attempts) => attempts + 1);
    this.lastAnswer.set(this.problem().answer);

    if (answer === this.problem().answer) {
      this.score.update((score) => score + 1);
      this.streak.update((streak) => streak + 1);
      this.bestStreak.update((best) => Math.max(best, this.streak()));
      this.feedback.set('correct');
      this.nextProblem();
      return;
    }

    this.streak.set(0);
    this.feedback.set('wrong');
    this.answerInput.set('');
  }

  skipProblem(): void {
    this.lastAnswer.set(this.problem().answer);
    this.streak.set(0);
    this.feedback.set('wrong');
    this.nextProblem();
  }

  restart(): void {
    this.round.set(1);
    this.problem.set(this.createProblem(this.operation(), this.difficulty(), 1));
    this.answerInput.set('');
    this.score.set(0);
    this.attempts.set(0);
    this.streak.set(0);
    this.bestStreak.set(0);
    this.seconds.set(0);
    this.feedback.set('idle');
    this.lastAnswer.set(null);
    this.stopTimer();
  }

  private nextProblem(): void {
    const nextRound = this.round() + 1;
    this.round.set(nextRound);
    this.problem.set(this.createProblem(this.operation(), this.difficulty(), nextRound));
    this.answerInput.set('');
  }

  private createProblem(operation: Operation, difficulty: Difficulty, round: number): Problem {
    const max = this.difficultyOption(difficulty).max;
    const selectedOperation = operation === 'mixed' ? this.mixedOperation(round) : operation;
    const left = this.seededNumber(round, max, 3);
    const right = this.seededNumber(round, max, 11);

    if (selectedOperation === 'subtraction') {
      const larger = Math.max(left, right);
      const smaller = Math.min(left, right);
      return { left: larger, right: smaller, operator: '-', answer: larger - smaller };
    }

    if (selectedOperation === 'multiplication') {
      const multiplicationMax = difficulty === 'challenge' ? 12 : difficulty === 'standard' ? 10 : 5;
      const first = this.seededNumber(round, multiplicationMax, 5);
      const second = this.seededNumber(round, multiplicationMax, 17);
      return { left: first, right: second, operator: 'x', answer: first * second };
    }

    return { left, right, operator: '+', answer: left + right };
  }

  private seededNumber(round: number, max: number, offset: number): number {
    return ((round * 37 + offset * 19) % max) + 1;
  }

  private mixedOperation(round: number): Exclude<Operation, 'mixed'> {
    const operations: Exclude<Operation, 'mixed'>[] = ['addition', 'subtraction', 'multiplication'];
    return operations[round % operations.length];
  }

  private difficultyOption(difficulty = this.difficulty()): DifficultyOption {
    return DIFFICULTIES.find((option) => option.id === difficulty) ?? DIFFICULTIES[0];
  }

  private startTimer(): void {
    if (this.timerId) {
      return;
    }

    this.timerId = setInterval(() => this.seconds.update((seconds) => seconds + 1), 1000);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
