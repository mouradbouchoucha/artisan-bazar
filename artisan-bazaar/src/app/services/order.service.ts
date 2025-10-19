import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order, OrderStatus, OrderStatusUpdate, OrderSummary } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les commandes (pour l'administrateur)
  getAllOrders(): Observable<Order[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders`).pipe(
      map(items => items.map(item => ({
        id: String(item.id),
        customerId: item.customer_id || '',
        customerName: item.customer_name,
        sellerId: item.seller_id || '',
        sellerName: item.seller_name,
        orderDate: item.order_date ? new Date(item.order_date) : new Date(item.created_at),
        status: (item.status as OrderStatus) || OrderStatus.PENDING,
        items: Array.isArray(item.items) ? item.items : [],
        shippingAddress: item.shipping_address || undefined,
        billingAddress: item.billing_address || undefined,
        paymentMethod: item.payment_method || { type: 'cash_on_delivery', details: { method: 'Paiement à la livraison' } },
        subtotal: Number(item.subtotal) || 0,
        shippingCost: Number(item.shipping_cost) || 0,
        tax: Number(item.tax) || 0,
        total: Number(item.total)
      }) as Order))
    );
  }

  // Récupérer les commandes d'un client spécifique
  getCustomerOrders(customerId: string): Observable<Order[]> {
    return this.getAllOrders();
  }

  // Récupérer les commandes d'un vendeur spécifique
  getSellerOrders(sellerId: string): Observable<Order[]> {
    return this.getAllOrders();
  }

  // Récupérer une commande par son ID
  getOrderById(orderId: string): Observable<Order | undefined> {
    return this.getAllOrders().pipe(map(list => list.find(o => o.id === orderId)));
  }

  // Créer une nouvelle commande
  createOrder(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, order);
  }

  // Mettre à jour le statut d'une commande
  updateOrderStatus(orderId: string, status: OrderStatus, comment?: string): Observable<boolean> {
    return this.getAllOrders().pipe(map(() => true));
  }

  // Récupérer l'historique des mises à jour de statut pour une commande
  getOrderStatusHistory(orderId: string): Observable<OrderStatusUpdate[]> {
    return this.getAllOrders().pipe(map(() => []));
  }

  // Ajouter un numéro de suivi à une commande
  addTrackingNumber(orderId: string, trackingNumber: string): Observable<boolean> {
    return this.getAllOrders().pipe(map(() => true));
  }

  // Mettre à jour la date de livraison estimée
  updateEstimatedDeliveryDate(orderId: string, date: Date): Observable<boolean> {
    return this.getAllOrders().pipe(map(() => true));
  }

  // Obtenir un résumé des commandes pour un tableau de bord
  getOrderSummary(sellerId?: string): Observable<OrderSummary> {
    return this.getAllOrders().pipe(map(orders => ({
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.PAYMENT_PROCESSING).length,
      shippedOrders: orders.filter(o => o.status === OrderStatus.SHIPPED || o.status === OrderStatus.OUT_FOR_DELIVERY).length,
      deliveredOrders: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
      cancelledOrders: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0)
    })));
  }

  // Annuler une commande
  cancelOrder(orderId: string, reason: string): Observable<boolean> {
    return this.getAllOrders().pipe(map(() => true));
  }
}