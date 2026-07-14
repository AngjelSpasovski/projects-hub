import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type Difficulty = 'easy' | 'standard' | 'hard';
type GameStatus = 'ready' | 'playing' | 'complete';
type CardSet = 'letters' | 'fruits' | 'colors' | 'cars' | 'mixed';

interface DifficultyOption {
  id: Difficulty;
  labelKey: string;
  pairs: number;
}

interface CardTemplate {
  pairId: string;
  icon: string;
  accent: string;
}

interface CardSetOption {
  id: CardSet;
  labelKey: string;
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

const CARD_SETS: CardSetOption[] = [
  { id: 'letters', labelKey: 'MEMORY_GAME.CARD_SETS.LETTERS' },
  { id: 'fruits', labelKey: 'MEMORY_GAME.CARD_SETS.FRUITS' },
  { id: 'colors', labelKey: 'MEMORY_GAME.CARD_SETS.COLORS' },
  { id: 'cars', labelKey: 'MEMORY_GAME.CARD_SETS.CARS' },
  { id: 'mixed', labelKey: 'MEMORY_GAME.CARD_SETS.MIXED' }
];

const CARD_COLLECTIONS: Record<CardSet, CardTemplate[]> = {
  letters: [
    { pairId: 'angular', icon: 'A', accent: '#5b6ee1' },
    { pairId: 'typescript', icon: 'TS', accent: '#2563eb' },
    { pairId: 'forms', icon: 'FM', accent: '#16a34a' },
    { pairId: 'signals', icon: 'SG', accent: '#eab308' },
    { pairId: 'routes', icon: 'RT', accent: '#db2777' },
    { pairId: 'tests', icon: 'QA', accent: '#0891b2' },
    { pairId: 'themes', icon: 'TH', accent: '#7c3aed' },
    { pairId: 'docs', icon: 'DC', accent: '#475569' },
    { pairId: 'api', icon: 'API', accent: '#ea580c' },
    { pairId: 'state', icon: 'ST', accent: '#0f766e' }
  ],
  fruits: [
    { pairId: 'apple', icon: '🍎', accent: '#dc2626' },
    { pairId: 'banana', icon: '🍌', accent: '#eab308' },
    { pairId: 'grapes', icon: '🍇', accent: '#7c3aed' },
    { pairId: 'orange', icon: '🍊', accent: '#f97316' },
    { pairId: 'strawberry', icon: '🍓', accent: '#e11d48' },
    { pairId: 'watermelon', icon: '🍉', accent: '#16a34a' },
    { pairId: 'kiwi', icon: '🥝', accent: '#65a30d' },
    { pairId: 'lemon', icon: '🍋', accent: '#ca8a04' },
    { pairId: 'peach', icon: '🍑', accent: '#fb7185' },
    { pairId: 'cherry', icon: '🍒', accent: '#be123c' }
  ],
  colors: [
    { pairId: 'red', icon: 'Red', accent: '#ef4444' },
    { pairId: 'blue', icon: 'Blue', accent: '#3b82f6' },
    { pairId: 'green', icon: 'Green', accent: '#22c55e' },
    { pairId: 'yellow', icon: 'Gold', accent: '#eab308' },
    { pairId: 'purple', icon: 'Violet', accent: '#8b5cf6' },
    { pairId: 'pink', icon: 'Pink', accent: '#ec4899' },
    { pairId: 'cyan', icon: 'Cyan', accent: '#06b6d4' },
    { pairId: 'slate', icon: 'Slate', accent: '#64748b' },
    { pairId: 'orange', icon: 'Orange', accent: '#f97316' },
    { pairId: 'lime', icon: 'Lime', accent: '#84cc16' }
  ],
  cars: [
    { pairId: 'red-car', icon: '🚗', accent: '#dc2626' },
    { pairId: 'taxi', icon: '🚕', accent: '#eab308' },
    { pairId: 'bus', icon: '🚌', accent: '#f97316' },
    { pairId: 'police', icon: '🚓', accent: '#2563eb' },
    { pairId: 'truck', icon: '🚚', accent: '#0f766e' },
    { pairId: 'tractor', icon: '🚜', accent: '#16a34a' },
    { pairId: 'ambulance', icon: '🚑', accent: '#ef4444' },
    { pairId: 'firetruck', icon: '🚒', accent: '#b91c1c' },
    { pairId: 'racecar', icon: '🏎️', accent: '#7c3aed' },
    { pairId: 'motorcycle', icon: '🏍️', accent: '#475569' }
  ],
  mixed: []
};

CARD_COLLECTIONS.mixed = [
  CARD_COLLECTIONS.letters[0],
  CARD_COLLECTIONS.fruits[0],
  CARD_COLLECTIONS.colors[1],
  CARD_COLLECTIONS.cars[0],
  CARD_COLLECTIONS.letters[1],
  CARD_COLLECTIONS.fruits[1],
  CARD_COLLECTIONS.colors[2],
  CARD_COLLECTIONS.cars[1],
  CARD_COLLECTIONS.letters[2],
  CARD_COLLECTIONS.fruits[2]
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
  readonly cardSets = CARD_SETS;
  readonly difficulty = signal<Difficulty>('standard');
  readonly cardSet = signal<CardSet>('letters');
  readonly pendingCardSet = signal<CardSet | null>(null);
  readonly round = signal(1);
  readonly cards = signal<MemoryCard[]>(this.createCards('standard', 'letters', 1));
  readonly selectedIds = signal<string[]>([]);
  readonly moves = signal(0);
  readonly seconds = signal(0);
  readonly status = signal<GameStatus>('ready');
  readonly isChecking = signal(false);

  readonly pairCount = computed(() => this.difficultyOption().pairs);
  readonly matchedPairs = computed(() => this.cards().filter((card) => card.isMatched).length / 2);
  readonly remainingPairs = computed(() => this.pairCount() - this.matchedPairs());
  readonly isComplete = computed(() => this.status() === 'complete');
  readonly pendingCardSetOption = computed(() => {
    const pendingCardSet = this.pendingCardSet();
    return this.cardSets.find((option) => option.id === pendingCardSet) ?? null;
  });
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

  selectCardSet(cardSet: CardSet): void {
    if (cardSet === this.cardSet()) {
      return;
    }

    this.pendingCardSet.set(cardSet);
  }

  confirmCardSetChange(): void {
    const pendingCardSet = this.pendingCardSet();

    if (!pendingCardSet) {
      return;
    }

    this.pendingCardSet.set(null);
    this.cardSet.set(pendingCardSet);
    this.newRound();
  }

  continueCurrentRound(): void {
    this.pendingCardSet.set(null);
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
    this.cards.set(this.createCards(this.difficulty(), this.cardSet(), nextRound));
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

  private createCards(difficulty: Difficulty, cardSet: CardSet, round: number): MemoryCard[] {
    const templates = CARD_COLLECTIONS[cardSet].slice(0, this.difficultyOption(difficulty).pairs);
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
