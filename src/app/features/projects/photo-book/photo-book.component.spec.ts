import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { PhotoBookComponent } from './photo-book.component';

describe('PhotoBookComponent', () => {
  let component: PhotoBookComponent;
  let fixture: ComponentFixture<PhotoBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoBookComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with the first photo selected', () => {
    expect(component.selectedPhoto().id).toBe('mountain-light');
    expect(component.filteredPhotos().length).toBe(7);
    expect(component.resultLabel()).toBe('7 / 7');
  });

  it('filters photos by category', () => {
    component.selectCategory('city');

    expect(component.filteredPhotos().map((photo) => photo.id)).toEqual(['old-bazaar', 'stone-bridge']);
    expect(component.selectedPhoto().id).toBe('old-bazaar');
  });

  it('includes a people category photo', () => {
    component.selectCategory('people');

    expect(component.filteredPhotos().map((photo) => photo.id)).toEqual(['basketball-2011']);
    expect(component.selectedPhoto().id).toBe('basketball-2011');
  });

  it('filters photos by search term', () => {
    component.updateSearch('ohrid');

    expect(component.filteredPhotos().map((photo) => photo.id)).toEqual(['lake-route']);
    expect(component.selectedPhoto().id).toBe('lake-route');
  });

  it('moves selection forward and backward within filtered photos', () => {
    component.selectCategory('city');

    component.nextPhoto();
    expect(component.selectedPhoto().id).toBe('stone-bridge');

    component.previousPhoto();
    expect(component.selectedPhoto().id).toBe('old-bazaar');
  });

  it('resets filters and selected photo', () => {
    component.selectCategory('travel');
    component.updateSearch('lake');
    component.resetFilters();

    expect(component.selectedCategory()).toBe('all');
    expect(component.searchTerm()).toBe('');
    expect(component.selectedPhoto().id).toBe('mountain-light');
  });

  it('starts and stops automatic slideshow navigation', fakeAsync(() => {
    component.toggleAutoSlide();

    expect(component.isAutoPlaying()).toBeTrue();

    tick(3500);
    expect(component.selectedPhoto().id).toBe('old-bazaar');

    component.toggleAutoSlide();
    tick(3500);

    expect(component.isAutoPlaying()).toBeFalse();
    expect(component.selectedPhoto().id).toBe('old-bazaar');
  }));

  it('stops the automatic slideshow when the user changes filters', fakeAsync(() => {
    component.toggleAutoSlide();

    component.selectCategory('people');
    tick(3500);

    expect(component.isAutoPlaying()).toBeFalse();
    expect(component.selectedPhoto().id).toBe('basketball-2011');
  }));
});
