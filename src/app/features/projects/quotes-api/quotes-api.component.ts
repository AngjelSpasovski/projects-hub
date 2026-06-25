import { Component, OnDestroy, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AsyncStatePanelComponent } from '../../../shared/ui/async-state-panel/async-state-panel.component';

type QuoteLoadState = 'idle' | 'loading' | 'ready' | 'error';
type QuoteTone = 'mindset' | 'craft' | 'focus';

interface QuoteItem {
  id: number;
  author: string;
  text: string;
  tone: QuoteTone;
  source: string;
}

const QUOTES: QuoteItem[] = [
  {
    id: 1,
    author: 'Ada Lovelace',
    text: 'The more I study, the more insatiable do I feel my genius for it to be.',
    tone: 'craft',
    source: 'Letters'
  },
  {
    id: 2,
    author: 'Grace Hopper',
    text: 'A ship in port is safe, but that is not what ships are built for.',
    tone: 'mindset',
    source: 'Talks'
  },
  {
    id: 3,
    author: 'Kent Beck',
    text: 'Make it work, make it right, make it fast.',
    tone: 'craft',
    source: 'Extreme Programming'
  },
  {
    id: 4,
    author: 'Donald Knuth',
    text: 'Premature optimization is the root of all evil.',
    tone: 'focus',
    source: 'Structured Programming'
  },
  {
    id: 5,
    author: 'Sandi Metz',
    text: 'Design is more the art of preserving changeability than it is the act of achieving perfection.',
    tone: 'craft',
    source: 'Practical Object-Oriented Design'
  },
  {
    id: 6,
    author: 'Linus Torvalds',
    text: 'Talk is cheap. Show me the code.',
    tone: 'focus',
    source: 'Developer discussion'
  }
];

const FAVORITES_KEY = 'projects-hub-quotes-api-favorites';

@Component({
  selector: 'app-quotes-api',
  standalone: true,
  imports: [AsyncStatePanelComponent, TranslatePipe],
  templateUrl: './quotes-api.component.html',
  styleUrl: './quotes-api.component.scss'
})
export class QuotesApiComponent implements OnDestroy {
  readonly quotes = signal<QuoteItem[]>([]);
  readonly loadState = signal<QuoteLoadState>('idle');
  readonly selectedQuote = signal<QuoteItem | null>(null);
  readonly typedText = signal('');
  readonly favoriteIds = signal<number[]>(this.loadFavorites());
  readonly lastUpdated = signal<Date | null>(null);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private typeTimer: ReturnType<typeof setInterval> | null = null;
  private lastQuoteId: number | null = null;

  readonly favoriteQuotes = computed(() =>
    this.quotes().filter((quote) => this.favoriteIds().includes(quote.id))
  );

  readonly quotePosition = computed(() => {
    const selected = this.selectedQuote();

    if (!selected) {
      return 0;
    }

    return this.quotes().findIndex((quote) => quote.id === selected.id) + 1;
  });

  readonly isFavorite = computed(() => {
    const selected = this.selectedQuote();
    return Boolean(selected && this.favoriteIds().includes(selected.id));
  });

  constructor() {
    this.loadQuotes();
  }

  ngOnDestroy(): void {
    this.clearLoadTimer();
    this.clearTypeTimer();
  }

  loadQuotes(delay = 300): void {
    this.clearLoadTimer();
    this.clearTypeTimer();
    this.loadState.set('loading');

    this.loadTimer = setTimeout(() => {
      const quotes = [...QUOTES];
      this.quotes.set(quotes);
      this.selectedQuote.set(this.pickRandomQuote(quotes));
      this.lastUpdated.set(new Date());
      this.loadState.set('ready');
      this.loadTimer = null;
      this.startTypewriter();
    }, delay);
  }

  nextQuote(): void {
    const nextQuote = this.pickRandomQuote(this.quotes());
    this.selectedQuote.set(nextQuote);
    this.startTypewriter();
  }

  toggleFavorite(): void {
    const selected = this.selectedQuote();

    if (!selected) {
      return;
    }

    const currentFavorites = this.favoriteIds();
    const nextFavorites = currentFavorites.includes(selected.id)
      ? currentFavorites.filter((id) => id !== selected.id)
      : [...currentFavorites, selected.id];

    this.favoriteIds.set(nextFavorites);
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
  }

  selectFavorite(quote: QuoteItem): void {
    this.selectedQuote.set(quote);
    this.startTypewriter();
  }

  simulateApiFailure(): void {
    this.clearLoadTimer();
    this.clearTypeTimer();
    this.quotes.set([]);
    this.selectedQuote.set(null);
    this.typedText.set('');
    this.loadState.set('error');
  }

  clearFavorites(): void {
    this.favoriteIds.set([]);
    window.localStorage.removeItem(FAVORITES_KEY);
  }

  toneKey(tone: QuoteTone): string {
    return `QUOTES_API.TONES.${tone.toUpperCase()}`;
  }

  private pickRandomQuote(quotes: QuoteItem[]): QuoteItem | null {
    if (quotes.length === 0) {
      return null;
    }

    if (quotes.length === 1) {
      this.lastQuoteId = quotes[0].id;
      return quotes[0];
    }

    const candidates = quotes.filter((quote) => quote.id !== this.lastQuoteId);
    const nextQuote = candidates[Math.floor(Math.random() * candidates.length)];
    this.lastQuoteId = nextQuote.id;
    return nextQuote;
  }

  private startTypewriter(): void {
    this.clearTypeTimer();

    const quote = this.selectedQuote();

    if (!quote) {
      this.typedText.set('');
      return;
    }

    if (this.prefersReducedMotion()) {
      this.typedText.set(quote.text);
      return;
    }

    let index = 0;
    this.typedText.set('');

    this.typeTimer = setInterval(() => {
      index += 1;
      this.typedText.set(quote.text.slice(0, index));

      if (index >= quote.text.length) {
        this.clearTypeTimer();
      }
    }, 18);
  }

  private prefersReducedMotion(): boolean {
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private loadFavorites(): number[] {
    const rawFavorites = window.localStorage.getItem(FAVORITES_KEY);

    if (!rawFavorites) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawFavorites);
      return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === 'number') : [];
    } catch {
      return [];
    }
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }

  private clearTypeTimer(): void {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
  }
}
