import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  shippingAddress: string;
}

@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {
  orders: Order[] = [];
  currentUser: User | null = null;
  filteredOrders: Order[] = [];
  selectedStatus: string = 'all';
  statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadOrders();
  }

  private loadOrders(): void {
    // Mock data - in a real app, this would come from an API
    this.orders = [
      {
        id: 'ORD-001',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        productName: 'Handwoven Moroccan Basket',
        quantity: 2,
        price: 45.00,
        total: 90.00,
        status: 'pending',
        orderDate: new Date('2024-01-15'),
        shippingAddress: '123 Main St, New York, NY 10001'
      },
      {
        id: 'ORD-002',
        customerName: 'Ahmed Al-Rashid',
        customerEmail: 'ahmed@example.com',
        productName: 'Ceramic Tunisian Vase',
        quantity: 1,
        price: 68.00,
        total: 68.00,
        status: 'processing',
        orderDate: new Date('2024-01-14'),
        shippingAddress: 'King Fahd Road, Riyadh, Saudi Arabia'
      },
      {
        id: 'ORD-003',
        customerName: 'Marie Dubois',
        customerEmail: 'marie@example.com',
        productName: 'Leather Egyptian Bag',
        quantity: 1,
        price: 120.00,
        total: 120.00,
        status: 'shipped',
        orderDate: new Date('2024-01-13'),
        shippingAddress: '15 Rue de la Paix, Paris, France'
      },
      {
        id: 'ORD-004',
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        productName: 'Silver Algerian Necklace',
        quantity: 3,
        price: 89.00,
        total: 267.00,
        status: 'delivered',
        orderDate: new Date('2024-01-10'),
        shippingAddress: '456 Oak Ave, London, UK'
      }
    ];
    
    this.filteredOrders = [...this.orders];
  }

  onStatusChange(): void {
    if (this.selectedStatus === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
  }

  updateOrderStatus(order: Order, newStatus: string): void {
    // In a real app, this would make an API call
    order.status = newStatus as any;
    console.log(`Updated order ${order.id} status to ${newStatus}`);
  }

  getTotalRevenue(): number {
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  getOrdersByStatus(status: string): number {
    return this.orders.filter(order => order.status === status).length;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}
