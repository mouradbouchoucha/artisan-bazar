@echo off
echo Starting Artisan Bazaar Backend Server...
echo.
echo Server will be available at: http://localhost:8000
echo API endpoints will be at: http://localhost:8000/api
echo.
echo Press Ctrl+C to stop the server
echo.
php artisan serve --host=127.0.0.1 --port=8000
