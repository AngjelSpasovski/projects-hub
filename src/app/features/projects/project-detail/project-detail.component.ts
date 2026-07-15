import { NgComponentOutlet } from '@angular/common';
import { Component, DestroyRef, ElementRef, Type, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { PROJECTS } from '../project-registry';

const PROJECT_COMPONENT_LOADERS: Record<string, () => Promise<Type<unknown>>> = {
  'tic-tac-toe': () =>
    import('../tic-tac-toe/tic-tac-toe.component').then((component) => component.TicTacToeComponent),
  calculator: () => import('../calculator/calculator.component').then((component) => component.CalculatorComponent),
  'hang-man': () => import('../hang-man/hang-man.component').then((component) => component.HangManComponent),
  weather: () => import('../weather/weather.component').then((component) => component.WeatherComponent),
  'music-event': () => import('../music-event/music-event.component').then((component) => component.MusicEventComponent),
  'javascript-quiz': () =>
    import('../javascript-quiz/javascript-quiz.component').then((component) => component.JavaScriptQuizComponent),
  'todo-list': () => import('../todo-list/todo-list.component').then((component) => component.TodoListComponent),
  'expense-tracker': () =>
    import('../expense-tracker/expense-tracker.component').then((component) => component.ExpenseTrackerComponent),
  'technical-documentation': () =>
    import('../technical-documentation/technical-documentation.component').then(
      (component) => component.TechnicalDocumentationComponent
    ),
  'movie-search': () => import('../movie-search/movie-search.component').then((component) => component.MovieSearchComponent),
  'rest-countries': () =>
    import('../rest-countries/rest-countries.component').then((component) => component.RestCountriesComponent),
  'currency-converter': () =>
    import('../currency-converter/currency-converter.component').then(
      (component) => component.CurrencyConverterComponent
    ),
  'quotes-api': () => import('../quotes-api/quotes-api.component').then((component) => component.QuotesApiComponent),
  'sticky-notes': () =>
    import('../sticky-notes/sticky-notes.component').then((component) => component.StickyNotesComponent),
  'grocery-list': () =>
    import('../grocery-list/grocery-list.component').then((component) => component.GroceryListComponent),
  'project-planner': () =>
    import('../project-planner/project-planner.component').then((component) => component.ProjectPlannerComponent),
  'odd-even': () => import('../odd-even/odd-even.component').then((component) => component.OddEvenComponent),
  'dev-logger': () => import('../dev-logger/dev-logger.component').then((component) => component.DevLoggerComponent),
  'recipe-book': () =>
    import('../recipe-book/recipe-book.component').then((component) => component.RecipeBookComponent),
  flashcards: () => import('../flashcards/flashcards.component').then((component) => component.FlashcardsComponent),
  timer: () => import('../timer/timer.component').then((component) => component.TimerComponent),
  'digital-clock': () =>
    import('../digital-clock/digital-clock.component').then((component) => component.DigitalClockComponent),
  'tip-calculator': () =>
    import('../tip-calculator/tip-calculator.component').then((component) => component.TipCalculatorComponent),
  'memory-game': () =>
    import('../memory-game/memory-game.component').then((component) => component.MemoryGameComponent),
  'math-4-kids': () =>
    import('../math-4-kids/math-4-kids.component').then((component) => component.Math4KidsComponent),
  'music-player': () =>
    import('../music-player/music-player.component').then((component) => component.MusicPlayerComponent),
  'photo-book': () => import('../photo-book/photo-book.component').then((component) => component.PhotoBookComponent),
  'client-panel': () =>
    import('../client-panel/client-panel.component').then((component) => component.ClientPanelComponent),
  'chat-app': () => import('../chat-app/chat-app.component').then((component) => component.ChatAppComponent)
};

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [NgComponentOutlet, RouterLink, TranslatePipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  @ViewChild('projectLive') private readonly projectLive?: ElementRef<HTMLElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly projectId = signal<string | null>(null);
  readonly projectComponent = signal<Type<unknown> | null>(null);
  readonly isComponentLoading = signal(false);

  readonly project = computed(() => {
    const projectId = this.projectId();
    return PROJECTS.find((project) => project.id === projectId);
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paramMap) => {
      const projectId = paramMap.get('projectId');
      this.projectId.set(projectId);
      void this.loadProjectComponent(projectId);
    });
  }

  focusLivePreview(): void {
    const liveElement = this.projectLive?.nativeElement;

    liveElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    liveElement?.focus({ preventScroll: true });
  }

  private async loadProjectComponent(projectId: string | null): Promise<void> {
    this.projectComponent.set(null);

    if (!projectId || !PROJECT_COMPONENT_LOADERS[projectId]) {
      this.isComponentLoading.set(false);
      return;
    }

    this.isComponentLoading.set(true);

    try {
      this.projectComponent.set(await PROJECT_COMPONENT_LOADERS[projectId]());
    } finally {
      this.isComponentLoading.set(false);
    }
  }
}
