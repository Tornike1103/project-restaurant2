import { Injectable, signal } from '@angular/core';

export interface ErrorConfig {
  title?: string;
  message: string;
  code?: string;
  duration?: number;
  type?: 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  readonly error = signal<ErrorConfig | null>(null);
  readonly isVisible = signal(false);

  show(config: ErrorConfig): void {
    this.error.set(config);
    this.isVisible.set(true);

    const duration = config.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => this.hide(), duration);
    }
  }

  hide(): void {
    this.isVisible.set(false);
    setTimeout(() => this.error.set(null), 300);
  }

  showError(message: string, title = 'Error'): void {
    this.show({ message, title, type: 'error' });
  }

  showWarning(message: string, title = 'Warning'): void {
    this.show({ message, title, type: 'warning' });
  }

  showInfo(message: string, title = 'Info'): void {
    this.show({ message, title, type: 'info' });
  }
}