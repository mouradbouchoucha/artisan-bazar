<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($productId)
    {
        return response()->json(Review::where('product_id', $productId)->latest()->get());
    }

    public function store(Request $request, $productId)
    {
        $review = Review::create([
            'product_id' => $productId,
            'user_name' => $request->input('user_name', 'Anonymous'),
            'rating' => (int) $request->input('rating', 5),
            'comment' => $request->input('comment')
        ]);
        return response()->json($review, 201);
    }
}


