import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {
  alert = signal({
    visible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
  });

  dialog = signal({
    visible: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    resolve: null as ((confirmed: boolean) => void) | null,
  });

  private alertTimer: any = null;

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 3500) {
    if (this.alertTimer) clearTimeout(this.alertTimer);
    this.alert.set({ visible: true, message, type });
    this.alertTimer = setTimeout(() => this.dismiss(), duration);
  }

  success(message: string, duration = 3500) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 4500) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4000) {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 3500) {
    this.show(message, 'info', duration);
  }

  dismiss() {
    this.alert.update((s) => ({ ...s, visible: false }));
  }

  confirm(title: string, message: string, confirmLabel = 'Delete', cancelLabel = 'Cancel'): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialog.set({ visible: true, title, message, confirmLabel, cancelLabel, resolve });
    });
  }

  resolveDialog(confirmed: boolean) {
    const current = this.dialog();
    if (current.resolve) current.resolve(confirmed);
    this.dialog.set({
      visible: false,
      title: '',
      message: '',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      resolve: null,
    });
  }
}