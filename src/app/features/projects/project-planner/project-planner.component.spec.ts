import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ProjectPlannerComponent } from './project-planner.component';

describe('ProjectPlannerComponent', () => {
  let component: ProjectPlannerComponent;
  let fixture: ComponentFixture<ProjectPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPlannerComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with active and finished projects', () => {
    expect(component.activeProjects().length).toBe(2);
    expect(component.finishedProjects().length).toBe(1);
  });

  it('moves projects between lanes', () => {
    component.moveProject('course', 'finished');

    expect(component.activeProjects().map((project) => project.id)).not.toContain('course');
    expect(component.finishedProjects().map((project) => project.id)).toContain('course');
  });

  it('requires a title before creating a project', () => {
    component.addProject();

    expect(component.projects().length).toBe(3);
    expect(component.titleErrorVisible()).toBeTrue();
  });

  it('creates and selects a new active project', () => {
    component.updateNewProjectTitle('Migrate sidebar');
    component.updateNewProjectDescription('Move legacy navigation into the shared shell.');

    component.addProject();

    const createdProject = component.activeProjects()[0];

    expect(createdProject.title).toBe('Migrate sidebar');
    expect(createdProject.description).toBe('Move legacy navigation into the shared shell.');
    expect(component.selectedProjectId()).toBe(createdProject.id);
    expect(component.newProjectTitle()).toBe('');
    expect(component.titleErrorVisible()).toBeFalse();
  });

  it('moves a dragged project into the dropped lane', () => {
    const dataTransfer = new DataTransfer();
    const dragEvent = new DragEvent('dragstart', { dataTransfer });
    const dropEvent = new DragEvent('drop', { dataTransfer });

    component.startDrag('groceries', dragEvent);
    component.dropProject('finished', dropEvent);

    expect(component.finishedProjects().map((project) => project.id)).toContain('groceries');
    expect(component.draggedProjectId()).toBeNull();
    expect(component.dropTarget()).toBeNull();
  });

  it('tracks and clears lane drop targets', () => {
    const event = new DragEvent('dragover');
    spyOn(event, 'preventDefault');

    component.allowDrop('active', event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.dropTarget()).toBe('active');

    component.leaveLane('active');

    expect(component.dropTarget()).toBeNull();
  });

  it('shows and clears selected project info', () => {
    component.selectProject('hotel');

    expect(component.selectedProject()?.titleKey).toBe('PROJECT_PLANNER.SAMPLE.HOTEL.TITLE');

    component.clearSelection();

    expect(component.selectedProject()).toBeNull();
  });
});
