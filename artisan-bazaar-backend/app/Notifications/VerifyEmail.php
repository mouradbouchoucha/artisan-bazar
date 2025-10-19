<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmail extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verify Your Email Address - Artisan Bazaar')
            ->greeting('Welcome to Artisan Bazaar!')
            ->line('Thank you for registering with Artisan Bazaar. Please verify your email address by clicking the button below.')
            ->action('Verify Email Address', $verificationUrl)
            ->line('If you did not create an account, no further action is required.')
            ->salutation('Best regards, The Artisan Bazaar Team');
    }

    /**
     * Get the verification URL for the given notifiable.
     */
    protected function verificationUrl($notifiable)
    {
        $id = $notifiable->getKey();
        $hash = sha1($notifiable->getEmailForVerification());

        // Point to frontend verification page
        return "http://localhost:4201/email-verification?id={$id}&hash={$hash}";
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
