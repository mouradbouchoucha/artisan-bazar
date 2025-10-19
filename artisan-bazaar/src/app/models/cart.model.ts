import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  items: CartItem[];
}

export interface SellerGroup {
  sellerId: number;
  sellerName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee?: number; // Each seller can have their own delivery fee
}

export interface CartState {
  items: CartItem[];
  lastUpdated: Date;
}