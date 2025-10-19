import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isDropdownOpen = false;

  menuItems: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.initializeMenuItems();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  private initializeMenuItems(): void {
    this.menuItems = [
      {
        label: 'Accueil',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'Produits',
        icon: 'pi pi-shopping-bag',
        routerLink: '/products'
      },
      {
        label: 'Artisans',
        icon: 'pi pi-users',
        routerLink: '/artisans'
      },
      {
        label: 'À propos',
        icon: 'pi pi-info-circle',
        routerLink: '/about'
      },
      {
        label: 'Contact',
        icon: 'pi pi-phone',
        routerLink: '/contact'
      },
      {
        label: 'Messages',
        icon: 'pi pi-comments',
        routerLink: '/messages'
      },
      {
        label: 'Recherche',
        icon: 'pi pi-search',
        routerLink: '/search'
      },
      {
        label: 'Commandes',
        icon: 'pi pi-shopping-cart',
        routerLink: '/orders'
      }
    ];

    this.userMenuItems = [
      {
        label: 'Tableau de bord Admin',
        icon: 'pi pi-cog',
        routerLink: '/admin/dashboard',
        visible: this.authService.hasRole('super_admin')
      },
      {
        label: 'Tableau de bord Vendeur',
        icon: 'pi pi-chart-line',
        routerLink: '/seller/dashboard',
        visible: this.authService.hasRole('seller')
      },
      {
        label: 'Mon Profil',
        icon: 'pi pi-user',
        routerLink: '/customer/profile',
        visible: this.authService.hasRole('customer')
      },
      {
        separator: true
      },
      {
        label: 'Déconnexion',
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout()
      }
    ];
  }


  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (user && user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }
}