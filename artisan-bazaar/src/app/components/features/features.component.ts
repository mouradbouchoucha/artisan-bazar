import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  features = [
    {
      icon: 'globe',
      title: 'Support Multilingue',
      description: 'Connectez-vous avec des clients du monde entier dans leur langue préférée'
    },
    {
      icon: 'shield',
      title: 'Paiements Sécurisés',
      description: 'Traitement des paiements sûr et crypté pour toutes les transactions'
    },
    {
      icon: 'trending-up',
      title: 'Analyses Vendeur',
      description: 'Informations complètes et analyses pour la croissance de votre entreprise'
    },
    {
      icon: 'user-plus',
      title: 'Intégration Facile',
      description: 'Processus d\'inscription simple pour que les artisans et vendeurs nous rejoignent'
    },
    {
      icon: 'star',
      title: 'Avis Clients',
      description: 'Construisez la confiance avec des avis et notations vérifiés des clients'
    },
    {
      icon: 'mobile',
      title: 'Responsive Mobile',
      description: 'Expérience optimisée sur tous les appareils et tailles d\'écran'
    }
  ];


  getIconPath(icon: string): string {
    const icons: { [key: string]: string } = {
      globe: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      'trending-up': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      'user-plus': 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      mobile: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
    };
    return icons[icon] || '';
  }

}