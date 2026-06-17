import { Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type Player = 'X' | 'O';
type CellValue = Player | null;

interface WinningLine {
  cells: [number, number, number];
  player: Player;
}

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
  imports: [TranslatePipe],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.scss'
})
export class TicTacToeComponent {
  readonly board = signal<CellValue[]>(this.createEmptyBoard());
  readonly currentPlayer = signal<Player>('X');

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

    if (!this.isGameOver()) {
      this.currentPlayer.set(this.currentPlayer() === 'X' ? 'O' : 'X');
    }
  }

  resetGame(): void {
    this.board.set(this.createEmptyBoard());
    this.currentPlayer.set('X');
  }

  isWinningCell(index: number): boolean {
    return this.winningLine()?.cells.includes(index) ?? false;
  }

  private createEmptyBoard(): CellValue[] {
    return Array<CellValue>(9).fill(null);
  }
}
