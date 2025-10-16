@echo off
echo =======================================================
echo        ARTISAN BAZAAR LOGIN TEST SCRIPT
echo =======================================================
echo.

:: Set API base URL
set API_URL=http://localhost:8000/api

:: Colors for output (if supported)
set GREEN=[92m
set RED=[91m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

echo %BLUE%Testing Authentication System...%NC%
echo.

:: Test 1: Check if Laravel server is running
echo %YELLOW%Test 1: Checking if backend server is running...%NC%
curl -s %API_URL%/../up >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Laravel server is running at http://localhost:8000%NC%
) else (
    echo %RED%✗ Laravel server is not running%NC%
    echo Please start the server with:
    echo   cd artisan-bazaar-backend
    echo   php artisan serve --host=127.0.0.1 --port=8000
    pause
    exit /b 1
)
echo.

:: Test 2: Test Admin Login
echo %YELLOW%Test 2: Testing Admin Login (admin@artisanbazaar.com / 1111)...%NC%
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"admin@artisanbazaar.com\",\"password\":\"1111\",\"role\":\"super_admin\"}" ^
  %API_URL%/auth/login > admin_login_result.json 2>&1

findstr "token" admin_login_result.json >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Admin login successful%NC%
    echo Response:
    type admin_login_result.json | findstr "user\|token"
) else (
    echo %RED%✗ Admin login failed%NC%
    echo Full response:
    type admin_login_result.json
    echo.
    findstr "email_verified.*false" admin_login_result.json >nul 2>&1
    if %errorlevel% == 0 (
        echo %YELLOW%Issue: Email not verified. Running verification fix...%NC%
        cd artisan-bazaar-backend
        php verify-users.php
        cd ..
        echo Please try logging in again.
    )
)
echo.

:: Test 3: Test Seller Login
echo %YELLOW%Test 3: Testing Seller Login (artisan.ahmed@example.com / 1234)...%NC%
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"artisan.ahmed@example.com\",\"password\":\"1234\",\"role\":\"seller\"}" ^
  %API_URL%/auth/login > seller_login_result.json 2>&1

findstr "token" seller_login_result.json >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Seller login successful%NC%
) else (
    echo %RED%✗ Seller login failed%NC%
    type seller_login_result.json
)
echo.

:: Test 4: Test Customer Login
echo %YELLOW%Test 4: Testing Customer Login (customer.sarah@example.com / 1234)...%NC%
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"customer.sarah@example.com\",\"password\":\"1234\",\"role\":\"customer\"}" ^
  %API_URL%/auth/login > customer_login_result.json 2>&1

findstr "token" customer_login_result.json >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Customer login successful%NC%
) else (
    echo %RED%✗ Customer login failed%NC%
    type customer_login_result.json
)
echo.

:: Test 5: Test Invalid Login
echo %YELLOW%Test 5: Testing Invalid Login (should fail)...%NC%
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"invalid@example.com\",\"password\":\"wrongpassword\",\"role\":\"customer\"}" ^
  %API_URL%/auth/login > invalid_login_result.json 2>&1

findstr "Invalid credentials" invalid_login_result.json >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Invalid login correctly rejected%NC%
) else (
    echo %RED%✗ Invalid login was not properly handled%NC%
    type invalid_login_result.json
)
echo.

:: Test 6: Check Frontend Status
echo %YELLOW%Test 6: Checking Frontend Server...%NC%
curl -s http://localhost:4201 >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Frontend server is running at http://localhost:4201%NC%
) else (
    echo %RED%✗ Frontend server is not running%NC%
    echo Please start the frontend with:
    echo   cd artisan-bazaar
    echo   ng serve --port 4201
)
echo.

:: Summary
echo =======================================================
echo                    LOGIN TEST SUMMARY
echo =======================================================
echo.
echo %BLUE%Test Results:%NC%
echo - Backend Server: Check above
echo - Admin Login: Check above
echo - Seller Login: Check above
echo - Customer Login: Check above
echo - Invalid Login Rejection: Check above
echo - Frontend Server: Check above
echo.

echo %YELLOW%Login Credentials (if all tests passed):%NC%
echo.
echo %GREEN%Super Admin:%NC%
echo   Email: admin@artisanbazaar.com
echo   Password: 1111
echo   URL: http://localhost:4201/login
echo.
echo %GREEN%Seller:%NC%
echo   Email: artisan.ahmed@example.com
echo   Password: 1234
echo   URL: http://localhost:4201/login
echo.
echo %GREEN%Customer:%NC%
echo   Email: customer.sarah@example.com
echo   Password: 1234
echo   URL: http://localhost:4201/login
echo.

echo %BLUE%Next Steps:%NC%
echo 1. If login tests failed, check the error messages above
echo 2. Make sure both backend and frontend servers are running
echo 3. Open http://localhost:4201/login in your browser
echo 4. Use the credentials above to test login
echo.

echo %YELLOW%Troubleshooting:%NC%
echo - If "email not verified" error: Run verify-users.php in backend folder
echo - If CORS errors: Make sure CORS middleware is enabled in Laravel
echo - If network errors: Check if servers are actually running
echo.

:: Cleanup
del *_login_result.json >nul 2>&1

pause
