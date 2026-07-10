import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  deck: string;
  mastered: boolean;
}

type ReviewResult = 'correct' | 'incorrect';

const STORAGE_KEY = 'projects-hub-flashcards';
const TEXT_MAX_LENGTH = 140;
const DEFAULT_CARDS: Flashcard[] = [
  {
    id: 1,
    question: 'What Angular primitive tracks reactive local state?',
    answer: 'A signal stores reactive state and notifies computed values and templates when it changes.',
    deck: 'Angular',
    mastered: false
  },
  {
    id: 2,
    question: 'What does LocalStorage persistence add to a portfolio mini project?',
    answer: 'It keeps demo data available after reloads without requiring a backend or secrets.',
    deck: 'Frontend',
    mastered: true
  },
  {
    id: 3,
    question: 'Why should visible labels live in translation files?',
    answer: 'It keeps English and Macedonian UI copy aligned and makes future language support safer.',
    deck: 'i18n',
    mastered: false
  }
];

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './flashcards.component.html',
  styleUrl: './flashcards.component.scss'
})
export class FlashcardsComponent {
  readonly textMaxLength = TEXT_MAX_LENGTH;
  readonly cards = signal<Flashcard[]>(this.loadCards());
  readonly selectedDeck = signal('all');
  readonly activeIndex = signal(0);
  readonly answerVisible = signal(false);
  readonly reviewResults = signal<Record<number, ReviewResult>>({});
  readonly editingId = signal<number | null>(null);
  readonly draftQuestion = signal('');
  readonly draftAnswer = signal('');
  readonly draftDeck = signal('Angular');
  readonly questionTouched = signal(false);
  readonly answerTouched = signal(false);

  readonly deckOptions = computed(() => ['all', ...Array.from(new Set(this.cards().map((card) => card.deck))).sort()]);
  readonly filteredCards = computed(() => {
    const selectedDeck = this.selectedDeck();
    return selectedDeck === 'all' ? this.cards() : this.cards().filter((card) => card.deck === selectedDeck);
  });
  readonly activeCard = computed(() => this.filteredCards()[this.activeIndex()] ?? null);
  readonly masteredCount = computed(() => this.cards().filter((card) => card.mastered).length);
  readonly reviewedCount = computed(() => Object.keys(this.reviewResults()).length);
  readonly correctCount = computed(() => Object.values(this.reviewResults()).filter((result) => result === 'correct').length);
  readonly isQuestionInvalid = computed(() => this.questionTouched() && this.draftQuestion().trim().length === 0);
  readonly isAnswerInvalid = computed(() => this.answerTouched() && this.draftAnswer().trim().length === 0);
  readonly progressLabel = computed(() => {
    const cards = this.filteredCards();
    return cards.length ? `${this.activeIndex() + 1} / ${cards.length}` : '0 / 0';
  });

  updateDeck(deck: string): void {
    this.selectedDeck.set(deck);
    this.activeIndex.set(0);
    this.answerVisible.set(false);
  }

  updateQuestion(value: string): void {
    this.draftQuestion.set(value.slice(0, TEXT_MAX_LENGTH));
  }

  updateAnswer(value: string): void {
    this.draftAnswer.set(value.slice(0, TEXT_MAX_LENGTH));
  }

  updateDraftDeck(value: string): void {
    this.draftDeck.set(value.slice(0, 32));
  }

  revealAnswer(): void {
    this.answerVisible.set(true);
  }

  markCard(result: ReviewResult): void {
    const card = this.activeCard();

    if (!card) {
      return;
    }

    this.reviewResults.update((results) => ({ ...results, [card.id]: result }));
    this.cards.update((cards) =>
      cards.map((item) => (item.id === card.id ? { ...item, mastered: result === 'correct' } : item))
    );
    this.persistCards();
    this.nextCard();
  }

  nextCard(): void {
    const cards = this.filteredCards();

    if (cards.length === 0) {
      this.activeIndex.set(0);
      this.answerVisible.set(false);
      return;
    }

    this.activeIndex.set((this.activeIndex() + 1) % cards.length);
    this.answerVisible.set(false);
  }

  previousCard(): void {
    const cards = this.filteredCards();

    if (cards.length === 0) {
      this.activeIndex.set(0);
      this.answerVisible.set(false);
      return;
    }

    this.activeIndex.set((this.activeIndex() - 1 + cards.length) % cards.length);
    this.answerVisible.set(false);
  }

  shuffleCards(): void {
    this.cards.update((cards) => [...cards].sort(() => Math.random() - 0.5));
    this.activeIndex.set(0);
    this.answerVisible.set(false);
    this.persistCards();
  }

  submitCard(): void {
    this.questionTouched.set(true);
    this.answerTouched.set(true);

    const question = this.draftQuestion().trim();
    const answer = this.draftAnswer().trim();
    const deck = this.draftDeck().trim() || 'General';

    if (!question || !answer) {
      return;
    }

    const editingId = this.editingId();

    if (editingId) {
      this.cards.update((cards) =>
        cards.map((card) => (card.id === editingId ? { ...card, answer, deck, question } : card))
      );
    } else {
      this.cards.update((cards) => [
        {
          answer,
          deck,
          id: Date.now(),
          mastered: false,
          question
        },
        ...cards
      ]);
    }

    this.persistCards();
    this.resetDraft();
    this.updateDeck(deck);
  }

  editCard(card: Flashcard): void {
    this.editingId.set(card.id);
    this.draftQuestion.set(card.question);
    this.draftAnswer.set(card.answer);
    this.draftDeck.set(card.deck);
    this.questionTouched.set(false);
    this.answerTouched.set(false);
  }

  cancelEdit(): void {
    this.resetDraft();
  }

  deleteCard(cardId: number): void {
    this.cards.update((cards) => cards.filter((card) => card.id !== cardId));
    this.reviewResults.update((results) => {
      const nextResults = { ...results };
      delete nextResults[cardId];
      return nextResults;
    });

    if (this.editingId() === cardId) {
      this.resetDraft();
    }

    this.activeIndex.set(0);
    this.answerVisible.set(false);
    this.persistCards();
  }

  resetReview(): void {
    this.reviewResults.set({});
    this.cards.update((cards) => cards.map((card) => ({ ...card, mastered: false })));
    this.activeIndex.set(0);
    this.answerVisible.set(false);
    this.persistCards();
  }

  resetDemo(): void {
    this.cards.set(DEFAULT_CARDS);
    this.selectedDeck.set('all');
    this.reviewResults.set({});
    this.activeIndex.set(0);
    this.answerVisible.set(false);
    this.resetDraft();
    this.persistCards();
  }

  deckLabel(deck: string): string {
    return deck === 'all' ? 'FLASHCARDS.DECKS.ALL' : deck;
  }

  private resetDraft(): void {
    this.editingId.set(null);
    this.draftQuestion.set('');
    this.draftAnswer.set('');
    this.draftDeck.set('Angular');
    this.questionTouched.set(false);
    this.answerTouched.set(false);
  }

  private loadCards(): Flashcard[] {
    const storedCards = localStorage.getItem(STORAGE_KEY);

    if (!storedCards) {
      return DEFAULT_CARDS;
    }

    try {
      const parsedCards = JSON.parse(storedCards) as Flashcard[];
      return Array.isArray(parsedCards) ? parsedCards : DEFAULT_CARDS;
    } catch {
      return DEFAULT_CARDS;
    }
  }

  private persistCards(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cards()));
  }
}
