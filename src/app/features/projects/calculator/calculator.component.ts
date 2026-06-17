import { Component, HostListener } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type CalculatorOperator = 'add' | 'subtract' | 'multiply' | 'divide';
type CalculatorAction = 'clear' | 'sign' | 'percent' | 'decimal' | 'equals';

interface CalculatorButton {
  label: string;
  value: string;
  type: 'digit' | 'operator' | 'action';
  action?: CalculatorAction;
  operator?: CalculatorOperator;
  className?: string;
}

const MAX_DISPLAY_LENGTH = 12;

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  displayValue = '0';
  expression = '';
  private storedValue: number | null = null;
  private activeOperator: CalculatorOperator | null = null;
  private waitingForOperand = false;

  readonly buttons: CalculatorButton[] = [
    { label: 'C', value: 'clear', type: 'action', action: 'clear', className: 'utility' },
    { label: '+/-', value: 'sign', type: 'action', action: 'sign', className: 'utility' },
    { label: '%', value: 'percent', type: 'action', action: 'percent', className: 'utility' },
    { label: '÷', value: 'divide', type: 'operator', operator: 'divide', className: 'operator' },
    { label: '7', value: '7', type: 'digit' },
    { label: '8', value: '8', type: 'digit' },
    { label: '9', value: '9', type: 'digit' },
    { label: '×', value: 'multiply', type: 'operator', operator: 'multiply', className: 'operator' },
    { label: '4', value: '4', type: 'digit' },
    { label: '5', value: '5', type: 'digit' },
    { label: '6', value: '6', type: 'digit' },
    { label: '-', value: 'subtract', type: 'operator', operator: 'subtract', className: 'operator' },
    { label: '1', value: '1', type: 'digit' },
    { label: '2', value: '2', type: 'digit' },
    { label: '3', value: '3', type: 'digit' },
    { label: '+', value: 'add', type: 'operator', operator: 'add', className: 'operator' },
    { label: '0', value: '0', type: 'digit', className: 'zero' },
    { label: '.', value: 'decimal', type: 'action', action: 'decimal' },
    { label: '=', value: 'equals', type: 'action', action: 'equals', className: 'equals' }
  ];

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      this.inputDigit(event.key);
      return;
    }

    const operators: Record<string, CalculatorOperator> = {
      '+': 'add',
      '-': 'subtract',
      '*': 'multiply',
      '/': 'divide'
    };

    if (operators[event.key]) {
      event.preventDefault();
      this.chooseOperator(operators[event.key]);
      return;
    }

    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
      this.inputDecimal();
      return;
    }

    if (event.key === 'Enter' || event.key === '=') {
      event.preventDefault();
      this.calculate();
      return;
    }

    if (event.key === 'Escape' || event.key.toLowerCase() === 'c') {
      event.preventDefault();
      this.clear();
      return;
    }

    if (event.key === '%') {
      event.preventDefault();
      this.applyPercent();
    }
  }

  handleButton(button: CalculatorButton): void {
    if (button.type === 'digit') {
      this.inputDigit(button.value);
      return;
    }

    if (button.type === 'operator' && button.operator) {
      this.chooseOperator(button.operator);
      return;
    }

    if (button.action === 'clear') {
      this.clear();
    } else if (button.action === 'sign') {
      this.toggleSign();
    } else if (button.action === 'percent') {
      this.applyPercent();
    } else if (button.action === 'decimal') {
      this.inputDecimal();
    } else if (button.action === 'equals') {
      this.calculate();
    }
  }

  inputDigit(digit: string): void {
    if (this.isErrorState()) {
      this.clear();
    }

    if (this.waitingForOperand) {
      this.displayValue = digit;
      this.waitingForOperand = false;
      return;
    }

    if (this.displayValue.replace('.', '').replace('-', '').length >= MAX_DISPLAY_LENGTH) {
      return;
    }

    this.displayValue = this.displayValue === '0' ? digit : `${this.displayValue}${digit}`;
  }

  inputDecimal(): void {
    if (this.isErrorState()) {
      this.clear();
    }

    if (this.waitingForOperand) {
      this.displayValue = '0.';
      this.waitingForOperand = false;
      return;
    }

    if (!this.displayValue.includes('.')) {
      this.displayValue = `${this.displayValue}.`;
    }
  }

  chooseOperator(operator: CalculatorOperator): void {
    if (this.isErrorState()) {
      this.clear();
      return;
    }

    const inputValue = Number(this.displayValue);

    if (this.storedValue === null) {
      this.storedValue = inputValue;
    } else if (this.activeOperator) {
      const result = this.performCalculation(this.storedValue, inputValue, this.activeOperator);

      if (result === null) {
        this.setError();
        return;
      }

      this.storedValue = result;
      this.displayValue = this.formatNumber(result);
    }

    this.activeOperator = operator;
    this.waitingForOperand = true;
    this.expression = `${this.formatNumber(this.storedValue)} ${this.operatorSymbol(operator)}`;
  }

  calculate(): void {
    if (this.storedValue === null || this.activeOperator === null || this.isErrorState()) {
      return;
    }

    const inputValue = Number(this.displayValue);
    const result = this.performCalculation(this.storedValue, inputValue, this.activeOperator);

    if (result === null) {
      this.setError();
      return;
    }

    this.expression = `${this.formatNumber(this.storedValue)} ${this.operatorSymbol(this.activeOperator)} ${this.formatNumber(inputValue)} =`;
    this.displayValue = this.formatNumber(result);
    this.storedValue = null;
    this.activeOperator = null;
    this.waitingForOperand = true;
  }

  clear(): void {
    this.displayValue = '0';
    this.expression = '';
    this.storedValue = null;
    this.activeOperator = null;
    this.waitingForOperand = false;
  }

  toggleSign(): void {
    if (this.isErrorState() || this.displayValue === '0') {
      return;
    }

    this.displayValue = this.displayValue.startsWith('-') ? this.displayValue.slice(1) : `-${this.displayValue}`;
  }

  applyPercent(): void {
    if (this.isErrorState()) {
      return;
    }

    this.displayValue = this.formatNumber(Number(this.displayValue) / 100);
  }

  private performCalculation(first: number, second: number, operator: CalculatorOperator): number | null {
    if (operator === 'add') {
      return first + second;
    }

    if (operator === 'subtract') {
      return first - second;
    }

    if (operator === 'multiply') {
      return first * second;
    }

    if (second === 0) {
      return null;
    }

    return first / second;
  }

  private formatNumber(value: number | null): string {
    if (value === null || !Number.isFinite(value)) {
      return 'Error';
    }

    const rounded = Number(value.toPrecision(MAX_DISPLAY_LENGTH));
    return String(rounded);
  }

  private operatorSymbol(operator: CalculatorOperator): string {
    return {
      add: '+',
      subtract: '-',
      multiply: '×',
      divide: '÷'
    }[operator];
  }

  private setError(): void {
    this.displayValue = 'Error';
    this.expression = '';
    this.storedValue = null;
    this.activeOperator = null;
    this.waitingForOperand = true;
  }

  private isErrorState(): boolean {
    return this.displayValue === 'Error';
  }
}
