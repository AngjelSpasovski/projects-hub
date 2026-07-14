import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

type PanelMode = 'list' | 'detail' | 'create' | 'edit';
type ClientStatus = 'active' | 'review' | 'overdue';
type ClientStatusFilter = 'all' | ClientStatus;

interface ClientRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  balance: number;
  status: ClientStatus;
}

interface ClientForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  balance: number | null;
}

const STORAGE_KEY = 'projects-hub-client-panel';

const DEMO_CLIENTS: ClientRecord[] = [
  {
    id: 'client-1001',
    firstName: 'Ana',
    lastName: 'Petrova',
    email: 'ana.petrova@example.com',
    phone: '+389 70 123 456',
    balance: 1280,
    status: 'active'
  },
  {
    id: 'client-1002',
    firstName: 'Marko',
    lastName: 'Stojanov',
    email: 'marko.stojanov@example.com',
    phone: '+389 75 222 118',
    balance: 420,
    status: 'review'
  },
  {
    id: 'client-1003',
    firstName: 'Elena',
    lastName: 'Nikolova',
    email: 'elena.nikolova@example.com',
    phone: '+389 78 654 321',
    balance: 0,
    status: 'active'
  }
];

const EMPTY_FORM: ClientForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  balance: 0
};

const STATUS_FILTERS: { id: ClientStatusFilter; labelKey: string }[] = [
  { id: 'all', labelKey: 'CLIENT_PANEL.FILTERS.ALL' },
  { id: 'active', labelKey: 'CLIENT_PANEL.FILTERS.ACTIVE' },
  { id: 'review', labelKey: 'CLIENT_PANEL.FILTERS.REVIEW' },
  { id: 'overdue', labelKey: 'CLIENT_PANEL.FILTERS.OVERDUE' }
];

@Component({
  selector: 'app-client-panel',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, TranslatePipe],
  templateUrl: './client-panel.component.html',
  styleUrl: './client-panel.component.scss'
})
export class ClientPanelComponent {
  readonly clients = signal<ClientRecord[]>(this.loadClients());
  readonly statusFilters = STATUS_FILTERS;
  readonly selectedClientId = signal(this.clients()[0]?.id ?? '');
  readonly mode = signal<PanelMode>('list');
  readonly searchTerm = signal('');
  readonly selectedStatus = signal<ClientStatusFilter>('all');
  readonly form = signal<ClientForm>({ ...EMPTY_FORM });
  readonly formError = signal('');
  readonly pendingDeleteClientId = signal('');

