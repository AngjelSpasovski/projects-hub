import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { WeatherComponent } from './weather.component';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load mock weather data', fakeAsync(() => {
    component.loadWeather(0);

    expect(component.loadState()).toBe('loading');

    tick(0);

    expect(component.loadState()).toBe('ready');
    expect(component.cities().length).toBe(5);
    expect(component.lastUpdated()).toBeTruthy();
    expect(component.stale()).toBeFalse();
  }));

  it('should filter cities by condition', fakeAsync(() => {
    component.loadWeather(0);
    tick(0);

    component.updateFilter('sunny');

    expect(component.filteredCities().map((city) => city.city)).toEqual(['Skopje', 'Strumica']);
  }));

  it('should filter cities by search term', fakeAsync(() => {
    component.loadWeather(0);
    tick(0);

    component.updateSearchTerm('oh');

    expect(component.filteredCities().map((city) => city.city)).toEqual(['Ohrid']);

    component.clearSearch();

    expect(component.filteredCities().length).toBe(5);
  }));

  it('should calculate the average temperature for the filtered list', fakeAsync(() => {
    component.loadWeather(0);
    tick(0);

    component.updateFilter('sunny');

    expect(component.averageTemperature()).toBe(30);
  }));

  it('should calculate secondary weather summaries', fakeAsync(() => {
    component.loadWeather(0);
    tick(0);

    expect(component.warmestCity()?.city).toBe('Skopje');
    expect(component.averageHumidity()).toBe(53);
    expect(component.featuredCity()?.city).toBe('Skopje');
  }));

  it('should simulate an API failure state', fakeAsync(() => {
    component.simulateApiFailure();

    expect(component.loadState()).toBe('error');
    expect(component.cities()).toEqual([]);
    expect(component.lastUpdated()).toBeNull();
    expect(component.stale()).toBeTrue();
  }));

  it('should map weather conditions to icons', () => {
    expect(component.conditionIcon('rainy')).toBe('pi pi-cloud-download');
  });

  it('should map forecast trend labels', fakeAsync(() => {
    component.loadWeather(0);
    tick(0);

    expect(component.trendLabel(component.cities()[0])).toBe('WEATHER.TREND.COOLING');
  }));
});
