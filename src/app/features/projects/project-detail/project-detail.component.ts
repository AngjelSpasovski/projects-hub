import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { PROJECTS } from '../project-registry';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly project = computed(() => {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    return PROJECTS.find((project) => project.id === projectId);
  });
}
