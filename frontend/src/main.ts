import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { ProductsComponent } from './app/products/products.component';
import { ProductsListComponent } from './app/products-list/products-list.component';
import { AdminProductsComponent } from './app/admin-products/admin-products.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './app/auth/signup/signup.component';
import { LoginComponent } from './app/auth/login/login.component';


const routes: Routes = [
  {path: '', redirectTo: '/product-list', pathMatch: 'full'},
  {path: 'product-list', component: ProductsListComponent},
  {path: 'signup', component: SignupComponent },
  {path: 'login', component: LoginComponent },
  {path: 'admin-products', component: AdminProductsComponent},
];

bootstrapApplication(AppComponent, appConfig) // ✅ Uses `app.config.ts`
  .catch(err => console.error(err));
