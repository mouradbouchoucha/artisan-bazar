import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent implements OnInit {
  currentUser: User | null = null;
  mainMenuItems: MenuItem[] = [];
  productMenuItems: MenuItem[] = [];
  settingsMenuItems: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.setMenuItems();
    });
  }

  private setMenuItems(): void {
    if (!this.currentUser) return;

    switch (this.currentUser.role) {
      case 'super_admin':
        this.mainMenuItems = [
          { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
          { label: 'Users', icon: 'users', route: '/admin/users' },
          { label: 'Sellers', icon: 'store', route: '/admin/sellers' },
        ];
        
        this.productMenuItems = [
          { label: 'All Products', icon: 'package', route: '/admin/products' },
          { label: 'Add Product', icon: 'plus-circle', route: '/admin/products/new' },
          { label: 'Categories', icon: 'tag', route: '/admin/categories' },
        ];
        
        this.settingsMenuItems = [
          { label: 'Settings', icon: 'settings', route: '/admin/settings' },
          { label: 'Analytics', icon: 'bar-chart', route: '/admin/analytics' },
        ];
        break;

      case 'seller':
        this.mainMenuItems = [
          { label: 'Dashboard', icon: 'dashboard', route: '/seller/dashboard' },
          { label: 'Orders', icon: 'shopping-cart', route: '/seller/orders' },
        ];
        
        this.productMenuItems = [
          { label: 'My Products', icon: 'package', route: '/seller/products' },
          { label: 'Add Product', icon: 'plus-circle', route: '/seller/products/new' },
        ];
        
        this.settingsMenuItems = [
          { label: 'Settings', icon: 'settings', route: '/seller/settings' },
          { label: 'Inventory', icon: 'archive', route: '/seller/inventory' },
          { label: 'Sales', icon: 'dollar-sign', route: '/seller/sales' },
        ];
        break;
      
      case 'customer':
        this.mainMenuItems = [
          { label: 'Profile', icon: 'user', route: '/customer/profile' },
          { label: 'Orders', icon: 'shopping-cart', route: '/customer/orders' },
          { label: 'Wishlist', icon: 'heart', route: '/customer/wishlist' },
          { label: 'Addresses', icon: 'map-pin', route: '/customer/addresses' },
        ];
        
        this.settingsMenuItems = [
          { label: 'Settings', icon: 'settings', route: '/customer/settings' }
        ];
        break;
        
      default:
        // For other user types
        this.mainMenuItems = [
          { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
        ];
        break;
    }
  }

  getIconPath(icon: string): string {
    // Définition des chemins SVG pour les icônes
    const iconPaths: {[key: string]: string} = {
      'dashboard': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      'store': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      'package': 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      'shopping-cart': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      'bar-chart': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      'settings': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'archive': 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
      'dollar-sign': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      'plus-circle': 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
      'tag': 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      'user': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      'heart': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      'map-pin': 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
    };
    
    return iconPaths[icon] || '';
  }
}