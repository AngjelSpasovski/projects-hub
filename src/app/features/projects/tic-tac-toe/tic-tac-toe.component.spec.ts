import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { TicTacToeComponent } from './tic-tac-toe.component';

describe('TicTacToeComponent', () => {
  let component: TicTacToeComponent;
  let fixture: ComponentFixture<TicTacToeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicTacToeComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should alternate players after valid moves', () => {
    component.play(0);
    component.play(1);

    expect(component.board()[0]).toBe('X');
    expect(component.board()[1]).toBe('O');
    expect(component.currentPlayer()).toBe('X');
  });

  it('should not overwrite a selected cell', () => {
    component.play(0);
    component.play(0);

    expect(component.board()[0]).toBe('X');
    expect(component.currentPlayer()).toBe('O');
  });

  it('should detect a winning line', () => {
    component.play(0);
    component.play(3);
    component.play(1);
    component.play(4);
    component.play(2);

    expect(component.winningLine()?.player).toBe('X');
    expect(component.isWinningCell(1)).toBeTrue();
    expect(component.isGameOver()).toBeTrue();
  });

  it('should detect a draw', () => {
    [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach((cell) => component.play(cell));

    expect(component.isDraw()).toBeTrue();
    expect(component.isGameOver()).toBeTrue();
  });

  it('should reset the board', () => {
    component.play(0);

    component.resetGame();

    expect(component.board().every((cell) => cell === null)).toBeTrue();
    expect(component.currentPlayer()).toBe('X');
  });
});
