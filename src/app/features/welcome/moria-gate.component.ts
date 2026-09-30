import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { GateAccessService } from '../../core/services/gate-access.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-moria-gate',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './moria-gate.component.html',
  styleUrl: './moria-gate.component.scss'
})
export class MoriaGateComponent {
  private readonly router = inject(Router);
  private readonly access = inject(GateAccessService);
  private readonly destroyRef = inject(DestroyRef);
  private navigationTimer: ReturnType<typeof setTimeout> | null = null;

  readonly languageService = inject(LanguageService);
  readonly answer = signal('');
  readonly error = signal(false);
  readonly opening = signal(false);
  readonly inputFocused = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.navigationTimer) clearTimeout(this.navigationTimer);
    });
  }

  enter(): void {
    if (this.opening()) return;

    const expected = this.languageService.activeLanguage() === 'mk' ? 'пријател' : 'friend';
    if (this.answer().trim().toLocaleLowerCase() !== expected) {
      this.error.set(true);
      return;
    }

    this.error.set(false);
    this.opening.set(true);
    this.access.enter();
    this.navigationTimer = setTimeout(() => {
      void this.router.navigateByUrl('/admin/dashboard', { replaceUrl: true });
    }, 900);
  }

  updateAnswer(value: string): void {
    this.answer.set(value);
    if (this.error()) this.error.set(false);
  }
}
