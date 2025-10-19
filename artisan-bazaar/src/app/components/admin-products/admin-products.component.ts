import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = ['All', 'Home Decor', 'Fashion', 'Jewelry', 'Art', 'Textiles'];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = [...this.products];
    });
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  private filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        this.selectedCategory === 'All' || 
        product.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  approveProduct(product: Product): void {
    // In a real app, this would make an API call
    console.log('Approving product:', product.name);
  }

  rejectProduct(product: Product): void {
    // In a real app, this would make an API call
    console.log('Rejecting product:', product.name);
  }

  editProduct(product: Product): void {
    // In a real app, this would navigate to edit page
    console.log('Editing product:', product.name);
  }

  deleteProduct(product: Product): void {
    // In a real app, this would make an API call
    console.log('Deleting product:', product.name);
  }

  getTotalValue(): number {
    return this.products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  }

  getAveragePrice(): number {
    return this.products.length > 0 ? 
      this.products.reduce((sum, product) => sum + product.price, 0) / this.products.length : 0;
  }

  getApprovedProductsCount(): number {
    return this.products.filter(p => p.status === 'approved').length;
  }

  getPendingProductsCount(): number {
    return this.products.filter(p => p.status === 'pending').length;
  }
}
