import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

interface TimerPreset {
  labelKey: string;
  seconds: number;
}

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

const STORAGE_KEY = 'projects-hub-timer';
const DEFAULT_SECONDS = 5 * 60;
const MAX_SECONDS = 99 * 60 + 59;
const PRESETS: TimerPreset[] = [
  { labelKey: 'TIMER.PRESETS.ONE', seconds: 60 },
  { labelKey: 'TIMER.PRESETS.FIVE', seconds: 5 * 60 },
  { labelKey: 'TIMER.PRESETS.TEN', seconds: 10 * 60 },
  { labelKey: 'TIMER.PRESETS.TWENTY_FIVE', seconds: 25 * 60 }
];

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  private readonly destroyRef = inject(DestroyRef);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly presets = PRESETS;
  readonly selectedSeconds = signal(this.loadDuration());
  readonly remainingSeconds = signal(this.selectedSeconds());
  readonly status = signal<TimerStatus>('idle');
  readonly minutesInput = signal(Math.floor(this.selectedSeconds() / 60).toString());
  readonly secondsInput = signal((this.selectedSeconds() % 60).toString());
  readonly formTouched = signal(false);
  readonly completedCount = signal(0);

  readonly progress = computed(() => {
    const selectedSeconds = this.selectedSeconds();
    return selectedSeconds === 0 ? 0 : Math.round(((selectedSeconds - this.remainingSeconds()) / selectedSeconds) * 100);
  });
  readonly displayTime = computed(() => this.formatTime(this.remainingSeconds()));
  readonly selectedLabel = computed(() => this.formatTime(this.selectedSeconds()));
  readonly isRunning = computed(() => this.status() === 'running');
  readonly isPaused = computed(() => this.status() === 'paused');
  readonly isCompleted = computed(() => this.status() === 'completed');
  readonly isDurationInvalid = computed(() => this.formTouched() && this.parseDraftSeconds() <= 0);

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTicker());
  }

  selectPreset(seconds: number): void {
    this.setDuration(seconds);
  }

  updateMinutes(value: string): void {
    this.minutesInput.set(this.onlyDigits(value).slice(0, 2));
  }

  updateSeconds(value: string): void {
    this.secondsInput.set(this.onlyDigits(value).slice(0, 2));
  }

  applyCustomDuration(): void {
    this.formTouched.set(true);

    const nextSeconds = this.parseDraftSeconds();

    if (nextSeconds <= 0) {
      return;
    }

    this.setDuration(Math.min(nextSeconds, MAX_SECONDS));
    this.formTouched.set(false);
  }

  start(): void {
    if (this.remainingSeconds() <= 0) {
      this.reset();
    }

    this.status.set('running');
    this.startTicker();
  }

  pause(): void {
    if (!this.isRunning()) {
      return;
    }

    this.status.set('paused');
    this.clearTicker();
  }

  resume(): void {
    if (!this.isPaused()) {
      return;
    }

    this.start();
  }

  reset(): void {
    this.clearTicker();
    this.remainingSeconds.set(this.selectedSeconds());
    this.status.set('idle');
  }

  restart(): void {
    this.reset();
    this.start();
  }

  private tick(): void {
    const nextSeconds = Math.max(this.remainingSeconds() - 1, 0);
    this.remainingSeconds.set(nextSeconds);

    if (nextSeconds === 0) {
      this.status.set('completed');
      this.completedCount.update((count) => count + 1);
      this.clearTicker();
    }
  }

  private startTicker(): void {
    this.clearTicker();
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  private clearTicker(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private setDuration(seconds: number): void {
    this.clearTicker();
    this.selectedSeconds.set(seconds);
    this.remainingSeconds.set(seconds);
    this.status.set('idle');
    this.minutesInput.set(Math.floor(seconds / 60).toString());
    this.secondsInput.set((seconds % 60).toString());
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ selectedSeconds: seconds }));
  }

  private loadDuration(): number {
    const storedTimer = localStorage.getItem(STORAGE_KEY);

    if (!storedTimer) {
      return DEFAULT_SECONDS;
    }

    try {
      const parsedTimer = JSON.parse(storedTimer) as { selectedSeconds?: number };
      const selectedSeconds = Number(parsedTimer.selectedSeconds);
      return selectedSeconds > 0 && selectedSeconds <= MAX_SECONDS ? selectedSeconds : DEFAULT_SECONDS;
    } catch {
      return DEFAULT_SECONDS;
    }
  }

  private parseDraftSeconds(): number {
    const minutes = Number(this.minutesInput() || 0);
    const seconds = Number(this.secondsInput() || 0);
    return minutes * 60 + seconds;
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
