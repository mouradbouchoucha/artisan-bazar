import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CartSummary, CartState } from '../models/cart.model';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'artisan_bazaar_cart';
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartSummary = new BehaviorSubject<CartSummary>({
    totalItems: 0,
    totalPrice: 0,
    items: []
  });

  constructor() {
    this.loadCartFromStorage();
  }

  // Observable for cart items
  get cartItems$(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  // Observable for cart summary
  get cartSummary$(): Observable<CartSummary> {
    return this.cartSummary.asObservable();
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  // Get current cart summary
  getCartSummary(): CartSummary {
    return this.cartSummary.value;
  }

  // Add product to cart
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.getCartItems();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      // Update quantity if product already exists
      currentItems[existingItemIndex].quantity += quantity;
      currentItems[existingItemIndex].addedAt = new Date();
    } else {
      // Add new item
      const newItem: CartItem = {
        product,
        quantity,
        addedAt: new Date()
      };
      currentItems.push(newItem);
    }

    this.updateCart(currentItems);
  }

  // Remove product from cart
  removeFromCart(productId: number): void {
    const currentItems = this.getCartItems().filter(item => item.product.id !== productId);
    this.updateCart(currentItems);
  }

  // Update quantity of a product
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.getCartItems();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      currentItems[itemIndex].quantity = quantity;
      currentItems[itemIndex].addedAt = new Date();
      this.updateCart(currentItems);
    }
  }

  // Clear entire cart
  clearCart(): void {
    this.updateCart([]);
  }

  // Check if product is in cart
  isInCart(productId: number): boolean {
    return this.getCartItems().some(item => item.product.id === productId);
  }

  // Get quantity of product in cart
  getProductQuantity(productId: number): number {
    const item = this.getCartItems().find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  // Calculate total price
  private calculateTotalPrice(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  // Calculate total items count
  private calculateTotalItems(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  // Update cart and notify subscribers
  private updateCart(items: CartItem[]): void {
    const summary: CartSummary = {
      totalItems: this.calculateTotalItems(items),
      totalPrice: this.calculateTotalPrice(items),
      items: items
    };

    this.cartItems.next(items);
    this.cartSummary.next(summary);
    this.saveCartToStorage(items);
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    try {
      const storedCart = localStorage.getItem(this.CART_STORAGE_KEY);
      if (storedCart) {
        const cartState: CartState = JSON.parse(storedCart);
        // Convert date strings back to Date objects
        const items = cartState.items.map(item => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        this.updateCart(items);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.updateCart([]);
    }
  }

  // Save cart to localStorage
  private saveCartToStorage(items: CartItem[]): void {
    try {
      const cartState: CartState = {
        items,
        lastUpdated: new Date()
      };
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cartState));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }
}