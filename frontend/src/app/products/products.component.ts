import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Products } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-products',
  standalone: true, // Ensure this is a standalone component
  imports: [CommonModule, FormsModule], // Import CommonModule here
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  @Input() products?: Products;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    console.log(this.products);
  }
}
