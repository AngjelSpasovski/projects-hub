import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

type TodoFilter = 'all' | 'active' | 'completed';
type TodoPriority = 'low' | 'medium' | 'high';

interface TodoItem {
  id: number;
  title: string;
  notes: string;
  priority: TodoPriority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'projects-hub-todo-list';
const TITLE_MAX_LENGTH = 64;
const DEFAULT_TASKS: TodoItem[] = [
  {
    id: 1,
    title: 'Plan project README',
    notes: 'Outline setup, features, and screenshots.',
    priority: 'high',
    dueDate: '',
    completed: false,
    createdAt: '2026-06-24'
  },
  {
    id: 2,
    title: 'Polish catalog card layout',
    notes: 'Keep summaries compact and actions aligned.',
    priority: 'medium',
    dueDate: '',
    completed: true,
    createdAt: '2026-06-24'
  }
];

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  readonly titleMaxLength = TITLE_MAX_LENGTH;
  readonly tasks = signal<TodoItem[]>(this.loadTasks());
  readonly filter = signal<TodoFilter>('all');
  readonly editingId = signal<number | null>(null);
  readonly draftTitle = signal('');
  readonly draftNotes = signal('');
  readonly draftPriority = signal<TodoPriority>('medium');
  readonly draftDueDate = signal('');
  readonly titleTouched = signal(false);

  readonly activeCount = computed(() => this.tasks().filter((task) => !task.completed).length);
  readonly completedCount = computed(() => this.tasks().filter((task) => task.completed).length);
  readonly filteredTasks = computed(() => {
    const filter = this.filter();

    if (filter === 'active') {
      return this.tasks().filter((task) => !task.completed);
    }

    if (filter === 'completed') {
      return this.tasks().filter((task) => task.completed);
    }

    return this.tasks();
  });
  readonly isTitleInvalid = computed(() => this.titleTouched() && this.draftTitle().trim().length === 0);

  updateTitle(value: string): void {
    this.draftTitle.set(value.slice(0, TITLE_MAX_LENGTH));
  }

  updateNotes(value: string): void {
    this.draftNotes.set(value);
  }

  updatePriority(value: string): void {
    this.draftPriority.set(value as TodoPriority);
  }

  updateDueDate(value: string): void {
    this.draftDueDate.set(value);
  }

  openDatePicker(input: HTMLInputElement): void {
    input.focus();

    try {
      (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
    } catch {
      // Some browsers only allow showPicker during direct user activation.
    }
  }

  updateFilter(value: TodoFilter): void {
    this.filter.set(value);
  }

  submitTask(): void {
    this.titleTouched.set(true);

    const title = this.draftTitle().trim();

    if (!title) {
      return;
    }

    const editingId = this.editingId();

    if (editingId) {
      this.tasks.update((tasks) =>
        tasks.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title,
                notes: this.draftNotes().trim(),
                priority: this.draftPriority(),
                dueDate: this.draftDueDate()
              }
            : task
        )
      );
    } else {
      this.tasks.update((tasks) => [
        {
          id: Date.now(),
          title,
          notes: this.draftNotes().trim(),
          priority: this.draftPriority(),
          dueDate: this.draftDueDate(),
          completed: false,
          createdAt: new Date().toISOString().slice(0, 10)
        },
        ...tasks
      ]);
    }

    this.persistTasks();
    this.resetDraft();
  }

  editTask(task: TodoItem): void {
    this.editingId.set(task.id);
    this.draftTitle.set(task.title);
    this.draftNotes.set(task.notes);
    this.draftPriority.set(task.priority);
    this.draftDueDate.set(task.dueDate);
    this.titleTouched.set(false);
  }

  cancelEdit(): void {
    this.resetDraft();
  }

  toggleTask(taskId: number): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
    this.persistTasks();
  }

  deleteTask(taskId: number): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));

    if (this.editingId() === taskId) {
      this.resetDraft();
    }

    this.persistTasks();
  }

  clearCompleted(): void {
    this.tasks.update((tasks) => tasks.filter((task) => !task.completed));
    this.persistTasks();
  }

  resetDemo(): void {
    this.tasks.set(DEFAULT_TASKS);
    this.filter.set('all');
    this.resetDraft();
    this.persistTasks();
  }

  private resetDraft(): void {
    this.editingId.set(null);
    this.draftTitle.set('');
    this.draftNotes.set('');
    this.draftPriority.set('medium');
    this.draftDueDate.set('');
    this.titleTouched.set(false);
  }

  private loadTasks(): TodoItem[] {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if (!storedTasks) {
      return DEFAULT_TASKS;
    }

    try {
      const parsedTasks = JSON.parse(storedTasks) as TodoItem[];
      return Array.isArray(parsedTasks) ? parsedTasks : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  }

  private persistTasks(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks()));
  }
}
