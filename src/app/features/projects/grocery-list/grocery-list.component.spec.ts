import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { GroceryListComponent } from './grocery-list.component';

describe('GroceryListComponent', () => {
  let component: GroceryListComponent;
  let fixture: ComponentFixture<GroceryListComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [GroceryListComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with demo items', () => {
    expect(component).toBeTruthy();
    expect(component.items().length).toBe(3);
    expect(component.activeCount()).toBe(2);
    expect(component.purchasedCount()).toBe(1);
  });

  it('should validate name and quantity before adding', () => {
    component.updateQuantity('0');
    component.submitItem();

    expect(component.isNameInvalid()).toBeTrue();
    expect(component.isQuantityInvalid()).toBeTrue();
    expect(component.items().length).toBe(3);
  });

  it('should add an item and persist it', () => {
    component.updateName('Coffee beans');
    component.updateQuantity('2');
    component.updateCategory('pantry');
    component.submitItem();

    expect(component.items()[0]).toEqual(
      jasmine.objectContaining({
        category: 'pantry',
        name: 'Coffee beans',
        purchased: false,
        quantity: 2
      })
    );
    expect(localStorage.getItem('projects-hub-grocery-list')).toContain('Coffee beans');
  });

  it('should filter by state and category', () => {
    component.updateFilter('purchased');
    expect(component.filteredItems().every((item) => item.purchased)).toBeTrue();

    component.updateFilter('all');
    component.updateCategoryFilter('dairy');
    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].name).toBe('Greek yogurt');
  });

  it('should edit, purchase, and delete an item', () => {
    const item = component.items()[0];

    component.editItem(item);
    component.updateName('Green apples');
    component.updateQuantity('8');
    component.submitItem();

    expect(component.items()[0].name).toBe('Green apples');
    expect(component.items()[0].quantity).toBe(8);

    component.togglePurchased(item.id);
    expect(component.items()[0].purchased).toBeTrue();

    component.deleteItem(item.id);
    expect(component.items().some((entry) => entry.id === item.id)).toBeFalse();
  });

  it('should clear purchased items', () => {
    component.clearPurchased();

    expect(component.items().length).toBe(2);
    expect(component.purchasedCount()).toBe(0);
  });
});
