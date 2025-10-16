# Artisan Bazaar - Credentials & Configuration

## Test User Accounts

### Super Admin
- **Email**: admin@artisanbazaar.com
- **Password**: 1111
- **Role**: super_admin
- **Access**: Full platform management

### Seller
- **Email**: artisan.ahmed@example.com
- **Password**: 1234
- **Role**: seller
- **Access**: Product and order management

### Customer
- **Email**: customer.sarah@example.com
- **Password**: 1234
- **Role**: customer
- **Access**: Shopping and profile management

### Additional Mock Users
- **Email**: admin+mock@artisanbazaar.com / 1111 (super_admin)
- **Email**: seller+mock@example.com / 1234 (seller)
- **Email**: customer+mock@example.com / 1234 (customer)

## Database Configuration

### MySQL Settings
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=artisan_bazaar
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

### SQLite (Alternative for Development)
```env
DB_CONNECTION=sqlite
# No additional settings needed
```

## Email Configuration

### 📧 **WHERE TO ADD EMAIL CREDENTIALS**

**Location**: `artisan-bazaar-backend/.env` file (lines 50-58)

### Gmail SMTP (Production)
```env
# Add these lines to artisan-bazaar-backend/.env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@artisanbazaar.com
MAIL_FROM_NAME=Artisan Bazaar
```

### 🔐 **How to Get Gmail App Password**
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App passwords
4. Generate a new app password for "Artisan Bazaar"
5. Use this 16-character password in `MAIL_PASSWORD`

### Log (Development - Current Setup)
```env
MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@artisanbazaar.com
MAIL_FROM_NAME=Artisan Bazaar
```

### 📧 **Email Features**
- **Registration**: Email verification sent to new users
- **Password Reset**: Future implementation
- **Order Confirmations**: Future implementation
- **Notifications**: Admin and seller notifications

### 🧪 **Testing Email Configuration**
1. **Check logs**: With `MAIL_MAILER=log`, emails appear in `storage/logs/laravel.log`
2. **MailHog**: For local testing, use MailHog on port 1025
3. **Test command**: Run `php artisan test:email your-email@example.com`
4. **Manual test**: Use `php artisan tinker` then `Mail::raw('Test email', function($msg) { $msg->to('test@example.com')->subject('Test'); });`

### 🔄 **Alternative Email Services**
```env
# SendGrid
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key

# Mailgun
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your-mailgun-username
MAIL_PASSWORD=your-mailgun-password
```

### ⚠️ **Important Notes**
- **Security**: Never commit `.env` file to version control
- **App Passwords**: Gmail requires app passwords, not regular passwords
- **Rate Limits**: Be aware of email provider sending limits
- **SPF/DKIM**: Configure DNS records for better deliverability

## Application Keys

### Laravel App Key
Generate with: `php artisan key:generate`
```env
APP_KEY=base64:generated_key_here
```

### Sanctum Stateful Domains (for session auth if needed)
```env
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
```

## API Endpoints

### Base URLs
- **Frontend**: http://localhost:4201
- **Backend API**: http://localhost:8000/api

### Authentication
- **Login**: POST /api/auth/login
- **Token Required**: Bearer {token}

## File Storage

### Upload Directory
- **Path**: storage/app/public/uploads/products/
- **URL**: http://localhost:8000/storage/uploads/products/

### Storage Link
Run: `php artisan storage:link`

## Environment Variables Summary

### Required for Production
- APP_KEY (generated)
- DB_* (database settings)
- MAIL_* (email settings)

### Optional
- APP_DEBUG=false (production)
- APP_ENV=production
- LOG_CHANNEL=stack

## Security Notes
- Never commit .env files to version control
- Use strong passwords for database and email
- Enable HTTPS in production
- Regularly update dependencies
- Use environment-specific configurations

## Development Setup
1. Copy `.env.example` to `.env`
2. Configure database settings
3. Run `php artisan key:generate`
4. Run `php artisan migrate`
5. Run `php artisan db:seed`
6. Configure email if needed
7. Start servers: `php artisan serve` and `ng serve`