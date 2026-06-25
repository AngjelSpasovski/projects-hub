import { Component, OnDestroy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { AsyncStatePanelComponent } from '../../../shared/ui/async-state-panel/async-state-panel.component';

type MovieGenre = 'action' | 'drama' | 'sci-fi' | 'animation';
type MovieFilter = 'all' | MovieGenre;
type MovieLoadState = 'idle' | 'loading' | 'ready' | 'error';

interface MovieItem {
  id: number;
  title: string;
  year: number;
  genre: MovieGenre;
  rating: number;
  runtime: number;
  director: string;
  summary: string;
  cast: string[];
}

const MOVIES: MovieItem[] = [
  {
    id: 1,
    title: 'Signal Point',
    year: 2024,
    genre: 'sci-fi',
    rating: 8.2,
    runtime: 118,
    director: 'Mira Stone',
    summary: 'A satellite engineer follows a strange signal that exposes a hidden city beneath the polar ice.',
    cast: ['Nora Fields', 'Evan Cole', 'Rami East']
  },
  {
    id: 2,
    title: 'Last Train North',
    year: 2023,
    genre: 'drama',
    rating: 7.7,
    runtime: 104,
    director: 'Jon Keller',
    summary: 'Two strangers share one overnight train ride and slowly uncover why each of them is leaving home.',
    cast: ['Mila Grant', 'Theo Brooks', 'Sara Voss']
  },
  {
    id: 3,
    title: 'Neon Run',
    year: 2025,
    genre: 'action',
    rating: 8.0,
    runtime: 126,
    director: 'Arun Vale',
    summary: 'A courier races across a locked-down city with evidence that can clear her brother.',
    cast: ['Lena Park', 'Dario Knox', 'Iris Chen']
  },
  {
    id: 4,
    title: 'Paper Moons',
    year: 2022,
    genre: 'animation',
    rating: 8.5,
    runtime: 96,
    director: 'Elena Moreau',
    summary: 'A young inventor builds paper moons that light a town where stars have disappeared.',
    cast: ['Ava Moon', 'Noah Reed', 'Kim Vale']
  },
  {
    id: 5,
    title: 'Harbor Code',
    year: 2024,
    genre: 'action',
    rating: 7.4,
    runtime: 112,
    director: 'Leo Marin',
    summary: 'An ex-detective and a junior developer decode a smuggling network hidden in port logistics.',
    cast: ['Cole Finch', 'Mina Hale', 'Oscar Reed']
  },
  {
    id: 6,
    title: 'The Orchard House',
    year: 2021,
    genre: 'drama',
    rating: 7.9,
    runtime: 109,
    director: 'Ana Grey',
    summary: 'Three siblings return to sell their family orchard and face the choices that split them apart.',
    cast: ['Ivy Cole', 'Mark Lane', 'Tara Bloom']
  },
  {
    id: 7,
    title: 'Orbit Nine',
    year: 2025,
    genre: 'sci-fi',
    rating: 8.1,
    runtime: 121,
    director: 'Vik Rao',
    summary: 'A maintenance crew on a remote station discovers that their mission logs are being rewritten.',
    cast: ['Nia Sol', 'Ben Ash', 'Mara Quinn']
  },
  {
    id: 8,
    title: 'Tiny Giants',
    year: 2023,
    genre: 'animation',
    rating: 7.6,
    runtime: 88,
    director: 'Pia Nolen',
    summary: 'A family of miniature explorers protects a greenhouse from a storm with clever teamwork.',
    cast: ['Luca Bell', 'Emma Frost', 'Oli Day']
  }
];

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [AsyncStatePanelComponent, FormsModule, TranslatePipe],
  templateUrl: './movie-search.component.html',
  styleUrl: './movie-search.component.scss'
})
export class MovieSearchComponent implements OnDestroy {
  readonly movies = signal<MovieItem[]>([]);
  readonly loadState = signal<MovieLoadState>('idle');
  readonly searchTerm = signal('');
  readonly selectedGenre = signal<MovieFilter>('all');
  readonly selectedMovie = signal<MovieItem | null>(null);
  readonly currentPage = signal(1);
  readonly pageSize = 4;

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  readonly filteredMovies = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const genre = this.selectedGenre();

    return this.movies().filter((movie) => {
      const matchesGenre = genre === 'all' || movie.genre === genre;
      const matchesQuery =
        query.length === 0 ||
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query) ||
        movie.cast.some((person) => person.toLowerCase().includes(query));

      return matchesGenre && matchesQuery;
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredMovies().length / this.pageSize)));

  readonly pagedMovies = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredMovies().slice(start, start + this.pageSize);
  });

  readonly averageRating = computed(() => {
    if (this.filteredMovies().length === 0) {
      return 0;
    }

    const totalTenths = this.filteredMovies().reduce((sum, movie) => sum + Math.round(movie.rating * 10), 0);
    return Math.round(totalTenths / this.filteredMovies().length) / 10;
  });

  readonly newestMovie = computed(() =>
    this.filteredMovies().reduce<MovieItem | null>((newest, movie) => {
      if (!newest || movie.year > newest.year) {
        return movie;
      }

      return newest;
    }, null)
  );

  constructor() {
    this.loadMovies();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  loadMovies(delay = 300): void {
    this.clearTimer();
    this.loadState.set('loading');

    this.loadTimer = setTimeout(() => {
      this.movies.set(MOVIES);
      this.selectedMovie.set(MOVIES[0]);
      this.currentPage.set(1);
      this.loadState.set('ready');
      this.loadTimer = null;
    }, delay);
  }

  simulateApiFailure(): void {
    this.clearTimer();
    this.movies.set([]);
    this.selectedMovie.set(null);
    this.loadState.set('error');
  }

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
    this.syncSelection();
  }

  updateGenre(value: string): void {
    this.selectedGenre.set(value as MovieFilter);
    this.currentPage.set(1);
    this.syncSelection();
  }

  selectMovie(movie: MovieItem): void {
    this.selectedMovie.set(movie);
  }

  nextPage(): void {
    this.currentPage.set(Math.min(this.currentPage() + 1, this.totalPages()));
    this.syncSelection();
  }

  previousPage(): void {
    this.currentPage.set(Math.max(this.currentPage() - 1, 1));
    this.syncSelection();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedGenre.set('all');
    this.currentPage.set(1);
    this.syncSelection();
  }

  genreKey(genre: MovieGenre): string {
    return `MOVIE_SEARCH.GENRES.${genre.toUpperCase().replace('-', '_')}`;
  }

  private syncSelection(): void {
    const currentSelection = this.selectedMovie();

    if (currentSelection && this.filteredMovies().some((movie) => movie.id === currentSelection.id)) {
      return;
    }

    this.selectedMovie.set(this.filteredMovies()[0] ?? null);
  }

  private clearTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
