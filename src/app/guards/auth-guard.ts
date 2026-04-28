import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  if (!localStorage.getItem('accessToken')) {
    alert('You must be logged in to access this page.');
    router.navigateByUrl("/auth");
    return false;
  }
  return true;
};
