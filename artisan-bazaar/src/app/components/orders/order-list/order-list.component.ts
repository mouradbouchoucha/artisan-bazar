import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus } from '../../../models/order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styles: [`
    .orders-container {
      padding: 1rem;
    }
    .orders-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .orders-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
    }
    .filter-container {
      display: flex;
      gap: 0.5rem;
    }
    .filter-select {
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.25rem;
    }
    .orders-table {
      width: 100%;
      border-collapse: collapse;
    }
    .orders-table th, .orders-table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    .orders-table th {
      background-color: #f8fafc;
      font-weight: 600;
      color: #64748b;
    }
    .orders-table tr:hover {
      background-color: #f1f5f9;
    }
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    .status-processing {
      background-color: #e0f2fe;
      color: #0369a1;
    }
    .status-shipped {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .status-delivered {
      background-color: #dcfce7;
      color: #166534;
    }
    .status-cancelled {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    .action-button {
      padding: 0.25rem 0.5rem;
      border: none;
      border-radius: 0.25rem;
      background-color: #3b82f6;
      color: white;
      cursor: pointer;
      font-size: 0.75rem;
    }
    .action-button:hover {
      background-color: #2563eb;
    }
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 1.5rem;
    }
    .page-button {
      padding: 0.5rem 0.75rem;
      margin: 0 0.25rem;
      border: 1px solid #cbd5e1;
      background-color: white;
      border-radius: 0.25rem;
      cursor: pointer;
    }
    .page-button.active {
      background-color: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }
    .page-button:hover:not(.active) {
      background-color: #f1f5f9;
    }
    .empty-state {
      text-align: center;
      padding: 3rem 0;
      color: #64748b;
    }
    @media (max-width: 768px) {
      .orders-table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: string = 'all';
  currentPage: number = 1;
  pageSize: number = 10;
  isLoading: boolean = true;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    // Dans une application réelle, nous utiliserions l'ID de l'utilisateur connecté
    // et vérifierions son rôle pour charger les commandes appropriées
    
    // Pour l'exemple, nous chargeons toutes les commandes
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.statusFilter);
    }
    
    // Réinitialiser la pagination
    this.currentPage = 1;
  }

  onStatusFilterChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
      case OrderStatus.PAYMENT_PROCESSING:
        return 'status-pending';
      case OrderStatus.PAID:
      case OrderStatus.PREPARING:
        return 'status-processing';
      case OrderStatus.SHIPPED:
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'status-shipped';
      case OrderStatus.DELIVERED:
        return 'status-delivered';
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED:
      case OrderStatus.RETURNED:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  formatPrice(price: number): string {
    return price.toFixed(2) + ' €';
  }

  getPaginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(startIndex, startIndex + this.pageSize);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }
}