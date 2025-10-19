import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchService } from '../../../services/search.service';
import { SearchFilters, SearchResults } from '../../../models/filter';
import { Product } from '../../../models/product';
import { CurrencyService } from '../../../services/currency.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styles: [`
    .search-container {
      padding: 1rem;
    }
    .search-header {
      margin-bottom: 1.5rem;
    }
    .search-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    .search-description {
      color: #64748b;
    }
    .search-bar {
      display: flex;
      margin-bottom: 1.5rem;
    }
    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e1;
      border-right: none;
      border-radius: 0.375rem 0 0 0.375rem;
      font-size: 1rem;
    }
    .search-button {
      padding: 0.75rem 1.5rem;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 0 0.375rem 0.375rem 0;
      cursor: pointer;
    }
    .search-button:hover {
      background-color: #2563eb;
    }
    .search-content {
      display: flex;
      gap: 1.5rem;
    }
    .filters-sidebar {
      width: 300px;
      flex-shrink: 0;
    }
    .results-container {
      flex: 1;
    }
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .results-count {
      font-weight: 500;
    }
    .sort-select {
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.25rem;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .product-info {
      padding: 1rem;
    }
    .product-name {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #1e293b;
    }
    .product-price {
      font-weight: 600;
      color: #3b82f6;
      margin-bottom: 0.5rem;
    }
    .product-rating {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .rating-stars {
      color: #f59e0b;
      margin-right: 0.5rem;
    }
    .product-artisan {
      font-size: 0.875rem;
      color: #64748b;
    }
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }
    .page-button {
      padding: 0.5rem 1rem;
      margin: 0 0.25rem;
      border: 1px solid #cbd5e1;
      background-color: white;
      border-radius: 0.25rem;
      cursor: pointer;
    }
    .page-button.active {
      background-color: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }
    .page-button:hover:not(.active) {
      background-color: #f1f5f9;
    }
    .no-results {
      text-align: center;
      padding: 3rem 0;
      color: #64748b;
    }
    .loading {
      text-align: center;
      padding: 2rem 0;
      color: #64748b;
    }
    @media (max-width: 768px) {
      .search-content {
        flex-direction: column;
      }
      .filters-sidebar {
        width: 100%;
        margin-bottom: 1.5rem;
      }
    }
  `]
})
export class AdvancedSearchComponent implements OnInit {
  searchQuery = new FormControl('');
  currentFilters: SearchFilters = {};
  searchResults: SearchResults | null = null;
  availableFilters: any = null;
  isLoading = false;
  currentPage = 1;
  pageSize = 8;
  sortOption = 'newest';

  constructor(private searchService: SearchService, private router: Router, private currencyService: CurrencyService) { }

  ngOnInit(): void {
    // Charger les filtres disponibles
    this.loadAvailableFilters();
    
    // Configurer la recherche par texte avec debounce
    this.searchQuery.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.currentFilters = { ...this.currentFilters, query };
      this.currentPage = 1;
      this.performSearch();
    });
    
    // Effectuer une recherche initiale
    this.performSearch();
  }

  loadAvailableFilters(): void {
    this.searchService.getAvailableFilters().subscribe(filters => {
      this.availableFilters = filters;
    });
  }

  performSearch(): void {
    this.isLoading = true;
    
    // Ajouter la pagination et le tri aux filtres
    const filters: SearchFilters = {
      ...this.currentFilters,
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortOption as any
    };
    
    this.searchService.search(filters).subscribe(results => {
      this.searchResults = results;
      this.isLoading = false;
    });
  }

  onFiltersChanged(filters: SearchFilters): void {
    this.currentFilters = { ...this.currentFilters, ...filters };
    this.currentPage = 1;
    this.performSearch();
  }

  onSortChange(event: Event): void {
    this.sortOption = (event.target as HTMLSelectElement).value;
    this.performSearch();
  }

  goToPage(page: number): void {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.performSearch();
    }
  }

  getPageNumbers(): number[] {
    if (!this.searchResults) return [1];
    
    const totalPages = Math.ceil(this.searchResults.totalCount / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  formatPrice(price: number): string {
    return this.currencyService.formatPrice(price);
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
  }

  goToProduct(productId: number | string): void {
    this.router.navigate(['/products', productId]);
  }
}