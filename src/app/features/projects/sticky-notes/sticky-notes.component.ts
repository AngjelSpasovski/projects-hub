import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

type NoteColor = 'yellow' | 'blue' | 'green' | 'rose';

interface StickyNote {
  id: number;
  title: string;
  body: string;
  color: NoteColor;
  pinned: boolean;
  updatedAt: string;
}

const STORAGE_KEY = 'projects-hub-sticky-notes';
const TITLE_MAX_LENGTH = 48;
const BODY_MAX_LENGTH = 180;
const DEFAULT_NOTES: StickyNote[] = [
  {
    id: 1,
    title: 'Portfolio ideas',
    body: 'Add screenshots and short README notes for every completed mini project.',
    color: 'yellow',
    pinned: true,
    updatedAt: '2026-06-25'
  },
  {
    id: 2,
    title: 'Angular polish',
    body: 'Keep project detail headers compact so the live component has enough space.',
    color: 'blue',
    pinned: false,
    updatedAt: '2026-06-25'
  },
  {
    id: 3,
    title: 'Next batch',
    body: 'Prepare Grocery List and Flashcards after Sticky Notes is finished.',
    color: 'green',
    pinned: false,
    updatedAt: '2026-06-25'
  }
];

@Component({
  selector: 'app-sticky-notes',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './sticky-notes.component.html',
  styleUrl: './sticky-notes.component.scss'
})
export class StickyNotesComponent {
  readonly titleMaxLength = TITLE_MAX_LENGTH;
  readonly bodyMaxLength = BODY_MAX_LENGTH;
  readonly colors: NoteColor[] = ['yellow', 'blue', 'green', 'rose'];
  readonly notes = signal<StickyNote[]>(this.loadNotes());
  readonly searchTerm = signal('');
  readonly editingId = signal<number | null>(null);
  readonly draftTitle = signal('');
  readonly draftBody = signal('');
  readonly draftColor = signal<NoteColor>('yellow');
  readonly titleTouched = signal(false);

  readonly pinnedCount = computed(() => this.notes().filter((note) => note.pinned).length);
  readonly filteredNotes = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const notes = query
      ? this.notes().filter(
          (note) => note.title.toLowerCase().includes(query) || note.body.toLowerCase().includes(query)
        )
      : this.notes();

    return [...notes].sort((first, second) => Number(second.pinned) - Number(first.pinned));
  });
  readonly isTitleInvalid = computed(() => this.titleTouched() && this.draftTitle().trim().length === 0);

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  updateTitle(value: string): void {
    this.draftTitle.set(value.slice(0, TITLE_MAX_LENGTH));
  }

  updateBody(value: string): void {
    this.draftBody.set(value.slice(0, BODY_MAX_LENGTH));
  }

  updateColor(value: NoteColor): void {
    this.draftColor.set(value);
  }

  submitNote(): void {
    this.titleTouched.set(true);

    const title = this.draftTitle().trim();

    if (!title) {
      return;
    }

    const editingId = this.editingId();

    if (editingId) {
      this.notes.update((notes) =>
        notes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                body: this.draftBody().trim(),
                color: this.draftColor(),
                title,
                updatedAt: this.today()
              }
            : note
        )
      );
    } else {
      this.notes.update((notes) => [
        {
          body: this.draftBody().trim(),
          color: this.draftColor(),
          id: Date.now(),
          pinned: false,
          title,
          updatedAt: this.today()
        },
        ...notes
      ]);
    }

    this.persistNotes();
    this.resetDraft();
  }

  editNote(note: StickyNote): void {
    this.editingId.set(note.id);
    this.draftTitle.set(note.title);
    this.draftBody.set(note.body);
    this.draftColor.set(note.color);
    this.titleTouched.set(false);
  }

  cancelEdit(): void {
    this.resetDraft();
  }

  togglePin(noteId: number): void {
    this.notes.update((notes) =>
      notes.map((note) => (note.id === noteId ? { ...note, pinned: !note.pinned, updatedAt: this.today() } : note))
    );
    this.persistNotes();
  }

  deleteNote(noteId: number): void {
    this.notes.update((notes) => notes.filter((note) => note.id !== noteId));

    if (this.editingId() === noteId) {
      this.resetDraft();
    }

    this.persistNotes();
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  resetDemo(): void {
    this.notes.set(DEFAULT_NOTES);
    this.searchTerm.set('');
    this.resetDraft();
    this.persistNotes();
  }

  colorKey(color: NoteColor): string {
    return `STICKY_NOTES.COLORS.${color.toUpperCase()}`;
  }

  private resetDraft(): void {
    this.editingId.set(null);
    this.draftTitle.set('');
    this.draftBody.set('');
    this.draftColor.set('yellow');
    this.titleTouched.set(false);
  }

  private loadNotes(): StickyNote[] {
    const storedNotes = localStorage.getItem(STORAGE_KEY);

    if (!storedNotes) {
      return DEFAULT_NOTES;
    }

    try {
      const parsedNotes = JSON.parse(storedNotes) as StickyNote[];
      return Array.isArray(parsedNotes) ? parsedNotes : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  }

  private persistNotes(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes()));
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
