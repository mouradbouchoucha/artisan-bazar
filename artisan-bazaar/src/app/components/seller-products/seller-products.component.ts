import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-seller-products',
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.css']
})
export class SellerProductsComponent implements OnInit {
  products: Product[] = [];
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Get products (in a real app, this would filter by seller)
    this.productService.getFeaturedProducts().subscribe(products => {
      this.products = products;
    });
  }

  addProduct(): void {
    console.log('Add new product');
    // In a real app, this would navigate to product form
  }

  editProduct(product: Product): void {
    console.log('Edit product:', product.name);
    // In a real app, this would navigate to product edit form
  }

  deleteProduct(product: Product): void {
    console.log('Delete product:', product.name);
    // In a real app, this would make an API call
  }

  toggleProductStatus(product: Product): void {
    console.log('Toggle product status:', product.name);
    // In a real app, this would make an API call
  }
}
