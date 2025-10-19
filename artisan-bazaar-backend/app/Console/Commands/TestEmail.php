<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email configuration by sending a test email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? 'test@example.com';

        $this->info('Testing email configuration...');
        $this->info('Mail Driver: ' . config('mail.default'));
        $this->info('Sending test email to: ' . $email);

        try {
            Mail::raw('This is a test email from Artisan Bazaar. If you received this, email configuration is working correctly!', function ($message) use ($email) {
                $message->to($email)
                        ->subject('Artisan Bazaar - Email Test');
            });

            $this->info('✅ Test email sent successfully!');
            $this->info('Check your email or logs for the test message.');

        } catch (\Exception $e) {
            $this->error('❌ Failed to send test email: ' . $e->getMessage());
            $this->info('Make sure your email credentials are configured correctly in the .env file.');
        }
    }
}
