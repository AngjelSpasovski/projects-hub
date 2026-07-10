import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { FlashcardsComponent } from './flashcards.component';

describe('FlashcardsComponent', () => {
  let component: FlashcardsComponent;
  let fixture: ComponentFixture<FlashcardsComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [FlashcardsComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(FlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with demo decks and the first card hidden', () => {
    expect(component.cards().length).toBe(3);
    expect(component.deckOptions()).toEqual(['all', 'Angular', 'Frontend', 'i18n']);
    expect(component.answerVisible()).toBeFalse();
    expect(component.progressLabel()).toBe('1 / 3');
  });

  it('reveals and marks the active card as known', () => {
    const activeCardId = component.activeCard()?.id;

    component.revealAnswer();
    component.markCard('correct');

    expect(component.answerVisible()).toBeFalse();
    expect(component.reviewedCount()).toBe(1);
    expect(component.correctCount()).toBe(1);
    expect(component.cards().find((card) => card.id === activeCardId)?.mastered).toBeTrue();
    expect(localStorage.getItem('projects-hub-flashcards')).toContain('"mastered":true');
  });

  it('adds a card, persists it, and switches to the new deck', () => {
    component.updateDraftDeck('Testing');
    component.updateQuestion('What should focused unit tests cover?');
    component.updateAnswer('Important state transitions and validation rules.');
    component.submitCard();

    expect(component.cards()[0]).toEqual(
      jasmine.objectContaining({
        answer: 'Important state transitions and validation rules.',
        deck: 'Testing',
        mastered: false,
        question: 'What should focused unit tests cover?'
      })
    );
    expect(component.selectedDeck()).toBe('Testing');
    expect(component.filteredCards().length).toBe(1);
    expect(localStorage.getItem('projects-hub-flashcards')).toContain('What should focused unit tests cover?');
  });

  it('validates required question and answer before adding', () => {
    component.submitCard();

    expect(component.isQuestionInvalid()).toBeTrue();
    expect(component.isAnswerInvalid()).toBeTrue();
    expect(component.cards().length).toBe(3);
  });

  it('edits and deletes a card', () => {
    const card = component.cards()[0];

    component.editCard(card);
    component.updateQuestion('Updated flashcard question');
    component.updateAnswer('Updated answer');
    component.submitCard();

    expect(component.cards().find((item) => item.id === card.id)?.question).toBe('Updated flashcard question');

    component.deleteCard(card.id);
    expect(component.cards().some((item) => item.id === card.id)).toBeFalse();
  });
});
