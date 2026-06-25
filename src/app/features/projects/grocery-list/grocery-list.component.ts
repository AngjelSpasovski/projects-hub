import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

type GroceryCategory = 'produce' | 'bakery' | 'dairy' | 'pantry' | 'household';
type GroceryFilter = 'all' | 'active' | 'purchased';

interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  category: GroceryCategory;
  purchased: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'projects-hub-grocery-list';
const NAME_MAX_LENGTH = 44;
const DEFAULT_ITEMS: GroceryItem[] = [
  {
    id: 1,
    name: 'Apples',
    quantity: 6,
    category: 'produce',
    purchased: false,
    createdAt: '2026-06-25'
  },
  {
    id: 2,
    name: 'Whole grain bread',
    quantity: 1,
    category: 'bakery',
    purchased: true,
    createdAt: '2026-06-25'
  },
  {
    id: 3,
    name: 'Greek yogurt',
    quantity: 2,
    category: 'dairy',
    purchased: false,
    createdAt: '2026-06-25'
  }
];

@Component({
  selector: 'app-grocery-list',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './grocery-list.component.html',
  styleUrl: './grocery-list.component.scss'
})
export class GroceryListComponent {
  readonly nameMaxLength = NAME_MAX_LENGTH;
  readonly categories: GroceryCategory[] = ['produce', 'bakery', 'dairy', 'pantry', 'household'];
  readonly items = signal<GroceryItem[]>(this.loadItems());
  readonly filter = signal<GroceryFilter>('all');
  readonly categoryFilter = signal<GroceryCategory | 'all'>('all');
  readonly editingId = signal<number | null>(null);
  readonly draftName = signal('');
  readonly draftQuantity = signal(1);
  readonly draftCategory = signal<GroceryCategory>('produce');
  readonly nameTouched = signal(false);

  readonly activeCount = computed(() => this.items().filter((item) => !item.purchased).length);
  readonly purchasedCount = computed(() => this.items().filter((item) => item.purchased).length);
  readonly totalQuantity = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
  readonly filteredItems = computed(() => {
    const filter = this.filter();
    const categoryFilter = this.categoryFilter();

    return this.items().filter((item) => {
      const matchesState =
        filter === 'all' || (filter === 'active' && !item.purchased) || (filter === 'purchased' && item.purchased);
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

      return matchesState && matchesCategory;
    });
  });
  readonly isNameInvalid = computed(() => this.nameTouched() && this.draftName().trim().length === 0);
  readonly isQuantityInvalid = computed(() => !Number.isFinite(this.draftQuantity()) || this.draftQuantity() <= 0);

  updateName(value: string): void {
    this.draftName.set(value.slice(0, NAME_MAX_LENGTH));
  }

  updateQuantity(value: string): void {
    this.draftQuantity.set(Number(value));
  }

  updateCategory(value: string): void {
    this.draftCategory.set(value as GroceryCategory);
  }

  updateFilter(value: GroceryFilter): void {
    this.filter.set(value);
  }

  updateCategoryFilter(value: string): void {
    this.categoryFilter.set(value as GroceryCategory | 'all');
  }

  submitItem(): void {
    this.nameTouched.set(true);

    const name = this.draftName().trim();

    if (!name || this.isQuantityInvalid()) {
      return;
    }

    const editingId = this.editingId();

    if (editingId) {
      this.items.update((items) =>
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                category: this.draftCategory(),
                name,
                quantity: this.draftQuantity()
              }
            : item
        )
      );
    } else {
      this.items.update((items) => [
        {
          category: this.draftCategory(),
          createdAt: this.today(),
          id: Date.now(),
          name,
          purchased: false,
          quantity: this.draftQuantity()
        },
        ...items
      ]);
    }

    this.persistItems();
    this.resetDraft();
  }

  editItem(item: GroceryItem): void {
    this.editingId.set(item.id);
    this.draftName.set(item.name);
    this.draftQuantity.set(item.quantity);
    this.draftCategory.set(item.category);
    this.nameTouched.set(false);
  }

  cancelEdit(): void {
    this.resetDraft();
  }

  togglePurchased(itemId: number): void {
    this.items.update((items) =>
      items.map((item) => (item.id === itemId ? { ...item, purchased: !item.purchased } : item))
    );
    this.persistItems();
  }

  deleteItem(itemId: number): void {
    this.items.update((items) => items.filter((item) => item.id !== itemId));

    if (this.editingId() === itemId) {
      this.resetDraft();
    }

    this.persistItems();
  }

  clearPurchased(): void {
    this.items.update((items) => items.filter((item) => !item.purchased));
    this.persistItems();
  }

  resetDemo(): void {
    this.items.set(DEFAULT_ITEMS);
    this.filter.set('all');
    this.categoryFilter.set('all');
    this.resetDraft();
    this.persistItems();
  }

  categoryKey(category: GroceryCategory): string {
    return `GROCERY_LIST.CATEGORIES.${category.toUpperCase()}`;
  }

  private resetDraft(): void {
    this.editingId.set(null);
    this.draftName.set('');
    this.draftQuantity.set(1);
    this.draftCategory.set('produce');
    this.nameTouched.set(false);
  }

  private loadItems(): GroceryItem[] {
    const storedItems = localStorage.getItem(STORAGE_KEY);

    if (!storedItems) {
      return DEFAULT_ITEMS;
    }

    try {
      const parsedItems = JSON.parse(storedItems) as GroceryItem[];
      return Array.isArray(parsedItems) ? parsedItems : DEFAULT_ITEMS;
    } catch {
      return DEFAULT_ITEMS;
    }
  }

  private persistItems(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
