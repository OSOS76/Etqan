import { Routes } from '@angular/router';

export const landingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing-page/landing-page').then((m) => m.LandingPage),
  },
  {
    path: 'course-details/:id',
    loadComponent: () =>
      import('./components/course-details/course-details').then((m) => m.CourseDetails),
  },
];
