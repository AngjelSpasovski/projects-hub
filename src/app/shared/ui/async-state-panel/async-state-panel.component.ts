import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-async-state-panel',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './async-state-panel.component.html',
  styleUrl: './async-state-panel.component.scss'
})
export class AsyncStatePanelComponent {
  readonly icon = input('pi pi-info-circle');
  readonly titleKey = input.required<string>();
  readonly messageKey = input.required<string>();
  readonly actionKey = input<string | null>(null);
  readonly tone = input<'neutral' | 'error'>('neutral');
  readonly action = output<void>();
}
