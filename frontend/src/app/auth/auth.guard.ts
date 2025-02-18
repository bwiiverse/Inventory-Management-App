import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ✅ Import AuthService

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const role = this.authService.getRole();

    if (!token) {
      this.router.navigate(['/login']); // ✅ Redirect if not logged in
      return false;
    }

    const currentUrl = this.router.url;

    // ✅ Redirect normal users if they try to access admin routes
    if (role === 'user' && currentUrl === '/admin-products') {
      this.router.navigate(['/product-list']);
      return false;
    }

    // ✅ Redirect admins if they try to access the product list (optional)
    if (role === 'admin' && currentUrl === '/product-list') {
      this.router.navigate(['/admin-products']);
      return false;
    }

    return true; // ✅ Allow access if all checks pass
  }
}
