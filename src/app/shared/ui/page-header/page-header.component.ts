import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  readonly eyebrowKey = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly descriptionKey = input.required<string>();
  readonly featureKeys = input<readonly string[]>([]);
}
