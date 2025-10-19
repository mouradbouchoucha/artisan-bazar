<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Review;

class MockDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin+mock@artisanbazaar.com'],
            ['name' => 'Admin Mock', 'role' => 'super_admin', 'password' => Hash::make('1111')]
        );

        $seller = User::updateOrCreate(
            ['email' => 'seller+mock@example.com'],
            ['name' => 'Seller Mock', 'role' => 'seller', 'password' => Hash::make('1234')]
        );

        $customer = User::updateOrCreate(
            ['email' => 'customer+mock@example.com'],
            ['name' => 'Customer Mock', 'role' => 'customer', 'password' => Hash::make('1234')]
        );

        $products = [
            [
                'name' => 'Mock Basket',
                'description' => 'Handwoven mock basket',
                'price' => 29.99,
                'image_url' => 'https://picsum.photos/300/200?random=11',
                'category' => 'Home Decor',
                'seller_id' => $seller->id,
                'seller_name' => $seller->name,
                'stock' => 20,
                'rating' => 4.4,
                'review_count' => 5,
                'status' => 'approved',
                'sku' => 'MOCK-BASK-001',
            ],
            [
                'name' => 'Mock Vase',
                'description' => 'Painted mock vase',
                'price' => 49.00,
                'image_url' => 'https://picsum.photos/300/200?random=12',
                'category' => 'Home Decor',
                'seller_id' => $seller->id,
                'seller_name' => $seller->name,
                'stock' => 10,
                'rating' => 4.7,
                'review_count' => 8,
                'status' => 'approved',
                'sku' => 'MOCK-VASE-001',
            ],
        ];

        foreach ($products as $data) {
            Product::updateOrCreate(['name' => $data['name']], $data);
        }

        Order::create([
            'customer_id' => (string) $customer->id,
            'customer_name' => $customer->name,
            'seller_id' => (string) $seller->id,
            'seller_name' => $seller->name,
            'order_date' => now()->subDays(3),
            'status' => 'delivered',
            'items' => json_encode([
                ['product_id' => Product::value('id'), 'name' => 'Mock Item', 'quantity' => 2, 'unit_price' => 29.99],
            ]),
            'shipping_address' => json_encode([
                'line1' => '123 Mock St',
                'city' => 'Mock City',
                'country' => 'Mockland',
                'postal_code' => '12345',
            ]),
            'billing_address' => json_encode([
                'line1' => '123 Mock St',
                'city' => 'Mock City',
                'country' => 'Mockland',
                'postal_code' => '12345',
            ]),
            'payment_method' => json_encode(['type' => 'card', 'last4' => '4242']),
            'subtotal' => 59.98,
            'shipping_cost' => 5.00,
            'tax' => 7.20,
            'total' => 79.99,
        ]);

        $firstProductId = Product::value('id');
        if ($firstProductId) {
            Review::create([
                'product_id' => $firstProductId,
                'user_name' => $customer->name,
                'rating' => 5,
                'comment' => 'Excellent mock product!'
            ]);
        }
    }
}



