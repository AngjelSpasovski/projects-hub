import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { RestCountriesComponent } from './rest-countries.component';

describe('RestCountriesComponent', () => {
  let component: RestCountriesComponent;
  let fixture: ComponentFixture<RestCountriesComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [RestCountriesComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(RestCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load local country data', fakeAsync(() => {
    component.loadCountries(0);

    expect(component.loadState()).toBe('loading');

    tick(0);

    expect(component.loadState()).toBe('ready');
    expect(component.countries().length).toBe(8);
    expect(component.selectedCountry()?.code).toBe('MKD');
  }));

  it('should filter countries by search term', fakeAsync(() => {
    component.loadCountries(0);
    tick(0);

    component.updateSearchTerm('tokyo');

    expect(component.filteredCountries().map((country) => country.code)).toEqual(['JPN']);
    expect(component.selectedCountry()?.code).toBe('JPN');
  }));

  it('should filter countries by region', fakeAsync(() => {
    component.loadCountries(0);
    tick(0);

    component.updateRegion('africa');

    expect(component.filteredCountries().map((country) => country.code)).toEqual(['ZAF', 'EGY']);
  }));

  it('should persist favorite country codes', fakeAsync(() => {
    component.loadCountries(0);
    tick(0);

    component.toggleFavorite(component.countries()[0]);

    expect(component.favoriteCodes()).toEqual(['MKD']);
    expect(localStorage.getItem('projects-hub-rest-countries-favorites')).toContain('MKD');
  }));

  it('should calculate filtered summaries', fakeAsync(() => {
    component.loadCountries(0);
    tick(0);

    component.updateRegion('oceania');

    expect(component.totalPopulation()).toBe(26713205);
    expect(component.largestCountry()?.code).toBe('AUS');
  }));

  it('should expose an error state', () => {
    component.simulateApiFailure();

    expect(component.loadState()).toBe('error');
    expect(component.countries()).toEqual([]);
    expect(component.selectedCountry()).toBeNull();
  });
});
