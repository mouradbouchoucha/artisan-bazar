import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus } from '../../../models/order';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: []
})
export class OrderDetailComponent implements OnInit {
  orderId: string = '';
  order: Order | null = null;
  isLoading = true;
  error: string | null = null;
  showCancelModal = false;
  cancellationReason = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderId = id;
        this.loadOrderDetails();
      } else {
        this.error = 'ID de commande non valide';
        this.isLoading = false;
      }
    });
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    this.orderService.getOrderById(this.orderId).subscribe(
      order => {
        this.order = order;
        this.isLoading = false;
      },
      error => {
        this.error = 'Impossible de charger les détails de la commande';
        this.isLoading = false;
      }
    );
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

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  formatPrice(price: number): string {
    return price.toFixed(2) + ' €';
  }

  calculateSubtotal(): number {
    if (!this.order || !this.order.items) return 0;
    return this.order.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  canCancel(): boolean {
    if (!this.order) return false;
    return [
      OrderStatus.PENDING,
      OrderStatus.PAYMENT_PROCESSING,
      OrderStatus.PAID,
      OrderStatus.PREPARING
    ].includes(this.order.status);
  }

  openCancelModal(): void {
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.cancellationReason = '';
  }

  confirmCancelOrder(): void {
    if (!this.order) return;
    
    this.orderService.cancelOrder(this.order.id, this.cancellationReason).subscribe(
      success => {
        if (success) {
          // Recharger les détails de la commande après annulation
          this.loadOrderDetails();
          this.showCancelModal = false;
          this.cancellationReason = '';
        } else {
          this.error = 'Impossible d\'annuler la commande';
        }
      },
      error => {
        this.error = 'Impossible d\'annuler la commande';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  printOrder(): void {
    window.print();
  }
}