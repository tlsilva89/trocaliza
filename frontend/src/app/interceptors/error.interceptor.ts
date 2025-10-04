import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro desconhecido';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            errorMessage = 'Não foi possível conectar ao servidor';
            break;
          case 400:
            errorMessage = error.error?.message || error.error || 'Requisição inválida';
            break;
          case 401:
            errorMessage = 'Não autorizado. Faça login novamente';
            localStorage.removeItem('authToken');
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'Acesso negado';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
          default:
            errorMessage = `Erro ${error.status}: ${error.statusText}`;
        }
      }

      notificationService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};
