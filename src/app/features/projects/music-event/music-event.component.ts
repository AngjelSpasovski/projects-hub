import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { Dialog } from 'primeng/dialog';
import { MultiSelect } from 'primeng/multiselect';

type EventCategory = 'concert' | 'festival' | 'workshop';
type EventCategoryFilter = 'all' | EventCategory;

interface MusicEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  venue: string;
  city: string;
  price: number;
  tags: string[];
  seatsLeft: number;
}

interface TagOption {
  label: string;
  value: string;
}

const EVENTS: MusicEvent[] = [
  {
    id: 'jazz-night',
    title: 'Jazz Night',
    category: 'concert',
    date: '2026-07-12',
    venue: 'City Hall',
    city: 'Skopje',
    price: 18,
    tags: ['Jazz', 'Live', 'Indoor'],
    seatsLeft: 42
  },
  {
    id: 'lake-festival',
    title: 'Lake Festival',
    category: 'festival',
    date: '2026-08-03',
    venue: 'Old Port',
    city: 'Ohrid',
    price: 35,
    tags: ['Festival', 'Outdoor', 'Electronic'],
    seatsLeft: 120
  },
  {
    id: 'studio-session',
    title: 'Studio Session',
    category: 'workshop',
    date: '2026-07-25',
    venue: 'Sound Lab',
    city: 'Bitola',
    price: 24,
    tags: ['Workshop', 'Production', 'Indoor'],
    seatsLeft: 12
  },
  {
    id: 'acoustic-evening',
    title: 'Acoustic Evening',
    category: 'concert',
    date: '2026-09-05',
    venue: 'Culture Center',
    city: 'Strumica',
    price: 15,
    tags: ['Acoustic', 'Live', 'Indoor'],
    seatsLeft: 28
  }
];

@Component({
  selector: 'app-music-event',
  standalone: true,
  imports: [Dialog, FormsModule, MultiSelect, PageHeaderComponent, TranslatePipe],
  templateUrl: './music-event.component.html',
  styleUrl: './music-event.component.scss'
})
export class MusicEventComponent {
  readonly events = EVENTS;
  readonly selectedCategory = signal<EventCategoryFilter>('all');
  readonly selectedTags = signal<string[]>([]);
  readonly selectedEvent = signal<MusicEvent | null>(null);

  readonly tagOptions = computed<TagOption[]>(() =>
    Array.from(new Set(this.events.flatMap((event) => event.tags)))
      .sort()
      .map((tag) => ({ label: tag, value: tag }))
  );

  readonly filteredEvents = computed(() => {
    const category = this.selectedCategory();
    const tags = this.selectedTags();

    return this.events
      .filter((event) => category === 'all' || event.category === category)
      .filter((event) => tags.length === 0 || tags.every((tag) => event.tags.includes(tag)));
  });

  readonly totalSeatsLeft = computed(() =>
    this.filteredEvents().reduce((total, event) => total + event.seatsLeft, 0)
  );

  updateCategory(value: string): void {
    this.selectedCategory.set(value as EventCategoryFilter);
  }

  updateTags(value: string[]): void {
    this.selectedTags.set(value);
  }

  resetFilters(): void {
    this.selectedCategory.set('all');
    this.selectedTags.set([]);
  }

  openEvent(event: MusicEvent): void {
    this.selectedEvent.set(event);
  }

  closeEvent(): void {
    this.selectedEvent.set(null);
  }
}
