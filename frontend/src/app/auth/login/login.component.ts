import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule], // ✅ Import ReactiveFormsModule
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  form!: FormGroup;
  apiUrl = 'http://localhost:5000/api/auth/login'; // ✅ Your Node.js API URL
  
  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}
  
  ngOnInit(): void{
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  login() {
    if (this.form.invalid) return;

    this.http.post<{ token: string; role: string }>(this.apiUrl, this.form.value).subscribe({
      next: (response) => {
        console.log("Login Response:", response); 

        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role); // Store role
        this.authService.login(response.token, response.role); // ✅ Pass both token and role

        if (response.role === 'admin') {
          this.router.navigate(['/admin-products']);  
        } else {
          this.router.navigate(['/product-list']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid credentials.');
      },
    });
  }
}
