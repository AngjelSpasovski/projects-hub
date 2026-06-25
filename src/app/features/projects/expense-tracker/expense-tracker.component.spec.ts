import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ExpenseTrackerComponent } from './expense-tracker.component';

describe('ExpenseTrackerComponent', () => {
  let component: ExpenseTrackerComponent;
  let fixture: ComponentFixture<ExpenseTrackerComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ExpenseTrackerComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with demo totals', () => {
    expect(component).toBeTruthy();
    expect(component.entries().length).toBe(3);
    expect(component.incomeTotal()).toBe(620);
    expect(component.expenseTotal()).toBe(103);
    expect(component.balance()).toBe(517);
  });

  it('should validate empty title and amount', () => {
    component.submitEntry();

    expect(component.isTitleInvalid()).toBeTrue();
    expect(component.isAmountInvalid()).toBeTrue();
    expect(component.entries().length).toBe(3);
  });

  it('should add an expense and persist it', () => {
    component.updateTitle('Coffee meeting');
    component.updateAmount('12.5');
    component.updateType('expense');
    component.updateCategory('food');
    component.updateDate('2026-06-24');
    component.submitEntry();

    expect(component.entries()[0]).toEqual(
      jasmine.objectContaining({
        title: 'Coffee meeting',
        amount: 12.5,
        type: 'expense',
        category: 'food'
      })
    );
    expect(localStorage.getItem('projects-hub-expense-tracker')).toContain('Coffee meeting');
  });

  it('should filter income and expenses', () => {
    component.updateFilter('income');
    expect(component.filteredEntries().every((entry) => entry.type === 'income')).toBeTrue();

    component.updateFilter('expense');
    expect(component.filteredEntries().every((entry) => entry.type === 'expense')).toBeTrue();
  });

  it('should edit and delete an entry', () => {
    const firstEntry = component.entries()[0];

    component.editEntry(firstEntry);
    component.updateTitle('Updated income');
    component.updateAmount('700');
    component.submitEntry();

    expect(component.entries()[0].title).toBe('Updated income');
    expect(component.incomeTotal()).toBe(700);

    component.deleteEntry(firstEntry.id);
    expect(component.entries().some((entry) => entry.id === firstEntry.id)).toBeFalse();
  });
});
