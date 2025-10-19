<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('image_url')->nullable();
            $table->string('category')->nullable();
            $table->unsignedBigInteger('seller_id')->nullable();
            $table->string('seller_name')->nullable();
            $table->integer('stock')->default(0);
            $table->float('rating')->default(0);
            $table->integer('review_count')->default(0);
            $table->string('status')->nullable();
            $table->string('sku')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};


