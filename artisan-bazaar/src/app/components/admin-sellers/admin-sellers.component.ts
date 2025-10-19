import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User, Seller } from '../../models/user.model';

@Component({
  selector: 'app-admin-sellers',
  templateUrl: './admin-sellers.component.html',
  styleUrls: ['./admin-sellers.component.css']
})
export class AdminSellersComponent implements OnInit {
  sellers: Seller[] = [];
  currentUser: User | null = null;
  totalRevenue: number = 0;
  totalProducts: number = 0;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.userService.getUsers('seller').subscribe(users => {
      this.sellers = users as Seller[];
      this.calculateStats();
    });
    
    this.calculateStats();
  }

  private calculateStats(): void {
    this.totalRevenue = this.sellers.reduce((sum, seller) => sum + (seller.totalSales || 0), 0);
    this.totalProducts = this.sellers.reduce((sum, seller) => sum + (seller.totalProducts || 0), 0);
  }

  toggleSellerStatus(seller: Seller): void {
    // In a real app, this would make an API call
    console.log('Toggling seller status for:', seller.email);
  }

  approveSeller(seller: Seller): void {
    // In a real app, this would make an API call
    console.log('Approving seller:', seller.email);
  }

  rejectSeller(seller: Seller): void {
    // In a real app, this would make an API call
    console.log('Rejecting seller:', seller.email);
  }

  viewSellerDetails(seller: Seller): void {
    // In a real app, this would navigate to seller details page
    console.log('Viewing seller details:', seller.email);
  }

  getActiveSellersCount(): number {
    return this.sellers.filter(s => s.storeStatus === 'active').length;
  }
}
