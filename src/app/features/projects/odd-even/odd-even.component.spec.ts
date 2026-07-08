import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { OddEvenComponent } from './odd-even.component';

describe('OddEvenComponent', () => {
  let component: OddEvenComponent;
  let fixture: ComponentFixture<OddEvenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OddEvenComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(OddEvenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.reset();
  });

  it('starts with no generated numbers', () => {
    expect(component.numbers()).toEqual([]);
    expect(component.lastNumber()).toBe(0);
    expect(component.state()).toBe('idle');
  });

  it('can manually generate odd and even numbers', () => {
    component.step();
    component.step();
    component.step();

    expect(component.numbers()).toEqual([1, 2, 3]);
    expect(component.oddNumbers()).toEqual([1, 3]);
    expect(component.evenNumbers()).toEqual([2]);
  });

  it('starts and pauses interval generation', fakeAsync(() => {
    component.start();

    tick(2100);

    expect(component.numbers()).toEqual([1, 2]);
    expect(component.running()).toBeTrue();

    component.pause();
    tick(1200);

    expect(component.numbers()).toEqual([1, 2]);
    expect(component.state()).toBe('paused');
  }));

  it('resets the generated sequence', () => {
    component.step();
    component.step();

    component.reset();

    expect(component.numbers()).toEqual([]);
    expect(component.lastNumber()).toBe(0);
    expect(component.state()).toBe('idle');
  });
});
