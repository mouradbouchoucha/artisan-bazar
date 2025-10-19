<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);

        $user = User::where("email", $request->input("email"))->first();
        if (!$user) {
            return response()->json(["message" => "Invalid credentials"], 401);
        }

        // For demo: if password column is empty, accept any; else verify hash
        $password = $request->input("password");
        if ($user->password && !Hash::check($password, $user->password)) {
            return response()->json(["message" => "Invalid credentials"], 401);
        }

        // Check if email is verified
        if (!$user->hasVerifiedEmail()) {
            return response()->json(
                [
                    "message" =>
                        "Please verify your email address before logging in.",
                    "email_verified" => false,
                ],
                403,
            );
        }

        // Create token
        $token = $user->createToken("api-token")->plainTextToken;

        return response()->json([
            "user" => [
                "id" => $user->id,
                "email" => $user->email,
                "name" => $user->name,
                "role" => $user->role ?? "customer",
                "email_verified" => true,
                "createdAt" => $user->created_at,
            ],
            "token" => $token,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|email|unique:users,email",
            "password" => "required|min:6",
            "role" => "required|in:customer,seller",
        ]);

        $user = User::create([
            "name" => $request->input("name"),
            "email" => $request->input("email"),
            "password" => Hash::make($request->input("password")),
            "role" => $request->input("role", "customer"),
        ]);

        // Send email verification
        $user->sendEmailVerificationNotification();

        return response()->json(
            [
                "message" =>
                    "Registration successful! Please check your email to verify your account.",
                "user" => [
                    "id" => $user->id,
                    "email" => $user->email,
                    "name" => $user->name,
                    "role" => $user->role,
                    "email_verified" => false,
                    "createdAt" => $user->created_at,
                ],
            ],
            201,
        );
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            "id" => "required|integer",
            "hash" => "required|string",
        ]);

        $user = User::findOrFail($request->input("id"));

        if (
            !hash_equals(
                (string) $request->input("id"),
                (string) $user->getKey(),
            )
        ) {
            return response()->json(
                ["message" => "Invalid verification link"],
                400,
            );
        }

        if (
            !hash_equals(
                $request->input("hash"),
                sha1($user->getEmailForVerification()),
            )
        ) {
            return response()->json(
                ["message" => "Invalid verification link"],
                400,
            );
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(
                ["message" => "Email already verified"],
                200,
            );
        }

        $user->markEmailAsVerified();

        return response()->json(
            ["message" => "Email verified successfully"],
            200,
        );
    }

    public function logout(Request $request)
    {
        try {
            // Revoke the token that was used to authenticate the current request
            $request->user()->currentAccessToken()->delete();

            return response()->json(
                [
                    "message" => "Successfully logged out",
                ],
                200,
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    "message" => "Failed to logout",
                    "error" => $e->getMessage(),
                ],
                500,
            );
        }
    }

    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            "user" => [
                "id" => $user->id,
                "email" => $user->email,
                "name" => $user->name,
                "role" => $user->role ?? "customer",
                "phone" => $user->phone,
                "address" => $user->address,
                "date_of_birth" => $user->date_of_birth,
                "gender" => $user->gender,
                "bio" => $user->bio,
                "profile_image" => $user->profile_image,
                "email_verified" => $user->hasVerifiedEmail(),
                "createdAt" => $user->created_at,
                "updatedAt" => $user->updated_at,
            ],
        ]);
    }

    public function refresh(Request $request)
    {
        try {
            $user = $request->user();

            // Revoke current token
            $request->user()->currentAccessToken()->delete();

            // Create new token
            $token = $user->createToken("api-token")->plainTextToken;

            return response()->json([
                "user" => [
                    "id" => $user->id,
                    "email" => $user->email,
                    "name" => $user->name,
                    "role" => $user->role ?? "customer",
                    "email_verified" => $user->hasVerifiedEmail(),
                    "createdAt" => $user->created_at,
                ],
                "token" => $token,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "message" => "Failed to refresh token",
                    "error" => $e->getMessage(),
                ],
                500,
            );
        }
    }
}
