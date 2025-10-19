<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Filter by category if provided
        if ($request->has("category") && $request->category) {
            $query->where("category", $request->category);
        }

        // Filter by seller if provided
        if ($request->has("seller_id") && $request->seller_id) {
            $query->where("seller_id", $request->seller_id);
        }

        // Search by name or description
        if ($request->has("search") && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where("name", "like", "%{$search}%")->orWhere(
                    "description",
                    "like",
                    "%{$search}%",
                );
            });
        }

        // Filter by status
        if ($request->has("status") && $request->status) {
            $query->where("status", $request->status);
        }

        // Sort options
        $sortBy = $request->get("sort_by", "created_at");
        $sortOrder = $request->get("sort_order", "desc");
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get("per_page", 15);
        if ($request->has("paginate") && $request->paginate === "false") {
            return response()->json($query->get());
        }

        return response()->json($query->paginate($perPage));
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(["message" => "Product not found"], 404);
        }

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "description" => "required|string",
            "price" => "required|numeric|min:0",
            "category" => "required|string|max:100",
            "stock" => "required|integer|min:0",
            "sku" => "nullable|string|max:100|unique:products,sku",
            "image_url" => "nullable|url",
            "status" => "nullable|in:active,inactive,pending,approved,rejected",
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    "message" => "Validation failed",
                    "errors" => $validator->errors(),
                ],
                422,
            );
        }

        try {
            $product = Product::create([
                "name" => $request->name,
                "description" => $request->description,
                "price" => $request->price,
                "category" => $request->category,
                "seller_id" => $request->user()->id,
                "stock" => $request->stock,
                "rating" => 0,
                "status" => $request->status ?? "pending",
                "sku" => $request->sku ?? $this->generateSKU(),
                "image_url" => $request->image_url,
            ]);

            return response()->json(
                [
                    "message" => "Product created successfully",
                    "product" => $product,
                ],
                201,
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    "message" => "Failed to create product",
                    "error" => $e->getMessage(),
                ],
                500,
            );
        }
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(["message" => "Product not found"], 404);
        }

        // Check if user owns the product or is admin
        $user = $request->user();
        if ($user->role !== "super_admin" && $product->seller_id != $user->id) {
            return response()->json(
                ["message" => "Unauthorized to update this product"],
                403,
            );
        }

        $validator = Validator::make($request->all(), [
            "name" => "sometimes|required|string|max:255",
            "description" => "sometimes|required|string",
            "price" => "sometimes|required|numeric|min:0",
            "category" => "sometimes|required|string|max:100",
            "stock" => "sometimes|required|integer|min:0",
            "sku" =>
                "sometimes|nullable|string|max:100|unique:products,sku," . $id,
            "image_url" => "nullable|url",
            "status" =>
                "sometimes|nullable|in:active,inactive,pending,approved,rejected",
            "rating" => "sometimes|numeric|min:0|max:5",
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    "message" => "Validation failed",
                    "errors" => $validator->errors(),
                ],
                422,
            );
        }

        try {
            $product->update(
                $request->only([
                    "name",
                    "description",
                    "price",
                    "category",
                    "stock",
                    "sku",
                    "image_url",
                    "status",
                    "rating",
                ]),
            );

            return response()->json([
                "message" => "Product updated successfully",
                "product" => $product,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "message" => "Failed to update product",
                    "error" => $e->getMessage(),
                ],
                500,
            );
        }
    }

    public function destroy(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(["message" => "Product not found"], 404);
        }

        // Check if user owns the product or is admin
        $user = $request->user();
        if ($user->role !== "super_admin" && $product->seller_id != $user->id) {
            return response()->json(
                ["message" => "Unauthorized to delete this product"],
                403,
            );
        }

        try {
            // Delete associated image if exists
            if (
                $product->image_url &&
                Storage::disk("public")->exists($product->image_url)
            ) {
                Storage::disk("public")->delete($product->image_url);
            }

            $product->delete();

            return response()->json([
                "message" => "Product deleted successfully",
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "message" => "Failed to delete product",
                    "error" => $e->getMessage(),
                ],
                500,
            );
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(["message" => "Product not found"], 404);
        }

        // Only admins can change product status
        if ($request->user()->role !== "super_admin") {
            return response()->json(
                ["message" => "Unauthorized to change product status"],
                403,
            );
        }

        $validator = Validator::make($request->all(), [
            "status" => "required|in:active,inactive,pending,approved,rejected",
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    "message" => "Invalid status",
                    "errors" => $validator->errors(),
                ],
                422,
            );
        }

        try {
            $product->update(["status" => $request->status]);

            return response()->json([
                "message" => "Product status updated successfully",
                "product" => $product,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "message" => "Failed to update product status",
                    "error" => $e->getMessage(),
                ],
                500,
            );
        }
    }

    private function generateSKU()
    {
        return "SKU-" . strtoupper(uniqid());
    }
}
