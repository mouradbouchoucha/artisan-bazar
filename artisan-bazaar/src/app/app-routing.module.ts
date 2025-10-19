import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ArtisansComponent } from './pages/artisans/artisans.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';

// Dashboard Components
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';
import { SellerDashboardComponent } from './components/seller-dashboard/seller-dashboard.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';

// Messaging Component
import { MessagingComponent } from './components/messaging/messaging.component';

// Search Component
import { AdvancedSearchComponent } from './components/search/advanced-search/advanced-search.component';

// Order Components
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';

// Admin Components
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminSellersComponent } from './components/admin-sellers/admin-sellers.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';

// Seller Components
import { SellerProductsComponent } from './components/seller-products/seller-products.component';
import { SellerOrdersComponent } from './components/seller-orders/seller-orders.component';
import { SellerSettingsComponent } from './components/seller-settings/seller-settings.component';

// Customer Components
import { CustomerOrdersComponent } from './components/customer-orders/customer-orders.component';
import { CustomerWishlistComponent } from './components/customer-wishlist/customer-wishlist.component';
import { CustomerSettingsComponent } from './components/customer-settings/customer-settings.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'artisans', component: ArtisansComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'email-verification', component: EmailVerificationComponent },
  // for test only
  {path: 'admin_dashboard', component: SuperAdminDashboardComponent},
  {path: 'seller_dashboard', component: SellerDashboardComponent},
  {path: 'customer_profile', component: CustomerProfileComponent}, 

  // Dashboard Routes
  { 
    path: 'admin/dashboard', 
    component: SuperAdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'super_admin' }
  },
  { 
    path: 'seller/dashboard', 
    component: SellerDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'seller' }
  },
  { 
    path: 'customer/profile', 
    component: CustomerProfileComponent,
    canActivate: [AuthGuard],
    data: { role: 'customer' }
  },
  {
    path: 'messages',
    component: MessagingComponent,
    canActivate: [AuthGuard],
    data: { role: ['customer', 'seller'] }
  },
  {
    path: 'search',
    component: AdvancedSearchComponent
  },
  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuard],
    data: { role: ['customer', 'seller'] }
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
    canActivate: [AuthGuard],
    data: { role: ['customer', 'seller'] }
  },

  // Admin Routes
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    data: { role: 'super_admin' }
  },
  {
    path: 'admin/sellers',
    component: AdminSellersComponent,
    canActivate: [AuthGuard],
    data: { role: 'super_admin' }
  },
  {
    path: 'admin/products',
    component: AdminProductsComponent,
    canActivate: [AuthGuard],
    data: { role: 'super_admin' }
  },
  {
    path: 'admin/products/new',
    component: AdminProductsComponent,
    canActivate: [AuthGuard],
    data: { role: 'super_admin' }
  },
  {
    path: 'admin/categories',
    component: AdminProductsComponent,
    canActivate: [AuthGuard],
    data: { role: 'super_admin' }
  },
  {
    path: 'admin/settings',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    data: { role: 'super_admin' }
  },
  {
    path: 'admin/analytics',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    data: { role: 'super_admin' }
  },

  // Seller Routes
  {
    path: 'seller/products',
    component: SellerProductsComponent,
    canActivate: [AuthGuard],
    data: { role: 'seller' }
  },
  {
    path: 'seller/products/new',
    component: SellerProductsComponent,
    canActivate: [AuthGuard],
    data: { role: 'seller' }
  },
  {
    path: 'seller/orders',
    component: SellerOrdersComponent,
    canActivate: [AuthGuard],
    data: { role: 'seller' }
  },
  {
    path: 'seller/settings',
    component: SellerSettingsComponent,
    canActivate: [AuthGuard],
    data: { role: 'seller' }
  },
  {
    path: 'seller/inventory',
    component: SellerProductsComponent,
    canActivate: [AuthGuard],
    data: { role: 'seller' }
  },
  {
    path: 'seller/sales',
    component: SellerOrdersComponent,
    canActivate: [AuthGuard],
    data: { role: 'seller' }
  },

  // Customer Routes
  {
    path: 'customer/orders',
    component: CustomerOrdersComponent,
    canActivate: [AuthGuard],
    data: { role: 'customer' }
  },
  {
    path: 'customer/wishlist',
    component: CustomerWishlistComponent,
    canActivate: [AuthGuard],
    data: { role: 'customer' }
  },
  {
    path: 'customer/addresses',
    component: CustomerSettingsComponent,
    canActivate: [AuthGuard],
    data: { role: 'customer' }
  },
  {
    path: 'customer/settings',
    component: CustomerSettingsComponent,
    canActivate: [AuthGuard],
    data: { role: 'customer' }
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }