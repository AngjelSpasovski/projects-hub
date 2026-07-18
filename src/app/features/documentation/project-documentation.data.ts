import type { ProjectDocumentation } from './documentation.models';

const localSession = 'DOCUMENTATION.PROJECT_GUIDANCE.LIMITATIONS.LOCAL_SESSION';
const localBrowser = 'DOCUMENTATION.PROJECT_GUIDANCE.LIMITATIONS.LOCAL_BROWSER';
const simulatedApi = 'DOCUMENTATION.PROJECT_GUIDANCE.LIMITATIONS.SIMULATED_API';
const externalMedia = 'DOCUMENTATION.PROJECT_GUIDANCE.LIMITATIONS.EXTERNAL_MEDIA';
const bundledAssets = 'DOCUMENTATION.PROJECT_GUIDANCE.LIMITATIONS.BUNDLED_ASSETS';
const noBackend = 'DOCUMENTATION.PROJECT_GUIDANCE.LIMITATIONS.NO_BACKEND';

const optionalEnhancements = 'DOCUMENTATION.PROJECT_GUIDANCE.FUTURE.OPTIONAL_ENHANCEMENTS';
const contentExpansion = 'DOCUMENTATION.PROJECT_GUIDANCE.FUTURE.CONTENT_EXPANSION';
const liveApi = 'DOCUMENTATION.PROJECT_GUIDANCE.FUTURE.LIVE_API';
const backendAdapter = 'DOCUMENTATION.PROJECT_GUIDANCE.FUTURE.BACKEND_ADAPTER';

function projectDocumentation(
  projectId: string,
  featureKeys: readonly string[],
  options: Partial<Pick<ProjectDocumentation, 'storage' | 'integration' | 'limitationKey' | 'futureKey'>> = {}
): ProjectDocumentation {
  return {
    projectId,
    featureKeys,
    storage: options.storage ?? 'memory',
    integration: options.integration ?? 'local',
    limitationKey: options.limitationKey ?? localSession,
    futureKey: options.futureKey ?? optionalEnhancements,
    hasUnitTests: true,
    hasE2eCoverage: true
  };
}

