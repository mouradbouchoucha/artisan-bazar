<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Panier Tressé à la Main',
                'description' => 'Design traditionnel marocain',
                'price' => 135.00, // ~45 USD in TND
                'image_url' => 'https://picsum.photos/300/200?random=1',
                'category' => 'Décoration Maison',
                'seller_id' => 3,
                'seller_name' => 'Ahmed Al-Fassi',
                'stock' => 15,
                'rating' => 4.5,
                'review_count' => 23,
                'status' => 'approved'
            ],
            [
                'name' => 'Vase en Céramique',
                'description' => 'Poterie tunisienne peinte à la main',
                'price' => 204.00, // ~68 USD in TND
                'image_url' => 'https://picsum.photos/300/200?random=2',
                'category' => 'Décoration Maison',
                'seller_id' => 3,
                'seller_name' => 'Ahmed Al-Fassi',
                'stock' => 8,
                'rating' => 4.7,
                'review_count' => 31,
                'status' => 'approved'
            ],
            [
                'name' => 'Sac en Cuir',
                'description' => 'Cuir égyptien cousu à la main',
                'price' => 360.00, // ~120 USD in TND
                'image_url' => 'https://picsum.photos/300/200?random=3',
                'category' => 'Mode',
                'seller_id' => 3,
                'seller_name' => 'Ahmed Al-Fassi',
                'stock' => 12,
                'rating' => 4.8,
                'review_count' => 45,
                'status' => 'approved'
            ],
            [
                'name' => 'Collier en Argent',
                'description' => 'Filigrane traditionnel algérien',
                'price' => 267.00, // ~89 USD in TND
                'image_url' => 'https://picsum.photos/300/200?random=4',
                'category' => 'Bijoux',
                'seller_id' => 4,
                'seller_name' => 'Fatima Benali',
                'stock' => 20,
                'rating' => 4.6,
                'review_count' => 18,
                'status' => 'approved'
            ],
            [
                'name' => 'Sculpture en Bois',
                'description' => 'Pièce d\'art africaine sculptée à la main',
                'price' => 450.00, // ~150 USD in TND
                'image_url' => 'https://picsum.photos/300/200?random=5',
                'category' => 'Art',
                'seller_id' => 2,
                'seller_name' => 'Jean Laurent',
                'stock' => 5,
                'rating' => 4.9,
                'review_count' => 12,
                'status' => 'pending'
            ],
            [
                'name' => 'Écharpe en Soie',
                'description' => 'Soie tissée à la main avec motifs traditionnels',
                'price' => 225.00, // ~75 USD in TND
                'image_url' => 'https://picsum.photos/300/200?random=6',
                'category' => 'Mode',
                'seller_id' => 2,
                'seller_name' => 'Jean Laurent',
                'stock' => 25,
                'rating' => 4.4,
                'review_count' => 28,
                'status' => 'approved'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}



