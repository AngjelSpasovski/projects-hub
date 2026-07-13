import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MemoryGameComponent } from './memory-game.component';

describe('MemoryGameComponent', () => {
  let component: MemoryGameComponent;
  let fixture: ComponentFixture<MemoryGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryGameComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(MemoryGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with a standard shuffled board', () => {
    expect(component.difficulty()).toBe('standard');
    expect(component.cards().length).toBe(16);
    expect(component.pairCount()).toBe(8);
    expect(component.moves()).toBe(0);
    expect(component.status()).toBe('ready');
  });

  it('changes difficulty and resets progress', () => {
    component.selectDifficulty('easy');

    expect(component.cards().length).toBe(12);
    expect(component.pairCount()).toBe(6);
    expect(component.moves()).toBe(0);
    expect(component.seconds()).toBe(0);
  });

  it('matches a selected pair and counts one move', () => {
    const [firstCard, secondCard] = findPair(component);

    component.flipCard(firstCard.id);
    component.flipCard(secondCard.id);

    expect(component.moves()).toBe(1);
    expect(component.matchedPairs()).toBe(1);
    expect(component.cards().filter((card) => card.pairId === firstCard.pairId).every((card) => card.isMatched)).toBeTrue();
  });

  it('hides mismatched cards after a short delay', fakeAsync(() => {
    const firstCard = component.cards()[0];
    const secondCard = component.cards().find((card) => card.pairId !== firstCard.pairId);

    expect(secondCard).toBeDefined();

    component.flipCard(firstCard.id);
    component.flipCard(secondCard!.id);

    expect(component.moves()).toBe(1);
    expect(component.isChecking()).toBeTrue();

    tick(550);

    expect(component.isChecking()).toBeFalse();
    expect(component.cards().find((card) => card.id === firstCard.id)?.isFlipped).toBeFalse();
    expect(component.cards().find((card) => card.id === secondCard!.id)?.isFlipped).toBeFalse();
  }));

  it('completes when every pair is matched', () => {
    for (const pairId of new Set(component.cards().map((card) => card.pairId))) {
      const cards = component.cards().filter((card) => card.pairId === pairId);
      component.flipCard(cards[0].id);
      component.flipCard(cards[1].id);
    }

    expect(component.isComplete()).toBeTrue();
    expect(component.status()).toBe('complete');
    expect(component.matchedPairs()).toBe(component.pairCount());
  });
});

function findPair(component: MemoryGameComponent) {
  const firstCard = component.cards()[0];
  const secondCard = component.cards().find((card) => card.id !== firstCard.id && card.pairId === firstCard.pairId);

  if (!secondCard) {
    throw new Error('Expected a matching pair in the memory board');
  }

  return [firstCard, secondCard];
}
