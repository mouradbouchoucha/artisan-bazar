<?php

require_once 'vendor/autoload.php';

use Illuminate\Foundation\Application;
use App\Models\User;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "Verifying user emails...\n";
    echo "========================\n\n";

    // Get all users without verified emails
    $unverifiedUsers = User::whereNull('email_verified_at')->get();

    if ($unverifiedUsers->isEmpty()) {
        echo "✅ All users already have verified emails.\n";

        // Show all users and their verification status
        $allUsers = User::all();
        echo "\nAll users in database:\n";
        echo "---------------------\n";
        foreach ($allUsers as $user) {
            $verified = $user->email_verified_at ? '✅ VERIFIED' : '❌ NOT VERIFIED';
            echo "- {$user->name} ({$user->email}) [{$user->role}] - {$verified}\n";
        }
    } else {
        echo "Found " . $unverifiedUsers->count() . " unverified users:\n\n";

        foreach ($unverifiedUsers as $user) {
            $user->email_verified_at = now();
            $user->save();

            echo "✅ Verified: {$user->name} ({$user->email}) [{$user->role}]\n";
        }

        echo "\n🎉 All users have been verified successfully!\n";
    }

    echo "\n📝 Test Credentials:\n";
    echo "-------------------\n";
    echo "Super Admin: admin@artisanbazaar.com / 1111\n";
    echo "Seller: artisan.ahmed@example.com / 1234\n";
    echo "Customer: customer.sarah@example.com / 1234\n";
    echo "\n✨ You can now login with these credentials!\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Make sure the database is set up and Laravel is properly configured.\n";
    exit(1);
}
