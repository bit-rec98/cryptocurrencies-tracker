import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred';

      if (error.status === 0) {
        message = 'Unable to reach the server. Please check your connection.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.status === 429) {
        message = 'Too many requests. Please wait before trying again.';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error.error?.message) {
        message = error.error.message;
      }

      return throwError(() => new Error(message));
    })
  );
};
