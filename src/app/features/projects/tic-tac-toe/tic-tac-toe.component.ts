import { Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';

type Player = 'X' | 'O';
type CellValue = Player | null;

interface WinningLine {
  cells: [number, number, number];
  player: Player;
}

interface MatchScore {
  X: number;
  O: number;
  draws: number;
}

const TARGET_SCORE = 10;
const WINNING_LINES: Array<[number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [Dialog, TranslatePipe],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.scss'
})
export class TicTacToeComponent {
  readonly board = signal<CellValue[]>(this.createEmptyBoard());
  readonly currentPlayer = signal<Player>('X');
  readonly score = signal<MatchScore>({ X: 0, O: 0, draws: 0 });
  readonly matchWinner = signal<Player | null>(null);
  readonly targetScore = TARGET_SCORE;

  readonly winningLine = computed<WinningLine | null>(() => {
    const board = this.board();

    for (const cells of WINNING_LINES) {
      const [first, second, third] = cells;
      const player = board[first];

      if (player && player === board[second] && player === board[third]) {
        return { cells, player };
      }
    }

    return null;
  });

  readonly isDraw = computed(() => !this.winningLine() && this.board().every(Boolean));
  readonly isGameOver = computed(() => Boolean(this.winningLine()) || this.isDraw());

  play(index: number): void {
    if (this.board()[index] || this.isGameOver()) {
      return;
    }

    const nextBoard = [...this.board()];
    nextBoard[index] = this.currentPlayer();
    this.board.set(nextBoard);

    const winningLine = this.winningLine();

    if (winningLine) {
      this.addWin(winningLine.player);
      return;
    }

    if (this.isDraw()) {
      this.score.update((score) => ({ ...score, draws: score.draws + 1 }));
      return;
    }

    if (!this.isGameOver()) {
      this.currentPlayer.set(this.currentPlayer() === 'X' ? 'O' : 'X');
    }
  }

  resetGame(): void {
    this.board.set(this.createEmptyBoard());
    this.currentPlayer.set('X');
  }

  resetScore(): void {
    this.score.set({ X: 0, O: 0, draws: 0 });
    this.matchWinner.set(null);
    this.resetGame();
  }

  isWinningCell(index: number): boolean {
    return this.winningLine()?.cells.includes(index) ?? false;
  }

  private createEmptyBoard(): CellValue[] {
    return Array<CellValue>(9).fill(null);
  }

  private addWin(player: Player): void {
    const nextScore = {
      ...this.score(),
      [player]: this.score()[player] + 1
    };

    this.score.set(nextScore);

    if (nextScore[player] >= TARGET_SCORE) {
      this.matchWinner.set(player);
    }
  }
}
