import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import localeAr from '@angular/common/locales/ar';
import localeEs from '@angular/common/locales/es';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';
import localePt from '@angular/common/locales/pt';
import localeRu from '@angular/common/locales/ru';
import localeZh from '@angular/common/locales/zh';
import localeJa from '@angular/common/locales/ja';
import localeKo from '@angular/common/locales/ko';
import localeHi from '@angular/common/locales/hi';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private currentLocale: string;

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.currentLocale = this.getPreferredLocale();
    this.registerAllLocales();
  }

  private registerAllLocales(): void {
    // Register all supported locales
    registerLocaleData(localeEn, 'en');
    registerLocaleData(localeFr, 'fr');
    registerLocaleData(localeAr, 'ar');
    registerLocaleData(localeEs, 'es');
    registerLocaleData(localeDe, 'de');
    registerLocaleData(localeIt, 'it');
    registerLocaleData(localePt, 'pt');
    registerLocaleData(localeRu, 'ru');
    registerLocaleData(localeZh, 'zh');
    registerLocaleData(localeJa, 'ja');
    registerLocaleData(localeKo, 'ko');
    registerLocaleData(localeHi, 'hi');
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  setLocale(locale: string): void {
    this.currentLocale = locale;
    // Store in localStorage for persistence
    localStorage.setItem('preferredLocale', locale);
    // Update document attributes
    this.updateDocumentLocale(locale);
  }

  private updateDocumentLocale(locale: string): void {
    // Update HTML lang attribute
    document.documentElement.lang = locale;
    // Update text direction for RTL languages
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }

  getPreferredLocale(): string {
    return localStorage.getItem('preferredLocale') || 'en';
  }

  initializeLocale(): void {
    const preferredLocale = this.getPreferredLocale();
    this.setLocale(preferredLocale);
  }
}
