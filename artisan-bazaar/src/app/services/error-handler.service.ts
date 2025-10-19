import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  details?: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleError(error: any): Observable<never> {
    const appError = this.createAppError(error);

    // Log error for debugging
    console.error('Application Error:', appError);

    // Show user-friendly message
    this.showErrorToUser(appError);

    return throwError(() => appError);
  }

  private createAppError(error: any): AppError {
    let appError: AppError = {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      userMessage: 'Something went wrong. Please try again.',
      timestamp: new Date()
    };

    if (error instanceof HttpErrorResponse) {
      appError = this.handleHttpError(error);
    } else if (error instanceof Error) {
      appError = this.handleJavaScriptError(error);
    } else if (typeof error === 'string') {
      appError.message = error;
      appError.userMessage = error;
    }

    return appError;
  }

  private handleHttpError(error: HttpErrorResponse): AppError {
    const appError: AppError = {
      code: `HTTP_${error.status}`,
      message: error.message,
      userMessage: 'Server error occurred',
      details: error.error,
      timestamp: new Date()
    };

    switch (error.status) {
      case 0:
        appError.code = 'NETWORK_ERROR';
        appError.userMessage = 'Unable to connect to server. Please check your internet connection.';
        break;

      case 400:
        appError.code = 'BAD_REQUEST';
        appError.userMessage = 'Invalid request. Please check your input.';
        if (error.error?.message) {
          appError.userMessage = error.error.message;
        }
        break;

      case 401:
        appError.code = 'UNAUTHORIZED';
        appError.userMessage = 'Please login to continue.';
        if (error.error?.message) {
          appError.userMessage = error.error.message;
        }
        break;

      case 403:
        appError.code = 'FORBIDDEN';
        appError.userMessage = 'You do not have permission to access this resource.';
        if (error.error?.message) {
          appError.userMessage = error.error.message;
        }
        // Special case for email verification
        if (error.error?.email_verified === false) {
          appError.code = 'EMAIL_NOT_VERIFIED';
          appError.userMessage = 'Please verify your email address before logging in. Check your email for verification link.';
        }
        break;

      case 404:
        appError.code = 'NOT_FOUND';
        appError.userMessage = 'The requested resource was not found.';
        break;

      case 422:
        appError.code = 'VALIDATION_ERROR';
        appError.userMessage = 'Please check your input and try again.';
        if (error.error?.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          appError.userMessage = validationErrors.join(', ');
        } else if (error.error?.message) {
          appError.userMessage = error.error.message;
        }
        break;

      case 429:
        appError.code = 'TOO_MANY_REQUESTS';
        appError.userMessage = 'Too many requests. Please wait a moment and try again.';
        break;

      case 500:
        appError.code = 'SERVER_ERROR';
        appError.userMessage = 'Server error occurred. Please try again later.';
        break;

      case 502:
      case 503:
      case 504:
        appError.code = 'SERVICE_UNAVAILABLE';
        appError.userMessage = 'Service is temporarily unavailable. Please try again later.';
        break;

      default:
        appError.userMessage = `Server returned error ${error.status}. Please try again.`;
    }

    return appError;
  }

  private handleJavaScriptError(error: Error): AppError {
    return {
      code: 'JAVASCRIPT_ERROR',
      message: error.message,
      userMessage: 'An application error occurred. Please refresh the page and try again.',
      details: error.stack,
      timestamp: new Date()
    };
  }

  private showErrorToUser(error: AppError): void {
    // For now, we'll use browser alert
    // In a real app, you'd integrate with a toast notification service
    if (this.shouldShowToUser(error)) {
      // You can replace this with a toast notification service
      console.warn('User Error:', error.userMessage);

      // Optional: Show alert for critical errors
      if (this.isCriticalError(error)) {
        alert(error.userMessage);
      }
    }
  }

  private shouldShowToUser(error: AppError): boolean {
    // Don't show network errors immediately - they might be temporary
    if (error.code === 'NETWORK_ERROR') {
      return false;
    }
    return true;
  }

  private isCriticalError(error: AppError): boolean {
    const criticalErrors = [
      'EMAIL_NOT_VERIFIED',
      'UNAUTHORIZED',
      'FORBIDDEN',
      'VALIDATION_ERROR'
    ];
    return criticalErrors.includes(error.code);
  }

  // Utility method to get user-friendly message
  getUserMessage(error: any): string {
    const appError = this.createAppError(error);
    return appError.userMessage;
  }

  // Method to check if error is network related
  isNetworkError(error: any): boolean {
    if (error instanceof HttpErrorResponse) {
      return error.status === 0;
    }
    return false;
  }

  // Method to check if error is authentication related
  isAuthError(error: any): boolean {
    if (error instanceof HttpErrorResponse) {
      return error.status === 401 || error.status === 403;
    }
    return false;
  }

  // Method to check if error is validation related
  isValidationError(error: any): boolean {
    if (error instanceof HttpErrorResponse) {
      return error.status === 422;
    }
    return false;
  }
}
