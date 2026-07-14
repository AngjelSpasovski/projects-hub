import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { Math4KidsComponent } from './math-4-kids.component';

describe('Math4KidsComponent', () => {
  let component: Math4KidsComponent;
  let fixture: ComponentFixture<Math4KidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Math4KidsComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(Math4KidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with an addition problem and empty score', () => {
    expect(component.operation()).toBe('addition');
    expect(component.difficulty()).toBe('easy');
    expect(component.score()).toBe(0);
    expect(component.attempts()).toBe(0);
    expect(component.problem().operator).toBe('+');
  });

  it('accepts a correct answer and moves to the next problem', () => {
    const firstAnswer = component.problem().answer;

    component.updateAnswer(firstAnswer.toString());
    component.submitAnswer();

    expect(component.score()).toBe(1);
    expect(component.attempts()).toBe(1);
    expect(component.streak()).toBe(1);
    expect(component.feedback()).toBe('correct');
    expect(component.round()).toBe(2);
  });

  it('keeps the same problem after a wrong answer', () => {
    const firstProblem = component.problem();

    component.updateAnswer((firstProblem.answer + 1).toString());
    component.submitAnswer();

    expect(component.score()).toBe(0);
    expect(component.attempts()).toBe(1);
    expect(component.streak()).toBe(0);
    expect(component.feedback()).toBe('wrong');
    expect(component.problem()).toEqual(firstProblem);
  });

  it('switches operation and restarts progress', () => {
    component.updateAnswer(component.problem().answer.toString());
    component.submitAnswer();
    component.selectOperation('multiplication');

    expect(component.operation()).toBe('multiplication');
    expect(component.problem().operator).toBe('x');
    expect(component.score()).toBe(0);
    expect(component.attempts()).toBe(0);
  });

  it('switches difficulty and uses the selected range', () => {
    component.selectDifficulty('challenge');

    expect(component.difficulty()).toBe('challenge');
    expect(component.problem().left).toBeLessThanOrEqual(50);
    expect(component.problem().right).toBeLessThanOrEqual(50);
  });

  it('tracks elapsed time after an answer is submitted', fakeAsync(() => {
    component.updateAnswer(component.problem().answer.toString());
    component.submitAnswer();

    tick(2000);

    expect(component.seconds()).toBe(2);
  }));
});
