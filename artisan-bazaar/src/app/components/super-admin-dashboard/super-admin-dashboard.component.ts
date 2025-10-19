import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
}

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  startDate: string = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 7 days ago
  endDate: string = new Date().toISOString().split('T')[0]; // today
  
  // Stats
  totalSales: number = 0;
  totalOrders: number = 0;
  newCustomers: number = 0;
  abandonedCheckouts: number = 0;
  
  // Today's stats
  todaySales: number = 0;
  todayOrders: number = 0;
  todayCustomers: number = 0;
  todayVisitors: number = 0;
  
  // Products
  products: Product[] = [
    {
      id: '1',
      name: 'Fundukluk Men\'s Classic White Sneakers US',
      sku: 'WFCWSUS0001',
      price: 59.99,
      stock: 99
    },
    {
      id: '2',
      name: 'Complimentary Monthly Movie Pass',
      sku: 'CMMP00001',
      price: 99.00,
      stock: 99
    },
    {
      id: '3',
      name: 'Urban Skate Men\'s Grey Denim Jeans 34',
      sku: 'USMGDJ00034',
      price: 47.99,
      stock: 99
    },
    {
      id: '4',
      name: 'Coastal Breeze Men\'s Blue Zipper Hoodie S',
      sku: 'CBMBZHS001',
      price: 52.99,
      stock: 99
    },
    {
      id: '5',
      name: 'Azure Comfort Full Sleeve T-Shirt S',
      sku: 'ACFSTSS001',
      price: 25.99,
      stock: 99
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // In a real application, you would fetch this data from a service
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    // This would be replaced with actual API calls in a real application
    // For now, we're just using dummy data
    this.totalSales = 1250.00;
    this.totalOrders = 25;
    this.newCustomers = 12;
    this.abandonedCheckouts = 320.00;
    
    this.todaySales = 450.00;
    this.todayOrders = 8;
    this.todayCustomers = 3;
    this.todayVisitors = 42;
    
    // In a real application, this data would be filtered based on the date range
    console.log(`Loading data from ${this.startDate} to ${this.endDate}`);
  }
  
  onDateRangeChange(): void {
    // This would update the dashboard data based on the selected date range
    console.log(`Date range changed: ${this.startDate} to ${this.endDate}`);
    this.loadDashboardData();
  }
}