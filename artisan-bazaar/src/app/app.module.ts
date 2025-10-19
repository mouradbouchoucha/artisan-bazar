import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { CarouselModule } from 'primeng/carousel';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Existing components
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { ProductShowcaseComponent } from './components/product-showcase/product-showcase.component';
import { VendorCtaComponent } from './components/vendor-cta/vendor-cta.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { FooterComponent } from './components/footer/footer.component';

// Page components
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ArtisansComponent } from './pages/artisans/artisans.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

// Dashboard components
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';
import { SellerDashboardComponent } from './components/seller-dashboard/seller-dashboard.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

// Messaging components
import { MessagingComponent } from './components/messaging/messaging.component';
import { ConversationListComponent } from './components/messaging/conversation-list/conversation-list.component';
import { ConversationComponent } from './components/messaging/conversation/conversation.component';

// Search components
import { AdvancedSearchComponent } from './components/search/advanced-search/advanced-search.component';
import { SearchFiltersComponent } from './components/search/search-filters/search-filters.component';

// Order components
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';

// Product components
import { ProductReviewsComponent } from './components/product-reviews/product-reviews.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminSellersComponent } from './components/admin-sellers/admin-sellers.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { SellerProductsComponent } from './components/seller-products/seller-products.component';
import { SellerOrdersComponent } from './components/seller-orders/seller-orders.component';
import { SellerSettingsComponent } from './components/seller-settings/seller-settings.component';
import { CustomerOrdersComponent } from './components/customer-orders/customer-orders.component';
import { CustomerWishlistComponent } from './components/customer-wishlist/customer-wishlist.component';
import { CustomerSettingsComponent } from './components/customer-settings/customer-settings.component';
import { LanguageIndicatorComponent } from './components/language-indicator/language-indicator.component';
import { AuthInterceptor } from './auth.interceptor';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';

import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { SimilarProductsComponent } from './components/similar-products/similar-products.component';
import { OrderTrackingComponent } from './components/orders/order-tracking/order-tracking.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    ProductShowcaseComponent,
    VendorCtaComponent,
    TestimonialsComponent,
    FooterComponent,
    HomeComponent,
    ProductsComponent,
    ArtisansComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    SuperAdminDashboardComponent,
    SellerDashboardComponent,
    CustomerProfileComponent,
    DashboardLayoutComponent,
    DashboardHeaderComponent,
    DashboardSidebarComponent,
    ProductFormComponent,
    MessagingComponent,
    ConversationListComponent,
    ConversationComponent,
    AdvancedSearchComponent,
    SearchFiltersComponent,
    OrderListComponent,
    OrderDetailComponent,
    ProductReviewsComponent,
    AdminUsersComponent,
    AdminSellersComponent,
    AdminProductsComponent,
    SellerProductsComponent,
    SellerOrdersComponent,
    SellerSettingsComponent,
    CustomerOrdersComponent,
    CustomerWishlistComponent,
    CustomerSettingsComponent,
    LanguageIndicatorComponent,
    EmailVerificationComponent,
    ProductDetailComponent,
    SimilarProductsComponent,
    OrderTrackingComponent,
    CartComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    // PrimeNG Modules
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    MenubarModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    TabViewModule,
    ProgressSpinnerModule,
    BadgeModule,
    AvatarModule,
    MenuModule,
    SidebarModule,
    PanelModule,
    DividerModule,
    CarouselModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }