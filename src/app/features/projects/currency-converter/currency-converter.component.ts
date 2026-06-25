import { Component, OnDestroy, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { AsyncStatePanelComponent } from '../../../shared/ui/async-state-panel/async-state-panel.component';

type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'MKD' | 'CHF' | 'JPY';
type RatesLoadState = 'idle' | 'loading' | 'ready' | 'error';

interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  nameKey: string;
}

const CURRENCIES: CurrencyOption[] = [
  { code: 'EUR', symbol: '€', nameKey: 'CURRENCY_CONVERTER.CURRENCIES.EUR' },
  { code: 'USD', symbol: '$', nameKey: 'CURRENCY_CONVERTER.CURRENCIES.USD' },
  { code: 'GBP', symbol: '£', nameKey: 'CURRENCY_CONVERTER.CURRENCIES.GBP' },
  { code: 'MKD', symbol: 'ден', nameKey: 'CURRENCY_CONVERTER.CURRENCIES.MKD' },
  { code: 'CHF', symbol: 'CHF', nameKey: 'CURRENCY_CONVERTER.CURRENCIES.CHF' },
  { code: 'JPY', symbol: '¥', nameKey: 'CURRENCY_CONVERTER.CURRENCIES.JPY' }
];

const EUR_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  MKD: 61.5,
  CHF: 0.95,
  JPY: 170.25
};

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [AsyncStatePanelComponent, DatePipe, FormsModule, TranslatePipe],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss'
})
export class CurrencyConverterComponent implements OnDestroy {
  readonly currencies = CURRENCIES;
  readonly rates = signal<Record<CurrencyCode, number>>({ ...EUR_RATES });
  readonly loadState = signal<RatesLoadState>('idle');
  readonly amount = signal(125);
  readonly fromCurrency = signal<CurrencyCode>('EUR');
  readonly toCurrency = signal<CurrencyCode>('MKD');
  readonly lastUpdated = signal<Date | null>(null);
  readonly stale = signal(false);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  readonly amountError = computed(() => {
    const amount = this.amount();

    if (!Number.isFinite(amount) || amount <= 0) {
      return 'CURRENCY_CONVERTER.ERRORS.AMOUNT_POSITIVE';
    }

    if (amount > 1000000) {
      return 'CURRENCY_CONVERTER.ERRORS.AMOUNT_LIMIT';
    }

    return null;
  });

  readonly exchangeRate = computed(() => {
    const rates = this.rates();
    return rates[this.toCurrency()] / rates[this.fromCurrency()];
  });

  readonly convertedAmount = computed(() => {
    if (this.amountError()) {
      return 0;
    }

    return this.amount() * this.exchangeRate();
  });

  readonly inverseRate = computed(() => 1 / this.exchangeRate());

  constructor() {
    this.loadRates();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  loadRates(delay = 300): void {
    this.clearTimer();
    this.loadState.set('loading');

    this.loadTimer = setTimeout(() => {
      this.rates.set({ ...EUR_RATES });
      this.lastUpdated.set(new Date());
      this.stale.set(false);
      this.loadState.set('ready');
      this.loadTimer = null;
    }, delay);
  }

  markStale(): void {
    this.stale.set(true);
  }

  simulateApiFailure(): void {
    this.clearTimer();
    this.loadState.set('error');
    this.stale.set(true);
  }

  updateAmount(value: string): void {
    this.amount.set(Number(value));
  }

  updateFromCurrency(value: string): void {
    this.fromCurrency.set(value as CurrencyCode);
  }

  updateToCurrency(value: string): void {
    this.toCurrency.set(value as CurrencyCode);
  }

  swapCurrencies(): void {
    const from = this.fromCurrency();
    this.fromCurrency.set(this.toCurrency());
    this.toCurrency.set(from);
  }

  formatCurrency(value: number, code: CurrencyCode): string {
    return new Intl.NumberFormat('en-US', {
      currency: code === 'MKD' ? 'MKD' : code,
      maximumFractionDigits: code === 'JPY' || code === 'MKD' ? 0 : 2,
      minimumFractionDigits: code === 'JPY' || code === 'MKD' ? 0 : 2,
      style: 'currency'
    }).format(value);
  }

  formatRate(value: number): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4, minimumFractionDigits: 4 }).format(value);
  }

  private clearTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
