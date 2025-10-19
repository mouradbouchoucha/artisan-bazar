export interface FilterOption {
  id: string | number;
  name: string;
  count?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface SearchFilters {
  query?: string;
  categories?: string[];
  priceRange?: PriceRange;
  rating?: number;
  tags?: string[];
  artisanId?: string | number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popularity';
  page?: number;
  pageSize?: number;
}

export interface FilterGroup {
  name: string;
  type: 'checkbox' | 'radio' | 'range' | 'star';
  options?: FilterOption[];
  rangeMin?: number;
  rangeMax?: number;
  currentMin?: number;
  currentMax?: number;
}

export interface SearchResults {
  products: any[];
  totalCount: number;
  filters: {
    categories: FilterOption[];
    priceRange: PriceRange;
    tags: FilterOption[];
    ratings: FilterOption[];
  };
}