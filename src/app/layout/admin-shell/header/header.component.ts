import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

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
  readonly languageService = inject(LanguageService);
  readonly themeService = inject(ThemeService);
}
