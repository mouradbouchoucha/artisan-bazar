import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();
  
  currentUser: User | null = null;
  isProfileDropdownOpen = false;
  isNotificationsOpen = false;
  searchQuery = '';
  notifications: Notification[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('DashboardHeader: Initializing component');
    this.authService.currentUser$.subscribe(user => {
      console.log('DashboardHeader: User changed:', user);
      this.currentUser = user;
    });
    
    // Notifications will be loaded from backend in future
    this.notifications = [];
  }

  toggleProfileDropdown(): void {
    console.log('DashboardHeader: Toggling profile dropdown, current state:', this.isProfileDropdownOpen);
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    if (this.isProfileDropdownOpen) {
      this.isNotificationsOpen = false;
      console.log('DashboardHeader: Profile dropdown opened, current user:', this.currentUser);
    }
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.isProfileDropdownOpen = false;
    }
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  logout(): void {
    this.authService.logout();
  }

  search(): void {
    console.log('Recherche:', this.searchQuery);
    // Implémenter la logique de recherche ici
    this.searchQuery = '';
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(notification => ({
      ...notification,
      read: true
    }));
  }

  getDashboardTitle(): string {
    if (!this.currentUser) return 'Dashboard';
    
    switch (this.currentUser.role) {
      case 'super_admin': return 'Super Admin Dashboard';
      case 'seller': return 'Seller Dashboard';
      case 'customer': return 'My Profile';
      default: return 'Dashboard';
    }
  }

  getProfileLink(): string {
    if (!this.currentUser) {
      console.log('No current user, returning home');
      return '/';
    }
    
    console.log('Current user role:', this.currentUser.role);
    
    switch (this.currentUser.role) {
      case 'super_admin': 
        console.log('Returning admin dashboard link');
        return '/admin/dashboard';
      case 'seller': 
        console.log('Returning seller dashboard link');
        return '/seller/dashboard';
      case 'customer': 
        console.log('Returning customer profile link');
        return '/customer/profile';
      default: 
        console.log('Unknown role, returning home');
        return '/';
    }
  }

  getSettingsLink(): string {
    if (!this.currentUser) {
      console.log('No current user for settings, returning home');
      return '/';
    }
    
    console.log('Getting settings link for role:', this.currentUser.role);
    
    switch (this.currentUser.role) {
      case 'super_admin': 
        console.log('Returning admin settings link');
        return '/admin/settings';
      case 'seller': 
        console.log('Returning seller settings link');
        return '/seller/settings';
      case 'customer': 
        console.log('Returning customer settings link');
        return '/customer/settings';
      default: 
        console.log('Unknown role for settings, returning home');
        return '/';
    }
  }

  private loadDemoNotifications(): void {}
}