import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(private router: Router) {}

  handleError(error: any): void {
    // Log the error to the console or a remote logging service
    console.error('An error occurred:', error);

    // Navigate to the error page
    this.router.navigate(['/error']);
  }
}
