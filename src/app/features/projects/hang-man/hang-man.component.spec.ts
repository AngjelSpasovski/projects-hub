import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { HangManComponent } from './hang-man.component';

describe('HangManComponent', () => {
  let component: HangManComponent;
  let fixture: ComponentFixture<HangManComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangManComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(HangManComponent);
    component = fixture.componentInstance;
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
  });

  it('should detect a loss', () => {
    ['B', 'C', 'D', 'E', 'F', 'H'].forEach((letter) => component.guessLetter(letter));

    expect(component.hasLost()).toBeTrue();
    expect(component.isGameOver()).toBeTrue();
  });

  it('should reset with a new word and clear guesses', () => {
    component.guessLetter('A');

    component.resetGame();

    expect(component.currentWord()).toBe('TYPESCRIPT');
    expect(component.guessedLetters()).toEqual([]);
  });
});
