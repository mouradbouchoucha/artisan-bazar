import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterGroup, SearchFilters, FilterOption, PriceRange } from '../../../models/filter';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styles: [`
    .filters-container {
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      background-color: white;
    }
    .filter-group {
      margin-bottom: 1.5rem;
    }
    .filter-title {
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #1e293b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
    .filter-content {
      margin-left: 0.5rem;
    }
    .filter-option {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .filter-option label {
      margin-left: 0.5rem;
      cursor: pointer;
      flex: 1;
    }
    .filter-count {
      color: #64748b;
      font-size: 0.875rem;
    }
    .price-range {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .price-inputs {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .price-input {
      width: 5rem;
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.25rem;
    }
    .price-slider {
      width: 100%;
    }
    .star-rating {
      display: flex;
      align-items: center;
    }
    .star {
      color: #cbd5e1;
      cursor: pointer;
    }
    .star.filled {
      color: #f59e0b;
    }
    .clear-filters {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: #f1f5f9;
      color: #64748b;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      width: 100%;
      text-align: center;
    }
    .clear-filters:hover {
      background-color: #e2e8f0;
    }
    .mobile-filter-toggle {
      display: none;
    }
    @media (max-width: 768px) {
      .filters-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 50;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        overflow-y: auto;
      }
      .filters-container.open {
        transform: translateX(0);
      }
      .mobile-filter-toggle {
        display: block;
        position: fixed;
        bottom: 1rem;
        left: 1rem;
        padding: 0.75rem 1rem;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        z-index: 40;
      }
      .mobile-filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
      }
      .mobile-filter-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
      }
    }
  `]
})
export class SearchFiltersComponent implements OnInit {
  @Input() availableFilters: any;
  @Output() filtersChanged = new EventEmitter<SearchFilters>();
  
  filterForm: FormGroup;
  filterGroups: FilterGroup[] = [];
  selectedRating = 0;
  isMobileFiltersOpen = false;
  
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      categories: [[]],
      priceMin: [0],
      priceMax: [1000],
      rating: [0],
      tags: [[]],
      inStock: [false]
    });
  }

  ngOnInit(): void {
    this.setupFilterForm();
    
    // Réagir aux changements du formulaire
    this.filterForm.valueChanges.subscribe(formValue => {
      const filters: SearchFilters = {
        categories: formValue.categories.length > 0 ? formValue.categories : undefined,
        priceRange: {
          min: formValue.priceMin,
          max: formValue.priceMax
        },
        rating: formValue.rating > 0 ? formValue.rating : undefined,
        tags: formValue.tags.length > 0 ? formValue.tags : undefined,
        inStock: formValue.inStock ? true : undefined
      };
      
      this.filtersChanged.emit(filters);
    });
  }

  ngOnChanges(): void {
    if (this.availableFilters) {
      this.setupFilterGroups();
      this.updatePriceRange(this.availableFilters.priceRange);
    }
  }

  setupFilterForm(): void {
    this.filterForm = this.fb.group({
      categories: [[]],
      priceMin: [0],
      priceMax: [1000],
      rating: [0],
      tags: [[]],
      inStock: [false]
    });
  }

  setupFilterGroups(): void {
    this.filterGroups = [
      {
        name: 'Catégories',
        type: 'checkbox',
        options: this.availableFilters.categories
      },
      {
        name: 'Prix',
        type: 'range',
        rangeMin: this.availableFilters.priceRange.min,
        rangeMax: this.availableFilters.priceRange.max,
        currentMin: this.availableFilters.priceRange.min,
        currentMax: this.availableFilters.priceRange.max
      },
      {
        name: 'Note minimale',
        type: 'star',
        options: this.availableFilters.ratings
      },
      {
        name: 'Tags',
        type: 'checkbox',
        options: this.availableFilters.tags
      },
      {
        name: 'Disponibilité',
        type: 'radio',
        options: [
          { id: 'all', name: 'Tous les produits' },
          { id: 'inStock', name: 'En stock uniquement' }
        ]
      }
    ];
  }

  updatePriceRange(priceRange: PriceRange): void {
    this.filterForm.patchValue({
      priceMin: priceRange.min,
      priceMax: priceRange.max
    });
  }

  toggleCategory(categoryId: string): void {
    const currentCategories = [...this.filterForm.get('categories')!.value];
    const index = currentCategories.indexOf(categoryId);
    
    if (index === -1) {
      currentCategories.push(categoryId);
    } else {
      currentCategories.splice(index, 1);
    }
    
    this.filterForm.patchValue({ categories: currentCategories });
  }

  toggleTag(tagId: string): void {
    const currentTags = [...this.filterForm.get('tags')!.value];
    const index = currentTags.indexOf(tagId);
    
    if (index === -1) {
      currentTags.push(tagId);
    } else {
      currentTags.splice(index, 1);
    }
    
    this.filterForm.patchValue({ tags: currentTags });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.filterForm.patchValue({ rating });
  }

  setAvailability(inStock: boolean): void {
    this.filterForm.patchValue({ inStock });
  }

  clearFilters(): void {
    this.filterForm.reset({
      categories: [],
      priceMin: this.availableFilters.priceRange.min,
      priceMax: this.availableFilters.priceRange.max,
      rating: 0,
      tags: [],
      inStock: false
    });
    this.selectedRating = 0;
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }

  isCategorySelected(categoryId: string): boolean {
    return this.filterForm.get('categories')!.value.includes(categoryId);
  }

  isTagSelected(tagId: string): boolean {
    return this.filterForm.get('tags')!.value.includes(tagId);
  }
}