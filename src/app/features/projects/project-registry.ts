import { PortfolioProject } from '../../core/models/project.model';

export const PROJECTS: PortfolioProject[] = [
  {
    id: 'tic-tac-toe',
    titleKey: 'PROJECTS.TIC_TAC_TOE.TITLE',
    summaryKey: 'PROJECTS.TIC_TAC_TOE.SUMMARY',
    categoryKey: 'CATEGORIES.GAMES',
    tags: ['Angular', 'TypeScript', 'State'],
    status: 'planned',
    image: 'assets/project-covers/tic-tac-toe.svg',
    route: '/admin/projects/tic-tac-toe'
  },
  {
    id: 'calculator',
    titleKey: 'PROJECTS.CALCULATOR.TITLE',
    summaryKey: 'PROJECTS.CALCULATOR.SUMMARY',
    categoryKey: 'CATEGORIES.UTILITIES',
    tags: ['Forms', 'SCSS', 'Validation'],
    status: 'planned',
    image: 'assets/project-covers/calculator.svg',
    route: '/admin/projects/calculator'
  },
  {
    id: 'hang-man',
    titleKey: 'PROJECTS.HANG_MAN.TITLE',
    summaryKey: 'PROJECTS.HANG_MAN.SUMMARY',
    categoryKey: 'CATEGORIES.GAMES',
    tags: ['Animations', 'i18n', 'Game UI'],
    status: 'planned',
    image: 'assets/project-covers/hang-man.svg',
    route: '/admin/projects/hang-man'
  },
  {
    id: 'weather',
    titleKey: 'PROJECTS.WEATHER.TITLE',
    summaryKey: 'PROJECTS.WEATHER.SUMMARY',
    categoryKey: 'CATEGORIES.API',
    tags: ['HTTP', 'Bootstrap', 'PrimeNG'],
    status: 'planned',
    image: 'assets/project-covers/weather.svg',
    route: '/admin/projects/weather'
  },
  {
    id: 'music-event',
    titleKey: 'PROJECTS.MUSIC_EVENT.TITLE',
    summaryKey: 'PROJECTS.MUSIC_EVENT.SUMMARY',
    categoryKey: 'CATEGORIES.EVENTS',
    tags: ['PrimeNG', 'Modals', 'Filters'],
    status: 'planned',
    image: 'assets/project-covers/music-event.svg',
    route: '/admin/projects/music-event'
  }
];
