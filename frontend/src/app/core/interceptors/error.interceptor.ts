import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status > 0) {
        alertService.httpError(error, 'A művelet sikertelen. Próbáld meg később.');
      } else {
        alertService.error('A szerver nem érhető el. Ellenőrizd a kapcsolatot.');
      }

      return throwError(() => error);
    }),
  );
};
