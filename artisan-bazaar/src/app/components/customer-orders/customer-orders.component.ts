import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  trackingNumber?: string;
}

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent implements OnInit {
  orders: Order[] = [];
  currentUser: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Mock orders data
    this.orders = [
      {
        id: '1',
        orderNumber: 'AB-2024-001',
        date: new Date('2024-01-15'),
        status: 'delivered',
        total: 145.00,
        items: 3,
        trackingNumber: 'TRK123456789'
      },
      {
        id: '2',
        orderNumber: 'AB-2024-002',
        date: new Date('2024-01-20'),
        status: 'shipped',
        total: 89.50,
        items: 2,
        trackingNumber: 'TRK987654321'
      },
      {
        id: '3',
        orderNumber: 'AB-2024-003',
        date: new Date('2024-01-25'),
        status: 'processing',
        total: 67.25,
        items: 1
      }
    ];
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  trackOrder(order: Order): void {
    if (order.trackingNumber) {
      console.log('Track order:', order.trackingNumber);
      // In a real app, this would open tracking page
    }
  }

  cancelOrder(order: Order): void {
    console.log('Cancel order:', order.orderNumber);
    // In a real app, this would make an API call
  }

  reorder(order: Order): void {
    console.log('Reorder:', order.orderNumber);
    // In a real app, this would add items to cart
  }
}
