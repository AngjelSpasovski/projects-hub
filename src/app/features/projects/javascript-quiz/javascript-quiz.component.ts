import { Component, OnDestroy, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  JAVASCRIPT_QUIZ_QUESTIONS,
  QUIZ_SESSION_SIZE,
  QuizQuestion,
  createQuizSession
} from './javascript-quiz.data';

type QuizPhase = 'intro' | 'playing' | 'results' | 'review';

const QUESTION_TIME_SECONDS = 20;

@Component({
  selector: 'app-javascript-quiz',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './javascript-quiz.component.html',
  styleUrl: './javascript-quiz.component.scss'
})
export class JavaScriptQuizComponent implements OnDestroy {
  readonly questionCount = QUIZ_SESSION_SIZE;
  readonly questionBankSize = JAVASCRIPT_QUIZ_QUESTIONS.length;
  readonly questions = signal(createQuizSession());
  readonly questionTime = QUESTION_TIME_SECONDS;
  readonly phase = signal<QuizPhase>('intro');
  readonly currentIndex = signal(0);
  readonly answers = signal<Array<number | null>>(this.emptyAnswers());
  readonly secondsRemaining = signal(QUESTION_TIME_SECONDS);

  private timerId: ReturnType<typeof setInterval> | null = null;

  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()]);
  readonly currentAnswer = computed(() => this.answers()[this.currentIndex()]);
  readonly progress = computed(() => ((this.currentIndex() + 1) / this.questions().length) * 100);
  readonly score = computed(() =>
    this.questions().reduce(
      (total, question, index) => total + (this.answers()[index] === question.correctOption ? 1 : 0),
      0
    )
  );
  readonly scorePercentage = computed(() => Math.round((this.score() / this.questions().length) * 100));

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startQuiz(): void {
    this.questions.set(createQuizSession());
    this.answers.set(this.emptyAnswers());
    this.currentIndex.set(0);
    this.phase.set('playing');
    this.resetTimer();
  }

  selectAnswer(optionIndex: number): void {
    if (this.phase() !== 'playing') {
      return;
    }

    const nextAnswers = [...this.answers()];
    nextAnswers[this.currentIndex()] = optionIndex;
    this.answers.set(nextAnswers);
  }

  nextQuestion(): void {
    if (this.currentAnswer() === null) {
      return;
    }

    this.advanceQuestion();
  }

  showReview(): void {
    this.phase.set('review');
  }

  showResults(): void {
    this.phase.set('results');
  }

  isCorrect(question: QuizQuestion, questionIndex: number): boolean {
    return this.answers()[questionIndex] === question.correctOption;
  }

  selectedAnswerKey(question: QuizQuestion, questionIndex: number): string | null {
    const answer = this.answers()[questionIndex];
    return answer === null ? null : question.optionKeys[answer];
  }

  private advanceQuestion(): void {
    if (this.currentIndex() === this.questions().length - 1) {
      this.stopTimer();
      this.phase.set('results');
      return;
    }

    this.currentIndex.update((index) => index + 1);
    this.resetTimer();
  }

  private resetTimer(): void {
    this.stopTimer();
    this.secondsRemaining.set(QUESTION_TIME_SECONDS);
    this.timerId = setInterval(() => {
      if (this.secondsRemaining() <= 1) {
        this.secondsRemaining.set(0);
        this.advanceQuestion();
        return;
      }

      this.secondsRemaining.update((seconds) => seconds - 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private emptyAnswers(): Array<number | null> {
    return Array.from({ length: this.questions().length }, () => null);
  }
}
