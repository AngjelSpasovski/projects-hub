import { Component, OnDestroy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { AsyncStatePanelComponent } from '../../../shared/ui/async-state-panel/async-state-panel.component';

type CountryRegion = 'africa' | 'americas' | 'asia' | 'europe' | 'oceania';
type CountryFilter = 'all' | CountryRegion;
type CountriesLoadState = 'idle' | 'loading' | 'ready' | 'error';

interface CountryItem {
  code: string;
  name: string;
  capital: string;
  region: CountryRegion;
  population: number;
  area: number;
  currency: string;
  languages: string[];
  borders: string[];
  flag: string;
}

const STORAGE_KEY = 'projects-hub-rest-countries-favorites';

const COUNTRIES: CountryItem[] = [
  {
    code: 'MKD',
    name: 'North Macedonia',
    capital: 'Skopje',
    region: 'europe',
    population: 1836713,
    area: 25713,
    currency: 'Macedonian denar',
    languages: ['Macedonian', 'Albanian'],
    borders: ['Albania', 'Bulgaria', 'Greece', 'Kosovo', 'Serbia'],
    flag: 'MK'
  },
  {
    code: 'DEU',
    name: 'Germany',
    capital: 'Berlin',
    region: 'europe',
    population: 83240525,
    area: 357114,
    currency: 'Euro',
    languages: ['German'],
    borders: ['Austria', 'Belgium', 'France', 'Netherlands', 'Poland'],
    flag: 'DE'
  },
  {
    code: 'JPN',
    name: 'Japan',
    capital: 'Tokyo',
    region: 'asia',
    population: 125681593,
    area: 377975,
    currency: 'Japanese yen',
    languages: ['Japanese'],
    borders: [],
    flag: 'JP'
  },
  {
    code: 'BRA',
    name: 'Brazil',
    capital: 'Brasilia',
    region: 'americas',
    population: 203062512,
    area: 8515767,
    currency: 'Brazilian real',
    languages: ['Portuguese'],
    borders: ['Argentina', 'Bolivia', 'Colombia', 'Peru', 'Uruguay'],
    flag: 'BR'
  },
  {
    code: 'CAN',
    name: 'Canada',
    capital: 'Ottawa',
    region: 'americas',
    population: 40097761,
    area: 9984670,
    currency: 'Canadian dollar',
    languages: ['English', 'French'],
    borders: ['United States'],
    flag: 'CA'
  },
  {
    code: 'ZAF',
    name: 'South Africa',
    capital: 'Pretoria',
    region: 'africa',
    population: 62027503,
    area: 1221037,
    currency: 'South African rand',
    languages: ['Zulu', 'Xhosa', 'Afrikaans', 'English'],
    borders: ['Botswana', 'Mozambique', 'Namibia', 'Zimbabwe'],
    flag: 'ZA'
  },
  {
    code: 'AUS',
    name: 'Australia',
    capital: 'Canberra',
    region: 'oceania',
    population: 26713205,
    area: 7692024,
    currency: 'Australian dollar',
    languages: ['English'],
    borders: [],
    flag: 'AU'
  },
  {
    code: 'EGY',
    name: 'Egypt',
    capital: 'Cairo',
    region: 'africa',
    population: 112716598,
    area: 1002450,
    currency: 'Egyptian pound',
    languages: ['Arabic'],
    borders: ['Israel', 'Libya', 'Sudan'],
    flag: 'EG'
  }
];

@Component({
  selector: 'app-rest-countries',
  standalone: true,
  imports: [AsyncStatePanelComponent, FormsModule, TranslatePipe],
  templateUrl: './rest-countries.component.html',
  styleUrl: './rest-countries.component.scss'
})
export class RestCountriesComponent implements OnDestroy {
  readonly countries = signal<CountryItem[]>([]);
  readonly loadState = signal<CountriesLoadState>('idle');
  readonly searchTerm = signal('');
  readonly selectedRegion = signal<CountryFilter>('all');
  readonly selectedCountry = signal<CountryItem | null>(null);
  readonly favoriteCodes = signal<string[]>(this.readFavorites());

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  readonly filteredCountries = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const region = this.selectedRegion();

    return this.countries().filter((country) => {
      const matchesRegion = region === 'all' || country.region === region;
      const matchesQuery =
        query.length === 0 ||
        country.name.toLowerCase().includes(query) ||
        country.capital.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query);

      return matchesRegion && matchesQuery;
    });
  });

  readonly favoriteCountries = computed(() =>
    this.countries().filter((country) => this.favoriteCodes().includes(country.code))
  );

  readonly totalPopulation = computed(() =>
    this.filteredCountries().reduce((total, country) => total + country.population, 0)
  );

  readonly largestCountry = computed(() =>
    this.filteredCountries().reduce<CountryItem | null>((largest, country) => {
      if (!largest || country.area > largest.area) {
        return country;
      }

      return largest;
    }, null)
  );

  constructor() {
    this.loadCountries();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  loadCountries(delay = 300): void {
    this.clearTimer();
    this.loadState.set('loading');

    this.loadTimer = setTimeout(() => {
      this.countries.set(COUNTRIES);
      this.selectedCountry.set(COUNTRIES[0]);
      this.loadState.set('ready');
      this.loadTimer = null;
    }, delay);
  }

  simulateApiFailure(): void {
    this.clearTimer();
    this.countries.set([]);
    this.selectedCountry.set(null);
    this.loadState.set('error');
  }

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.syncSelection();
  }

  updateRegion(value: string): void {
    this.selectedRegion.set(value as CountryFilter);
    this.syncSelection();
  }

  selectCountry(country: CountryItem): void {
    this.selectedCountry.set(country);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedRegion.set('all');
    this.syncSelection();
  }

  toggleFavorite(country: CountryItem): void {
    const favorites = this.favoriteCodes();
    const nextFavorites = favorites.includes(country.code)
      ? favorites.filter((code) => code !== country.code)
      : [...favorites, country.code];

    this.favoriteCodes.set(nextFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
  }

  isFavorite(country: CountryItem): boolean {
    return this.favoriteCodes().includes(country.code);
  }

  regionKey(region: CountryRegion): string {
    return `REST_COUNTRIES.REGIONS.${region.toUpperCase()}`;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  private syncSelection(): void {
    const currentSelection = this.selectedCountry();

    if (currentSelection && this.filteredCountries().some((country) => country.code === currentSelection.code)) {
      return;
    }

    this.selectedCountry.set(this.filteredCountries()[0] ?? null);
  }

  private readFavorites(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private clearTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
