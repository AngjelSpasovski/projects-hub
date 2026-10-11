import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { GateAccessService } from '../../../core/services/gate-access.service';
import { DashboardToolbarService } from '../../../core/services/dashboard-toolbar.service';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly gateAccess = inject(GateAccessService);
  readonly languageService = inject(LanguageService);
  readonly themeService = inject(ThemeService);
  readonly dashboardToolbar = inject(DashboardToolbarService);
  readonly isDocumentationRoute = signal(this.router.url.startsWith('/admin/documentation'));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.isDocumentationRoute.set(event.urlAfterRedirects.startsWith('/admin/documentation'));
      });
  }

  leaveMoria(): void {
    this.gateAccess.leave();
    void this.router.navigateByUrl('/welcome', { replaceUrl: true });
  }
}
