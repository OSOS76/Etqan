import { signal, Service } from '@angular/core';

@Service()
export class LoadingSpinnerServicess {
  isLoading = signal(false);

  show() {
    this.isLoading.set(true);
  }

  hide() {
    this.isLoading.set(false);
  }
}
