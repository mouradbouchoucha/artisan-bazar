<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UploadController;

Route::post("/auth/login", [AuthController::class, "login"]);
Route::post("/auth/register", [AuthController::class, "register"]);
Route::post("/auth/verify-email", [AuthController::class, "verifyEmail"]);

// Public routes
Route::get("/products", [ProductController::class, "index"]);
Route::get("/products/{id}", [ProductController::class, "show"]);
Route::get("/products/{product}/reviews", [ReviewController::class, "index"]);
Route::get("/exchange-rates", [
    App\Http\Controllers\Api\ExchangeRateController::class,
    "getRates",
]);

// Protected routes
Route::middleware("auth:sanctum")->group(function () {
    // Order routes
    Route::get("/orders", [OrderController::class, "index"]);
    Route::post("/orders", [OrderController::class, "store"]);
    Route::get("/orders/{id}", [OrderController::class, "show"]);
    Route::put("/orders/{id}", [OrderController::class, "update"]);

    // Product management routes (authenticated users)
    Route::post("/products", [ProductController::class, "store"]);
    Route::put("/products/{id}", [ProductController::class, "update"]);
    Route::delete("/products/{id}", [ProductController::class, "destroy"]);

    // Admin-only product routes
    Route::put("/products/{id}/status", [
        ProductController::class,
        "updateStatus",
    ]);

    // Review routes
    Route::post("/products/{product}/reviews", [
        ReviewController::class,
        "store",
    ]);
    Route::put("/reviews/{id}", [ReviewController::class, "update"]);
    Route::delete("/reviews/{id}", [ReviewController::class, "destroy"]);

    // User management
    Route::get("/users", [UserController::class, "index"]);
    Route::put("/user/profile", [UserController::class, "update"]);
    Route::get("/user/profile", [UserController::class, "show"]);
    Route::delete("/users/{id}", [UserController::class, "destroy"]);

    // File upload routes
    Route::post("/upload", [UploadController::class, "upload"]);
    Route::post("/upload/profile-image", [
        UploadController::class,
        "uploadProfileImage",
    ]);

    // Authentication routes (protected)
    Route::post("/auth/logout", [AuthController::class, "logout"]);
    Route::get("/auth/user", [AuthController::class, "user"]);
    Route::post("/auth/refresh", [AuthController::class, "refresh"]);
});
