import { Component, inject } from '@angular/core';
import { BreadcrumbsServise } from '../services/breadcrumbs-servise';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterModule],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
  private breadcrumbsService = inject(BreadcrumbsServise);

  breadcrumbs = this.breadcrumbsService.breadcrumbs;
}
