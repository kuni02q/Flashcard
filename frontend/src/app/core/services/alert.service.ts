import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  success(message: string): Promise<SweetAlertResult> {
    return this.toast(message, 'success', 2500);
  }

  error(message: string): Promise<SweetAlertResult> {
    return this.toast(message, 'error', 3500);
  }

  warning(message: string): Promise<SweetAlertResult> {
    return this.toast(message, 'warning', 3000);
  }

  info(message: string): Promise<SweetAlertResult> {
    return this.toast(message, 'info', 2500);
  }

  confirm(title: string, text: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Igen, törlöm',
      cancelButtonText: 'Mégse',
      reverseButtons: true,
    });
  }

  httpError(error: unknown, fallbackMessage: string): Promise<SweetAlertResult> {
    const response = error as { error?: { message?: unknown } | string };
    const message =
      typeof response?.error === 'string'
        ? response.error
        : typeof response?.error?.message === 'string'
          ? response.error.message
          : fallbackMessage;

    return this.error(message);
  }

  private toast(message: string, icon: SweetAlertIcon, timer: number): Promise<SweetAlertResult> {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
    });
  }
}
