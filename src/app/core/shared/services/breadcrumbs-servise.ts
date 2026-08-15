import { inject, Service, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Service()
export class BreadcrumbsServise {
  private router = inject(Router);

  breadcrumbs = signal<Breadcrumb[]>([]);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateBreadcrumbs());

    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs(): void {
    const segments = this.router.url.split('?')[0].split('/').filter(Boolean);

    const breadcrumbs: Breadcrumb[] = [
      {
        label: 'الرئيسية',
        url: '/',
      },
    ];

    let currentUrl = '';

    for (const segment of segments) {
      currentUrl += `/${segment}`;

      breadcrumbs.push({
        label: this.getLabel(segment),
        url: currentUrl,
      });
    }

    this.breadcrumbs.set(breadcrumbs);
  }

  private getLabel(segment: string): string {
    const labels: Record<string, string> = {
      dashboard: 'لوحة التحكم',
      teacher: 'المدرس',
      student: 'الطالب',
      courses: 'الكورسات',
      'course-details': 'تفاصيل الكورس',
      profile: 'الملف الشخصي',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
    };

    return labels[segment] ?? segment;
  }
  setCourseName(name: string): void {
    const current = this.breadcrumbs();

    if (!current.length) return;

    current[current.length - 1] = {
      ...current[current.length - 1],
      label: name,
    };

    this.breadcrumbs.set([...current]);
  }
}
