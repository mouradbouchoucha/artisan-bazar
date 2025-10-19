import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartItem, CartSummary, SellerGroup } from '../../models/cart.model';
import { Order, OrderItem, Address, PaymentMethod, OrderStatus } from '../../models/order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = { totalItems: 0, totalPrice: 0, items: [] };
  sellerGroups: SellerGroup[] = [];
  isProcessing = false;
  private subscriptions: Subscription[] = [];

  // Form data
  customerInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Tunisie'
  };

  constructor(
    private cartService: CartService,
    private currencyService: CurrencyService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get seller groups from router state (passed from cart component)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['sellerGroups']) {
      this.sellerGroups = navigation.extras.state['sellerGroups'];
    } else {
      // Fallback: Subscribe to cart changes and group items by seller
      this.subscriptions.push(
        this.cartService.cartItems$.subscribe(items => {
          this.cartItems = items;
          this.groupItemsBySeller();
        }),
        this.cartService.cartSummary$.subscribe(summary => {
          this.cartSummary = summary;
        })
      );
    }

    // Pre-fill customer info if logged in
    this.loadCustomerInfo();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCustomerInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.customerInfo.firstName = user.name?.split(' ')[0] || '';
      this.customerInfo.lastName = user.name?.split(' ').slice(1).join(' ') || '';
      this.customerInfo.email = user.email || '';
    }
  }

  formatPrice(price: number): string {
    return this.currencyService.formatPrice(price);
  }

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  getTotalDeliveryFee(): number {
    return this.sellerGroups.reduce((total, group) => total + (group.deliveryFee || 0), 0);
  }

  getTotalPrice(): number {
    return this.cartSummary.totalPrice + this.getTotalDeliveryFee();
  }

  async placeOrder(): Promise<void> {
    if (this.sellerGroups.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    this.isProcessing = true;

    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        alert('Veuillez vous connecter pour passer une commande');
        this.router.navigate(['/login']);
        return;
      }

      // Create addresses (same for all orders)
      const address: Address = {
        fullName: `${this.customerInfo.firstName} ${this.customerInfo.lastName}`,
        addressLine1: this.customerInfo.address,
        city: this.customerInfo.city,
        state: this.customerInfo.city,
        postalCode: this.customerInfo.postalCode,
        country: this.customerInfo.country,
        phoneNumber: this.customerInfo.phone
      };

      // Create payment method for cash on delivery
      const paymentMethod: PaymentMethod = {
        type: 'cash_on_delivery',
        details: { method: 'Paiement à la livraison' }
      };

      // Create separate orders for each seller
      const createdOrders: Order[] = [];

      for (const sellerGroup of this.sellerGroups) {
        // Create order items for this seller
        const orderItems: OrderItem[] = sellerGroup.items.map(cartItem => ({
          productId: cartItem.product.id.toString(),
          productName: cartItem.product.name,
          productImage: cartItem.product.imageUrl || '',
          quantity: cartItem.quantity,
          unitPrice: cartItem.product.price,
          totalPrice: cartItem.product.price * cartItem.quantity,
          artisanId: sellerGroup.sellerId.toString(),
          artisanName: sellerGroup.sellerName
        }));

        // Create order for this seller
        const orderData: Omit<Order, 'id'> = {
          customerId: user.id.toString(),
          customerName: user.name || '',
          sellerId: sellerGroup.sellerId.toString(),
          sellerName: sellerGroup.sellerName,
          orderDate: new Date(),
          status: OrderStatus.PENDING,
          items: orderItems,
          shippingAddress: address,
          billingAddress: address,
          paymentMethod: paymentMethod,
          subtotal: sellerGroup.subtotal,
          shippingCost: sellerGroup.deliveryFee || 0,
          tax: 0,
          total: sellerGroup.subtotal + (sellerGroup.deliveryFee || 0)
        };

        const order = await this.orderService.createOrder(orderData).toPromise();
        createdOrders.push(order);
      }

      // Clear cart and redirect
      this.cartService.clearCart();
      alert(`Commande confirmée! ${createdOrders.length} commande(s) ont été créée(s). Le paiement se fera à la livraison.`);
      this.router.navigate(['/orders']);

    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Erreur lors de la création de la commande. Veuillez réessayer.');
    } finally {
      this.isProcessing = false;
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.customerInfo.firstName &&
      this.customerInfo.lastName &&
      this.customerInfo.email &&
      this.customerInfo.phone &&
      this.customerInfo.address &&
      this.customerInfo.city &&
      this.customerInfo.postalCode
    );
  }

  private groupItemsBySeller(): void {
    const groups: { [sellerId: number]: SellerGroup } = {};

    this.cartItems.forEach(item => {
      const sellerId = item.product.sellerId;
      const sellerName = item.product.sellerName || 'Vendeur inconnu';

      if (!groups[sellerId]) {
        groups[sellerId] = {
          sellerId,
          sellerName,
          items: [],
          subtotal: 0,
          deliveryFee: 0
        };
      }

      groups[sellerId].items.push(item);
      groups[sellerId].subtotal += this.getItemTotal(item);
    });

    this.sellerGroups = Object.values(groups);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
