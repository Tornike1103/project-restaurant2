import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class Cart {
  cartItems = signal<any[]>([]);
  authMessage = signal('');
  token = signal(localStorage.getItem('accessToken') ?? '');

  totalPrice = computed(() =>
    this.cartItems().reduce(
      (sum, item) => sum + (Number(item.price || item.product?.price || 0) * Number(item.quantity || 1)),
      0
    )
  );

  constructor(private api: Api) {
    this.loadCart();
  }

  normalizeData(data: any) {
    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    if (Array.isArray(data?.items)) {
      return data.items;
    }
    if (Array.isArray(data?.data?.items)) {
      return data.data.items;
    }
    return data?.products ?? [];
  }

  loadCart() {
    if (!this.token()) {
      this.cartItems.set([]);
      return;
    }

    this.api.getCart().subscribe({
      next: (result) => this.cartItems.set(this.normalizeData(result)),
      error: () => this.cartItems.set([]),
    });
  }

  setToken(value: string) {
    this.token.set(value);
    if (value) {
      localStorage.setItem('accessToken', value);
      this.loadCart();
    } else {
      localStorage.removeItem('accessToken');
      this.cartItems.set([]);
    }
  }

  logout() {
    this.setToken('');
    this.authMessage.set('Logged out.');
  }

  removeFromCart(item: any) {
    const itemId = item.id || item._id || item.itemId;
    if (!itemId) {
      return;
    }
    this.api.cartRemove(itemId).subscribe({
      next: () => this.loadCart(),
      error: () => this.authMessage.set('Unable to remove item.'),
    });
  }

  changeQuantity(item: any, delta: number) {
    const itemId = item.id || item._id || item.itemId;
    const quantity = Number(item.quantity || 1) + delta;
    if (!itemId || quantity < 1) {
      return this.removeFromCart(item);
    }
    this.api.cartEditQuantity({ itemId, quantity }).subscribe({
      next: () => this.loadCart(),
      error: () => this.authMessage.set('Unable to update quantity.'),
    });
  }

  checkout() {
    if (!this.token()) {
      this.authMessage.set('Login to checkout.');
      return;
    }
    this.api.checkoutCart({}).subscribe({
      next: () => {
        this.authMessage.set('Checkout complete.');
        this.loadCart();
      },
      error: () => this.authMessage.set('Checkout failed.'),
    });
  }
}
