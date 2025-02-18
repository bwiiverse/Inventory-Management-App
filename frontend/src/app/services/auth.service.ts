import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: "root"})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private roleSubject = new BehaviorSubject<string | null>(this.getRole()); // ✅ Track role

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token'); 
}

getRole(): string | null {
    return localStorage.getItem('role'); 
}

  login(token: string, role: string): void {
    localStorage.setItem('token', token); 
    localStorage.setItem('role', role); // ✅ Store role in local storage
    this.roleSubject.next(role); // ✅ Update role on login
    this.isLoggedInSubject.next(true);

    // ✅ Redirect users based on their role
    if (role === 'admin') {
      this.router.navigate(['/admin-products']);
    } else {
      this.router.navigate(['/product-list']);
    }
}

  logout(): void {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('role');
    this.roleSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']); // ✅ Redirect to login page
  }
}
