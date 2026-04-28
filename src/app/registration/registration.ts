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
  authFirstName = signal('');
  authLastName = signal('');
  authEmail = signal('');
  authPassword = signal('');
  authMessage = signal('');
  verificationCode = signal('');
  needsVerification = signal(false);
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
            this.needsVerification.set(false);
          } else {
            this.authMessage.set('Login failed. Check your credentials.');
          }
        },
        error: (error) => {
          const errorMessage = error?.error?.message || error?.error?.detail || 'Login failed. Check your credentials.';
          this.authMessage.set(errorMessage);
          
          // Check if the error is about email verification (by message content or status code)
          if (errorMessage.toLowerCase().includes('verification') || errorMessage.toLowerCase().includes('verify') || error.status === 406) {
            this.needsVerification.set(true);
          }
          console.error('Login error:', error);
        },
      });
  }

  register() {
    this.authMessage.set('');
    this.api
      .authRegister({
        firstName: this.authFirstName(),
        lastName: this.authLastName(),
        email: this.authEmail(),
        password: this.authPassword(),
      })
      .subscribe({
        next: (result) => {
          const payload = result as any;
          const token = payload?.data?.accessToken ?? payload?.accessToken ?? payload?.token ?? payload?.access_token;
          if (token) {
            this.setToken(token);
            this.authMessage.set('Registration complete. You are now logged in.');
            this.needsVerification.set(false);
          } else {
            this.authMessage.set('Registration complete. Please verify your email to continue.');
            this.needsVerification.set(true);
          }
        },
        error: (error) => {
          // Try to extract detailed validation errors
          let message = error?.error?.message || 'Registration failed. Try again.';
          if (error?.error?.errors) {
            const errors = error.error.errors;
            // Combine all error messages into a single string
            message += '\n' + Object.values(errors).flat().join('\n');
          }
          this.authMessage.set(message);
          console.error('Registration error:', error);
        },
      });
  }

  verifyEmail() {
    this.authMessage.set('');
    this.api
      .verifyEmail({
        email: this.authEmail(),
        code: this.verificationCode(),
      })
      .subscribe({
        next: (result) => {
          this.verificationCode.set('');
          this.needsVerification.set(false);
          
          // If they were trying to login, auto-login after verification
          if (this.isLogin()) {
            this.authMessage.set('Email verified. Logging in...');
            this.login();
          } else {
            this.authMessage.set('Email verified successfully. You can now login.');
            this.isLogin.set(true);
          }
        },
        error: (error) => {
          this.authMessage.set(error?.error?.message || 'Verification failed. Check your code.');
          console.error('Verification error:', error);
        },
      });
  }

  logout() {
    this.setToken('');
    this.authMessage.set('Logged out.');
  }
}
