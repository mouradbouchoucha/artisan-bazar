import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-language-indicator',
  templateUrl: './language-indicator.component.html',
  styleUrls: ['./language-indicator.component.css']
})
export class LanguageIndicatorComponent implements OnInit {
  currentLanguage = { code: 'fr', name: 'Français', flag: '🇫🇷' };

  constructor() {}

  ngOnInit(): void {
    // Component is now static - shows French only
  }
}
