<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $items = [
            [
                'product_id' => $this->faker->numberBetween(1, 10),
                'name' => $this->faker->words(3, true),
                'quantity' => $this->faker->numberBetween(1, 5),
                'unit_price' => $this->faker->randomFloat(2, 5, 200),
            ],
            [
                'product_id' => $this->faker->numberBetween(1, 10),
                'name' => $this->faker->words(3, true),
                'quantity' => $this->faker->numberBetween(1, 5),
                'unit_price' => $this->faker->randomFloat(2, 5, 200),
            ],
        ];

        $subtotal = array_reduce($items, function ($carry, $item) {
            return $carry + ($item['quantity'] * $item['unit_price']);
        }, 0);
        $shipping = $this->faker->randomFloat(2, 0, 20);
        $tax = round($subtotal * 0.12, 2);
        $total = round($subtotal + $shipping + $tax, 2);

        return [
            'customer_id' => (string) $this->faker->numberBetween(1, 5),
            'customer_name' => $this->faker->name(),
            'seller_id' => (string) $this->faker->numberBetween(1, 5),
            'seller_name' => $this->faker->company(),
            'order_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'status' => $this->faker->randomElement(['pending','paid','preparing','shipped','delivered']),
            'items' => json_encode($items),
            'shipping_address' => json_encode([
                'line1' => $this->faker->streetAddress(),
                'city' => $this->faker->city(),
                'country' => $this->faker->country(),
                'postal_code' => $this->faker->postcode(),
            ]),
            'billing_address' => json_encode([
                'line1' => $this->faker->streetAddress(),
                'city' => $this->faker->city(),
                'country' => $this->faker->country(),
                'postal_code' => $this->faker->postcode(),
            ]),
            'payment_method' => json_encode([
                'type' => $this->faker->randomElement(['card','cash_on_delivery']),
                'last4' => $this->faker->numerify('####'),
            ]),
            'subtotal' => $subtotal,
            'shipping_cost' => $shipping,
            'tax' => $tax,
            'total' => $total,
        ];
    }
}


