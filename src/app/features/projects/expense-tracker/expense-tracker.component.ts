import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

type EntryType = 'income' | 'expense';
type EntryCategory = 'salary' | 'freelance' | 'food' | 'transport' | 'tools' | 'learning' | 'other';
type EntryFilter = 'all' | EntryType;

interface ExpenseEntry {
  id: number;
  title: string;
  amount: number;
  type: EntryType;
  category: EntryCategory;
  date: string;
}

const STORAGE_KEY = 'projects-hub-expense-tracker';
const TITLE_MAX_LENGTH = 48;
const DEFAULT_ENTRIES: ExpenseEntry[] = [
  { id: 1, title: 'Frontend freelance work', amount: 620, type: 'income', category: 'freelance', date: '2026-06-20' },
  { id: 2, title: 'Angular course', amount: 79, type: 'expense', category: 'learning', date: '2026-06-21' },
  { id: 3, title: 'Design tools', amount: 24, type: 'expense', category: 'tools', date: '2026-06-22' }
];

Chart.register(...registerables);

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './expense-tracker.component.html',
  styleUrl: './expense-tracker.component.scss'
})
export class ExpenseTrackerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('summaryChart') private readonly summaryChart?: ElementRef<HTMLCanvasElement>;

  readonly titleMaxLength = TITLE_MAX_LENGTH;
  readonly entries = signal<ExpenseEntry[]>(this.loadEntries());
  readonly filter = signal<EntryFilter>('all');
  readonly editingId = signal<number | null>(null);
  readonly draftTitle = signal('');
  readonly draftAmount = signal<number | null>(null);
  readonly draftType = signal<EntryType>('expense');
  readonly draftCategory = signal<EntryCategory>('food');
  readonly draftDate = signal(new Date().toISOString().slice(0, 10));
  readonly titleTouched = signal(false);
  readonly amountTouched = signal(false);

  private chart: Chart<'doughnut', number[], string> | null = null;

  readonly filteredEntries = computed(() => {
    const filter = this.filter();

    if (filter === 'all') {
      return this.entries();
    }

    return this.entries().filter((entry) => entry.type === filter);
  });
  readonly incomeTotal = computed(() => this.totalByType('income'));
  readonly expenseTotal = computed(() => this.totalByType('expense'));
  readonly balance = computed(() => this.incomeTotal() - this.expenseTotal());
  readonly isTitleInvalid = computed(() => this.titleTouched() && this.draftTitle().trim().length === 0);
  readonly isAmountInvalid = computed(() => this.amountTouched() && (!this.draftAmount() || this.draftAmount()! <= 0));

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  updateTitle(value: string): void {
    this.draftTitle.set(value.slice(0, TITLE_MAX_LENGTH));
  }

  updateAmount(value: string): void {
    const amount = Number(value);
    this.draftAmount.set(Number.isFinite(amount) ? amount : null);
  }

  updateType(value: string): void {
    const type = value as EntryType;
    this.draftType.set(type);
    this.draftCategory.set(type === 'income' ? 'salary' : 'food');
  }

  updateCategory(value: string): void {
    this.draftCategory.set(value as EntryCategory);
  }

  updateDate(value: string): void {
    this.draftDate.set(value);
  }

  updateFilter(value: EntryFilter): void {
    this.filter.set(value);
  }

  submitEntry(): void {
    this.titleTouched.set(true);
    this.amountTouched.set(true);

    const title = this.draftTitle().trim();
    const amount = this.draftAmount();

    if (!title || !amount || amount <= 0) {
      return;
    }

    const editingId = this.editingId();
    const entry: ExpenseEntry = {
      id: editingId ?? Date.now(),
      title,
      amount: Math.round(amount * 100) / 100,
      type: this.draftType(),
      category: this.draftCategory(),
      date: this.draftDate()
    };

    if (editingId) {
      this.entries.update((entries) => entries.map((current) => (current.id === editingId ? entry : current)));
    } else {
      this.entries.update((entries) => [entry, ...entries]);
    }

    this.persistEntries();
    this.resetDraft();
    this.renderChart();
  }

  editEntry(entry: ExpenseEntry): void {
    this.editingId.set(entry.id);
    this.draftTitle.set(entry.title);
    this.draftAmount.set(entry.amount);
    this.draftType.set(entry.type);
    this.draftCategory.set(entry.category);
    this.draftDate.set(entry.date);
    this.titleTouched.set(false);
    this.amountTouched.set(false);
  }

  deleteEntry(entryId: number): void {
    this.entries.update((entries) => entries.filter((entry) => entry.id !== entryId));

    if (this.editingId() === entryId) {
      this.resetDraft();
    }

    this.persistEntries();
    this.renderChart();
  }

  cancelEdit(): void {
    this.resetDraft();
  }

  resetDemo(): void {
    this.entries.set(this.cloneDefaultEntries());
    this.filter.set('all');
    this.resetDraft();
    this.persistEntries();
    this.renderChart();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { currency: 'EUR', style: 'currency' }).format(value);
  }

  incomeCategories(): EntryCategory[] {
    return ['salary', 'freelance', 'other'];
  }

  expenseCategories(): EntryCategory[] {
    return ['food', 'transport', 'tools', 'learning', 'other'];
  }

  private totalByType(type: EntryType): number {
    return this.entries()
      .filter((entry) => entry.type === type)
      .reduce((total, entry) => total + entry.amount, 0);
  }

  private renderChart(): void {
    const canvas = this.summaryChart?.nativeElement;

    if (!canvas) {
      return;
    }

    const data = [this.incomeTotal(), this.expenseTotal()];
    const config: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [
          {
            data,
            backgroundColor: ['#65c89f', '#ef767a'],
            borderColor: 'transparent',
            borderWidth: 4
          }
        ]
      },
      options: {
        cutout: '68%',
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#dbe7f5',
              font: { weight: 'bold' }
            },
            position: 'bottom'
          }
        }
      }
    };

    this.chart?.destroy();
    this.chart = new Chart(canvas, config);
  }

  private resetDraft(): void {
    this.editingId.set(null);
    this.draftTitle.set('');
    this.draftAmount.set(null);
    this.draftType.set('expense');
    this.draftCategory.set('food');
    this.draftDate.set(new Date().toISOString().slice(0, 10));
    this.titleTouched.set(false);
    this.amountTouched.set(false);
  }

  private loadEntries(): ExpenseEntry[] {
    const storedEntries = localStorage.getItem(STORAGE_KEY);

    if (!storedEntries) {
      return this.cloneDefaultEntries();
    }

    try {
      const parsedEntries = JSON.parse(storedEntries) as ExpenseEntry[];
      return Array.isArray(parsedEntries) ? parsedEntries : this.cloneDefaultEntries();
    } catch {
      return this.cloneDefaultEntries();
    }
  }

  private persistEntries(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries()));
  }

  private cloneDefaultEntries(): ExpenseEntry[] {
    return DEFAULT_ENTRIES.map((entry) => ({ ...entry }));
  }
}
