import { Injectable } from "@angular/core";
import { Products } from "./product.model";
import { Observable, throwError } from "rxjs";
import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class ProductService{
  apiUrl = 'http://localhost:5000/api/products'; // ✅ Your Node.js API URL

  constructor(private http: HttpClient) {}

  listofProducts: Products[] = [];

  getProducts(): Observable<Products[]> {
    const token = localStorage.getItem('token'); // Retrieve token

    console.log("🔍 Checking localStorage:", { token });

    if (!token) {
        console.error("❌ No token or user_id found!");
        return throwError(() => new Error("User not authenticated"));
    }

    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    });

    return this.http.get<any[]>(`${this.apiUrl}`, { headers }).pipe(
      tap((response) => console.log("API Response:", response)), // ✅ Debug API response
      map((products: any[]) => 
        products
          .map((product: any) => new Products(
            product._id,
            product._rev || '', // Ensure _rev is optional
            product.name,
            product.price,
            product.stock,
            product.category,
            product.createdAt || new Date().toISOString() // ✅ Provide default timestamp if missing
          ))
          .sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ) // ✅ Sort by date DESCENDING
      ),
      tap((mappedProducts) => console.log("Mapped Products (After Fix):", mappedProducts))
    );
  }
  
  deleteProducts(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
  

  addProducts(productData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token
    if (!token) {
        console.error("❌ No token found!");
        return throwError(() => new Error("User not authenticated"));
    }

    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`, // ✅ Ensure token is included
        'Content-Type': 'application/json',
    });

    const productWithTimestamp = {
      ...productData,
      createdAt: new Date().toISOString(), // Add timestamp for sorting
    };

    return this.http.post<any>(`${this.apiUrl}`, productWithTimestamp, { headers });
  }


  updateProducts(id: string, productData: Products): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error("❌ No token found!");
      return throwError(() => new Error("User not authenticated"));
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.put(`${this.apiUrl}/${id}`, { 
      ...productData,
      _rev: productData._rev || '' // ✅ Ensure _rev is included if available
    }, { headers });
  }
  
}