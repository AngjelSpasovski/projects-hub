import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { GateAccessService } from '../../../core/services/gate-access.service';
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

  leaveMoria(): void {
    this.gateAccess.leave();
    void this.router.navigateByUrl('/welcome', { replaceUrl: true });
  }
}
