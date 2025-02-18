import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Products } from '../product.model';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-products',
  standalone: true, // ✅ Add this if you're using standalone components
  imports: [CommonModule, ReactiveFormsModule], // ✅ Import ReactiveFormsModule
  templateUrl: './admin-products.component.html', // ✅ Ensure this file exists
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit{
  form!: FormGroup;
  products: Products[] = []; // ✅ Store product list
  editingProductIndex: number | null = null;
  editingProductId: string | null = null; // Track product ID for update

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void{
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      price: new FormControl(null, [Validators.required]),
      stock: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
    });
    this.loadProducts(); // ✅ Fetch products on load
  }

  // ✅ Load products from the database
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products
          .filter(p => p.createdAt) // ✅ Remove products with missing `createdAt`
          .map(p => ({ 
            ...p, 
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString() // ✅ Ensure `createdAt` remains a string
          }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // ✅ Convert string to Date for sorting
  
        console.log("📌 Sorted Products:", this.products);
      },
      error: (err) => {
        console.error("❌ Error fetching products:", err);
      },
    });
  }

  addProduct() {
    if (this.form.invalid) {
      console.error("Form is invalid");
      return;
    }
  
    const productData = {
      name: this.form.value.name,
      price: this.form.value.price,
      stock: this.form.value.stock,
      category: this.form.value.category,
      createdAt: new Date().toISOString() // Add timestamp for sorting
    };
  
    this.productService.addProducts(productData).subscribe({
      next: () => {
        alert('Product added successfully!');
        this.form.reset();
        this.loadProducts(); // ✅ Refresh the list instead of navigating away
      },
      error: (err) => alert(`Failed to add product: ${err.error?.error || 'Unknown error'}`)
    });
  }

  // ✅ Edit a product
  editProduct(index: number) {
    const product = this.products[index];
    this.form.patchValue(product);
    this.editingProductIndex = index;
    this.editingProductId = product._id;
  } 
  
  saveProduct() {
    if (this.form.invalid || this.editingProductIndex === null) {
      console.error("Form is invalid or no product selected for editing");
      return;
    }
  
    const updatedProduct = {
      ...this.products[this.editingProductIndex],
      ...this.form.value,
      _rev: this.products[this.editingProductIndex]._rev, // ✅ Required for CouchDB update
    };
  
    this.productService.updateProducts(this.editingProductId!, updatedProduct).subscribe({
      next: () => {
        alert("Product updated successfully!");
        this.loadProducts(); // ✅ Reload products
        this.editingProductIndex = null;
        this.editingProductId = null;
        this.form.reset();
      },
      error: (err) => console.error("Error updating product:", err),
    });
  }

  cancelEdit() {
    this.editingProductIndex = null;
    this.form.reset();
  }  

  // ✅ Delete a product
  deleteProduct(index: number) {
    const productId = this.products[index]._id;
  
    this.productService.deleteProducts(productId).subscribe({
      next: () => {
        alert("Product deleted successfully!");
        this.loadProducts(); // Refresh the product list
      },
      error: (err) => console.error("Error deleting product:", err),
    });
  }
  
}