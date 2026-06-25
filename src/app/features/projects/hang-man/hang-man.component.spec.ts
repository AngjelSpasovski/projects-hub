import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

import { HangManComponent } from './hang-man.component';

describe('HangManComponent', () => {
  let component: HangManComponent;
  let fixture: ComponentFixture<HangManComponent>;
  let languageService: LanguageService;

  beforeEach(async () => {
    localStorage.setItem('projects-hub-language', 'en');

    await TestBed.configureTestingModule({
      imports: [HangManComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(HangManComponent);
    component = fixture.componentInstance;
    languageService = TestBed.inject(LanguageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reveal correct guessed letters', () => {
    component.guessLetter('A');

    expect(component.maskedWord()[0]).toBe('A');
    expect(component.isCorrectGuess('A')).toBeTrue();
  });

  it('should track wrong guesses', () => {
    component.guessLetter('Z');

    expect(component.wrongGuesses()).toEqual(['Z']);
    expect(component.remainingGuesses()).toBe(5);
    expect(component.isWrongGuess('Z')).toBeTrue();
  });

  it('should ignore duplicate guesses', () => {
    component.guessLetter('Z');
    component.guessLetter('Z');

    expect(component.guessedLetters()).toEqual(['Z']);
  });

  it('should detect a win', () => {
    ['A', 'N', 'G', 'U', 'L', 'R'].forEach((letter) => component.guessLetter(letter));

    expect(component.hasWon()).toBeTrue();
    expect(component.isGameOver()).toBeTrue();
    expect(component.resultDialogVisible()).toBeTrue();
  });

  it('should detect a loss', () => {
    ['B', 'C', 'D', 'E', 'F', 'H'].forEach((letter) => component.guessLetter(letter));

    expect(component.hasLost()).toBeTrue();
    expect(component.isGameOver()).toBeTrue();
    expect(component.resultDialogVisible()).toBeTrue();
  });

  it('should reset with a new word and clear guesses', () => {
    component.guessLetter('A');

    component.resetGame();

    expect(component.currentWord()).toBe('TYPESCRIPT');
    expect(component.guessedLetters()).toEqual([]);
  });

  it('should confirm before replacing an unfinished word', () => {
    component.guessLetter('A');

    component.requestNewWord();

    expect(component.newWordConfirmVisible()).toBeTrue();
    expect(component.currentWord()).toBe('ANGULAR');

    component.cancelNewWord();

    expect(component.newWordConfirmVisible()).toBeFalse();

    component.requestNewWord();
    component.startNextWord();

    expect(component.currentWord()).toBe('TYPESCRIPT');
    expect(component.guessedLetters()).toEqual([]);
    expect(component.newWordConfirmVisible()).toBeFalse();
  });

  it('should start a new word without confirmation after a completed round', () => {
    ['A', 'N', 'G', 'U', 'L', 'R'].forEach((letter) => component.guessLetter(letter));

    component.requestNewWord();

    expect(component.currentWord()).toBe('TYPESCRIPT');
    expect(component.newWordConfirmVisible()).toBeFalse();
    expect(component.resultDialogVisible()).toBeFalse();
  });

  it('should use Macedonian words and alphabet after confirmed language change', () => {
    component.guessLetter('A');

    const changed = languageService.setLanguage('mk');

    expect(changed).toBeFalse();
    expect(component.languageConfirmVisible()).toBeTrue();

    component.confirmLanguageChange();

    expect(languageService.activeLanguage()).toBe('mk');
    expect(component.currentWord()).toBe('АНГУЛАР');
    expect(component.alphabet()).toContain('Ѓ');
    expect(component.guessedLetters()).toEqual([]);
  });
});
