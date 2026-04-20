import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mainpage.html',
  styleUrls: ['./mainpage.scss'],
})
export class Mainpage {
  products = signal<any[]>([]);
  loadingError = signal('');

  popularProducts = computed(() => this.products().slice(0, 4));

  constructor(private api: Api) {
    this.loadProducts();
  }

  normalizeData(data: any) {
    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    if (Array.isArray(data?.data?.products)) {
      return data.data.products;
    }
    if (Array.isArray(data?.items)) {
      return data.items;
    }
    return data?.products ?? [];
  }

  loadProducts() {
    this.loadingError.set('');
    this.api.getProducts().subscribe({
      next: (result) => this.products.set(this.normalizeData(result)),
      error: (error) => {
        this.products.set([]);
        this.loadingError.set('Unable to load popular dishes from the API.');
        console.error('Homepage product load error:', error);
      },
    });
  }
}
