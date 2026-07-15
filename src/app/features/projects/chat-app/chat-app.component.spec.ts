import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ChatAppComponent } from './chat-app.component';

describe('ChatAppComponent', () => {
  let fixture: ComponentFixture<ChatAppComponent>;
  let component: ChatAppComponent;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ChatAppComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads demo rooms and messages', () => {
    expect(component.rooms().length).toBe(3);
    expect(component.roomMessages().length).toBe(2);
    expect(component.unreadTotal()).toBe(3);
  });

  it('filters rooms and clears search', () => {
    component.updateSearch('support');

    expect(component.filteredRooms().length).toBe(1);
    expect(component.filteredRooms()[0].name).toBe('Support Desk');

    component.clearSearch();

    expect(component.filteredRooms().length).toBe(3);
  });

  it('sends and persists a message', () => {
    component.updateDraft('This is a local demo message.');
    component.sendMessage();

    expect(component.roomMessages().at(-1)?.text).toBe('This is a local demo message.');
    expect(localStorage.getItem('projects-hub-chat-app')).toContain('This is a local demo message.');
  });

  it('blocks empty and offline sends', () => {
    component.updateDraft('x');
    component.sendMessage();

    expect(component.formError()).toBe('CHAT_APP.ERRORS.MESSAGE');

    component.updateDraft('Valid message');
    component.toggleConnection();
    component.sendMessage();

    expect(component.formError()).toBe('CHAT_APP.ERRORS.OFFLINE');
  });

  it('resets the demo state', () => {
    component.updateDraft('Temporary message');
    component.sendMessage();
    component.resetDemo();

    expect(component.rooms().length).toBe(3);
    expect(component.roomMessages().length).toBe(2);
    expect(component.draftMessage()).toBe('');
  });
});
