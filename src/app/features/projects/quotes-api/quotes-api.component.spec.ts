import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { QuotesApiComponent } from './quotes-api.component';

describe('QuotesApiComponent', () => {
  let component: QuotesApiComponent;
  let fixture: ComponentFixture<QuotesApiComponent>;

  beforeEach(async () => {
    window.localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [QuotesApiComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotesApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load local quotes', fakeAsync(() => {
    component.loadQuotes(0);

    expect(component.loadState()).toBe('loading');

    tick(0);

    expect(component.loadState()).toBe('ready');
    expect(component.quotes().length).toBe(6);
    expect(component.selectedQuote()).toBeTruthy();
  }));

  it('should type selected quote text', fakeAsync(() => {
    component.loadQuotes(0);
    tick(0);
    const quote = component.selectedQuote();

    expect(quote).toBeTruthy();
    const quoteText = quote!.text;

    tick(quoteText.length * 18);

    expect(component.typedText()).toBe(quoteText);
  }));

  it('should switch to a different quote', fakeAsync(() => {
    component.loadQuotes(0);
    tick(0);
    const firstQuote = component.selectedQuote();

    component.nextQuote();

    expect(component.selectedQuote()?.id).not.toBe(firstQuote?.id);
  }));

  it('should persist favorites', fakeAsync(() => {
    component.loadQuotes(0);
    tick(0);

    component.toggleFavorite();

    expect(component.favoriteIds().length).toBe(1);
    expect(window.localStorage.getItem('projects-hub-quotes-api-favorites')).toContain(String(component.selectedQuote()?.id));
  }));

  it('should expose an error state', () => {
    component.simulateApiFailure();

    expect(component.loadState()).toBe('error');
    expect(component.selectedQuote()).toBeNull();
    expect(component.typedText()).toBe('');
  });
});
