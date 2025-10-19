export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number; // Display price (converted to current currency)
  basePrice: number; // Base price in USD (for conversion)
  imageUrl: string;
  image?: string; // Add image property
  category: string;
  sellerId: number;
  sellerName?: string; // Add sellerName property
  artisanId?: string;
  artisanName?: string;
  stock: number;
  rating: number;
  reviewCount: number;
  status?: string; // Add status property
  tags?: string[];
  inventory?: {
    quantity: number;
    inStock: boolean;
  };
  sku?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductInventory {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
}

export interface TopSellingProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
  image?: string;
}