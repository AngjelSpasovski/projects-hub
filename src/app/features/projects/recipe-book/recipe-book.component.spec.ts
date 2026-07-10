import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { RecipeBookComponent } from './recipe-book.component';

describe('RecipeBookComponent', () => {
  let component: RecipeBookComponent;
  let fixture: ComponentFixture<RecipeBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeBookComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with demo recipes and selected detail', () => {
    expect(component.recipes().length).toBe(3);
    expect(component.selectedRecipe()?.name).toBe('Summer Pasta');
    expect(component.ingredientCount()).toBe(9);
  });

  it('filters and selects recipes', () => {
    component.updateSearch('chicken');

    expect(component.filteredRecipes().length).toBe(1);
    expect(component.filteredRecipes()[0].name).toBe('Chicken Rice Bowl');

    component.selectRecipe(component.filteredRecipes()[0].id);
    expect(component.selectedRecipe()?.name).toBe('Chicken Rice Bowl');
  });

  it('adds a recipe with reactive form validation', () => {
    component.addRecipe();

    expect(component.recipeForm.invalid).toBeTrue();
    expect(component.recipes().length).toBe(3);

    component.recipeForm.setValue({
      name: 'Herb Omelette',
      description: 'Fast breakfast recipe with a small ingredient list.',
      category: 'main',
      prepTime: 15,
      ingredientName: 'Eggs',
      ingredientAmount: 3
    });
    component.addRecipe();

    expect(component.recipes()[0].name).toBe('Herb Omelette');
    expect(component.selectedRecipe()?.name).toBe('Herb Omelette');
  });

  it('moves selected recipe ingredients to the shopping list', () => {
    const beforeCount = component.shoppingItems().length;

    component.addSelectedIngredientsToShoppingList();

    expect(component.shoppingItems().length).toBe(beforeCount + 3);
    expect(component.shoppingItems()[0].name).toBe('Pasta');
  });

  it('adds and removes shopping ingredients', () => {
    component.shoppingForm.setValue({ name: 'Olive oil', amount: 1 });
    component.addShoppingIngredient();

    expect(component.shoppingItems()[0].name).toBe('Olive oil');

    component.removeShoppingIngredient(0);

    expect(component.shoppingItems().some((item) => item.name === 'Olive oil')).toBeFalse();
  });
});
