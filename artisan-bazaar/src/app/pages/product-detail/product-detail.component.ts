import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CurrencyService } from '../../services/currency.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  similarProducts: Product[] = [];
  isLoading = true;
  currentDirection: string = 'ltr';
  private subscriptions: Subscription[] = [];

  carouselResponsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(productId: string): void {
    this.isLoading = true;

    // Get the specific product
    this.productService.getAllProducts().subscribe(products => {
      const foundProduct = products.find(p => p.id.toString() === productId);
      if (foundProduct) {
        this.product = foundProduct;
        this.loadSimilarProducts(foundProduct);
      } else {
        // Product not found, redirect to products page
        this.router.navigate(['/products']);
      }
      this.isLoading = false;
    });
  }

  
  loadSimilarProducts(currentProduct: Product): void {
    this.productService.getAllProducts().subscribe(products => {
      // Find products in the same category, excluding the current product and products already in cart
      this.similarProducts = products
        .filter(p => {
          const productId = Number(p.id);
          return p.category === currentProduct.category &&
                 p.id !== currentProduct.id &&
                 !isNaN(productId) &&
                 !this.cartService.isInCart(productId);
        })
        .slice(0, 6); // Limit to 6 similar products
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    // Show success message or toast notification
    console.log('Added to cart:', product.name);
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleWishlist(product: Product): void {
    this.wishlistService.toggleWishlist(product);
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistService.isInWishlist(Number(product.id));
  }

  formatPrice(price: number): string {
    return this.currencyService.formatPrice(price);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
