import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

type LogLevel = 'info' | 'warning' | 'error';
type LogFilter = 'all' | LogLevel;

interface DevLog {
  id: number;
  text: string;
  level: LogLevel;
  createdAt: string;
}

const TEXT_MAX_LENGTH = 96;
const DEFAULT_LOGS: DevLog[] = [
  {
    id: 1,
    text: 'Initial Angular migration review completed.',
    level: 'info',
    createdAt: '2026-07-08 10:15'
  },
  {
    id: 2,
    text: 'Validate responsive workspace before marking project ready.',
    level: 'warning',
    createdAt: '2026-07-08 10:32'
  },
  {
    id: 3,
    text: 'Legacy service dependency removed from migrated logger.',
    level: 'error',
    createdAt: '2026-07-08 10:48'
  }
];

@Component({
  selector: 'app-dev-logger',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './dev-logger.component.html',
  styleUrl: './dev-logger.component.scss'
})
export class DevLoggerComponent {
  readonly textMaxLength = TEXT_MAX_LENGTH;
  readonly filterOptions: LogFilter[] = ['all', 'info', 'warning', 'error'];
  readonly logs          = signal<DevLog[]>(DEFAULT_LOGS);
  readonly draftText    = signal('');
  readonly draftLevel   = signal<LogLevel>('info');
  readonly editingId    = signal<number | null>(null);
  readonly filter       = signal<LogFilter>('all');
  readonly searchTerm   = signal('');
  readonly textTouched  = signal(false);

  readonly filteredLogs = computed(() => {
    const filter = this.filter();
    const searchTerm = this.searchTerm().trim().toLowerCase();

    return this.logs().filter((log) => {
      const matchesLevel = filter === 'all' || log.level === filter;
      const matchesSearch =
        searchTerm.length === 0 ||
        log.text.toLowerCase().includes(searchTerm) ||
        this.levelLabelKey(log.level).toLowerCase().includes(searchTerm);

      return matchesLevel && matchesSearch;
    });
  });

  readonly infoCount      = computed(() => this.logs().filter((log) => log.level === 'info').length);
  readonly warningCount   = computed(() => this.logs().filter((log) => log.level === 'warning').length);
  readonly errorCount     = computed(() => this.logs().filter((log) => log.level === 'error').length);
  readonly isTextInvalid  = computed(() => this.textTouched() && this.draftText().trim().length === 0);

  updateText(value: string): void {
    this.draftText.set(value.slice(0, TEXT_MAX_LENGTH));
  }

  updateLevel(value: string): void {
    this.draftLevel.set(value as LogLevel);
  }

  updateFilter(value: LogFilter): void {
    this.filter.set(value);
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  submitLog(): void {
    this.textTouched.set(true);
    const text = this.draftText().trim();

    if (!text) {
      return;
    }

    const editingId = this.editingId();

    if (editingId) {
      this.logs.update((logs) =>
        logs.map((log) =>
          log.id === editingId
            ? {
                ...log,
                text,
                level: this.draftLevel(),
                createdAt: this.timestamp()
              }
            : log
        )
      );
    } else {
      this.logs.update((logs) => [
        {
          id: Date.now(),
          text,
          level: this.draftLevel(),
          createdAt: this.timestamp()
        },
        ...logs
      ]);
    }

    this.clearDraft();
  }

  editLog(log: DevLog): void {
    this.editingId.set(log.id);
    this.draftText.set(log.text);
    this.draftLevel.set(log.level);
    this.textTouched.set(false);
  }

  deleteLog(logId: number): void {
    this.logs.update((logs) => logs.filter((log) => log.id !== logId));

    if (this.editingId() === logId) {
      this.clearDraft();
    }
  }

  clearDraft(): void {
    this.editingId.set(null);
    this.draftText.set('');
    this.draftLevel.set('info');
    this.textTouched.set(false);
  }

  resetDemo(): void {
    this.logs.set(DEFAULT_LOGS);
    this.filter.set('all');
    this.searchTerm.set('');
    this.clearDraft();
  }

  levelLabelKey(level: LogLevel): string {
    return `DEV_LOGGER.LEVELS.${level.toUpperCase()}`;
  }

  private timestamp(): string {
    const value = new Date();
    const date = value.toISOString().slice(0, 10);
    const time = value.toTimeString().slice(0, 5);
    return `${date} ${time}`;
  }
}
