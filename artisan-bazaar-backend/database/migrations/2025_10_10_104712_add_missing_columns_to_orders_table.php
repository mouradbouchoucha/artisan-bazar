<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_id')->after('id');
            $table->string('seller_id')->after('customer_name');
            $table->timestamp('order_date')->after('seller_name');
            $table->json('items')->after('order_date');
            $table->json('shipping_address')->after('items');
            $table->json('billing_address')->after('shipping_address');
            $table->json('payment_method')->after('billing_address');
            $table->decimal('subtotal', 10, 2)->default(0)->after('payment_method');
            $table->decimal('shipping_cost', 10, 2)->default(0)->after('subtotal');
            $table->decimal('tax', 10, 2)->default(0)->after('shipping_cost');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_id',
                'seller_id',
                'order_date',
                'items',
                'shipping_address',
                'billing_address',
                'payment_method',
                'subtotal',
                'shipping_cost',
                'tax'
            ]);
        });
    }
};
