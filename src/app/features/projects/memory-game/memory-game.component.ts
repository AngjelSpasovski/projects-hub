import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type Difficulty = 'easy' | 'standard' | 'hard';
type GameStatus = 'ready' | 'playing' | 'complete';

interface DifficultyOption {
  id: Difficulty;
  labelKey: string;
  pairs: number;
}

interface CardTemplate {
  pairId: string;
  icon: string;
}

interface MemoryCard extends CardTemplate {
  id: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const DIFFICULTIES: DifficultyOption[] = [
  { id: 'easy', labelKey: 'MEMORY_GAME.DIFFICULTY.EASY', pairs: 6 },
  { id: 'standard', labelKey: 'MEMORY_GAME.DIFFICULTY.STANDARD', pairs: 8 },
  { id: 'hard', labelKey: 'MEMORY_GAME.DIFFICULTY.HARD', pairs: 10 }
];

const CARD_TEMPLATES: CardTemplate[] = [
  { pairId: 'angular', icon: 'A' },
  { pairId: 'typescript', icon: 'TS' },
  { pairId: 'forms', icon: 'FM' },
  { pairId: 'signals', icon: 'SG' },
  { pairId: 'routes', icon: 'RT' },
  { pairId: 'tests', icon: 'QA' },
  { pairId: 'themes', icon: 'TH' },
  { pairId: 'docs', icon: 'DC' },
  { pairId: 'api', icon: 'API' },
  { pairId: 'state', icon: 'ST' }
];

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.scss'
})
export class MemoryGameComponent {
  private readonly destroyRef = inject(DestroyRef);
  private timerId: ReturnType<typeof setInterval> | null = null;

  readonly difficulties = DIFFICULTIES;
  readonly difficulty = signal<Difficulty>('standard');
  readonly round = signal(1);
  readonly cards = signal<MemoryCard[]>(this.createCards('standard', 1));
  readonly selectedIds = signal<string[]>([]);
  readonly moves = signal(0);
  readonly seconds = signal(0);
  readonly status = signal<GameStatus>('ready');
  readonly isChecking = signal(false);

  readonly pairCount = computed(() => this.difficultyOption().pairs);
  readonly matchedPairs = computed(() => this.cards().filter((card) => card.isMatched).length / 2);
  readonly remainingPairs = computed(() => this.pairCount() - this.matchedPairs());
  readonly isComplete = computed(() => this.status() === 'complete');
  readonly accuracy = computed(() => {
    const moves = this.moves();
    return moves === 0 ? '100%' : `${Math.round((this.matchedPairs() / moves) * 100)}%`;
  });
  readonly displayTime = computed(() => this.formatTime(this.seconds()));

  constructor() {
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  selectDifficulty(difficulty: Difficulty): void {
    this.difficulty.set(difficulty);
    this.newRound();
  }

  flipCard(cardId: string): void {
    const card = this.cards().find((candidate) => candidate.id === cardId);

    if (!card || card.isFlipped || card.isMatched || this.isChecking() || this.isComplete()) {
      return;
    }

    if (this.status() === 'ready') {
      this.status.set('playing');
      this.startTimer();
    }

    this.cards.update((cards) =>
      cards.map((candidate) => (candidate.id === cardId ? { ...candidate, isFlipped: true } : candidate))
    );
    this.selectedIds.update((ids) => [...ids, cardId]);

    if (this.selectedIds().length === 2) {
      this.moves.update((moves) => moves + 1);
      this.resolveSelection();
    }
  }

  newRound(): void {
    const nextRound = this.round() + 1;
    this.round.set(nextRound);
    this.cards.set(this.createCards(this.difficulty(), nextRound));
    this.selectedIds.set([]);
    this.moves.set(0);
    this.seconds.set(0);
    this.status.set('ready');
    this.isChecking.set(false);
    this.stopTimer();
  }

  revealAll(): void {
    if (this.isComplete()) {
      return;
    }

    this.status.set('playing');
    this.startTimer();
    this.cards.update((cards) => cards.map((card) => ({ ...card, isFlipped: true })));
  }

  private resolveSelection(): void {
    const [firstId, secondId] = this.selectedIds();
    const cards = this.cards();
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);

    if (!firstCard || !secondCard) {
      this.selectedIds.set([]);
      return;
    }

    if (firstCard.pairId === secondCard.pairId) {
      this.cards.update((currentCards) =>
        currentCards.map((card) =>
          card.id === firstId || card.id === secondId ? { ...card, isMatched: true, isFlipped: true } : card
        )
      );
      this.selectedIds.set([]);
      this.checkCompletion();
      return;
    }

    this.isChecking.set(true);
    window.setTimeout(() => {
      this.cards.update((currentCards) =>
        currentCards.map((card) =>
          card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card
        )
      );
      this.selectedIds.set([]);
      this.isChecking.set(false);
    }, 550);
  }

  private checkCompletion(): void {
    const allMatched = this.cards().every((card) => card.isMatched);

    if (allMatched) {
      this.status.set('complete');
      this.stopTimer();
    }
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

  private createCards(difficulty: Difficulty, round: number): MemoryCard[] {
    const templates = CARD_TEMPLATES.slice(0, this.difficultyOption(difficulty).pairs);
    const cards = templates.flatMap((template) => [
      { ...template, id: `${template.pairId}-a-${round}`, isFlipped: false, isMatched: false },
      { ...template, id: `${template.pairId}-b-${round}`, isFlipped: false, isMatched: false }
    ]);

    return this.shuffle(cards, round);
  }

  private shuffle(cards: MemoryCard[], seed: number): MemoryCard[] {
    const shuffledCards = [...cards];
    let randomSeed = seed * 97;

    for (let index = shuffledCards.length - 1; index > 0; index--) {
      randomSeed = (randomSeed * 9301 + 49297) % 233280;
      const nextIndex = Math.floor((randomSeed / 233280) * (index + 1));
      [shuffledCards[index], shuffledCards[nextIndex]] = [shuffledCards[nextIndex], shuffledCards[index]];
    }

    return shuffledCards;
  }

  private difficultyOption(difficulty = this.difficulty()): DifficultyOption {
    return DIFFICULTIES.find((option) => option.id === difficulty) ?? DIFFICULTIES[1];
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
