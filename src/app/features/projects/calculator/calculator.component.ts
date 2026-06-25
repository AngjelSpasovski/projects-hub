import { Component, HostListener } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type CalculatorOperator = 'add' | 'subtract' | 'multiply' | 'divide';
type CalculatorAction = 'backspace' | 'clear' | 'decimal' | 'equals' | 'percent' | 'sign' | 'square' | 'squareRoot';

interface CalculatorButton {
  label: string;
  value: string;
  type: 'digit' | 'operator' | 'action';
  action?: CalculatorAction;
  operator?: CalculatorOperator;
  className?: string;
  gridArea: string;
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
    { label: 'C', value: 'clear', type: 'action', action: 'clear', className: 'utility', gridArea: 'clear' },
    { label: '⌫', value: 'backspace', type: 'action', action: 'backspace', className: 'utility', gridArea: 'back' },
    { label: '%', value: 'percent', type: 'action', action: 'percent', className: 'utility', gridArea: 'percent' },
    { label: '√', value: 'squareRoot', type: 'action', action: 'squareRoot', className: 'utility', gridArea: 'root' },
    { label: '÷', value: 'divide', type: 'operator', operator: 'divide', className: 'operator', gridArea: 'divide' },
    { label: '7', value: '7', type: 'digit', gridArea: 'seven' },
    { label: '8', value: '8', type: 'digit', gridArea: 'eight' },
    { label: '9', value: '9', type: 'digit', gridArea: 'nine' },
    { label: 'x²', value: 'square', type: 'action', action: 'square', className: 'utility', gridArea: 'square' },
    { label: '×', value: 'multiply', type: 'operator', operator: 'multiply', className: 'operator', gridArea: 'multiply' },
    { label: '4', value: '4', type: 'digit', gridArea: 'four' },
    { label: '5', value: '5', type: 'digit', gridArea: 'five' },
    { label: '6', value: '6', type: 'digit', gridArea: 'six' },
    { label: '+/-', value: 'sign', type: 'action', action: 'sign', className: 'utility', gridArea: 'sign' },
    { label: '-', value: 'subtract', type: 'operator', operator: 'subtract', className: 'operator', gridArea: 'subtract' },
    { label: '1', value: '1', type: 'digit', gridArea: 'one' },
    { label: '2', value: '2', type: 'digit', gridArea: 'two' },
    { label: '3', value: '3', type: 'digit', gridArea: 'three' },
    { label: '=', value: 'equals', type: 'action', action: 'equals', className: 'equals tall', gridArea: 'equals' },
    { label: '+', value: 'add', type: 'operator', operator: 'add', className: 'operator tall', gridArea: 'add' },
    { label: '0', value: '0', type: 'digit', className: 'zero', gridArea: 'zero' },
    { label: '.', value: 'decimal', type: 'action', action: 'decimal', gridArea: 'decimal' }
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
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      this.backspace();
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
    } else if (button.action === 'squareRoot') {
      this.applySquareRoot();
    } else if (button.action === 'square') {
      this.applySquare();
    } else if (button.action === 'backspace') {
      this.backspace();
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

    const inputValue = Number(this.displayValue);
    const percentValue =
      this.storedValue !== null && this.activeOperator ? this.storedValue * (inputValue / 100) : inputValue / 100;

    this.displayValue = this.formatNumber(percentValue);
  }

  applySquareRoot(): void {
    if (this.isErrorState()) {
      return;
    }

    const inputValue = Number(this.displayValue);

    if (inputValue < 0) {
      this.setError();
      return;
    }

    this.expression = `√(${this.formatNumber(inputValue)})`;
    this.displayValue = this.formatNumber(Math.sqrt(inputValue));
    this.waitingForOperand = true;
  }

  applySquare(): void {
    if (this.isErrorState()) {
      return;
    }

    const inputValue = Number(this.displayValue);
    this.expression = `${this.formatNumber(inputValue)}²`;
    this.displayValue = this.formatNumber(inputValue * inputValue);
    this.waitingForOperand = true;
  }

  backspace(): void {
    if (this.isErrorState()) {
      this.clear();
      return;
    }

    if (this.waitingForOperand) {
      return;
    }

    const nextValue = this.displayValue.length > 1 ? this.displayValue.slice(0, -1) : '0';
    this.displayValue = nextValue === '-' ? '0' : nextValue;
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
