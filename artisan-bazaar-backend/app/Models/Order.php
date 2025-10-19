<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'customer_name',
        'seller_id',
        'seller_name',
        'order_date',
        'status',
        'items',
        'shipping_address',
        'billing_address',
        'payment_method',
        'subtotal',
        'shipping_cost',
        'tax',
        'total'
    ];
}


