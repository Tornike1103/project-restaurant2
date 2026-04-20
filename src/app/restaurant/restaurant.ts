import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './restaurant.html',
  styleUrls: ['./restaurant.scss'],
})
export class Restaurant {
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  search = signal('');
  selectedCategory = signal('all');
  priceMax = signal(50);
  authMessage = signal('');
  token = signal(localStorage.getItem('accessToken') ?? '');
  loadingError = signal('');

  filteredProducts = computed(() => {
    const term = this.search().toLowerCase();
    const maxPrice = this.priceMax();

    return this.products().filter((product) => {
      const title = (product.title || product.name || '').toString().toLowerCase();
      const price = Number(product.price || product.priceUsd || 0);
      const matchesSearch = !term || title.includes(term);
      const matchesPrice = !maxPrice || price <= maxPrice;
      return matchesSearch && matchesPrice;
    });
  });

  constructor(private api: Api) {
    this.loadProducts();
    this.loadCategories();
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
    this.loadProducts(category);
  }

  loadProducts(category: string = 'all') {
    this.loadingError.set('');
    const request = category === 'all'
      ? this.api.getProducts()
      : this.api.getProductsFilter({ categoryId: category });

    request.subscribe({
      next: (result) => this.products.set(this.normalizeData(result)),
      error: (error) => {
        this.products.set([]);
        this.loadingError.set('Unable to load products from the API.');
        console.error('Product load error:', error);
      },
    });
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


  loadCategories() {
    this.api.getCategories().subscribe({
      next: (result) => this.categories.set(this.normalizeData(result)),
      error: (error) => {
        this.categories.set([]);
        console.error('Category load error:', error);
      },
    });
  }

  addToCart(product: any) {
    if (!this.token()) {
      this.authMessage.set('Please login on the Auth page before adding to cart.');
      return;
    }

    const productId = product.id || product._id || product.productId;
    if (!productId) {
      this.authMessage.set('Unable to add product.');
      return;
    }

    this.api.cartAdd({ productId, quantity: 1 }).subscribe({
      next: () => {
        this.authMessage.set('Product added to cart.');
      },
      error: (error) => {
        this.authMessage.set('Add to cart failed.');
        console.error('Cart add error:', error);
      },
    });
  }
}
