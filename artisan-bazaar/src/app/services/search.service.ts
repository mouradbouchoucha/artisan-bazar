import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product } from '../models/product';
import { ProductService } from './product.service';
import { SearchFilters, SearchResults, FilterOption, PriceRange } from '../models/filter';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // Données de démonstration pour simuler une base de données
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Vase en céramique artisanal',
      description: 'Vase fait main en céramique avec motifs traditionnels',
      price: 45.99,
      basePrice: 45.99, // Base price in USD
      imageUrl: 'assets/images/products/vase.jpg',
      category: 'Décoration',
      sellerId: 101,
      stock: 12,
      artisanId: '101',
      artisanName: 'Marie Dupont',
      rating: 4.5,
      reviewCount: 28,
      tags: ['céramique', 'fait main', 'décoration'],
      inventory: {
        quantity: 12,
        inStock: true
      },
      createdAt: new Date('2023-05-15')
    },
    {
      id: '2',
      name: 'Écharpe en laine tissée',
      description: 'Écharpe chaude tissée à la main avec de la laine naturelle',
      price: 35.50,
      basePrice: 35.50,
      imageUrl: 'assets/images/products/echarpe.jpg',
      category: 'Vêtements',
      sellerId: 102,
      stock: 8,
      artisanId: '102',
      artisanName: 'Jean Martin',
      rating: 4.8,
      reviewCount: 42,
      tags: ['laine', 'tissage', 'hiver'],
      inventory: {
        quantity: 8,
        inStock: true
      },
      createdAt: new Date('2023-06-20')
    },
    {
      id: '3',
      name: 'Bijou en argent fait main',
      description: 'Collier en argent avec pendentif unique fait à la main',
      price: 89.99,
      basePrice: 89.99,
      imageUrl: 'assets/images/products/bijou.jpg',
      category: 'Bijoux',
      sellerId: 103,
      stock: 5,
      artisanId: '103',
      artisanName: 'Sophie Leclerc',
      rating: 5.0,
      reviewCount: 17,
      tags: ['argent', 'bijou', 'fait main'],
      inventory: {
        quantity: 5,
        inStock: true
      },
      createdAt: new Date('2023-04-10')
    },
    {
      id: '4',
      name: 'Savon artisanal à la lavande',
      description: 'Savon naturel fait à la main avec huiles essentielles de lavande',
      price: 8.99,
      basePrice: 8.99,
      imageUrl: 'assets/images/products/savon.jpg',
      category: 'Cosmétiques',
      sellerId: 104,
      stock: 25,
      artisanId: '104',
      artisanName: 'Pierre Dubois',
      rating: 4.2,
      reviewCount: 36,
      tags: ['savon', 'naturel', 'lavande'],
      inventory: {
        quantity: 25,
        inStock: true
      },
      createdAt: new Date('2023-07-05')
    },
    {
      id: '5',
      name: 'Panier tressé en osier',
      description: 'Panier de rangement tressé à la main en osier naturel',
      price: 29.99,
      basePrice: 29.99,
      imageUrl: 'assets/images/products/panier.jpg',
      category: 'Décoration',
      sellerId: 101,
      stock: 0,
      artisanId: '101',
      artisanName: 'Marie Dupont',
      rating: 4.6,
      reviewCount: 19,
      tags: ['osier', 'rangement', 'décoration'],
      inventory: {
        quantity: 0,
        inStock: false
      },
      createdAt: new Date('2023-03-25')
    },
    {
      id: '6',
      name: 'Tasse en grès émaillé',
      description: 'Tasse artisanale en grès avec émail unique',
      price: 18.50,
      basePrice: 18.50,
      imageUrl: 'assets/images/products/tasse.jpg',
      category: 'Cuisine',
      sellerId: 105,
      stock: 15,
      artisanId: '105',
      artisanName: 'Lucie Moreau',
      rating: 4.3,
      reviewCount: 24,
      tags: ['grès', 'tasse', 'cuisine'],
      inventory: {
        quantity: 15,
        inStock: true
      },
      createdAt: new Date('2023-06-12')
    },
    {
      id: '7',
      name: 'Tableau peinture à l\'huile',
      description: 'Peinture à l\'huile originale sur toile, paysage de montagne',
      price: 199.99,
      basePrice: 199.99,
      imageUrl: 'assets/images/products/tableau.jpg',
      category: 'Art',
      sellerId: 106,
      stock: 1,
      artisanId: '106',
      artisanName: 'Michel Bernard',
      rating: 4.9,
      reviewCount: 8,
      tags: ['peinture', 'art', 'décoration'],
      inventory: {
        quantity: 1,
        inStock: true
      },
      createdAt: new Date('2023-02-18')
    },
    {
      id: '8',
      name: 'Bougie parfumée artisanale',
      description: 'Bougie en cire d\'abeille avec parfum naturel de vanille',
      price: 14.99,
      basePrice: 14.99,
      imageUrl: 'assets/images/products/bougie.jpg',
      category: 'Décoration',
      sellerId: 107,
      stock: 20,
      artisanId: '107',
      artisanName: 'Emma Petit',
      rating: 4.4,
      reviewCount: 31,
      tags: ['bougie', 'cire', 'parfum'],
      inventory: {
        quantity: 20,
        inStock: true
      },
      createdAt: new Date('2023-05-30')
    }
  ];

  constructor(private productService: ProductService) { }

  search(filters: SearchFilters): Observable<SearchResults> {
    return this.productService.getAllProducts().pipe(
      map(products => {
        // Transform API products to match expected format
        const transformedProducts = products.map(p => ({
          ...p,
          artisanId: p.sellerId?.toString() || '',
          artisanName: p.sellerName || '',
          tags: [], // API doesn't provide tags, so we'll use empty array
          inventory: {
            quantity: p.stock || 0,
            inStock: (p.stock || 0) > 0
          }
        }));
        return this.performSearchWithData(filters, transformedProducts);
      })
    );
  }

  private performSearchWithData(filters: SearchFilters, data: Product[]): SearchResults {
    let filteredProducts = [...data];
    
    // Filtrer par requête de recherche
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filtrer par catégories
    if (filters.categories && filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        filters.categories!.includes(product.category)
      );
    }
    
    // Filtrer par fourchette de prix
    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= filters.priceRange!.min && 
        product.price <= filters.priceRange!.max
      );
    }
    
    // Filtrer par note minimale
    if (filters.rating) {
      filteredProducts = filteredProducts.filter(product => 
        product.rating >= filters.rating!
      );
    }
    
    // Filtrer par tags
    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        filters.tags!.some(tag => product.tags.includes(tag))
      );
    }
    
    // Filtrer par artisan
    if (filters.artisanId) {
      filteredProducts = filteredProducts.filter(product => 
        product.artisanId === filters.artisanId
      );
    }
    
    // Filtrer par disponibilité en stock
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.inventory.inStock === filters.inStock
      );
    }
    
    // Trier les résultats
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'popularity':
          filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }
    
    // Pagination
    const totalCount = filteredProducts.length;
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProducts = filteredProducts.slice(start, end);
    
    // Générer les options de filtre disponibles
    const categoryOptions = this.generateCategoryOptions(filteredProducts);
    const priceRange = this.calculatePriceRange(filteredProducts);
    const tagOptions = this.generateTagOptions(filteredProducts);
    const ratingOptions = this.generateRatingOptions();
    
    return {
      products: paginatedProducts,
      totalCount,
      filters: {
        categories: categoryOptions,
        priceRange,
        tags: tagOptions,
        ratings: ratingOptions
      }
    };
  }

  private generateCategoryOptions(products: Product[]): FilterOption[] {
    const categories = new Map<string, number>();
    
    products.forEach(product => {
      const count = categories.get(product.category) || 0;
      categories.set(product.category, count + 1);
    });
    
    return Array.from(categories.entries()).map(([name, count]) => ({
      id: name,
      name,
      count
    }));
  }

  private calculatePriceRange(products: Product[]): PriceRange {
    if (products.length === 0) {
      return { min: 0, max: 1000 };
    }
    
    let min = products[0].price;
    let max = products[0].price;
    
    products.forEach(product => {
      min = Math.min(min, product.price);
      max = Math.max(max, product.price);
    });
    
    // Arrondir pour une meilleure expérience utilisateur
    min = Math.floor(min);
    max = Math.ceil(max);
    
    return { min, max };
  }

  private generateTagOptions(products: Product[]): FilterOption[] {
    const tags = new Map<string, number>();
    
    products.forEach(product => {
      product.tags.forEach(tag => {
        const count = tags.get(tag) || 0;
        tags.set(tag, count + 1);
      });
    });
    
    return Array.from(tags.entries()).map(([name, count]) => ({
      id: name,
      name,
      count
    }));
  }

  private generateRatingOptions(): FilterOption[] {
    return [
      { id: 5, name: '5 étoiles', count: 0 },
      { id: 4, name: '4 étoiles et plus', count: 0 },
      { id: 3, name: '3 étoiles et plus', count: 0 },
      { id: 2, name: '2 étoiles et plus', count: 0 },
      { id: 1, name: '1 étoile et plus', count: 0 }
    ];
  }

  private countProductsByRating(minRating: number): number {
    return 0;
  }

  getAvailableFilters(): Observable<any> {
    return this.productService.getAllProducts().pipe(map(products => {
      // Transform API products to match expected format
      const transformedProducts = products.map(p => ({
        ...p,
        artisanId: p.sellerId?.toString() || '',
        artisanName: p.sellerName || '',
        tags: [], // API doesn't provide tags, so we'll use empty array
        inventory: {
          quantity: p.stock || 0,
          inStock: (p.stock || 0) > 0
        }
      }));

      return {
        categories: this.generateCategoryOptions(transformedProducts),
        priceRange: this.calculatePriceRange(transformedProducts),
        tags: this.generateTagOptions(transformedProducts),
        ratings: this.generateRatingOptions()
      };
    }));
  }
}