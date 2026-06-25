import { Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';
import { AppLanguage, LanguageService } from '../../../core/services/language.service';

const WORDS: Record<AppLanguage, string[]> = {
  en: ['ANGULAR', 'TYPESCRIPT', 'BOOTSTRAP', 'COMPONENT', 'SIGNALS'],
  mk: ['АНГУЛАР', 'КОМПОНЕНТА', 'ПРОЕКТ', 'ТАСТАТУРА', 'СОСТОЈБА']
};
const ALPHABETS: Record<AppLanguage, string[]> = {
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  mk: 'АБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШ'.split('')
};
const MAX_WRONG_GUESSES = 6;

@Component({
  selector: 'app-hang-man',
  standalone: true,
  imports: [Dialog, TranslatePipe],
  templateUrl: './hang-man.component.html',
  styleUrl: './hang-man.component.scss'
})
export class HangManComponent implements OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly unregisterLanguageGuard = this.languageService.registerLanguageChangeGuard((language) =>
    this.handleLanguageChangeRequest(language)
  );
  private readonly wordIndexes: Record<AppLanguage, number> = { en: 1, mk: 1 };

  readonly maxWrongGuesses = MAX_WRONG_GUESSES;
  readonly pendingLanguage = signal<AppLanguage | null>(null);
  readonly languageConfirmVisible = signal(false);
  readonly newWordConfirmVisible = signal(false);
  readonly resultDialogVisible = signal(false);
  readonly currentLanguage = this.languageService.activeLanguage;
  readonly currentWord = signal(this.wordsForCurrentLanguage()[0]);
  readonly guessedLetters = signal<string[]>([]);

  readonly alphabet = computed(() => ALPHABETS[this.currentLanguage()]);

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

  ngOnDestroy(): void {
    this.unregisterLanguageGuard();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    const letter = event.key.toUpperCase();

    if (this.alphabet().includes(letter)) {
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

    if (this.hasWon() || this.hasLost()) {
      this.resultDialogVisible.set(true);
    }
  }

  requestNewWord(): void {
    if (this.guessedLetters().length > 0 && !this.isGameOver()) {
      this.newWordConfirmVisible.set(true);
      return;
    }

    this.startNextWord();
  }

  startNextWord(): void {
    const language = this.currentLanguage();
    const words = this.wordsForCurrentLanguage();
    const nextWordIndex = this.wordIndexes[language];

    this.currentWord.set(words[nextWordIndex]);
    this.wordIndexes[language] = (nextWordIndex + 1) % words.length;
    this.guessedLetters.set([]);
    this.newWordConfirmVisible.set(false);
    this.resultDialogVisible.set(false);
  }

  resetGame(): void {
    this.startNextWord();
  }

  cancelNewWord(): void {
    this.newWordConfirmVisible.set(false);
  }

  confirmLanguageChange(): void {
    const language = this.pendingLanguage();

    this.pendingLanguage.set(null);
    this.languageConfirmVisible.set(false);

    if (!language) {
      return;
    }

    this.languageService.setLanguage(language, true);
    this.currentWord.set(this.wordsForCurrentLanguage()[0]);
    this.wordIndexes[language] = 1;
    this.guessedLetters.set([]);
  }

  cancelLanguageChange(): void {
    this.pendingLanguage.set(null);
    this.languageConfirmVisible.set(false);
  }

  isCorrectGuess(letter: string): boolean {
    return this.guessedLetters().includes(letter) && this.currentWord().includes(letter);
  }

  isWrongGuess(letter: string): boolean {
    return this.guessedLetters().includes(letter) && !this.currentWord().includes(letter);
  }

  private handleLanguageChangeRequest(language: AppLanguage): boolean {
    if (this.guessedLetters().length === 0 || this.isGameOver()) {
      this.languageService.setLanguage(language, true);
      this.currentWord.set(this.wordsForCurrentLanguage()[0]);
      this.wordIndexes[language] = 1;
      this.guessedLetters.set([]);
      return false;
    }

    this.pendingLanguage.set(language);
    this.languageConfirmVisible.set(true);
    return false;
  }

  private wordsForCurrentLanguage(): string[] {
    return WORDS[this.currentLanguage()];
  }
}
