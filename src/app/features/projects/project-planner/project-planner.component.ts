import { Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type PlannerStatus = 'active' | 'finished';

interface PlannerProject {
  id: string;
  title?: string;
  titleKey?: string;
  description?: string;
  descriptionKey?: string;
  extraInfo?: string;
  extraInfoKey?: string;
  status: PlannerStatus;
}

const INITIAL_PROJECTS: PlannerProject[] = [
  {
    id: 'course',
    titleKey: 'PROJECT_PLANNER.SAMPLE.COURSE.TITLE',
    descriptionKey: 'PROJECT_PLANNER.SAMPLE.COURSE.DESCRIPTION',
    extraInfoKey: 'PROJECT_PLANNER.SAMPLE.COURSE.EXTRA',
    status: 'active'
  },
  {
    id: 'groceries',
    titleKey: 'PROJECT_PLANNER.SAMPLE.GROCERIES.TITLE',
    descriptionKey: 'PROJECT_PLANNER.SAMPLE.GROCERIES.DESCRIPTION',
    extraInfoKey: 'PROJECT_PLANNER.SAMPLE.GROCERIES.EXTRA',
    status: 'active'
  },
  {
    id: 'hotel',
    titleKey: 'PROJECT_PLANNER.SAMPLE.HOTEL.TITLE',
    descriptionKey: 'PROJECT_PLANNER.SAMPLE.HOTEL.DESCRIPTION',
    extraInfoKey: 'PROJECT_PLANNER.SAMPLE.HOTEL.EXTRA',
    status: 'finished'
  }
];

@Component({
  selector: 'app-project-planner',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './project-planner.component.html',
  styleUrl: './project-planner.component.scss'
})
export class ProjectPlannerComponent {
  readonly projects = signal<PlannerProject[]>(INITIAL_PROJECTS);
  readonly selectedProjectId = signal<string | null>(null);
  readonly draggedProjectId = signal<string | null>(null);
  readonly dropTarget = signal<PlannerStatus | null>(null);
  readonly newProjectTitle = signal('');
  readonly newProjectDescription = signal('');
  readonly formSubmitted = signal(false);

  readonly activeProjects = computed(() => this.projects().filter((project) => project.status === 'active'));
  readonly finishedProjects = computed(() => this.projects().filter((project) => project.status === 'finished'));
  readonly titleErrorVisible = computed(() => this.formSubmitted() && !this.newProjectTitle().trim());
  readonly selectedProject = computed(() => {
    const selectedProjectId = this.selectedProjectId();
    return this.projects().find((project) => project.id === selectedProjectId) ?? null;
  });

  updateNewProjectTitle(value: string): void {
    this.newProjectTitle.set(value);
  }

  updateNewProjectDescription(value: string): void {
    this.newProjectDescription.set(value);
  }

  addProject(): void {
    this.formSubmitted.set(true);

    const title = this.newProjectTitle().trim();
    const description = this.newProjectDescription().trim();

    if (!title) {
      return;
    }

    const id = `${this.slugify(title)}-${Date.now()}`;
    const project: PlannerProject = {
      id,
      title,
      description: description || 'New project without a description yet.',
      extraInfo: description || 'This project was created inside the Angular migration workspace.',
      status: 'active'
    };

    this.projects.update((projects) => [project, ...projects]);
    this.selectedProjectId.set(id);
    this.newProjectTitle.set('');
    this.newProjectDescription.set('');
    this.formSubmitted.set(false);
  }

  moveProject(projectId: string, status: PlannerStatus): void {
    this.projects.update((projects) =>
      projects.map((project) => (project.id === projectId ? { ...project, status } : project))
    );
  }

  startDrag(projectId: string, event: DragEvent): void {
    this.draggedProjectId.set(projectId);
    event.dataTransfer?.setData('text/plain', projectId);

    if (event.currentTarget instanceof Element) {
      event.dataTransfer?.setDragImage(event.currentTarget, 16, 16);
    }
  }

  endDrag(): void {
    this.draggedProjectId.set(null);
    this.dropTarget.set(null);
  }

  allowDrop(status: PlannerStatus, event: DragEvent): void {
    event.preventDefault();
    this.dropTarget.set(status);
  }

  enterLane(status: PlannerStatus): void {
    if (this.draggedProjectId()) {
      this.dropTarget.set(status);
    }
  }

  leaveLane(status: PlannerStatus): void {
    if (this.dropTarget() === status) {
      this.dropTarget.set(null);
    }
  }

  dropProject(status: PlannerStatus, event: DragEvent): void {
    event.preventDefault();

    const projectId = event.dataTransfer?.getData('text/plain') || this.draggedProjectId();

    if (projectId) {
      this.moveProject(projectId, status);
    }

    this.endDrag();
  }

  selectProject(projectId: string): void {
    this.selectedProjectId.set(projectId);
  }

  clearSelection(): void {
    this.selectedProjectId.set(null);
  }

  private slugify(value: string): string {
    return (
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'project'
    );
  }
}
