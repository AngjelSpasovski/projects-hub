import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { TodoListComponent } from './todo-list.component';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with demo tasks', () => {
    expect(component).toBeTruthy();
    expect(component.tasks().length).toBe(2);
    expect(component.activeCount()).toBe(1);
    expect(component.completedCount()).toBe(1);
  });

  it('should validate an empty title before adding a task', () => {
    component.submitTask();

    expect(component.isTitleInvalid()).toBeTrue();
    expect(component.tasks().length).toBe(2);
  });

  it('should add a task and persist it to localStorage', () => {
    component.updateTitle('Write portfolio update');
    component.updateNotes('Mention the new To-Do List app.');
    component.updatePriority('high');
    component.updateDueDate('2026-06-30');
    component.submitTask();

    expect(component.tasks()[0]).toEqual(
      jasmine.objectContaining({
        title: 'Write portfolio update',
        notes: 'Mention the new To-Do List app.',
        priority: 'high',
        dueDate: '2026-06-30',
        completed: false
      })
    );
    expect(localStorage.getItem('projects-hub-todo-list')).toContain('Write portfolio update');
  });

  it('should filter active and completed tasks', () => {
    component.updateFilter('active');
    expect(component.filteredTasks().every((task) => !task.completed)).toBeTrue();

    component.updateFilter('completed');
    expect(component.filteredTasks().every((task) => task.completed)).toBeTrue();
  });

  it('should edit, complete, and delete a task', () => {
    const firstTask = component.tasks()[0];

    component.editTask(firstTask);
    component.updateTitle('Updated task');
    component.submitTask();

    expect(component.tasks()[0].title).toBe('Updated task');

    component.toggleTask(firstTask.id);
    expect(component.tasks()[0].completed).toBeTrue();

    component.deleteTask(firstTask.id);
    expect(component.tasks().some((task) => task.id === firstTask.id)).toBeFalse();
  });

  it('should clear completed tasks', () => {
    component.clearCompleted();

    expect(component.tasks().length).toBe(1);
    expect(component.completedCount()).toBe(0);
  });
});
