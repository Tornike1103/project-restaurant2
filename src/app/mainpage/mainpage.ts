import { CommonModule } from '@angular/common';
import { Component, computed, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Api } from '../services/api';
import { AlertService } from '../services/alert.service';

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
  private alertService = inject(AlertService);
  private router = inject(Router);

  popularProducts = computed(() => this.products().slice(0, 4));

  constructor(private api: Api) {
    this.loadProducts();
  }

  navigateToCart() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!accessToken && !refreshToken) {
      this.alertService.warning('Please log in to view your cart');
      return;
    }
    this.router.navigate(['/cart']);
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
