import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServices } from '../../features/auth/services/auth.services';

export const authGuard: CanActivateFn = async () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const authServices = inject(AuthServices);

  const user =await  authServices.getCurrentUser();

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
