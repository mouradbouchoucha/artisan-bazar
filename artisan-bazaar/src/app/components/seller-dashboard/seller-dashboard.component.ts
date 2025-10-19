import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User, Seller } from '../../models/user.model';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getSeller(): Seller | null {
    return this.currentUser as Seller;
  }
}