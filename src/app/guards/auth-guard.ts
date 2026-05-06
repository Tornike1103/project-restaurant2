import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!accessToken && !refreshToken) {
    alert('You must be logged in to access this page.');
    router.navigateByUrl("/auth");
    return false;
  }
  return true;
};
