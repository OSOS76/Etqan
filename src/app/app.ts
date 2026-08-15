import { Component, inject, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import AOS from 'aos';
import { AuthServices } from './features/auth/services/auth.services';
import { LoadingSpinnerServicess } from './core/shared/services/loading-spinner';
import { Loading } from './core/shared/loading/loading';
import { BreadcrumbsServise } from './core/shared/services/breadcrumbs-servise';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loading],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authServices = inject(AuthServices);

  loadingService = inject(LoadingSpinnerServicess);

  private router = inject(Router);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const url = event.url;

        // لو التنقل مجرد fragment داخل نفس الصفحة، متظهرش spinner
        if (url.includes('#')) {
          return;
        }

        this.loadingService.show();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loadingService.hide();
        }, 1500);
      }
    });
  }

  ngOnInit(): void {
    this.authServices.checkAuthState();

    AOS.init({
      duration: 900,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }
}
