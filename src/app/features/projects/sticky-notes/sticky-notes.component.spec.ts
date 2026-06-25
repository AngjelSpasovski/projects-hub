import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { StickyNotesComponent } from './sticky-notes.component';

describe('StickyNotesComponent', () => {
  let component: StickyNotesComponent;
  let fixture: ComponentFixture<StickyNotesComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [StickyNotesComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(StickyNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with demo notes', () => {
    expect(component).toBeTruthy();
    expect(component.notes().length).toBe(3);
    expect(component.pinnedCount()).toBe(1);
  });

  it('should validate an empty title before adding a note', () => {
    component.submitNote();

    expect(component.isTitleInvalid()).toBeTrue();
    expect(component.notes().length).toBe(3);
  });

  it('should add a note and persist it', () => {
    component.updateTitle('Interview follow-up');
    component.updateBody('Send portfolio link and mention the Projects Hub.');
    component.updateColor('rose');
    component.submitNote();

    expect(component.notes()[0]).toEqual(
      jasmine.objectContaining({
        body: 'Send portfolio link and mention the Projects Hub.',
        color: 'rose',
        pinned: false,
        title: 'Interview follow-up'
      })
    );
    expect(localStorage.getItem('projects-hub-sticky-notes')).toContain('Interview follow-up');
  });

  it('should filter notes by title and body', () => {
    component.updateSearchTerm('angular');

    expect(component.filteredNotes().length).toBe(1);
    expect(component.filteredNotes()[0].title).toBe('Angular polish');
  });

  it('should edit, pin, and delete a note', () => {
    const note = component.notes()[1];

    component.editNote(note);
    component.updateTitle('Updated note');
    component.updateColor('green');
    component.submitNote();

    expect(component.notes()[1].title).toBe('Updated note');
    expect(component.notes()[1].color).toBe('green');

    component.togglePin(note.id);
    expect(component.notes()[1].pinned).toBeTrue();

    component.deleteNote(note.id);
    expect(component.notes().some((item) => item.id === note.id)).toBeFalse();
  });

  it('should reset demo notes', () => {
    component.deleteNote(component.notes()[0].id);
    component.resetDemo();

    expect(component.notes().length).toBe(3);
    expect(component.searchTerm()).toBe('');
  });
});
