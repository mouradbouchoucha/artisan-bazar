import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'Fatima A.',
      role: 'Moroccan Weaver',
      image: 'https://picsum.photos/100/100?random=6',
      quote: '"Since joining Artisan Bazaar, my sales have tripled. The dashboard makes it so easy to manage my products and track orders."'
    },
    {
      name: 'Jean L.',
      role: 'French Potter',
      image: 'https://picsum.photos/100/100?random=7',
      quote: '"The multilingual support is fantastic! I can communicate with customers in their preferred language effortlessly."'
    },
    {
      name: 'Ahmed K.',
      role: 'Egyptian Leatherworker',
      image: 'https://picsum.photos/100/100?random=8',
      quote: '"The secure payment system gives me peace of mind, and the analytics help me understand my customers better."'
    }
  ];
}