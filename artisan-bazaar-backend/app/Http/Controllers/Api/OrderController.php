<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index()
    {
        try {
            $orders = Order::latest()->get();

            // Process orders to handle JSON fields safely
            $processedOrders = $orders->map(function ($order) {
                $processed = $order->toArray();

                // Safely decode JSON fields
                $jsonFields = ['items', 'shipping_address', 'billing_address', 'payment_method'];
                foreach ($jsonFields as $field) {
                    if (!empty($processed[$field])) {
                        $decoded = json_decode($processed[$field], true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $processed[$field] = $decoded;
                        } else {
                            // If JSON is invalid, set to empty array/object
                            $processed[$field] = is_array(json_decode('[]', true)) ? [] : (object)[];
                        }
                    } else {
                        // If field is null or empty, set appropriate default
                        $processed[$field] = is_array(json_decode('[]', true)) ? [] : (object)[];
                    }
                }

                return $processed;
            });

            return response()->json($processedOrders);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve orders',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        // Log the incoming request for debugging
        \Log::info('Order creation request:', $request->all());

        $validator = Validator::make($request->all(), [
            'customerId' => 'required|string',
            'customerName' => 'required|string',
            'sellerId' => 'required|string',
            'sellerName' => 'required|string',
            'orderDate' => 'required', // Accept any format, we'll handle it
            'status' => 'required|string',
            'items' => 'required|array',
            'items.*.productId' => 'required|string',
            'items.*.productName' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unitPrice' => 'required|numeric|min:0',
            'items.*.totalPrice' => 'required|numeric|min:0',
            'shippingAddress' => 'required|array',
            'billingAddress' => 'required|array',
            'paymentMethod' => 'required|array',
            'subtotal' => 'required|numeric|min:0',
            'shippingCost' => 'numeric|min:0',
            'tax' => 'numeric|min:0',
            'total' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            \Log::error('Order validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Handle orderDate - convert to proper format if needed
            $orderDate = $request->orderDate;
            if (is_string($orderDate) && strtotime($orderDate)) {
                $orderDate = date('Y-m-d H:i:s', strtotime($orderDate));
            } elseif ($orderDate instanceof \DateTime) {
                $orderDate = $orderDate->format('Y-m-d H:i:s');
            } else {
                $orderDate = now()->format('Y-m-d H:i:s');
            }

            $order = Order::create([
                'customer_id' => $request->customerId,
                'customer_name' => $request->customerName,
                'seller_id' => $request->sellerId,
                'seller_name' => $request->sellerName,
                'order_date' => $orderDate,
                'status' => $request->status,
                'items' => json_encode($request->items),
                'shipping_address' => json_encode($request->shippingAddress),
                'billing_address' => json_encode($request->billingAddress),
                'payment_method' => json_encode($request->paymentMethod),
                'subtotal' => $request->subtotal,
                'shipping_cost' => $request->shippingCost ?? 0,
                'tax' => $request->tax ?? 0,
                'total' => $request->total
            ]);

            \Log::info('Order created successfully:', $order->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'order' => $order
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Order creation failed:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


