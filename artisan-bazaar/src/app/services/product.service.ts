import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { Product } from "../models/product";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<any>(`${this.baseUrl}/products?paginate=false`).pipe(
      map((response) => {
        // Handle different response formats
        let items: any[];

        if (Array.isArray(response)) {
          // Direct array response
          items = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Paginated response with data property
          items = response.data;
        } else if (response && Array.isArray(response.items)) {
          // Response with items property
          items = response.items;
        } else {
          console.warn("Unexpected API response format:", response);
          items = [];
        }

        return items.map((item) => {
          const basePrice = Number(item.price) || 0;
          return {
            id: item.id,
            name: item.name || "Untitled Product",
            description: item.description || "",
            price: basePrice,
            basePrice: basePrice,
            imageUrl: item.image_url || "",
            image: item.image_url || "",
            category: item.category || "Uncategorized",
            sellerId: item.seller_id,
            sellerName: item.seller_name || "Unknown Seller",
            stock: Number(item.stock) || 0,
            rating: Number(item.rating) || 0,
            reviewCount: Number(item.review_count) || 0,
            status: item.status || "active",
            sku: item.sku || "",
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          } as Product;
        });
      }),
      catchError((error) => {
        console.error("Error fetching products:", error);
        // Return mock data on error
        return of(this.getMockProducts());
      }),
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getAllProducts().pipe(map((products) => products.slice(0, 4)));
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: 1,
        name: "Handcrafted Ceramic Vase",
        description:
          "Beautiful handmade ceramic vase perfect for home decoration",
        price: 45.99,
        basePrice: 45.99,
        imageUrl: "assets/images/ceramic-vase.jpg",
        image: "assets/images/ceramic-vase.jpg",
        category: "Home Decor",
        sellerId: 1,
        sellerName: "Ahmed Al-Rashid",
        stock: 15,
        rating: 4.8,
        reviewCount: 23,
        status: "active",
        sku: "SKU-CERAMIC-001",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Leather Handbag",
        description: "Premium leather handbag crafted with care",
        price: 89.99,
        basePrice: 89.99,
        imageUrl: "assets/images/leather-bag.jpg",
        image: "assets/images/leather-bag.jpg",
        category: "Fashion",
        sellerId: 2,
        sellerName: "Sarah Johnson",
        stock: 8,
        rating: 4.6,
        reviewCount: 15,
        status: "active",
        sku: "SKU-LEATHER-002",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Wooden Coffee Table",
        description: "Rustic wooden coffee table made from reclaimed wood",
        price: 199.99,
        basePrice: 199.99,
        imageUrl: "assets/images/wood-table.jpg",
        image: "assets/images/wood-table.jpg",
        category: "Furniture",
        sellerId: 3,
        sellerName: "Michael Chen",
        stock: 3,
        rating: 4.9,
        reviewCount: 31,
        status: "active",
        sku: "SKU-WOOD-003",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Artisan Jewelry Set",
        description: "Hand-forged silver jewelry set with natural gemstones",
        price: 129.99,
        basePrice: 129.99,
        imageUrl: "assets/images/jewelry-set.jpg",
        image: "assets/images/jewelry-set.jpg",
        category: "Jewelry",
        sellerId: 4,
        sellerName: "Elena Rodriguez",
        stock: 12,
        rating: 4.7,
        reviewCount: 18,
        status: "active",
        sku: "SKU-JEWELRY-004",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}
