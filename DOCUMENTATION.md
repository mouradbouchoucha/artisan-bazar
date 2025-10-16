# Artisan Bazaar - Complete Documentation

## Overview
Artisan Bazaar is a comprehensive e-commerce platform for artisans and sellers to showcase and sell handmade products. Built with Angular frontend and Laravel backend.

## Architecture
- **Frontend**: Angular 17+ with TypeScript
- **Backend**: Laravel 11+ with PHP 8.1+
- **Database**: MySQL
- **Authentication**: Laravel Sanctum (Token-based)
- **Styling**: Tailwind CSS
- **Internationalization**: 12 languages support

## Features

### User Roles
- **Super Admin**: Full platform management
- **Seller**: Product and order management
- **Customer**: Shopping and profile management

### Core Functionality
- Product catalog with search and filters
- User authentication and authorization
- Order management with payment tracking
- File upload for product images
- Multi-language support
- Responsive design

## Installation & Setup

### Prerequisites
- Node.js 18+
- PHP 8.1+
- Composer
- MySQL 8.0+
- Git

### Backend Setup
```bash
cd artisan-bazaar-backend
composer install
cp .env.example .env
php artisan key:generate
# Configure .env for MySQL
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend Setup
```bash
cd artisan-bazaar
npm install
ng serve --port 4201
```

## API Documentation

### Authentication
```
POST /api/auth/login
Body: { email, password, role }
Response: { user, token }
```

### Protected Routes (Require Bearer Token)
```
GET /api/products
GET /api/orders
GET /api/users
POST /api/upload (image upload)
```

## Database Schema

### Users Table
- id, name, email, password, role, timestamps

### Products Table
- id, name, description, price, image_url, category, seller_id, stock, rating, status, sku, timestamps

### Orders Table
- id, customer_name, seller_name, status, total, payment_status, timestamps

### Reviews Table
- id, product_id, user_name, rating, comment, timestamps

## File Structure

```
artisan-bazaar/
├── src/
│   ├── app/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API services
│   │   └── models/        # TypeScript interfaces
│   └── assets/
└── artisan-bazaar-backend/
    ├── app/
    │   ├── Http/Controllers/Api/
    │   ├── Models/
    │   └── Providers/
    ├── database/
    │   ├── migrations/
    │   └── seeders/
    └── routes/
```

## Security Features
- Token-based authentication
- Protected API endpoints
- File upload validation
- SQL injection prevention
- XSS protection

## Deployment
1. Configure production .env
2. Run migrations
3. Build frontend: `ng build --prod`
4. Serve static files
5. Configure web server (Apache/Nginx)

## Testing
```bash
# Backend
php artisan test

# Frontend
ng test --watch=false
```

## Support
For issues, check logs and ensure all dependencies are installed.