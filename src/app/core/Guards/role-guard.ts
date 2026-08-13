import { CanActivateFn, Router } from '@angular/router';
import { User } from '../models/user.model';
import { inject } from '@angular/core';
import { AuthServices } from '../../features/auth/services/auth.services';

export function roleGuard(role: User['role']): CanActivateFn {
  return async () => {
    const authServices = inject(AuthServices);
    const router = inject(Router);

    const firebaseUser = await authServices.getCurrentUser();

    if (!firebaseUser) {
      return router.createUrlTree(['/login']);
    }
    const userData = await authServices.getUserData(firebaseUser.uid);

    if (!userData) {
      return router.createUrlTree(['/login']);
    }

    if (userData.role !== role) {
      return router.createUrlTree(['/']);
    }
    return true;
  };
}
