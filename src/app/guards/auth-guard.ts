import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let alertService = inject(AlertService);
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!accessToken && !refreshToken) {
    alertService.warning('You must be logged in to access this page.');
    router.navigateByUrl("/auth");
    return false;
  }
  return true;
};
