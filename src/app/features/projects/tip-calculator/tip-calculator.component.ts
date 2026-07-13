import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

interface TipPreset {
  labelKey: string;
  value: number;
}

const TIP_PRESETS: TipPreset[] = [
  { labelKey: 'TIP_CALCULATOR.PRESETS.TEN', value: 10 },
  { labelKey: 'TIP_CALCULATOR.PRESETS.FIFTEEN', value: 15 },
  { labelKey: 'TIP_CALCULATOR.PRESETS.EIGHTEEN', value: 18 },
  { labelKey: 'TIP_CALCULATOR.PRESETS.TWENTY', value: 20 }
];

const DEFAULT_BILL = '84.50';
const DEFAULT_TIP = '18';
const DEFAULT_PEOPLE = '2';

@Component({
  selector: 'app-tip-calculator',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './tip-calculator.component.html',
  styleUrl: './tip-calculator.component.scss'
})
export class TipCalculatorComponent {
  readonly presets = TIP_PRESETS;
  readonly billInput = signal(DEFAULT_BILL);
  readonly tipInput = signal(DEFAULT_TIP);
  readonly peopleInput = signal(DEFAULT_PEOPLE);
  readonly touched = signal(false);

  readonly billAmount = computed(() => Number(this.billInput()) || 0);
  readonly tipPercent = computed(() => Number(this.tipInput()) || 0);
  readonly peopleCount = computed(() => Math.floor(Number(this.peopleInput()) || 0));

  readonly isBillInvalid = computed(() => this.touched() && this.billAmount() <= 0);
  readonly isTipInvalid = computed(() => this.touched() && this.tipPercent() < 0);
  readonly isPeopleInvalid = computed(() => this.touched() && this.peopleCount() <= 0);
  readonly isValid = computed(() => this.billAmount() > 0 && this.tipPercent() >= 0 && this.peopleCount() > 0);

  readonly tipAmount = computed(() => (this.isValid() ? this.billAmount() * (this.tipPercent() / 100) : 0));
  readonly totalAmount = computed(() => (this.isValid() ? this.billAmount() + this.tipAmount() : 0));
  readonly tipPerPerson = computed(() => this.dividePerPerson(this.tipAmount()));
  readonly totalPerPerson = computed(() => this.dividePerPerson(this.totalAmount()));
  readonly billPerPerson = computed(() => this.dividePerPerson(this.billAmount()));
  readonly effectiveRate = computed(() => (this.isValid() ? `${this.tipPercent().toFixed(1)}%` : '0.0%'));

  updateBill(value: string): void {
    this.touched.set(true);
    this.billInput.set(this.decimalValue(value, 99999));
  }

  updateTip(value: string): void {
    this.touched.set(true);
    this.tipInput.set(this.decimalValue(value, 100));
  }

  updatePeople(value: string): void {
    this.touched.set(true);
    const numericValue = this.onlyDigits(value).slice(0, 3);
    this.peopleInput.set(numericValue);
  }

  selectTip(value: number): void {
    this.touched.set(true);
    this.tipInput.set(value.toString());
  }

  reset(): void {
    this.billInput.set(DEFAULT_BILL);
    this.tipInput.set(DEFAULT_TIP);
    this.peopleInput.set(DEFAULT_PEOPLE);
    this.touched.set(false);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: 'currency'
    }).format(value);
  }

  private dividePerPerson(value: number): number {
    return this.isValid() ? value / this.peopleCount() : 0;
  }

  private decimalValue(value: string, maxValue: number): string {
    const normalizedValue = value.replace(',', '.').replace(/[^\d.]/g, '');
    const [whole = '', fraction = ''] = normalizedValue.split('.');
    const nextValue = `${whole.slice(0, 5)}${normalizedValue.includes('.') ? `.${fraction.slice(0, 2)}` : ''}`;
    const numericValue = Number(nextValue);

    if (numericValue > maxValue) {
      return maxValue.toString();
    }

    return nextValue;
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }
}
