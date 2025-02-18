import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule], // ✅ Import ReactiveFormsModule
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  form!: FormGroup;
  apiUrl = 'http://localhost:5000/api/auth/signup'; // ✅ Your Node.js API URL
  
  constructor(private router: Router, private http: HttpClient) {}
  
  ngOnInit(): void{
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  signup() {
    if (this.form.invalid) return;  

    const userData = this.form.value; 
    this.http.post(this.apiUrl, userData).subscribe({
      next: (response: any) => {
        console.log('User registered successfully:', response);
        alert(`Registration successful! Role: ${response.role}`);
        this.form.reset();  
        this.router.navigate(['/login']);  
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.'); 
      }
    });
  }
}
