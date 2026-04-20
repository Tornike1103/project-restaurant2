import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss'],
})
export class Registration {
  isLogin = signal(true);
  authName = signal('');
  authEmail = signal('');
  authPassword = signal('');
  authMessage = signal('');
  token = signal(localStorage.getItem('accessToken') ?? '');

  constructor(private api: Api) {}

  setToken(value: string) {
    this.token.set(value);
    if (value) {
      localStorage.setItem('accessToken', value);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  login() {
    this.authMessage.set('');
    this.api
      .authLogin({ email: this.authEmail(), password: this.authPassword() })
      .subscribe({
        next: (result) => {
          const payload = result as any;
          const token = payload?.data?.accessToken ?? payload?.accessToken ?? payload?.token ?? payload?.access_token;
          if (token) {
            this.setToken(token);
            this.authMessage.set('Login successful. You can now add items to cart.');
          } else {
            this.authMessage.set('Login failed. Check your credentials.');
          }
        },
        error: (error) => {
          this.authMessage.set(error?.error?.message || 'Login failed. Check your credentials.');
          console.error('Login error:', error);
        },
      });
  }

  register() {
    this.authMessage.set('');
    this.api
      .authRegister({
        name: this.authName(),
        email: this.authEmail(),
        password: this.authPassword(),
        password_confirmation: this.authPassword(),
      })
      .subscribe({
        next: (result) => {
          const payload = result as any;
          const token = payload?.data?.accessToken ?? payload?.accessToken ?? payload?.token ?? payload?.access_token;
          if (token) {
            this.setToken(token);
            this.authMessage.set('Registration complete. You are now logged in.');
          } else {
            this.authMessage.set('Registration complete. Please login to continue.');
          }
        },
        error: (error) => {
          this.authMessage.set(error?.error?.message || 'Registration failed. Try again.');
          console.error('Registration error:', error);
        },
      });
  }

  logout() {
    this.setToken('');
    this.authMessage.set('Logged out.');
  }
}
