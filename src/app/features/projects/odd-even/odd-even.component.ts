import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type CounterState = 'idle' | 'running' | 'paused';

@Component({
  selector: 'app-odd-even',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './odd-even.component.html',
  styleUrl: './odd-even.component.scss'
})
export class OddEvenComponent {
  private readonly destroyRef = inject(DestroyRef);
  private intervalId: number | null = null;

  readonly numbers = signal<number[]>([]);
  readonly state = signal<CounterState>('idle');
  readonly lastNumber = computed(() => this.numbers().at(-1) ?? 0);
  readonly oddNumbers = computed(() => this.numbers().filter((number) => number % 2 !== 0));
  readonly evenNumbers = computed(() => this.numbers().filter((number) => number % 2 === 0));
  readonly running = computed(() => this.state() === 'running');

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  start(): void {
    if (this.running()) {
      return;
    }

    this.state.set('running');
    this.intervalId = window.setInterval(() => this.emitNextNumber(), 1000);
  }

  pause(): void {
    if (!this.running()) {
      return;
    }

    this.clearTimer();
    this.state.set('paused');
  }

  reset(): void {
    this.clearTimer();
    this.numbers.set([]);
    this.state.set('idle');
  }

  step(): void {
    if (this.running()) {
      return;
    }

    this.emitNextNumber();
    this.state.set('paused');
  }

  private emitNextNumber(): void {
    this.numbers.update((numbers) => [...numbers, numbers.length + 1]);
  }

  private clearTimer(): void {
    if (this.intervalId === null) {
      return;
    }

    window.clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
