import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { Products } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-products-list',
  standalone: true, // Enable standalone mode
  imports: [CommonModule], // Import required modules
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  listofProducts: Products[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.listofProducts = products
          .filter(p => p.createdAt) // Remove products that don't have `createdAt`
          .map(p => ({ 
            ...p, 
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString() // ✅ Ensure `createdAt` remains a string
          }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // ✅ Convert string to Date for sorting
  
        console.log("📌 Sorted Products:", this.listofProducts);
      },
      error: (err) => {
        console.error("❌ Error fetching products:", err);
      },
    });
  }
}
