import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import type { DocumentationCodeExample } from '../documentation.models';

type CopyState = 'idle' | 'copied' | 'failed';

@Component({
  selector: 'app-documentation-code-block',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './documentation-code-block.component.html',
  styleUrl: './documentation-code-block.component.scss'
})
export class DocumentationCodeBlockComponent {
  private readonly document = inject(DOCUMENT);

  readonly example = input.required<DocumentationCodeExample>();
  readonly wrapLines = signal(false);
  readonly showLineNumbers = signal(true);
  readonly copyState = signal<CopyState>('idle');
  readonly lines = computed(() => this.example().code.split('\n'));

  toggleWrap(): void {
    this.wrapLines.update((value) => !value);
  }

  toggleLineNumbers(): void {
    this.showLineNumbers.update((value) => !value);
  }

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.example().code);
      this.copyState.set('copied');
    } catch {
      this.copyState.set(this.copyWithFallback() ? 'copied' : 'failed');
    }
  }

  private copyWithFallback(): boolean {
    const textarea = this.document.createElement('textarea');
    textarea.value = this.example().code;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    this.document.body.appendChild(textarea);
    textarea.select();

    const copied = this.document.execCommand('copy');
    textarea.remove();
    return copied;
  }
}
