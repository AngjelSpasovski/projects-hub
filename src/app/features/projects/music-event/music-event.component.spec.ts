import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MusicEventComponent } from './music-event.component';

describe('MusicEventComponent', () => {
  let component: MusicEventComponent;
  let fixture: ComponentFixture<MusicEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicEventComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(MusicEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter events by category', () => {
    component.updateCategory('concert');

    expect(component.filteredEvents().map((event) => event.id)).toEqual(['jazz-night', 'acoustic-evening']);
  });

  it('should filter events by selected tags', () => {
    component.updateTags(['Outdoor']);

    expect(component.filteredEvents().map((event) => event.id)).toEqual(['lake-festival']);
  });

  it('should calculate total seats for the filtered events', () => {
    component.updateCategory('concert');

    expect(component.totalSeatsLeft()).toBe(70);
  });

  it('should reset filters', () => {
    component.updateCategory('workshop');
    component.updateTags(['Indoor']);

    component.resetFilters();

    expect(component.selectedCategory()).toBe('all');
    expect(component.selectedTags()).toEqual([]);
    expect(component.filteredEvents().length).toBe(4);
  });

  it('should open and close event details', () => {
    component.openEvent(component.events[0]);

    expect(component.selectedEvent()).toEqual(component.events[0]);

    component.closeEvent();

    expect(component.selectedEvent()).toBeNull();
  });
});
