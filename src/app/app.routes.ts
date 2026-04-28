import { Routes } from '@angular/router';
import { Mainpage } from './mainpage/mainpage';
import { Restaurant } from './restaurant/restaurant';
import { Cart } from './cart/cart';
import { Registration } from './registration/registration';
import { ErrorPage } from './error/error';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Mainpage },
  // {
  //   path: 'menu',
  //   loadComponent: () => import('./restaurant/restaurant').then((m) => m.Restaurant),
  //   canActivate: [authGuard],
  // },
  { path: 'menu', component: Restaurant },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart').then((m) => m.Cart),
    canActivate: [authGuard],
  },

  // { path: 'cart', component: Cart, canActivate: [authGuard] },
{
  path: 'auth',
  loadComponent: () => import('./registration/registration').then((m) => m.Registration),
  
},
  // { path: 'auth', component: Registration },
  { path: '**', component: ErrorPage },
];
