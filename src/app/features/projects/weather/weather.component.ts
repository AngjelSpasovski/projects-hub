import { Component, OnDestroy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { AsyncStatePanelComponent } from '../../../shared/ui/async-state-panel/async-state-panel.component';

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy';
type WeatherFilter = 'all' | WeatherCondition;
type WeatherLoadState = 'idle' | 'loading' | 'ready' | 'error';

interface WeatherCity {
  city: string;
  condition: WeatherCondition;
  humidity: number;
  temperature: number;
  wind: number;
}

const WEATHER_DATA: WeatherCity[] = [
  { city: 'Skopje', condition: 'sunny', humidity: 34, temperature: 31, wind: 9 },
  { city: 'Ohrid', condition: 'cloudy', humidity: 58, temperature: 24, wind: 12 },
  { city: 'Bitola', condition: 'rainy', humidity: 71, temperature: 21, wind: 16 },
  { city: 'Strumica', condition: 'sunny', humidity: 39, temperature: 29, wind: 8 }
];

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [AsyncStatePanelComponent, FormsModule, PageHeaderComponent, TranslatePipe],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnDestroy {
  readonly cities = signal<WeatherCity[]>([]);
  readonly filter = signal<WeatherFilter>('all');
  readonly loadState = signal<WeatherLoadState>('idle');
  readonly lastUpdated = signal<string | null>(null);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  readonly filteredCities = computed(() => {
    const selectedFilter = this.filter();

    if (selectedFilter === 'all') {
      return this.cities();
    }

    return this.cities().filter((city) => city.condition === selectedFilter);
  });

  readonly averageTemperature = computed(() => {
    if (this.filteredCities().length === 0) {
      return 0;
    }

    const total = this.filteredCities().reduce((sum, city) => sum + city.temperature, 0);
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
      this.loadTimer = null;
    }, delay);
  }

  showError(): void {
    this.clearTimer();
    this.cities.set([]);
    this.loadState.set('error');
    this.lastUpdated.set(null);
  }

  updateFilter(value: string): void {
    this.filter.set(value as WeatherFilter);
  }

  conditionIcon(condition: WeatherCondition): string {
    return {
      sunny: 'pi pi-sun',
      cloudy: 'pi pi-cloud',
      rainy: 'pi pi-cloud-download'
    }[condition];
  }

  private clearTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
