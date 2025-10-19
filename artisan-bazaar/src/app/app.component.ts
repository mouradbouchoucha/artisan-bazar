import { Component, OnInit } from '@angular/core';
import { LocaleService } from './services/locale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Artisan Bazaar';

  constructor(private localeService: LocaleService) {}

  ngOnInit(): void {
    // Initialize the locale from localStorage
    this.localeService.initializeLocale();
  }
}