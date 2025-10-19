import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('AuthGuard: Checking access to', state.url);
    
    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getCurrentUser()?.role;
      const requiredRole = route.data['role'];

      console.log('AuthGuard: User role:', userRole, 'Required role:', requiredRole);

      if (requiredRole) {
        // Handle both single role and array of roles
        if (Array.isArray(requiredRole)) {
          if (!requiredRole.includes(userRole)) {
            console.log('AuthGuard: User role not in required roles array, redirecting to home');
            this.router.navigate(['/']);
            return false;
          }
        } else {
          if (userRole !== requiredRole) {
            console.log('AuthGuard: User role does not match required role, redirecting to home');
            this.router.navigate(['/']);
            return false;
          }
        }
      }
      
      console.log('AuthGuard: Access granted');
      return true;
    }

    console.log('AuthGuard: User not logged in, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}