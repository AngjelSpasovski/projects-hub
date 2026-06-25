import { Component, OnDestroy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncStatePanelComponent } from '../../../shared/ui/async-state-panel/async-state-panel.component';

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy';
type WeatherFilter = 'all' | WeatherCondition;
type WeatherLoadState = 'idle' | 'loading' | 'ready' | 'error';

interface WeatherCity {
  city: string;
  condition: WeatherCondition;
  country: string;
  description: string;
  feelsLike: number;
  forecast: number[];
  humidity: number;
  pressure: number;
  temperature: number;
  visibility: number;
  wind: number;
}

const WEATHER_DATA: WeatherCity[] = [
  {
    city: 'Skopje',
    condition: 'sunny',
    country: 'MK',
    description: 'Clear sky with dry afternoon air.',
    feelsLike: 33,
    forecast: [31, 30, 29, 27],
    humidity: 34,
    pressure: 1017,
    temperature: 31,
    visibility: 10,
    wind: 9
  },
  {
    city: 'Ohrid',
    condition: 'cloudy',
    country: 'MK',
    description: 'Cloud cover over the lake with mild wind.',
    feelsLike: 24,
    forecast: [24, 23, 22, 21],
    humidity: 58,
    pressure: 1014,
    temperature: 24,
    visibility: 8,
    wind: 12
  },
  {
    city: 'Bitola',
    condition: 'rainy',
    country: 'MK',
    description: 'Passing showers with cooler evening air.',
    feelsLike: 20,
    forecast: [21, 20, 19, 18],
    humidity: 71,
    pressure: 1009,
    temperature: 21,
    visibility: 6,
    wind: 16
  },
  {
    city: 'Strumica',
    condition: 'sunny',
    country: 'MK',
    description: 'Warm and bright with low humidity.',
    feelsLike: 30,
    forecast: [29, 28, 27, 25],
    humidity: 39,
    pressure: 1016,
    temperature: 29,
    visibility: 10,
    wind: 8
  },
  {
    city: 'Mavrovo',
    condition: 'cloudy',
    country: 'MK',
    description: 'Mountain clouds with a colder breeze.',
    feelsLike: 16,
    forecast: [18, 17, 15, 14],
    humidity: 64,
    pressure: 1012,
    temperature: 18,
    visibility: 7,
    wind: 18
  }
];

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [AsyncStatePanelComponent, FormsModule, TranslatePipe],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnDestroy {
  readonly cities = signal<WeatherCity[]>([]);
  readonly filter = signal<WeatherFilter>('all');
  readonly loadState = signal<WeatherLoadState>('idle');
  readonly lastUpdated = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly stale = signal(false);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  readonly filteredCities = computed(() => {
    const selectedFilter = this.filter();

    const normalizedSearch = this.searchTerm().trim().toLowerCase();

    return this.cities().filter((city) => {
      const matchesCondition = selectedFilter === 'all' || city.condition === selectedFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        city.city.toLowerCase().includes(normalizedSearch) ||
        city.country.toLowerCase().includes(normalizedSearch);

      return matchesCondition && matchesSearch;
    });
  });

  readonly featuredCity = computed(() => this.filteredCities()[0] ?? null);

  readonly averageTemperature = computed(() => {
    if (this.filteredCities().length === 0) {
      return 0;
    }

    const total = this.filteredCities().reduce((sum, city) => sum + city.temperature, 0);
    return Math.round(total / this.filteredCities().length);
  });

  readonly warmestCity = computed(() =>
    this.filteredCities().reduce<WeatherCity | null>((warmest, city) => {
      if (!warmest || city.temperature > warmest.temperature) {
        return city;
      }

      return warmest;
    }, null)
  );

  readonly averageHumidity = computed(() => {
    if (this.filteredCities().length === 0) {
      return 0;
    }

    const total = this.filteredCities().reduce((sum, city) => sum + city.humidity, 0);
    return Math.round(total / this.filteredCities().length);
  });

  constructor() {
    this.loadWeather();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  loadWeather(delay = 350): void {
    this.clearTimer();
    this.loadState.set('loading');

    this.loadTimer = setTimeout(() => {
      this.cities.set(WEATHER_DATA);
      this.lastUpdated.set(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      this.loadState.set('ready');
      this.stale.set(false);
      this.loadTimer = null;
    }, delay);
  }

  simulateApiFailure(): void {
    this.clearTimer();
    this.cities.set([]);
    this.loadState.set('error');
    this.lastUpdated.set(null);
    this.stale.set(true);
  }

  updateFilter(value: string): void {
    this.filter.set(value as WeatherFilter);
  }

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  conditionIcon(condition: WeatherCondition): string {
    return {
      sunny: 'pi pi-sun',
      cloudy: 'pi pi-cloud',
      rainy: 'pi pi-cloud-download'
    }[condition];
  }

  trendLabel(city: WeatherCity): string {
    const lastForecast = city.forecast.at(-1) ?? city.temperature;

    if (lastForecast > city.temperature) {
      return 'WEATHER.TREND.WARMING';
    }

    if (lastForecast < city.temperature) {
      return 'WEATHER.TREND.COOLING';
    }

    return 'WEATHER.TREND.STABLE';
  }

  private clearTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
