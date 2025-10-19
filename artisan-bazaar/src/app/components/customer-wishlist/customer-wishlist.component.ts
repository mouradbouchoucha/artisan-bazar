import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { Product } from '../../models/product';
import { User, Customer } from '../../models/user.model';

@Component({
  selector: 'app-customer-wishlist',
  templateUrl: './customer-wishlist.component.html',
  styleUrls: ['./customer-wishlist.component.css']
})
export class CustomerWishlistComponent implements OnInit, OnDestroy {
  wishlistItems: WishlistItem[] = [];
  currentUser: User | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService,
    private currencyService: CurrencyService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        this.loadWishlist();
      }),
      this.wishlistService.wishlistItems$.subscribe(items => {
        this.wishlistItems = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadWishlist(): void {
    if (this.currentUser && this.isCustomer(this.currentUser)) {
      // Load wishlist from service - in a real app, this would come from API
      // For now, we'll load some sample products
      this.productService.getAllProducts().subscribe(allProducts => {
        // In a real implementation, this would load user's actual wishlist from API
        // For demo purposes, we'll show some products as wishlist items
        const sampleWishlistItems = allProducts.slice(0, 4).map(product => ({
          product,
          addedAt: new Date()
        }));
        // Note: In production, this should be loaded from user's wishlist API
        this.wishlistItems = sampleWishlistItems;
      });
    }
  }

  private isCustomer(user: User): user is Customer {
    return user.role === 'customer';
  }

  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(Number(product.id));
    console.log('Removed from wishlist:', product.name);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    console.log('Added to cart:', product.name);
  }

  moveToCart(product: Product): void {
    this.addToCart(product);
    this.removeFromWishlist(product);
  }

  toggleWishlist(product: Product): void {
    this.wishlistService.toggleWishlist(product);
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistService.isInWishlist(Number(product.id));
  }

  formatPrice(price: number): string {
    return this.currencyService.formatPrice(price);
  }

  getTotalValue(): number {
    return this.wishlistItems.reduce((sum, item) => sum + item.product.price, 0);
  }

}
