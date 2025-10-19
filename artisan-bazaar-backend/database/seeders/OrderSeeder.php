<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        Order::factory()->create([
            'customer_name' => 'Sophie Martin',
            'seller_name' => 'Atelier Lumière',
            'status' => 'delivered',
            'total' => 115.18
        ]);

        Order::factory()->create([
            'customer_name' => 'Thomas Dubois',
            'seller_name' => 'Céramiques du Sud',
            'status' => 'shipped',
            'total' => 140.99
        ]);
    }
}


