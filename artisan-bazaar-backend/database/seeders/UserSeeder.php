<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ["email" => "admin@artisanbazaar.com"],
            [
                "name" => "Super Admin",
                "role" => "super_admin",
                "password" => Hash::make("1111"),
                "email_verified_at" => now(),
            ],
        );

        User::updateOrCreate(
            ["email" => "artisan.ahmed@example.com"],
            [
                "name" => "Ahmed Al-Fassi",
                "role" => "seller",
                "password" => Hash::make("1234"),
                "email_verified_at" => now(),
            ],
        );

        User::updateOrCreate(
            ["email" => "customer.sarah@example.com"],
            [
                "name" => "Sarah Johnson",
                "role" => "customer",
                "password" => Hash::make("1234"),
                "email_verified_at" => now(),
            ],
        );
    }
}
