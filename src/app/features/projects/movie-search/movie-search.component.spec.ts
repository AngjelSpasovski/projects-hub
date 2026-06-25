import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MovieSearchComponent } from './movie-search.component';

describe('MovieSearchComponent', () => {
  let component: MovieSearchComponent;
  let fixture: ComponentFixture<MovieSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieSearchComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load local movie data', fakeAsync(() => {
    component.loadMovies(0);

    expect(component.loadState()).toBe('loading');

    tick(0);

    expect(component.loadState()).toBe('ready');
    expect(component.movies().length).toBe(8);
    expect(component.selectedMovie()?.title).toBe('Signal Point');
  }));

  it('should filter by search term', fakeAsync(() => {
    component.loadMovies(0);
    tick(0);

    component.updateSearchTerm('orbit');

    expect(component.filteredMovies().map((movie) => movie.title)).toEqual(['Orbit Nine']);
    expect(component.selectedMovie()?.title).toBe('Orbit Nine');
  }));

  it('should filter by genre', fakeAsync(() => {
    component.loadMovies(0);
    tick(0);

    component.updateGenre('animation');

    expect(component.filteredMovies().map((movie) => movie.title)).toEqual(['Paper Moons', 'Tiny Giants']);
  }));

  it('should paginate results', fakeAsync(() => {
    component.loadMovies(0);
    tick(0);

    expect(component.totalPages()).toBe(2);
    expect(component.pagedMovies().length).toBe(4);

    component.nextPage();

    expect(component.currentPage()).toBe(2);
    expect(component.pagedMovies()[0].title).toBe('Harbor Code');
  }));

  it('should calculate summaries for the filtered list', fakeAsync(() => {
    component.loadMovies(0);
    tick(0);

    component.updateGenre('sci-fi');

    expect(component.averageRating()).toBe(8.2);
    expect(component.newestMovie()?.title).toBe('Orbit Nine');
  }));

  it('should expose an error state', () => {
    component.simulateApiFailure();

    expect(component.loadState()).toBe('error');
    expect(component.movies()).toEqual([]);
    expect(component.selectedMovie()).toBeNull();
  });
});
