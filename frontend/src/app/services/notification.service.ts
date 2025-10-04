import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  showSuccess(message: string, duration: number = 3000): void {
    this.show(message, NotificationType.Success, duration);
  }

  showError(message: string, duration: number = 5000): void {
    this.show(message, NotificationType.Error, duration);
  }

  showWarning(message: string, duration: number = 4000): void {
    this.show(message, NotificationType.Warning, duration);
  }

  showInfo(message: string, duration: number = 3000): void {
    this.show(message, NotificationType.Info, duration);
  }

  private show(message: string, type: NotificationType, duration: number): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      duration,
      panelClass: this.getPanelClass(type)
    };

    this.snackBar.open(message, 'Fechar', config);
  }

  private getPanelClass(type: NotificationType): string[] {
    const baseClasses = ['custom-snackbar'];
    
    switch (type) {
      case NotificationType.Success:
        return [...baseClasses, 'success-snackbar'];
      case NotificationType.Error:
        return [...baseClasses, 'error-snackbar'];
      case NotificationType.Warning:
        return [...baseClasses, 'warning-snackbar'];
      case NotificationType.Info:
        return [...baseClasses, 'info-snackbar'];
      default:
        return baseClasses;
    }
  }
}
