import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ClientPanelComponent } from './client-panel.component';

describe('ClientPanelComponent', () => {
  let component: ClientPanelComponent;
  let fixture: ComponentFixture<ClientPanelComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ClientPanelComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads demo clients and calculates totals', () => {
    expect(component.clients().length).toBe(3);
    expect(component.totalBalance()).toBe(1700);
    expect(component.selectedClient()?.id).toBe('client-1001');
  });

  it('filters clients by search term', () => {
    component.searchTerm.set('marko');

    expect(component.filteredClients().map((client) => client.id)).toEqual(['client-1002']);
  });

  it('filters clients by status and resets the selected status', () => {
    component.selectStatus('review');

    expect(component.filteredClients().map((client) => client.id)).toEqual(['client-1002']);
    expect(component.selectedStatus()).toBe('review');

    component.resetDemo();

    expect(component.selectedStatus()).toBe('all');
  });

  it('clears search and status filters from an empty results state', () => {
    component.searchTerm.set('missing');
    component.selectStatus('overdue');

    expect(component.filteredClients()).toEqual([]);
    expect(component.hasActiveFilters()).toBeTrue();

    component.clearFilters();

    expect(component.searchTerm()).toBe('');
    expect(component.selectedStatus()).toBe('all');
    expect(component.filteredClients().length).toBe(3);
  });

  it('switches from detail mode to list overview mode', () => {
    component.selectClient('client-1002');

    component.showClientList();

    expect(component.mode()).toBe('list');
    expect(component.selectedClient()?.id).toBe('client-1002');
  });

  it('validates client form before saving', () => {
    component.showCreateForm();
    component.saveForm();

    expect(component.formError()).toBe('CLIENT_PANEL.ERRORS.NAME');
    expect(component.clients().length).toBe(3);
  });

  it('creates, edits, and deletes a client', () => {
    component.showCreateForm();
    component.form.set({
      firstName: 'Sara',
      lastName: 'Ilievska',
      email: 'sara@example.com',
      phone: '+389 71 111 222',
      balance: 300
    });
    component.saveForm();

    expect(component.clients().length).toBe(4);
    expect(component.selectedClient()?.firstName).toBe('Sara');

    component.showEditForm();
    component.updateForm('balance', '950');
    component.saveForm();

    expect(component.selectedClient()?.balance).toBe(950);
    expect(component.selectedClient()?.status).toBe('overdue');

    component.requestDeleteSelectedClient();

    expect(component.pendingDeleteClientId()).toBe(component.selectedClient()?.id);

    component.cancelDelete();

    expect(component.pendingDeleteClientId()).toBe('');
    expect(component.clients().length).toBe(4);

    component.requestDeleteSelectedClient();
    component.confirmDelete();

    expect(component.clients().length).toBe(3);
  });

  it('persists clients to localStorage', () => {
    component.showCreateForm();
    component.form.set({
      firstName: 'Ivan',
      lastName: 'Todorov',
      email: 'ivan@example.com',
      phone: '+389 72 333 444',
      balance: 100
    });
    component.saveForm();

    const storedClients = JSON.parse(localStorage.getItem('projects-hub-client-panel') ?? '[]');

    expect(storedClients.length).toBe(4);
  });
});
