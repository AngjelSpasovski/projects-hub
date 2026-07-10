import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { DigitalClockComponent } from './digital-clock.component';

describe('DigitalClockComponent', () => {
  let component: DigitalClockComponent;
  let fixture: ComponentFixture<DigitalClockComponent>;

  beforeEach(async () => {
    localStorage.clear();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-07-10T12:34:56Z'));

    await TestBed.configureTestingModule({
      imports: [DigitalClockComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(DigitalClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('starts with Skopje timezone and 24-hour mode', () => {
    expect(component.timezone()).toBe('Europe/Skopje');
    expect(component.mode()).toBe('24');
    expect(component.selectedTimezone().labelKey).toBe('DIGITAL_CLOCK.TIMEZONES.SKOPJE');
    expect(component.timeLabel()).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('updates and persists timezone and display mode', () => {
    component.updateTimezone('Asia/Tokyo');
    component.updateMode('12');

    expect(component.timezone()).toBe('Asia/Tokyo');
    expect(component.mode()).toBe('12');
    expect(component.modeLabel()).toBe('DIGITAL_CLOCK.MODE.TWELVE');
    expect(localStorage.getItem('projects-hub-digital-clock')).toContain('"timezone":"Asia/Tokyo"');
    expect(localStorage.getItem('projects-hub-digital-clock')).toContain('"mode":"12"');
  });

  it('loads persisted settings', () => {
    localStorage.setItem('projects-hub-digital-clock', JSON.stringify({ mode: '12', timezone: 'UTC' }));

    const nextFixture = TestBed.createComponent(DigitalClockComponent);
    const nextComponent = nextFixture.componentInstance;
    nextFixture.detectChanges();

    expect(nextComponent.timezone()).toBe('UTC');
    expect(nextComponent.mode()).toBe('12');
  });

  it('refreshes current time on demand', () => {
    const initialTime = component.now().getTime();

    jasmine.clock().mockDate(new Date('2026-07-10T12:34:57Z'));
    component.refreshNow();

    expect(component.now().getTime()).toBeGreaterThan(initialTime);
  });
});
