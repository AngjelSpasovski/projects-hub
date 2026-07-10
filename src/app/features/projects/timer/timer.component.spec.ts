import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { TimerComponent } from './timer.component';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [TimerComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with a five minute default timer', () => {
    expect(component.selectedSeconds()).toBe(300);
    expect(component.remainingSeconds()).toBe(300);
    expect(component.displayTime()).toBe('05:00');
    expect(component.status()).toBe('idle');
  });

  it('applies a custom duration and persists it', () => {
    component.updateMinutes('02');
    component.updateSeconds('30');
    component.applyCustomDuration();

    expect(component.selectedSeconds()).toBe(150);
    expect(component.displayTime()).toBe('02:30');
    expect(localStorage.getItem('projects-hub-timer')).toContain('"selectedSeconds":150');
  });

  it('validates custom duration above zero', () => {
    component.updateMinutes('0');
    component.updateSeconds('0');
    component.applyCustomDuration();

    expect(component.isDurationInvalid()).toBeTrue();
    expect(component.selectedSeconds()).toBe(300);
  });

  it('counts down and completes the timer', fakeAsync(() => {
    component.selectPreset(60);
    component.updateMinutes('0');
    component.updateSeconds('2');
    component.applyCustomDuration();

    component.start();
    tick(1000);
    expect(component.displayTime()).toBe('00:01');
    expect(component.status()).toBe('running');

    tick(1000);
    expect(component.displayTime()).toBe('00:00');
    expect(component.status()).toBe('completed');
    expect(component.completedCount()).toBe(1);
  }));

  it('pauses, resumes, and resets', fakeAsync(() => {
    component.updateMinutes('0');
    component.updateSeconds('4');
    component.applyCustomDuration();
    component.start();

    tick(1000);
    component.pause();
    tick(2000);
    expect(component.displayTime()).toBe('00:03');
    expect(component.status()).toBe('paused');

    component.resume();
    tick(1000);
    expect(component.displayTime()).toBe('00:02');

    component.reset();
    expect(component.displayTime()).toBe('00:04');
    expect(component.status()).toBe('idle');
  }));
});
