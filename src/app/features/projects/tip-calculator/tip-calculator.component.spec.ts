import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { TipCalculatorComponent } from './tip-calculator.component';

describe('TipCalculatorComponent', () => {
  let component: TipCalculatorComponent;
  let fixture: ComponentFixture<TipCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipCalculatorComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(TipCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with a valid demo split', () => {
    expect(component.billAmount()).toBe(84.5);
    expect(component.tipPercent()).toBe(18);
    expect(component.peopleCount()).toBe(2);
    expect(component.tipAmount()).toBeCloseTo(15.21, 2);
    expect(component.totalPerPerson()).toBeCloseTo(49.86, 2);
  });

  it('calculates custom bill, tip, and people split', () => {
    component.updateBill('120');
    component.selectTip(20);
    component.updatePeople('3');

    expect(component.tipAmount()).toBe(24);
    expect(component.totalAmount()).toBe(144);
    expect(component.tipPerPerson()).toBe(8);
    expect(component.totalPerPerson()).toBe(48);
  });

  it('sanitizes decimal and numeric input', () => {
    component.updateBill('$96.755');
    component.updateTip('18.999');
    component.updatePeople('04 people');

    expect(component.billInput()).toBe('96.75');
    expect(component.tipInput()).toBe('18.99');
    expect(component.peopleInput()).toBe('04');
    expect(component.peopleCount()).toBe(4);
  });

  it('shows invalid state for zero bill or people', () => {
    component.updateBill('0');
    component.updatePeople('0');

    expect(component.isValid()).toBeFalse();
    expect(component.isBillInvalid()).toBeTrue();
    expect(component.isPeopleInvalid()).toBeTrue();
    expect(component.totalPerPerson()).toBe(0);
  });

  it('resets to the demo values', () => {
    component.updateBill('10');
    component.updateTip('0');
    component.updatePeople('1');
    component.reset();

    expect(component.billInput()).toBe('84.50');
    expect(component.tipInput()).toBe('18');
    expect(component.peopleInput()).toBe('2');
    expect(component.touched()).toBeFalse();
  });
});
