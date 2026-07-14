import { Component, DestroyRef, HostListener, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

type PhotoCategory = 'all' | 'nature' | 'city' | 'people' | 'travel';
type ViewMode = 'grid' | 'list';

interface PhotoItem {
  id: string;
  title: string;
  location: string;
  category: Exclude<PhotoCategory, 'all'>;
  year: string;
  description: string;
  imageUrl: string;
  sourceUrl: string;
  accent: string;
}

interface CategoryOption {
  id: PhotoCategory;
  labelKey: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', labelKey: 'PHOTO_BOOK.CATEGORIES.ALL' },
  { id: 'nature', labelKey: 'PHOTO_BOOK.CATEGORIES.NATURE' },
  { id: 'city', labelKey: 'PHOTO_BOOK.CATEGORIES.CITY' },
  { id: 'people', labelKey: 'PHOTO_BOOK.CATEGORIES.PEOPLE' },
  { id: 'travel', labelKey: 'PHOTO_BOOK.CATEGORIES.TRAVEL' }
];

const SLIDE_INTERVAL_MS = 3500;

const PHOTOS: PhotoItem[] = [
  {
    id: 'mountain-light',
    title: 'Mountain Light',
    location: 'Shar Planina',
    category: 'nature',
    year: '2026',
    description: 'Soft sunrise colors over a quiet mountain ridge.',
    imageUrl: 'assets/photo-book/mountain-light.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Small_Turk_and_Titov_Vrv.jpg',
    accent: '#22c55e'
  },
  {
    id: 'old-bazaar',
    title: 'Old Bazaar Walk',
    location: 'Skopje',
    category: 'city',
    year: '2025',
    description: 'Street geometry, shop signs, and warm afternoon contrast.',
    imageUrl: 'assets/photo-book/old-bazaar.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Old_Bazaar2.jpg',
    accent: '#f97316'
  },
  {
    id: 'matka-canyon',
    title: 'Matka Canyon',
    location: 'Skopje',
    category: 'travel',
    year: '2026',
    description: 'Boats, cliffs, and green water through Matka Canyon.',
    imageUrl: 'assets/photo-book/matka-canyon.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Matka_Canyon_Skopje_3.jpg',
    accent: '#6366f1'
  },
  {
    id: 'lake-route',
    title: 'Lake Route',
    location: 'Ohrid',
    category: 'travel',
    year: '2024',
    description: 'A quiet lakeside route with layered blues and open space.',
    imageUrl: 'assets/photo-book/lake-route.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:03760-Ohrid_(16064511578).jpg',
    accent: '#06b6d4'
  },
  {
    id: 'mavrovo-lake',
    title: 'Mavrovo Lake',
    location: 'Mavrovo',
    category: 'nature',
    year: '2025',
    description: 'Mountain lake scenery from Mavrovo National Park.',
    imageUrl: 'assets/photo-book/mavrovo-lake.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B0%D0%B2%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%BE_%D0%B5%D0%B7%D0%B5%D1%80%D0%BE.jpg',
    accent: '#16a34a'
  },
  {
    id: 'basketball-2011',
    title: 'Macedonia Basketball 2011',
    location: 'EuroBasket 2011',
    category: 'people',
    year: '2011',
    description: 'A real 2011 Macedonia basketball moment, added as the People gallery entry.',
    imageUrl: 'assets/photo-book/basketball-2011.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bo_McCalebb.jpg',
    accent: '#eab308'
  },
  {
    id: 'stone-bridge',
    title: 'Stone Bridge',
    location: 'City Center',
    category: 'city',
    year: '2026',
    description: 'Skopje landmark connecting Macedonia Square and the Old Bazaar.',
    imageUrl: 'assets/photo-book/stone-bridge.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Stone_Bridge_Skopje_4.jpg',
    accent: '#8b5cf6'
  }
];

@Component({
  selector: 'app-photo-book',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './photo-book.component.html',
  styleUrl: './photo-book.component.scss'
})
export class PhotoBookComponent {
  private readonly destroyRef = inject(DestroyRef);
  private slideTimerId: ReturnType<typeof setInterval> | null = null;

  readonly photos = PHOTOS;
  readonly categories = CATEGORIES;
  readonly selectedPhotoId = signal(PHOTOS[0].id);
  readonly selectedCategory = signal<PhotoCategory>('all');
  readonly searchTerm = signal('');
  readonly viewMode = signal<ViewMode>('grid');
  readonly isAutoPlaying = signal(false);

  readonly filteredPhotos = computed(() => {
    const category = this.selectedCategory();
    const term = this.searchTerm().trim().toLowerCase();

    return this.photos.filter((photo) => {
      const matchesCategory = category === 'all' || photo.category === category;
      const matchesSearch =
        !term ||
        [photo.title, photo.location, photo.category, photo.description].some((value) => value.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  });

  readonly selectedPhoto = computed(() => {
    const filteredPhotos = this.filteredPhotos();
    return filteredPhotos.find((photo) => photo.id === this.selectedPhotoId()) ?? filteredPhotos[0] ?? this.photos[0];
  });

  readonly selectedIndex = computed(() => this.filteredPhotos().findIndex((photo) => photo.id === this.selectedPhoto().id));
  readonly resultLabel = computed(() => `${this.filteredPhotos().length} / ${this.photos.length}`);

  constructor() {
    this.destroyRef.onDestroy(() => this.stopAutoSlide());
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.nextPhoto();
    }

    if (event.key === 'ArrowLeft') {
      this.previousPhoto();
    }
  }

  selectPhoto(photoId: string): void {
    this.selectedPhotoId.set(photoId);
  }

  selectCategory(category: PhotoCategory): void {
    this.selectedCategory.set(category);
    this.ensureSelectionInFilter();
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
    this.ensureSelectionInFilter();
  }

  resetFilters(): void {
    this.selectedCategory.set('all');
    this.searchTerm.set('');
    this.selectedPhotoId.set(this.photos[0].id);
  }

  setViewMode(viewMode: ViewMode): void {
    this.viewMode.set(viewMode);
  }

  nextPhoto(): void {
    this.moveSelection(1);
  }

  previousPhoto(): void {
    this.moveSelection(-1);
  }

  toggleAutoSlide(): void {
    if (this.isAutoPlaying()) {
      this.stopAutoSlide();
      return;
    }

    this.startAutoSlide();
  }

  private startAutoSlide(): void {
    if (this.slideTimerId !== null) {
      return;
    }

    this.isAutoPlaying.set(true);
    this.slideTimerId = setInterval(() => this.nextPhoto(), SLIDE_INTERVAL_MS);
  }

  private stopAutoSlide(): void {
    if (this.slideTimerId !== null) {
      clearInterval(this.slideTimerId);
      this.slideTimerId = null;
    }

    this.isAutoPlaying.set(false);
  }

  private ensureSelectionInFilter(): void {
    const filteredPhotos = this.filteredPhotos();

    if (filteredPhotos.length > 0 && !filteredPhotos.some((photo) => photo.id === this.selectedPhotoId())) {
      this.selectedPhotoId.set(filteredPhotos[0].id);
    }
  }

  private moveSelection(direction: 1 | -1): void {
    const filteredPhotos = this.filteredPhotos();

    if (filteredPhotos.length === 0) {
      return;
    }

    const currentIndex = Math.max(0, this.selectedIndex());
    const nextIndex = (currentIndex + direction + filteredPhotos.length) % filteredPhotos.length;
    this.selectedPhotoId.set(filteredPhotos[nextIndex].id);
  }
}
