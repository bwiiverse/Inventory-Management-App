import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component'
import { ProductsListComponent } from './products-list/products-list.component';; // Import HeaderComponent
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ Import this
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true, // Enables Standalone Mode
  imports: [CommonModule, HttpClientModule, HeaderComponent, RouterModule, ReactiveFormsModule], // Import necessary modules
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
