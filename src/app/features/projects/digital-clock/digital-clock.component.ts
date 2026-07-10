import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

interface ClockTimezone {
  id: string;
  labelKey: string;
}

type ClockMode = '12' | '24';

const STORAGE_KEY = 'projects-hub-digital-clock';
const DEFAULT_TIMEZONE = 'Europe/Skopje';
const DEFAULT_MODE: ClockMode = '24';
const TIMEZONES: ClockTimezone[] = [
  { id: 'Europe/Skopje', labelKey: 'DIGITAL_CLOCK.TIMEZONES.SKOPJE' },
  { id: 'UTC', labelKey: 'DIGITAL_CLOCK.TIMEZONES.UTC' },
  { id: 'America/New_York', labelKey: 'DIGITAL_CLOCK.TIMEZONES.NEW_YORK' },
  { id: 'Europe/London', labelKey: 'DIGITAL_CLOCK.TIMEZONES.LONDON' },
  { id: 'Asia/Tokyo', labelKey: 'DIGITAL_CLOCK.TIMEZONES.TOKYO' }
];

@Component({
  selector: 'app-digital-clock',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './digital-clock.component.html',
  styleUrl: './digital-clock.component.scss'
})
export class DigitalClockComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly intervalId: ReturnType<typeof setInterval>;

  readonly timezones = TIMEZONES;
  readonly now = signal(new Date());
  readonly timezone = signal(this.loadSettings().timezone);
  readonly mode = signal<ClockMode>(this.loadSettings().mode);

  readonly timeLabel = computed(() =>
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      hour12: this.mode() === '12',
      minute: '2-digit',
      second: '2-digit',
      timeZone: this.timezone()
    }).format(this.now())
  );
  readonly dateLabel = computed(() =>
    new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeZone: this.timezone()
    }).format(this.now())
  );
  readonly isoDateLabel = computed(() =>
    new Intl.DateTimeFormat('en-CA', {
      day: '2-digit',
      month: '2-digit',
      timeZone: this.timezone(),
      year: 'numeric'
    }).format(this.now())
  );
  readonly timezoneOffsetLabel = computed(() => this.formatOffset(this.now(), this.timezone()));
  readonly selectedTimezone = computed(() => this.timezones.find((timezone) => timezone.id === this.timezone()) ?? this.timezones[0]);
  readonly modeLabel = computed(() => (this.mode() === '12' ? 'DIGITAL_CLOCK.MODE.TWELVE' : 'DIGITAL_CLOCK.MODE.TWENTY_FOUR'));

  constructor() {
    this.intervalId = setInterval(() => this.now.set(new Date()), 1000);
    this.destroyRef.onDestroy(() => clearInterval(this.intervalId));
  }

  updateTimezone(timezone: string): void {
    this.timezone.set(timezone);
    this.persistSettings();
  }

  updateMode(mode: ClockMode): void {
    this.mode.set(mode);
    this.persistSettings();
  }

  refreshNow(): void {
    this.now.set(new Date());
  }

  private loadSettings(): { mode: ClockMode; timezone: string } {
    const storedSettings = localStorage.getItem(STORAGE_KEY);

    if (!storedSettings) {
      return { mode: DEFAULT_MODE, timezone: DEFAULT_TIMEZONE };
    }

    try {
      const parsedSettings = JSON.parse(storedSettings) as { mode?: ClockMode; timezone?: string };
      const timezone =
        typeof parsedSettings.timezone === 'string' && TIMEZONES.some((item) => item.id === parsedSettings.timezone)
          ? parsedSettings.timezone
          : DEFAULT_TIMEZONE;
      const mode = parsedSettings.mode === '12' ? '12' : DEFAULT_MODE;
      return { mode, timezone };
    } catch {
      return { mode: DEFAULT_MODE, timezone: DEFAULT_TIMEZONE };
    }
  }

  private persistSettings(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: this.mode(), timezone: this.timezone() }));
  }

  private formatOffset(date: Date, timezone: string): string {
    const offsetPart = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset'
    })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value;

    return offsetPart?.replace('GMT', 'UTC') ?? 'UTC';
  }
}
