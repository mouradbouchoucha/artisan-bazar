import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // Clone request and add auth header if token exists
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    } else {
      // Add default headers for non-authenticated requests
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    }

    return next.handle(request).pipe(
      retry(1), // Retry failed requests once
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "";

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
          console.error("Client-side error:", error.error.message);
        } else {
          // Server-side error
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
          console.error("Server-side error:", {
            status: error.status,
            message: error.message,
            url: error.url,
            error: error.error,
          });

          // Handle specific error cases
          switch (error.status) {
            case 401:
              // Unauthorized - token might be expired
              console.warn("Unauthorized request - clearing auth data");
              this.authService.logout();
              this.router.navigate(["/login"]);
              break;
            case 403:
              // Forbidden - insufficient permissions
              console.warn("Forbidden access attempt");
              break;
            case 404:
              // Not found
              console.warn("Resource not found:", error.url);
              break;
            case 422:
              // Validation error
              console.warn("Validation error:", error.error);
              break;
            case 500:
              // Server error
              console.error("Server error - please try again later");
              break;
            case 0:
              // Network error (CORS, server not running, etc.)
              console.error("Network error - check if server is running");
              errorMessage =
                "Network Error: Unable to connect to server. Please check if the backend is running.";
              break;
          }
        }

        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
