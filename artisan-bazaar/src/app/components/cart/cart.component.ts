import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { CartItem, CartSummary, SellerGroup } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = { totalItems: 0, totalPrice: 0, items: [] };
  sellerGroups: SellerGroup[] = [];
  isVisible = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private currencyService: CurrencyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.updateSellerGroups();
      }),
      this.cartService.cartSummary$.subscribe(summary => {
        this.cartSummary = summary;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleCart(): void {
    this.isVisible = !this.isVisible;
  }

  closeCart(): void {
    this.isVisible = false;
  }

  continueShopping(): void {
    this.closeCart();
    // Navigate to products page to continue shopping
    this.router.navigate(['/products']);
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    // Navigate to checkout page with seller groups data
    this.closeCart();
    // Pass seller groups data to checkout page
    this.router.navigate(['/checkout'], {
      state: { sellerGroups: this.sellerGroups }
    });
  }

  formatPrice(price: number): string {
    return this.currencyService.formatPrice(price);
  }

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  private updateSellerGroups(): void {
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
          deliveryFee: 0 // Default delivery fee, can be customized per seller
        };
      }

      groups[sellerId].items.push(item);
      groups[sellerId].subtotal += this.getItemTotal(item);
    });

    this.sellerGroups = Object.values(groups);
  }

  getSellerGroupTotal(group: SellerGroup): number {
    return group.subtotal + (group.deliveryFee || 0);
  }
}
