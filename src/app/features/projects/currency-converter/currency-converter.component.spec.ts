import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { CurrencyConverterComponent } from './currency-converter.component';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyConverterComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load local exchange rates', fakeAsync(() => {
    component.loadRates(0);

    expect(component.loadState()).toBe('loading');

    tick(0);

    expect(component.loadState()).toBe('ready');
    expect(component.rates().MKD).toBe(61.5);
    expect(component.lastUpdated()).toBeTruthy();
    expect(component.stale()).toBeFalse();
  }));

  it('should convert between selected currencies', fakeAsync(() => {
    component.loadRates(0);
    tick(0);

    component.updateAmount('10');
    component.updateFromCurrency('EUR');
    component.updateToCurrency('USD');

    expect(component.convertedAmount()).toBe(10.8);
    expect(component.exchangeRate()).toBe(1.08);
  }));

  it('should swap currencies', fakeAsync(() => {
    component.loadRates(0);
    tick(0);

    component.updateFromCurrency('EUR');
    component.updateToCurrency('MKD');
    component.swapCurrencies();

    expect(component.fromCurrency()).toBe('MKD');
    expect(component.toCurrency()).toBe('EUR');
  }));

  it('should validate amount values', () => {
    component.updateAmount('0');

    expect(component.amountError()).toBe('CURRENCY_CONVERTER.ERRORS.AMOUNT_POSITIVE');
    expect(component.convertedAmount()).toBe(0);

    component.updateAmount('1000001');

    expect(component.amountError()).toBe('CURRENCY_CONVERTER.ERRORS.AMOUNT_LIMIT');
  });

  it('should mark exchange rates as stale', () => {
    component.markStale();

    expect(component.stale()).toBeTrue();
  });

  it('should expose an error state', () => {
    component.simulateApiFailure();

    expect(component.loadState()).toBe('error');
    expect(component.stale()).toBeTrue();
  });
});
