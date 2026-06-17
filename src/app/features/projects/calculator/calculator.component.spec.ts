import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add two numbers', () => {
    component.inputDigit('1');
    component.inputDigit('2');
    component.chooseOperator('add');
    component.inputDigit('8');
    component.calculate();

    expect(component.displayValue).toBe('20');
  });

  it('should handle decimal multiplication', () => {
    component.inputDigit('2');
    component.inputDecimal();
    component.inputDigit('5');
    component.chooseOperator('multiply');
    component.inputDigit('4');
    component.calculate();

    expect(component.displayValue).toBe('10');
  });

  it('should show an error when dividing by zero', () => {
    component.inputDigit('8');
    component.chooseOperator('divide');
    component.inputDigit('0');
    component.calculate();

    expect(component.displayValue).toBe('Error');
  });
});
