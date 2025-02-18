import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { ProductsListComponent } from './products-list/products-list.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard'; // ✅ Import the AuthGuard

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'product-list', component: ProductsListComponent, canActivate: [AuthGuard] }, // ✅ Protect normal users
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin-products', component: AdminProductsComponent, canActivate: [AuthGuard] }, // ✅ Protect this route
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), 
  ]
};
