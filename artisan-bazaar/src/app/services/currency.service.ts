import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CurrencyConversionService } from './currency-conversion.service';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currencies: { [languageCode: string]: Currency } = {
    'fr': { code: 'TND', symbol: 'DT', name: 'Dinar Tunisien', locale: 'fr-TN' },
    'en': { code: 'TND', symbol: 'DT', name: 'Tunisian Dinar', locale: 'en-TN' },
    'ar': { code: 'TND', symbol: 'د.ت', name: 'الدينار التونسي', locale: 'ar-TN' },
    'es': { code: 'TND', symbol: 'DT', name: 'Dinar Tunecino', locale: 'es-TN' },
    'de': { code: 'TND', symbol: 'DT', name: 'Tunesischer Dinar', locale: 'de-TN' },
    'it': { code: 'TND', symbol: 'DT', name: 'Dinaro Tunisino', locale: 'it-TN' },
    'pt': { code: 'TND', symbol: 'DT', name: 'Dinar Tunisiano', locale: 'pt-TN' },
    'ru': { code: 'TND', symbol: 'DT', name: 'Тунисский динар', locale: 'ru-TN' },
    'zh': { code: 'TND', symbol: 'DT', name: '突尼斯第纳尔', locale: 'zh-TN' },
    'ja': { code: 'TND', symbol: 'DT', name: 'チュニジア・ディナール', locale: 'ja-TN' },
    'ko': { code: 'TND', symbol: 'DT', name: '튀니지 디나르', locale: 'ko-TN' },
    'hi': { code: 'TND', symbol: 'DT', name: 'ट्यूनीशियाई दिनार', locale: 'hi-TN' }
  };

  private currentCurrency = new BehaviorSubject<Currency>(this.currencies['fr']);
  private baseCurrency = 'TND'; // All prices stored in TND

  constructor(private currencyConversionService: CurrencyConversionService) {
    // Initialize with stored language preference or default to French
    const storedLang = localStorage.getItem('preferredLocale') || 'fr';
    this.setCurrencyByLanguage(storedLang);

    // Initialize exchange rates
    this.currencyConversionService.fetchExchangeRates().subscribe();
  }

  // Observable for current currency
  get currentCurrency$(): Observable<Currency> {
    return this.currentCurrency.asObservable();
  }

  // Get current currency
  getCurrentCurrency(): Currency {
    return this.currentCurrency.value;
  }

  // Set currency by language code
  setCurrencyByLanguage(languageCode: string): void {
    const currency = this.currencies[languageCode] || this.currencies['en'];
    this.currentCurrency.next(currency);
    localStorage.setItem('preferredCurrency', currency.code);
  }

  // Get currency for specific language
  getCurrencyForLanguage(languageCode: string): Currency {
    return this.currencies[languageCode] || this.currencies['en'];
  }

  // Format price with current currency (synchronous - uses cached rates)
  formatPrice(priceInBase: number): string {
    const currency = this.getCurrentCurrency();
    const convertedPrice = this.currencyConversionService.convertPriceSync(priceInBase, currency.code);
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code
    }).format(convertedPrice);
  }

  // Format price with real-time conversion (asynchronous)
  formatPriceAsync(priceInBase: number): Observable<string> {
    const currency = this.getCurrentCurrency();
    return this.currencyConversionService.convertPrice(priceInBase, currency.code).pipe(
      map(convertedPrice => {
        return new Intl.NumberFormat(currency.locale, {
          style: 'currency',
          currency: currency.code
        }).format(convertedPrice);
      })
    );
  }

  // Get converted price synchronously
  convertPrice(priceInBase: number): number {
    const currency = this.getCurrentCurrency();
    return this.currencyConversionService.convertPriceSync(priceInBase, currency.code);
  }

  // Get converted price asynchronously
  convertPriceAsync(priceInBase: number): Observable<number> {
    const currency = this.getCurrentCurrency();
    return this.currencyConversionService.convertPrice(priceInBase, currency.code);
  }

  // Get all available currencies
  getAllCurrencies(): { [key: string]: Currency } {
    return this.currencies;
  }
}