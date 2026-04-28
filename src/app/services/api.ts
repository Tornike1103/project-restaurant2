import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  baseUrl = 'https://restaurantapi.stepacademy.ge/';
  // apiKey = '6f035f63-b2c6-4f9b-95ef-bd6b74a706d3';

  constructor(private http: HttpClient) {}

  private defaultHeaders(includeAuth = false) {
    // let headers = new HttpHeaders({ 'X-API-Key': this.apiKey });
    let headers = new HttpHeaders();
    const token = localStorage.getItem('accessToken');
    if (includeAuth && token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  adminRegister(data: any) {
    return this.http.post(this.baseUrl + 'api/admin/register', data, this.defaultHeaders());
  }

  adminLogin(data: any) {
    return this.http.post(this.baseUrl + 'api/admin/login', data);
  }

  authRegister(data: any) {
    return this.http.post(this.baseUrl + 'api/auth/register', data, this.defaultHeaders());
  }

  authLogin(data: any) {
    return this.http.post(this.baseUrl + 'api/auth/login', data, this.defaultHeaders());
  }

  refreshAccessToken(token: string) {
    return this.http.post(this.baseUrl + `api/auth/refresh-access-token/${token}`, {}, this.defaultHeaders());
  }

  verifyEmail(data: any) {
    return this.http.put(this.baseUrl + 'api/auth/verify-email', data, this.defaultHeaders());
  }

  resendEmailVerification(email: string) {
    return this.http.post(this.baseUrl + `api/auth/resend-email-verification/${email}`, {}, this.defaultHeaders());
  }

  forgotPassword(email: string) {
    return this.http.post(this.baseUrl + `api/auth/forgot-password/${email}`, {}, this.defaultHeaders());
  }

  resetPassword(data: any) {
    return this.http.put(this.baseUrl + 'api/auth/reset-password', data, this.defaultHeaders());
  }

  cartAdd(data: any) {
    return this.http.post(this.baseUrl + 'api/cart/add-to-cart', data, this.defaultHeaders(true));
  }

  cartEditQuantity(data: any) {
    return this.http.put(this.baseUrl + 'api/cart/edit-quantity', data, this.defaultHeaders(true));
  }

  cartRemove(itemId: string) {
    return this.http.delete(this.baseUrl + `api/cart/remove-from-cart/${itemId}`, this.defaultHeaders(true));
  }

  getCart() {
    return this.http.get(this.baseUrl + 'api/cart', this.defaultHeaders(true));
  }

  checkoutCart(data: any) {
    return this.http.post(this.baseUrl + 'api/cart/checkout', data, this.defaultHeaders(true));
  }

  getCategories() {
    return this.http.get(this.baseUrl + 'api/categories', this.defaultHeaders());
  }

  createCategory(data: any) {
    return this.http.post(this.baseUrl + 'api/categories', data, this.defaultHeaders(true));
  }

  updateCategory(id: string, data: any) {
    return this.http.put(this.baseUrl + `api/categories/${id}`, data, this.defaultHeaders(true));
  }

  deleteCategory(id: string) {
    return this.http.delete(this.baseUrl + `api/categories/${id}`, this.defaultHeaders(true));
  }

  getProducts() {
    return this.http.get(this.baseUrl + 'api/products', this.defaultHeaders());
  }

  getProductsFilter(params: any) {
    return this.http.get(this.baseUrl + 'api/products/filter', { params, ...this.defaultHeaders() });
  }

  getProductById(id: string) {
    return this.http.get(this.baseUrl + `api/products/${id}`, this.defaultHeaders());
  }

  createProduct(data: any) {
    return this.http.post(this.baseUrl + 'api/products', data, this.defaultHeaders(true));
  }

  updateProduct(id: string, data: any) {
    return this.http.put(this.baseUrl + `api/products/${id}`, data, this.defaultHeaders(true));
  }

  deleteProduct(id: string) {
    return this.http.delete(this.baseUrl + `api/products/${id}`, this.defaultHeaders(true));
  }

  getHealth() {
    return this.http.get(this.baseUrl + 'health', this.defaultHeaders());
  }

  getUserMe() {
    return this.http.get(this.baseUrl + 'api/users/me', this.defaultHeaders(true));
  }

  getUserProfile() {
    return this.http.get(this.baseUrl + 'api/users/profile', this.defaultHeaders(true));
  }

  editUser(data: any) {
    return this.http.put(this.baseUrl + 'api/users/edit', data, this.defaultHeaders(true));
  }

  deleteUser() {
    return this.http.delete(this.baseUrl + 'api/users/delete', this.defaultHeaders(true));
  }

  changePassword(data: any) {
    return this.http.put(this.baseUrl + 'api/users/change-password', data, this.defaultHeaders(true));
  }
}
