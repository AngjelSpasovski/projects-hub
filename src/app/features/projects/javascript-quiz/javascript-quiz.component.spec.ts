import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { JavaScriptQuizComponent } from './javascript-quiz.component';

describe('JavaScriptQuizComponent', () => {
  let component: JavaScriptQuizComponent;
  let fixture: ComponentFixture<JavaScriptQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JavaScriptQuizComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(JavaScriptQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create in the intro phase', () => {
    expect(component).toBeTruthy();
    expect(component.phase()).toBe('intro');
  });

  it('should start with clean answers and the first question', () => {
    component.startQuiz();

    expect(component.phase()).toBe('playing');
    expect(component.currentIndex()).toBe(0);
    expect(component.answers().every((answer) => answer === null)).toBeTrue();
    expect(component.secondsRemaining()).toBe(component.questionTime);
  });

  it('should complete the quiz and calculate a perfect score', () => {
    component.startQuiz();

    component.questions().forEach((question) => {
      component.selectAnswer(question.correctOption);
      component.nextQuestion();
    });

    expect(component.phase()).toBe('results');
    expect(component.score()).toBe(component.questions().length);
    expect(component.scorePercentage()).toBe(100);
  });

  it('should move to the next question when time expires', fakeAsync(() => {
    component.startQuiz();

    tick(component.questionTime * 1000);

    expect(component.currentIndex()).toBe(1);
    expect(component.answers()[0]).toBeNull();
    expect(component.secondsRemaining()).toBe(component.questionTime);
  }));

  it('should move between results and answer review', () => {
    component.startQuiz();
    component.questions().forEach((question) => {
      component.selectAnswer(question.correctOption);
      component.nextQuestion();
    });

    component.showReview();
    expect(component.phase()).toBe('review');

    component.showResults();
    expect(component.phase()).toBe('results');
  });
});
