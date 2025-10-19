import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface ExchangeRates {
  [currency: string]: number;
}

export interface ExchangeRateResponse {
  result?: string;
  documentation?: string;
  terms_of_use?: string;
  time_last_update_unix?: number;
  time_last_update_utc?: string;
  time_next_update_unix?: number;
  time_next_update_utc?: string;
  base_code?: string;
  rates: ExchangeRates;
  provider?: string;
  warning?: string;
  base?: string;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {
  private readonly BASE_URL = 'http://localhost:8000/api'; // Backend API
  private readonly BASE_CURRENCY = 'USD'; // All prices stored in USD

  private exchangeRates = new BehaviorSubject<ExchangeRates | null>(null);
  private lastUpdate = 0;
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

  constructor(private http: HttpClient) {
    // Load cached rates on initialization
    this.loadCachedRates();
  }

  /**
   * Get current exchange rates
   */
  getExchangeRates(): Observable<ExchangeRates | null> {
    return this.exchangeRates.asObservable();
  }

  /**
   * Fetch latest exchange rates from API
   */
  fetchExchangeRates(): Observable<ExchangeRates> {
    const now = Date.now();

    // Return cached rates if still valid
    if (this.exchangeRates.value && (now - this.lastUpdate) < this.CACHE_DURATION) {
      return of(this.exchangeRates.value);
    }

    const url = `${this.BASE_URL}/exchange-rates`;

    return this.http.get<any>(url).pipe(
      map(response => {
        // Handle both API response formats
        let rates: ExchangeRates;

        if (response.rates) {
          // exchangerate-api.com format
          rates = response.rates;
        } else if (response.rates) {
          // Our backend format
          rates = response.rates;
        } else {
          throw new Error('Invalid response format');
        }

        this.exchangeRates.next(rates);
        this.lastUpdate = now;
        this.saveCachedRates(rates);
        return rates;
      }),
      catchError(error => {
        console.error('Exchange rate API error:', error);
        // Return cached rates as fallback
        const cached = this.loadCachedRates();
        if (cached) {
          return of(cached);
        }
        // Return default rates if no cache available
        return of(this.getDefaultRates());
      })
    );
  }

  /**
   * Convert price from base currency (USD) to target currency
   */
  convertPrice(priceInBase: number, targetCurrency: string): Observable<number> {
    return this.fetchExchangeRates().pipe(
      map(rates => {
        if (!rates || !rates[targetCurrency]) {
          console.warn(`Exchange rate not available for ${targetCurrency}, using default`);
          return priceInBase; // Return original price if conversion fails
        }
        return priceInBase * rates[targetCurrency];
      }),
      catchError(() => {
        console.warn('Currency conversion failed, returning original price');
        return of(priceInBase);
      })
    );
  }

  /**
   * Convert price synchronously (using cached rates)
   */
  convertPriceSync(priceInBase: number, targetCurrency: string): number {
    const rates = this.exchangeRates.value;
    if (!rates || !rates[targetCurrency]) {
      return priceInBase; // Return original price if no rates available
    }
    return priceInBase * rates[targetCurrency];
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): string[] {
    return [
      'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY',
      'SAR', 'RUB', 'INR', 'KRW', 'BRL', 'MXN', 'ZAR'
    ];
  }

  /**
   * Check if currency is supported
   */
  isCurrencySupported(currency: string): boolean {
    return this.getSupportedCurrencies().includes(currency);
  }

  /**
   * Get default exchange rates (fallback)
   */
  private getDefaultRates(): ExchangeRates {
    return {
      'USD': 1,
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 110,
      'CAD': 1.25,
      'AUD': 1.35,
      'CHF': 0.92,
      'CNY': 6.45,
      'SAR': 3.75,
      'RUB': 75,
      'INR': 74,
      'KRW': 1180,
      'BRL': 5.2,
      'MXN': 20,
      'ZAR': 14.5
    };
  }

  /**
   * Save rates to localStorage
   */
  private saveCachedRates(rates: ExchangeRates): void {
    try {
      localStorage.setItem('exchangeRates', JSON.stringify(rates));
      localStorage.setItem('exchangeRatesTimestamp', this.lastUpdate.toString());
    } catch (error) {
      console.warn('Failed to cache exchange rates:', error);
    }
  }

  /**
   * Load cached rates from localStorage
   */
  private loadCachedRates(): ExchangeRates | null {
    try {
      const ratesJson = localStorage.getItem('exchangeRates');
      const timestampStr = localStorage.getItem('exchangeRatesTimestamp');

      if (ratesJson && timestampStr) {
        const timestamp = parseInt(timestampStr, 10);
        const now = Date.now();

        // Check if cache is still valid
        if ((now - timestamp) < this.CACHE_DURATION) {
          const rates = JSON.parse(ratesJson);
          this.exchangeRates.next(rates);
          this.lastUpdate = timestamp;
          return rates;
        } else {
          // Cache expired, remove it
          localStorage.removeItem('exchangeRates');
          localStorage.removeItem('exchangeRatesTimestamp');
        }
      }
    } catch (error) {
      console.warn('Failed to load cached exchange rates:', error);
    }
    return null;
  }
}