  readonly filteredClients = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.clients().filter((client) => {
      const matchesStatus = status === 'all' || client.status === status;
      const matchesSearch =
        !term ||
        [client.firstName, client.lastName, client.email, client.phone, client.status].some((value) =>
          value.toLowerCase().includes(term)
        );

      return matchesStatus && matchesSearch;
    });
  });

  readonly selectedClient = computed(
    () => this.clients().find((client) => client.id === this.selectedClientId()) ?? this.clients()[0] ?? null
  );

  readonly totalBalance = computed(() => this.clients().reduce((total, client) => total + client.balance, 0));
  readonly activeCount = computed(() => this.clients().filter((client) => client.status === 'active').length);
  readonly overdueCount = computed(() => this.clients().filter((client) => client.status === 'overdue').length);
  readonly hasActiveFilters = computed(() => this.searchTerm().trim().length > 0 || this.selectedStatus() !== 'all');
  readonly emptyTitleKey = computed(() =>
    this.clients().length === 0 ? 'CLIENT_PANEL.EMPTY.NO_CLIENTS_TITLE' : 'CLIENT_PANEL.EMPTY.NO_RESULTS_TITLE'
  );
  readonly emptyTextKey = computed(() =>
    this.clients().length === 0 ? 'CLIENT_PANEL.EMPTY.NO_CLIENTS_TEXT' : 'CLIENT_PANEL.EMPTY.NO_RESULTS_TEXT'
  );

  selectStatus(status: ClientStatusFilter): void {
    this.selectedStatus.set(status);
    this.ensureSelectionInFilter();
  }

  selectClient(clientId: string): void {
    this.selectedClientId.set(clientId);
    this.mode.set('detail');
    this.formError.set('');
  }

  showCreateForm(): void {
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
    this.mode.set('create');
  }

  showEditForm(): void {
    const client = this.selectedClient();

    if (!client) {
      return;
    }

    this.form.set({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      balance: client.balance
    });
    this.formError.set('');
    this.mode.set('edit');
  }

  saveForm(): void {
    const validationError = this.getValidationError(this.form());

    if (validationError) {
      this.formError.set(validationError);
      return;
    }

    if (this.mode() === 'edit') {
      this.updateClient();
      return;
    }

    this.addClient();
  }

  requestDeleteSelectedClient(): void {
    const selectedClient = this.selectedClient();

    if (!selectedClient) {
      return;
    }

    this.pendingDeleteClientId.set(selectedClient.id);
  }

  cancelDelete(): void {
    this.pendingDeleteClientId.set('');
  }

  confirmDelete(): void {
    const selectedClient = this.clients().find((client) => client.id === this.pendingDeleteClientId());

    if (!selectedClient) {
      this.cancelDelete();
      return;
    }

    const remainingClients = this.clients().filter((client) => client.id !== selectedClient.id);
    this.clients.set(remainingClients);
    this.persistClients();
    this.selectedClientId.set(remainingClients[0]?.id ?? '');
    this.pendingDeleteClientId.set('');
    this.mode.set('list');
  }

  resetDemo(): void {
    this.clients.set([...DEMO_CLIENTS]);
    this.selectedClientId.set(DEMO_CLIENTS[0].id);
    this.searchTerm.set('');
    this.selectedStatus.set('all');
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
    this.pendingDeleteClientId.set('');
    this.mode.set('list');
    this.persistClients();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set('all');
    this.ensureSelectionInFilter();
  }

  showClientList(): void {
    this.formError.set('');
    this.mode.set('list');
  }

  cancelForm(): void {
    this.formError.set('');
    this.mode.set(this.selectedClient() ? 'detail' : 'list');
  }

  updateForm(field: keyof ClientForm, value: string): void {
    this.form.update((form) => ({
      ...form,
      [field]: field === 'balance' ? Number(value) : value
    }));
  }

  private ensureSelectionInFilter(): void {
    const filteredClients = this.filteredClients();

    if (filteredClients.length > 0 && !filteredClients.some((client) => client.id === this.selectedClientId())) {
      this.selectedClientId.set(filteredClients[0].id);
    }
  }

  private addClient(): void {
    const form = this.form();
    const client: ClientRecord = {
      id: `client-${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      balance: Number(form.balance ?? 0),
      status: Number(form.balance ?? 0) > 900 ? 'overdue' : 'active'
    };

    this.clients.update((clients) => [...clients, client]);
    this.selectedClientId.set(client.id);
    this.mode.set('detail');
    this.persistClients();
  }

  private updateClient(): void {
    const selectedClient = this.selectedClient();
    const form = this.form();

    if (!selectedClient) {
      return;
    }

    this.clients.update((clients) =>
      clients.map((client) =>
        client.id === selectedClient.id
          ? {
              ...client,
              firstName: form.firstName.trim(),
              lastName: form.lastName.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
              balance: Number(form.balance ?? 0),
              status: Number(form.balance ?? 0) > 900 ? 'overdue' : client.status
            }
          : client
      )
    );
    this.mode.set('detail');
    this.persistClients();
  }

  private getValidationError(form: ClientForm): string {
    if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) {
      return 'CLIENT_PANEL.ERRORS.NAME';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'CLIENT_PANEL.ERRORS.EMAIL';
    }

    if (form.phone.trim().length < 9) {
      return 'CLIENT_PANEL.ERRORS.PHONE';
    }

    if (Number(form.balance ?? 0) < 0) {
      return 'CLIENT_PANEL.ERRORS.BALANCE';
    }

    return '';
  }

  private loadClients(): ClientRecord[] {
    const storedClients = localStorage.getItem(STORAGE_KEY);

    if (!storedClients) {
      return [...DEMO_CLIENTS];
    }

    try {
      const clients = JSON.parse(storedClients) as ClientRecord[];
      return Array.isArray(clients) && clients.length > 0 ? clients : [...DEMO_CLIENTS];
    } catch {
      return [...DEMO_CLIENTS];
    }
  }

  private persistClients(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.clients()));
  }
}
