import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

interface Track {
  id: string;
  title: string;
  artist: string;
  mood: string;
  duration: string;
  youtubeUrl: string;
  accent: string;
}

const FAVORITES_STORAGE_KEY = 'projects-hub-music-player-favorites';

const TRACKS: Track[] = [
  {
    id: 'midnight-focus',
    title: 'Midnight Focus',
    artist: 'Lo-Fi Lab',
    mood: 'Focus',
    duration: '3:42',
    youtubeUrl: 'https://www.youtube.com/results?search_query=lofi+midnight+focus',
    accent: '#6366f1'
  },
  {
    id: 'sunrise-drive',
    title: 'Sunrise Drive',
    artist: 'Wave Route',
    mood: 'Energy',
    duration: '4:08',
    youtubeUrl: 'https://www.youtube.com/results?search_query=synthwave+sunrise+drive',
    accent: '#f97316'
  },
  {
    id: 'quiet-code',
    title: 'Quiet Code',
    artist: 'Signal Room',
    mood: 'Coding',
    duration: '2:58',
    youtubeUrl: 'https://www.youtube.com/results?search_query=quiet+coding+music',
    accent: '#22c55e'
  },
  {
    id: 'city-rain',
    title: 'City Rain',
    artist: 'North Station',
    mood: 'Calm',
    duration: '5:16',
    youtubeUrl: 'https://www.youtube.com/results?search_query=city+rain+ambient+music',
    accent: '#06b6d4'
  },
  {
    id: 'retro-walk',
    title: 'Retro Walk',
    artist: 'Pixel Avenue',
    mood: 'Retro',
    duration: '3:25',
    youtubeUrl: 'https://www.youtube.com/results?search_query=retro+walk+music',
    accent: '#ec4899'
  }
];

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss'
})
export class MusicPlayerComponent {
  readonly tracks = TRACKS;
  readonly currentTrackId = signal(TRACKS[0].id);
  readonly searchTerm = signal('');
  readonly favoriteIds = signal<string[]>(this.loadFavorites());
  readonly isPlaying = signal(false);

  readonly currentTrack = computed(() => this.tracks.find((track) => track.id === this.currentTrackId()) ?? this.tracks[0]);
  readonly favoriteTracks = computed(() => this.tracks.filter((track) => this.favoriteIds().includes(track.id)));
  readonly filteredTracks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.tracks;
    }

    return this.tracks.filter((track) =>
      [track.title, track.artist, track.mood].some((value) => value.toLowerCase().includes(term))
    );
  });
  readonly currentIndex = computed(() => this.tracks.findIndex((track) => track.id === this.currentTrack().id));
  readonly isCurrentFavorite = computed(() => this.favoriteIds().includes(this.currentTrack().id));

  selectTrack(trackId: string): void {
    this.currentTrackId.set(trackId);
    this.isPlaying.set(true);
  }

  togglePlayback(): void {
    this.isPlaying.update((isPlaying) => !isPlaying);
  }

  nextTrack(): void {
    const nextIndex = (this.currentIndex() + 1) % this.tracks.length;
    this.selectTrack(this.tracks[nextIndex].id);
  }

  previousTrack(): void {
    const previousIndex = (this.currentIndex() - 1 + this.tracks.length) % this.tracks.length;
    this.selectTrack(this.tracks[previousIndex].id);
  }

  toggleFavorite(trackId = this.currentTrack().id): void {
    const favoriteIds = this.favoriteIds();
    const nextFavorites = favoriteIds.includes(trackId)
      ? favoriteIds.filter((id) => id !== trackId)
      : [...favoriteIds, trackId];

    this.favoriteIds.set(nextFavorites);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  resetSearch(): void {
    this.searchTerm.set('');
  }

  private loadFavorites(): string[] {
    const rawFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!rawFavorites) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawFavorites);
      return Array.isArray(parsed) ? parsed.filter((id) => TRACKS.some((track) => track.id === id)) : [];
    } catch {
      return [];
    }
  }
}
