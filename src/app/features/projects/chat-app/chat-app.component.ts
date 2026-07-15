import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

interface ChatRoom {
  id: string;
  name: string;
  topic: string;
  participants: number;
  unread: number;
  online: boolean;
}

interface ChatMessage {
  id: string;
  roomId: string;
  author: 'me' | 'team';
  authorName: string;
  text: string;
  createdAt: string;
}

interface ChatState {
  rooms: ChatRoom[];
  messages: ChatMessage[];
}

const STORAGE_KEY = 'projects-hub-chat-app';

const DEMO_ROOMS: ChatRoom[] = [
  {
    id: 'room-product',
    name: 'Product Team',
    topic: 'Planning the next portfolio release',
    participants: 4,
    unread: 2,
    online: true
  },
  {
    id: 'room-support',
    name: 'Support Desk',
    topic: 'Client questions and follow-ups',
    participants: 3,
    unread: 0,
    online: true
  },
  {
    id: 'room-design',
    name: 'Design Review',
    topic: 'UI polish notes for mini projects',
    participants: 5,
    unread: 1,
    online: false
  }
];

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 'message-1',
    roomId: 'room-product',
    author: 'team',
    authorName: 'Elena',
    text: 'The local demo can cover rooms, unread counts, and connection state before a backend exists.',
    createdAt: '2026-07-14T09:12:00.000Z'
  },
  {
    id: 'message-2',
    roomId: 'room-product',
    author: 'me',
    authorName: 'You',
    text: 'Good. Keep Firebase and Socket.io behind an adapter so GitHub Pages stays simple.',
    createdAt: '2026-07-14T09:18:00.000Z'
  },
  {
    id: 'message-3',
    roomId: 'room-support',
    author: 'team',
    authorName: 'Marko',
    text: 'Can we show an offline state without failing the send form?',
    createdAt: '2026-07-14T10:05:00.000Z'
  },
  {
    id: 'message-4',
    roomId: 'room-design',
    author: 'team',
    authorName: 'Ana',
    text: 'The message list should stay compact and readable on mobile.',
    createdAt: '2026-07-14T10:40:00.000Z'
  }
];

@Component({
  selector: 'app-chat-app',
  standalone: true,
  imports: [DatePipe, FormsModule, TranslatePipe],
  templateUrl: './chat-app.component.html',
  styleUrl: './chat-app.component.scss'
})
export class ChatAppComponent {
  private readonly initialState = this.loadState();

  readonly rooms = signal<ChatRoom[]>(this.initialState.rooms);
  readonly messages = signal<ChatMessage[]>(this.initialState.messages);
  readonly selectedRoomId = signal(this.initialState.rooms[0]?.id ?? '');
  readonly searchTerm = signal('');
  readonly draftMessage = signal('');
  readonly isConnected = signal(true);
  readonly formError = signal('');

  readonly filteredRooms = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.rooms();
    }

    return this.rooms().filter((room) =>
      [room.name, room.topic].some((value) => value.toLowerCase().includes(term))
    );
  });

  readonly selectedRoom = computed(
    () => this.rooms().find((room) => room.id === this.selectedRoomId()) ?? this.filteredRooms()[0] ?? null
  );

  readonly roomMessages = computed(() => {
    const room = this.selectedRoom();
    return room ? this.messages().filter((message) => message.roomId === room.id) : [];
  });

  readonly unreadTotal = computed(() => this.rooms().reduce((total, room) => total + room.unread, 0));
  readonly onlineRooms = computed(() => this.rooms().filter((room) => room.online).length);
  readonly hasActiveSearch = computed(() => this.searchTerm().trim().length > 0);

  selectRoom(roomId: string): void {
    this.selectedRoomId.set(roomId);
    this.formError.set('');
    this.rooms.update((rooms) => rooms.map((room) => (room.id === roomId ? { ...room, unread: 0 } : room)));
    this.persistState();
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
    const filteredRooms = this.filteredRooms();

    if (filteredRooms.length > 0 && !filteredRooms.some((room) => room.id === this.selectedRoomId())) {
      this.selectRoom(filteredRooms[0].id);
    }
  }

  updateDraft(value: string): void {
    this.draftMessage.set(value);
    this.formError.set('');
  }

  sendMessage(): void {
    const room = this.selectedRoom();
    const text = this.draftMessage().trim();

    if (!room) {
      return;
    }

    if (!this.isConnected()) {
      this.formError.set('CHAT_APP.ERRORS.OFFLINE');
      return;
    }

    if (text.length < 2) {
      this.formError.set('CHAT_APP.ERRORS.MESSAGE');
      return;
    }

    this.messages.update((messages) => [
      ...messages,
      {
        id: `message-${Date.now()}`,
        roomId: room.id,
        author: 'me',
        authorName: 'You',
        text,
        createdAt: new Date().toISOString()
      }
    ]);
    this.draftMessage.set('');
    this.formError.set('');
    this.persistState();
  }

  toggleConnection(): void {
    this.isConnected.update((isConnected) => !isConnected);
    this.formError.set('');
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.ensureSelectedRoom();
  }

  resetDemo(): void {
    this.rooms.set(DEMO_ROOMS.map((room) => ({ ...room })));
    this.messages.set(DEMO_MESSAGES.map((message) => ({ ...message })));
    this.selectedRoomId.set(DEMO_ROOMS[0].id);
    this.searchTerm.set('');
    this.draftMessage.set('');
    this.isConnected.set(true);
    this.formError.set('');
    this.persistState();
  }

  private ensureSelectedRoom(): void {
    if (!this.rooms().some((room) => room.id === this.selectedRoomId())) {
      this.selectedRoomId.set(this.rooms()[0]?.id ?? '');
    }
  }

  private loadState(): ChatState {
    const storedState = localStorage.getItem(STORAGE_KEY);

    if (!storedState) {
      return this.getDemoState();
    }

    try {
      const parsedState = JSON.parse(storedState) as ChatState;

      if (!Array.isArray(parsedState.rooms) || !Array.isArray(parsedState.messages) || parsedState.rooms.length === 0) {
        return this.getDemoState();
      }

      return parsedState;
    } catch {
      return this.getDemoState();
    }
  }

  private getDemoState(): ChatState {
    return {
      rooms: DEMO_ROOMS.map((room) => ({ ...room })),
      messages: DEMO_MESSAGES.map((message) => ({ ...message }))
    };
  }

  private persistState(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rooms: this.rooms(),
        messages: this.messages()
      })
    );
  }
}
