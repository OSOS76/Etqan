import { signal, Service } from '@angular/core';

@Service()
export class LoadingSpinner {
  isLoading = signal(false);

  show() {
    this.isLoading.set(true);
  }

  hide() {
    this.isLoading.set(false);
  }
}
