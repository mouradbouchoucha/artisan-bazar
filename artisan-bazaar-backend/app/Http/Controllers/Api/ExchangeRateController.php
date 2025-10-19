<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class ExchangeRateController extends Controller
{
    private const CACHE_KEY = 'exchange_rates';
    private const CACHE_DURATION = 3600; // 1 hour

    public function getRates()
    {
        // Check cache first
        $cachedRates = Cache::get(self::CACHE_KEY);
        if ($cachedRates) {
            return response()->json($cachedRates);
        }

        try {
            // Fetch from exchangerate-api.com (free tier)
            $response = Http::get('https://api.exchangerate-api.com/v4/latest/USD');

            if ($response->successful()) {
                $data = $response->json();

                // Cache the rates
                Cache::put(self::CACHE_KEY, $data, self::CACHE_DURATION);

                return response()->json($data);
            }

            // Fallback to default rates if API fails
            return response()->json($this->getDefaultRates());

        } catch (\Exception $e) {
            // Return default rates on error
            return response()->json($this->getDefaultRates());
        }
    }

    private function getDefaultRates()
    {
        return [
            'provider' => 'fallback',
            'warning' => 'Using default exchange rates. API unavailable.',
            'base' => 'USD',
            'date' => now()->toDateString(),
            'rates' => [
                'USD' => 1,
                'EUR' => 0.85,
                'GBP' => 0.73,
                'JPY' => 110,
                'CAD' => 1.25,
                'AUD' => 1.35,
                'CHF' => 0.92,
                'CNY' => 6.45,
                'SAR' => 3.75,
                'RUB' => 75,
                'INR' => 74,
                'KRW' => 1180,
                'BRL' => 5.2,
                'MXN' => 20,
                'ZAR' => 14.5
            ]
        ];
    }
}
