import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ✅ Import AuthService
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  standalone: true, // Enable standalone mode
  imports: [CommonModule, RouterLink], // Import required modules
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn$: Observable<boolean>; // ✅ Tracks login status
  role: string | null = ''; // ✅ Tracks user role

  isUser$: Observable<boolean>;  // ✅ Observable for users
  isAdmin$: Observable<boolean>; // ✅ Observable for admins

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isUser$ = this.authService.isLoggedIn$.pipe(map(isLoggedIn => isLoggedIn && this.authService.getRole() === 'user'));
    this.isAdmin$ = this.authService.isLoggedIn$.pipe(map(isLoggedIn => isLoggedIn && this.authService.getRole() === 'admin'));
  }


  logout() {
    this.authService.logout();
  }
}
