import { authGuard } from '../../core/Guards/auth-guard-guard';
import { roleGuard } from '../../core/Guards/role-guard';
import { Routes } from '@angular/router';

export const teacherRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard('teacher')],
    loadComponent: () =>
      import('./pages/dashboard/thdashboard/thdashboard').then((m) => m.Thdashboard),

    children: [
      {
        path: 'add-course',
        loadComponent: () => import('./components/add-course/add-course').then((m) => m.AddCourse),
      },
      {
        path: 'your-courses',
        loadComponent: () =>
          import('./pages/dashboard/your-courses/your-courses').then((m) => m.YourCourses),
      },
      {
        path: 'groups',
        loadComponent: () => import('./pages/dashboard/groups/groups').then((m) => m.Groups),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/dashboard/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'setting',
        loadComponent: () => import('./pages/dashboard/setting/setting').then((m) => m.Setting),
      },
    ],
  },
];
