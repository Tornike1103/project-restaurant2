import { Routes } from '@angular/router';
import { Mainpage } from './mainpage/mainpage';
import { Restaurant } from './restaurant/restaurant';
import { Cart } from './cart/cart';
import { Registration } from './registration/registration';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Mainpage },
  { path: 'menu', component: Restaurant },
  { path: 'cart', component: Cart },
  { path: 'auth', component: Registration },
  { path: '**', redirectTo: '' },
];
