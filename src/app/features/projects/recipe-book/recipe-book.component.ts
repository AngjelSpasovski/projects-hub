import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

type RecipeCategory = 'main' | 'vegetarian' | 'dessert';

interface Ingredient {
  name: string;
  amount: number;
}

interface RecipeItem {
  id: number;
  name: string;
  description: string;
  category: RecipeCategory;
  prepTime: number;
  ingredients: Ingredient[];
}

const DEFAULT_RECIPES: RecipeItem[] = [
  {
    id: 1,
    name: 'Summer Pasta',
    description: 'Light pasta with tomato sauce, basil, and quick prep steps.',
    category: 'vegetarian',
    prepTime: 25,
    ingredients: [
      { name: 'Pasta', amount: 1 },
      { name: 'Tomatoes', amount: 4 },
      { name: 'Fresh basil', amount: 1 }
    ]
  },
  {
    id: 2,
    name: 'Chicken Rice Bowl',
    description: 'Simple protein bowl with rice, vegetables, and a clean shopping list handoff.',
    category: 'main',
    prepTime: 35,
    ingredients: [
      { name: 'Chicken breast', amount: 2 },
      { name: 'Rice', amount: 1 },
      { name: 'Mixed vegetables', amount: 3 }
    ]
  },
  {
    id: 3,
    name: 'Berry Pancakes',
    description: 'Dessert style recipe for testing recipe detail and ingredient transfer flows.',
    category: 'dessert',
    prepTime: 20,
    ingredients: [
      { name: 'Flour', amount: 2 },
      { name: 'Eggs', amount: 2 },
      { name: 'Berries', amount: 1 }
    ]
  }
];

@Component({
  selector: 'app-recipe-book',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './recipe-book.component.html',
  styleUrl: './recipe-book.component.scss'
})
export class RecipeBookComponent {
  readonly categories: RecipeCategory[] = ['main', 'vegetarian', 'dessert'];
  readonly recipes = signal<RecipeItem[]>(DEFAULT_RECIPES);
  readonly selectedRecipeId = signal(DEFAULT_RECIPES[0].id);
  readonly searchTerm = signal('');

  readonly recipeForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(48)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(140)] }),
    category: new FormControl<RecipeCategory>('main', { nonNullable: true, validators: [Validators.required] }),
    prepTime: new FormControl(30, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(5), Validators.max(240)]
    }),
    ingredientName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(40)] }),
    ingredientAmount: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(99)]
    })
  });

  readonly shoppingForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(40)] }),
    amount: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(99)]
    })
  });

  readonly shoppingItems = signal<Ingredient[]>([
    { name: 'Apples', amount: 5 },
    { name: 'Tomatoes', amount: 10 }
  ]);

  readonly filteredRecipes = computed(() => {
    const searchTerm = this.searchTerm().trim().toLowerCase();

    if (!searchTerm) {
      return this.recipes();
    }

    return this.recipes().filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.category.toLowerCase().includes(searchTerm)
    );
  });

  readonly selectedRecipe = computed(() => {
    const selectedId = this.selectedRecipeId();
    return this.recipes().find((recipe) => recipe.id === selectedId) ?? this.recipes()[0];
  });

  readonly recipeCount = computed(() => this.recipes().length);
  readonly ingredientCount = computed(() =>
    this.recipes().reduce((total, recipe) => total + recipe.ingredients.length, 0)
  );
  readonly shoppingCount = computed(() => this.shoppingItems().reduce((total, item) => total + item.amount, 0));

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  selectRecipe(recipeId: number): void {
    this.selectedRecipeId.set(recipeId);
  }

  addRecipe(): void {
    this.recipeForm.markAllAsTouched();

    if (this.recipeForm.invalid) {
      return;
    }

    const rawRecipe = this.recipeForm.getRawValue();
    const recipe: RecipeItem = {
      id: Date.now(),
      name: rawRecipe.name.trim(),
      description: rawRecipe.description.trim(),
      category: rawRecipe.category,
      prepTime: rawRecipe.prepTime,
      ingredients: [
        {
          name: rawRecipe.ingredientName.trim(),
          amount: rawRecipe.ingredientAmount
        }
      ]
    };

    this.recipes.update((recipes) => [recipe, ...recipes]);
    this.selectedRecipeId.set(recipe.id);
    this.recipeForm.reset({
      name: '',
      description: '',
      category: 'main',
      prepTime: 30,
      ingredientName: '',
      ingredientAmount: 1
    });
  }

  deleteSelectedRecipe(): void {
    const selectedRecipe = this.selectedRecipe();

    if (!selectedRecipe || this.recipes().length <= 1) {
      return;
    }

    this.recipes.update((recipes) => recipes.filter((recipe) => recipe.id !== selectedRecipe.id));
    this.selectedRecipeId.set(this.recipes()[0].id);
  }

  addSelectedIngredientsToShoppingList(): void {
    const selectedRecipe = this.selectedRecipe();

    if (!selectedRecipe) {
      return;
    }

    this.shoppingItems.update((items) => [...selectedRecipe.ingredients, ...items]);
  }

  addShoppingIngredient(): void {
    this.shoppingForm.markAllAsTouched();

    if (this.shoppingForm.invalid) {
      return;
    }

    const rawIngredient = this.shoppingForm.getRawValue();
    this.shoppingItems.update((items) => [
      {
        name: rawIngredient.name.trim(),
        amount: rawIngredient.amount
      },
      ...items
    ]);
    this.shoppingForm.reset({ name: '', amount: 1 });
  }

  removeShoppingIngredient(index: number): void {
    this.shoppingItems.update((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  resetDemo(): void {
    this.recipes.set(DEFAULT_RECIPES);
    this.selectedRecipeId.set(DEFAULT_RECIPES[0].id);
    this.shoppingItems.set([
      { name: 'Apples', amount: 5 },
      { name: 'Tomatoes', amount: 10 }
    ]);
    this.searchTerm.set('');
  }

  categoryKey(category: RecipeCategory): string {
    return `RECIPE_BOOK.CATEGORIES.${category.toUpperCase()}`;
  }
}
