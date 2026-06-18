import { Component, HostListener, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const WORDS = ['ANGULAR', 'TYPESCRIPT', 'BOOTSTRAP', 'COMPONENT', 'SIGNALS'];
const MAX_WRONG_GUESSES = 6;

@Component({
  selector: 'app-hang-man',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './hang-man.component.html',
  styleUrl: './hang-man.component.scss'
})
export class HangManComponent {
  readonly alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  readonly maxWrongGuesses = MAX_WRONG_GUESSES;
  readonly currentWord = signal(WORDS[0]);
  readonly guessedLetters = signal<string[]>([]);

  private nextWordIndex = 1;

  readonly wrongGuesses = computed(() =>
    this.guessedLetters().filter((letter) => !this.currentWord().includes(letter))
  );

  readonly maskedWord = computed(() =>
    this.currentWord()
      .split('')
      .map((letter) => (this.guessedLetters().includes(letter) ? letter : null))
  );

  readonly hasWon = computed(() => this.maskedWord().every(Boolean));
  readonly hasLost = computed(() => this.wrongGuesses().length >= MAX_WRONG_GUESSES);
  readonly isGameOver = computed(() => this.hasWon() || this.hasLost());
  readonly remainingGuesses = computed(() => MAX_WRONG_GUESSES - this.wrongGuesses().length);

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    const letter = event.key.toUpperCase();

    if (/^[A-Z]$/.test(letter)) {
      event.preventDefault();
      this.guessLetter(letter);
    }
  }

  guessLetter(letter: string): void {
    const normalizedLetter = letter.toUpperCase();

    if (this.isGameOver() || this.guessedLetters().includes(normalizedLetter)) {
      return;
    }

    this.guessedLetters.set([...this.guessedLetters(), normalizedLetter]);
  }

  resetGame(): void {
    this.currentWord.set(WORDS[this.nextWordIndex]);
    this.nextWordIndex = (this.nextWordIndex + 1) % WORDS.length;
    this.guessedLetters.set([]);
  }

  isCorrectGuess(letter: string): boolean {
    return this.guessedLetters().includes(letter) && this.currentWord().includes(letter);
  }

  isWrongGuess(letter: string): boolean {
    return this.guessedLetters().includes(letter) && !this.currentWord().includes(letter);
  }
}