export const PROJECT_DOCUMENTATION: readonly ProjectDocumentation[] = [
  projectDocumentation('tic-tac-toe', [
    'TIC_TAC_TOE.FEATURES.TURNS',
    'TIC_TAC_TOE.FEATURES.WINNER',
    'TIC_TAC_TOE.FEATURES.RESET'
  ], { futureKey: contentExpansion }),
  projectDocumentation('calculator', [
    'CALCULATOR.FEATURES.ARITHMETIC',
    'CALCULATOR.FEATURES.KEYBOARD',
    'CALCULATOR.FEATURES.ERRORS'
  ]),
  projectDocumentation('hang-man', [
    'HANG_MAN.FEATURES.STATE',
    'HANG_MAN.FEATURES.KEYBOARD',
    'HANG_MAN.FEATURES.RESET'
  ], { futureKey: contentExpansion }),
  projectDocumentation('weather', [
    'WEATHER.FEATURES.FILTERS',
    'WEATHER.FEATURES.LOADING',
    'WEATHER.FEATURES.ERRORS'
  ], { integration: 'api-style', limitationKey: simulatedApi, futureKey: liveApi }),
  projectDocumentation('music-event', [
    'MUSIC_EVENT.FEATURES.FILTERS',
    'MUSIC_EVENT.FEATURES.MODAL',
    'MUSIC_EVENT.FEATURES.EMPTY'
  ]),
  projectDocumentation('javascript-quiz', [
    'DOCUMENTATION.PROJECT_FEATURES.JAVASCRIPT_QUIZ.QUESTIONS',
    'DOCUMENTATION.PROJECT_FEATURES.JAVASCRIPT_QUIZ.TIMER',
    'DOCUMENTATION.PROJECT_FEATURES.JAVASCRIPT_QUIZ.REVIEW'
  ], { futureKey: contentExpansion }),
  projectDocumentation('todo-list', [
    'TODO_LIST.FEATURES.CRUD',
    'TODO_LIST.FEATURES.FILTERS',
    'TODO_LIST.FEATURES.STORAGE'
  ], { storage: 'local-storage', limitationKey: localBrowser }),
  projectDocumentation('expense-tracker', [
    'EXPENSE_TRACKER.FEATURES.CRUD',
    'EXPENSE_TRACKER.FEATURES.TOTALS',
    'EXPENSE_TRACKER.FEATURES.CHARTS'
  ], { storage: 'local-storage', limitationKey: localBrowser }),
  projectDocumentation('movie-search', [
    'MOVIE_SEARCH.FEATURES.FILTERS',
    'MOVIE_SEARCH.FEATURES.DETAILS',
    'MOVIE_SEARCH.FEATURES.STATES'
  ], { integration: 'api-style', limitationKey: simulatedApi, futureKey: liveApi }),
  projectDocumentation('rest-countries', [
    'REST_COUNTRIES.FEATURES.FILTERS',
    'REST_COUNTRIES.FEATURES.DETAILS',
    'REST_COUNTRIES.FEATURES.FAVORITES'
  ], { storage: 'local-storage', integration: 'api-style', limitationKey: simulatedApi, futureKey: liveApi }),
  projectDocumentation('currency-converter', [
    'CURRENCY_CONVERTER.FEATURES.VALIDATION',
    'CURRENCY_CONVERTER.FEATURES.SWAP',
    'CURRENCY_CONVERTER.FEATURES.REFRESH'
  ], { integration: 'api-style', limitationKey: simulatedApi, futureKey: liveApi }),
  projectDocumentation('quotes-api', [
    'QUOTES_API.FEATURES.STATES',
    'QUOTES_API.FEATURES.FAVORITES',
    'QUOTES_API.FEATURES.TYPEWRITER'
  ], { storage: 'local-storage', integration: 'api-style', limitationKey: simulatedApi, futureKey: liveApi }),
  projectDocumentation('sticky-notes', [
    'STICKY_NOTES.FEATURES.COLORS',
    'STICKY_NOTES.FEATURES.PINNING',
    'STICKY_NOTES.FEATURES.STORAGE'
  ], { storage: 'local-storage', limitationKey: localBrowser }),
  projectDocumentation('grocery-list', [
    'GROCERY_LIST.FEATURES.CATEGORIES',
    'GROCERY_LIST.FEATURES.PURCHASED',
    'GROCERY_LIST.FEATURES.STORAGE'
  ], { storage: 'local-storage', limitationKey: localBrowser }),
  projectDocumentation('project-planner', [
    'DOCUMENTATION.PROJECT_FEATURES.PROJECT_PLANNER.LANES',
    'DOCUMENTATION.PROJECT_FEATURES.PROJECT_PLANNER.CREATION',
    'DOCUMENTATION.PROJECT_FEATURES.PROJECT_PLANNER.MOVEMENT'
  ]),
  projectDocumentation('odd-even', [
    'ODD_EVEN.FEATURES.TIMER',
    'ODD_EVEN.FEATURES.LANES',
    'ODD_EVEN.FEATURES.SIGNALS'
  ]),
  projectDocumentation('dev-logger', [
    'DOCUMENTATION.PROJECT_FEATURES.DEV_LOGGER.CRUD',
    'DOCUMENTATION.PROJECT_FEATURES.DEV_LOGGER.FILTERS',
    'DOCUMENTATION.PROJECT_FEATURES.DEV_LOGGER.STATE'
  ]),
  projectDocumentation('recipe-book', [
    'DOCUMENTATION.PROJECT_FEATURES.RECIPE_BOOK.RECIPES',
    'DOCUMENTATION.PROJECT_FEATURES.RECIPE_BOOK.SHOPPING',
    'DOCUMENTATION.PROJECT_FEATURES.RECIPE_BOOK.FORMS'
  ]),
  projectDocumentation('flashcards', [
    'FLASHCARDS.FEATURES.DECKS',
    'FLASHCARDS.FEATURES.REVIEW',
    'FLASHCARDS.FEATURES.STORAGE'
  ], { storage: 'local-storage', limitationKey: localBrowser, futureKey: contentExpansion }),
  projectDocumentation('timer', [
    'TIMER.FEATURES.PRESETS',
    'TIMER.FEATURES.COMPLETE',
    'TIMER.FEATURES.STORAGE'
  ], { storage: 'local-storage', limitationKey: localBrowser }),
  projectDocumentation('digital-clock', [
    'DIGITAL_CLOCK.FEATURES.LIVE',
    'DIGITAL_CLOCK.FEATURES.TIMEZONE',
    'DIGITAL_CLOCK.FEATURES.STORAGE'
  ], { storage: 'local-storage', limitationKey: localBrowser }),
  projectDocumentation('tip-calculator', [
    'TIP_CALCULATOR.FEATURES.SPLIT',
    'TIP_CALCULATOR.FEATURES.VALIDATION',
    'TIP_CALCULATOR.FEATURES.RESET'
  ]),
  projectDocumentation('memory-game', [
    'MEMORY_GAME.FEATURES.MATCHING',
    'MEMORY_GAME.FEATURES.DIFFICULTY',
    'MEMORY_GAME.FEATURES.TIMER'
  ], { futureKey: contentExpansion }),
  projectDocumentation('math-4-kids', [
    'MATH_4_KIDS.FEATURES.ACCURACY',
    'MATH_4_KIDS.FEATURES.STREAK',
    'MATH_4_KIDS.FEATURES.TIMER'
  ], { futureKey: contentExpansion }),
  projectDocumentation('music-player', [
    'MUSIC_PLAYER.FEATURES.PLAYLIST',
    'MUSIC_PLAYER.FEATURES.FAVORITES',
    'DOCUMENTATION.PROJECT_FEATURES.MUSIC_PLAYER.SAFE_LINKS'
  ], { storage: 'local-storage', integration: 'external-links', limitationKey: externalMedia }),
  projectDocumentation('photo-book', [
    'PHOTO_BOOK.FEATURES.GALLERY',
    'PHOTO_BOOK.FEATURES.KEYBOARD',
    'DOCUMENTATION.PROJECT_FEATURES.PHOTO_BOOK.AUTOPLAY'
  ], { limitationKey: bundledAssets, futureKey: contentExpansion }),
  projectDocumentation('client-panel', [
    'DOCUMENTATION.PROJECT_FEATURES.CLIENT_PANEL.CRUD',
    'DOCUMENTATION.PROJECT_FEATURES.CLIENT_PANEL.TOTALS',
    'DOCUMENTATION.PROJECT_FEATURES.CLIENT_PANEL.STORAGE'
  ], { storage: 'local-storage', limitationKey: noBackend, futureKey: backendAdapter }),
  projectDocumentation('chat-app', [
    'DOCUMENTATION.PROJECT_FEATURES.CHAT_APP.ROOMS',
    'DOCUMENTATION.PROJECT_FEATURES.CHAT_APP.MESSAGES',
    'DOCUMENTATION.PROJECT_FEATURES.CHAT_APP.STORAGE'
  ], { storage: 'local-storage', limitationKey: noBackend, futureKey: backendAdapter })
];
