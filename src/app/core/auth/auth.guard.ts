import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { USER_ROL } from '../enum/role.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.currentUserRole() === USER_ROL.ROLE_ADMIN) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
