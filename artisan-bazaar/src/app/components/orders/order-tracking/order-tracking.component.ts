import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus } from '../../../models/order';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styles: [`
    .tracking-container {
      padding: 1.5rem;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    .tracking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .tracking-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }
    .tracking-number {
      color: #64748b;
      font-size: 0.875rem;
    }
    .tracking-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
    .tracking-info-label {
      color: #64748b;
    }
    .tracking-info-value {
      font-weight: 500;
    }
    .tracking-steps {
      position: relative;
      margin: 2rem 0;
    }
    .tracking-step {
      position: relative;
      padding-bottom: 2rem;
      padding-left: 2.5rem;
    }
    .tracking-step:last-child {
      padding-bottom: 0;
    }
    .step-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background-color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .step-indicator.completed {
      background-color: #10b981;
      color: white;
    }
    .step-indicator.current {
      background-color: #3b82f6;
      color: white;
    }
    .step-line {
      position: absolute;
      left: 0.75rem;
      top: 1.5rem;
      bottom: 0;
      width: 1px;
      background-color: #e2e8f0;
      transform: translateX(-50%);
    }
    .step-content {
      margin-bottom: 0.5rem;
    }
    .step-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .step-date {
      font-size: 0.75rem;
      color: #64748b;
    }
    .step-description {
      font-size: 0.875rem;
      color: #64748b;
    }
    .map-container {
      height: 200px;
      margin-top: 1.5rem;
      background-color: #f1f5f9;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
    }
    @media (max-width: 640px) {
      .tracking-info {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class OrderTrackingComponent implements OnInit {
  @Input() orderId: string | null = null;
  @Input() order: Order | null = null;
  
  trackingSteps: TrackingStep[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    if (this.orderId) {
      this.loadOrderTracking(this.orderId);
    } else if (this.order) {
      this.generateTrackingSteps(this.order);
      this.isLoading = false;
    } else {
      this.error = 'Aucune information de commande fournie';
      this.isLoading = false;
    }
  }

  loadOrderTracking(orderId: string): void {
    this.isLoading = true;
    this.orderService.getOrderById(orderId).subscribe(
      order => {
        if (order) {
          this.order = order;
          this.generateTrackingSteps(order);
        } else {
          this.error = 'Commande introuvable';
        }
        this.isLoading = false;
      },
      error => {
        this.error = 'Erreur lors du chargement des informations de suivi';
        this.isLoading = false;
      }
    );
  }

  generateTrackingSteps(order: Order): void {
    // Étapes de base du processus de commande
    this.trackingSteps = [
      {
        title: 'Commande passée',
        description: 'Votre commande a été reçue et est en cours de traitement.',
        date: order.orderDate,
        status: 'completed',
        icon: 'check'
      },
      {
        title: 'Paiement confirmé',
        description: 'Le paiement de votre commande a été confirmé.',
        date: this.getDateForStatus(order, OrderStatus.PAID),
        status: this.getStepStatus(order.status, OrderStatus.PAID),
        icon: this.getStepStatus(order.status, OrderStatus.PAID) === 'completed' ? 'check' : 'credit-card'
      },
      {
        title: 'Préparation en cours',
        description: 'Votre commande est en cours de préparation par nos artisans.',
        date: this.getDateForStatus(order, OrderStatus.PREPARING),
        status: this.getStepStatus(order.status, OrderStatus.PREPARING),
        icon: this.getStepStatus(order.status, OrderStatus.PREPARING) === 'completed' ? 'check' : 'package'
      },
      {
        title: 'Expédition',
        description: order.trackingInfo ? 
          `Votre commande a été expédiée via ${order.trackingInfo.carrier}.` : 
          'Votre commande sera bientôt expédiée.',
        date: order.trackingInfo?.shippedDate,
        status: this.getStepStatus(order.status, OrderStatus.SHIPPED),
        icon: this.getStepStatus(order.status, OrderStatus.SHIPPED) === 'completed' ? 'check' : 'truck'
      },
      {
        title: 'En cours de livraison',
        description: 'Votre commande est en route vers votre adresse de livraison.',
        date: this.getDateForStatus(order, OrderStatus.OUT_FOR_DELIVERY),
        status: this.getStepStatus(order.status, OrderStatus.OUT_FOR_DELIVERY),
        icon: this.getStepStatus(order.status, OrderStatus.OUT_FOR_DELIVERY) === 'completed' ? 'check' : 'map-pin'
      },
      {
        title: 'Livré',
        description: 'Votre commande a été livrée avec succès.',
        date: this.getDateForStatus(order, OrderStatus.DELIVERED),
        status: this.getStepStatus(order.status, OrderStatus.DELIVERED),
        icon: 'home'
      }
    ];

    // Si la commande est annulée, on ajoute une étape d'annulation
    if (order.status === OrderStatus.CANCELLED) {
      this.trackingSteps.push({
        title: 'Commande annulée',
        description: 'Cette commande a été annulée.',
        date: new Date(), // Idéalement, on utiliserait la date réelle d'annulation
        status: 'completed',
        icon: 'x'
      });
    }
  }

  getDateForStatus(order: Order, status: OrderStatus): Date | undefined {
    // Dans une vraie application, on récupérerait la date réelle du changement de statut
    // Pour l'instant, on utilise la date de commande comme approximation
    if (this.isStatusReached(order.status, status)) {
      return order.orderDate;
    }
    return undefined;
  }

  getStepStatus(currentStatus: OrderStatus, stepStatus: OrderStatus): 'upcoming' | 'current' | 'completed' {
    if (this.isStatusReached(currentStatus, stepStatus)) {
      if (currentStatus === stepStatus) {
        return 'current';
      }
      return 'completed';
    }
    return 'upcoming';
  }

  isStatusReached(currentStatus: OrderStatus, targetStatus: OrderStatus): boolean {
    const statusOrder = [
      OrderStatus.PENDING,
      OrderStatus.PAYMENT_PROCESSING,
      OrderStatus.PAID,
      OrderStatus.PREPARING,
      OrderStatus.SHIPPED,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED
    ];
    
    const currentIndex = statusOrder.indexOf(currentStatus);
    const targetIndex = statusOrder.indexOf(targetStatus);
    
    return currentIndex >= targetIndex && targetIndex !== -1;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'À venir';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

interface TrackingStep {
  title: string;
  description: string;
  date?: Date;
  status: 'upcoming' | 'current' | 'completed';
  icon: string;
}