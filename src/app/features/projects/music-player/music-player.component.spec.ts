import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MusicPlayerComponent } from './music-player.component';

describe('MusicPlayerComponent', () => {
  let component: MusicPlayerComponent;
  let fixture: ComponentFixture<MusicPlayerComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MusicPlayerComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(MusicPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with the first track selected and paused', () => {
    expect(component.currentTrack().id).toBe('midnight-focus');
    expect(component.isPlaying()).toBeFalse();
    expect(component.filteredTracks().length).toBe(5);
  });

  it('selects a track and starts playback state', () => {
    component.selectTrack('city-rain');

    expect(component.currentTrack().id).toBe('city-rain');
    expect(component.isPlaying()).toBeTrue();
  });

  it('moves through previous and next tracks', () => {
    component.nextTrack();
    expect(component.currentTrack().id).toBe('sunrise-drive');

    component.previousTrack();
    expect(component.currentTrack().id).toBe('midnight-focus');
  });

  it('filters tracks by title, artist, or mood', () => {
    component.updateSearch('coding');

    expect(component.filteredTracks().map((track) => track.id)).toEqual(['quiet-code']);
  });

  it('persists favorite tracks', () => {
    component.toggleFavorite('city-rain');

    expect(component.favoriteIds()).toEqual(['city-rain']);
    expect(JSON.parse(localStorage.getItem('projects-hub-music-player-favorites') ?? '[]')).toEqual(['city-rain']);
  });
});
