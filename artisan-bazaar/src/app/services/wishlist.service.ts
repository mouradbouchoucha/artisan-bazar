import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface WishlistState {
  items: WishlistItem[];
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly WISHLIST_STORAGE_KEY = 'artisan_bazaar_wishlist';
  private wishlistItems = new BehaviorSubject<WishlistItem[]>([]);
  private wishlistCount = new BehaviorSubject<number>(0);

  constructor() {
    this.loadWishlistFromStorage();
  }

  // Observable for wishlist items
  get wishlistItems$(): Observable<WishlistItem[]> {
    return this.wishlistItems.asObservable();
  }

  // Observable for wishlist count
  get wishlistCount$(): Observable<number> {
    return this.wishlistCount.asObservable();
  }

  // Get current wishlist items
  getWishlistItems(): WishlistItem[] {
    return this.wishlistItems.value;
  }

  // Get current wishlist count
  getWishlistCount(): number {
    return this.wishlistCount.value;
  }

  // Add product to wishlist
  addToWishlist(product: Product): void {
    const currentItems = this.getWishlistItems();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex === -1) {
      // Add new item
      const newItem: WishlistItem = {
        product,
        addedAt: new Date()
      };
      currentItems.push(newItem);
      this.updateWishlist(currentItems);
    }
  }

  // Remove product from wishlist
  removeFromWishlist(productId: number): void {
    const currentItems = this.getWishlistItems().filter(item => item.product.id !== productId);
    this.updateWishlist(currentItems);
  }

  // Check if product is in wishlist
  isInWishlist(productId: number): boolean {
    return this.getWishlistItems().some(item => item.product.id === productId);
  }

  // Toggle product in wishlist
  toggleWishlist(product: Product): void {
    const productId = Number(product.id);
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(product);
    }
  }

  // Clear entire wishlist
  clearWishlist(): void {
    this.updateWishlist([]);
  }

  // Move item from wishlist to cart (returns the product)
  moveToCart(productId: number): Product | null {
    const item = this.getWishlistItems().find(item => item.product.id === productId);
    if (item) {
      this.removeFromWishlist(productId);
      return item.product;
    }
    return null;
  }

  // Update wishlist and notify subscribers
  private updateWishlist(items: WishlistItem[]): void {
    this.wishlistItems.next(items);
    this.wishlistCount.next(items.length);
    this.saveWishlistToStorage(items);
  }

  // Load wishlist from localStorage
  private loadWishlistFromStorage(): void {
    try {
      const storedWishlist = localStorage.getItem(this.WISHLIST_STORAGE_KEY);
      if (storedWishlist) {
        const wishlistState: WishlistState = JSON.parse(storedWishlist);
        // Convert date strings back to Date objects
        const items = wishlistState.items.map(item => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        this.updateWishlist(items);
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
      this.updateWishlist([]);
    }
  }

  // Save wishlist to localStorage
  private saveWishlistToStorage(items: WishlistItem[]): void {
    try {
      const wishlistState: WishlistState = {
        items,
        lastUpdated: new Date()
      };
      localStorage.setItem(this.WISHLIST_STORAGE_KEY, JSON.stringify(wishlistState));
    } catch (error) {
      console.error('Error saving wishlist to storage:', error);
    }
  }
}