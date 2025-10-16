@echo off
echo =======================================================
echo        ARTISAN BAZAAR API TESTING SCRIPT
echo =======================================================
echo.

:: Set API base URL
set API_URL=http://localhost:8000/api
set FRONTEND_URL=http://localhost:4201

:: Colors for output (if supported)
set GREEN=[92m
set RED=[91m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

echo %BLUE%Starting API Tests...%NC%
echo.

:: Test 1: Check if Laravel server is running
echo %YELLOW%Test 1: Checking Laravel Server Status...%NC%
curl -s %API_URL%/../up >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Laravel server is running%NC%
) else (
    echo %RED%✗ Laravel server is not running%NC%
    echo Please start the server with: php artisan serve --host=127.0.0.1 --port=8000
    pause
    exit /b 1
)
echo.

:: Test 2: Test Public Routes
echo %YELLOW%Test 2: Testing Public API Endpoints...%NC%

echo Testing GET /api/products...
curl -s -H "Accept: application/json" %API_URL%/products | findstr "id" >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Products endpoint working%NC%
) else (
    echo %RED%✗ Products endpoint failed%NC%
)

echo Testing GET /api/exchange-rates...
curl -s -H "Accept: application/json" %API_URL%/exchange-rates >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Exchange rates endpoint working%NC%
) else (
    echo %RED%✗ Exchange rates endpoint failed%NC%
)
echo.

:: Test 3: Test Authentication
echo %YELLOW%Test 3: Testing Authentication...%NC%

:: Test login with admin credentials
echo Testing admin login...
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"admin@artisanbazaar.com\",\"password\":\"1111\",\"role\":\"super_admin\"}" ^
  %API_URL%/auth/login > temp_login.json 2>&1

findstr "token" temp_login.json >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Admin login successful%NC%
    for /f "tokens=2 delims=:," %%i in ('findstr "token" temp_login.json') do set TOKEN=%%i
    set TOKEN=%TOKEN:"=%
    set TOKEN=%TOKEN: =%
) else (
    echo %RED%✗ Admin login failed%NC%
    type temp_login.json
)

:: Test login with seller credentials
echo Testing seller login...
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"artisan.ahmed@example.com\",\"password\":\"1234\",\"role\":\"seller\"}" ^
  %API_URL%/auth/login > temp_seller_login.json 2>&1

findstr "token" temp_seller_login.json >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Seller login successful%NC%
) else (
    echo %RED%✗ Seller login failed%NC%
)

:: Test login with customer credentials
echo Testing customer login...
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"customer.sarah@example.com\",\"password\":\"1234\",\"role\":\"customer\"}" ^
  %API_URL%/auth/login > temp_customer_login.json 2>&1

findstr "token" temp_customer_login.json >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Customer login successful%NC%
) else (
    echo %RED%✗ Customer login failed%NC%
)
echo.

:: Test 4: Test Protected Routes (using admin token)
if defined TOKEN (
    echo %YELLOW%Test 4: Testing Protected API Endpoints...%NC%

    echo Testing GET /api/users...
    curl -s -H "Authorization: Bearer %TOKEN%" ^
      -H "Accept: application/json" ^
      %API_URL%/users | findstr "id" >nul 2>&1
    if %errorlevel% == 0 (
        echo %GREEN%✓ Users endpoint working with authentication%NC%
    ) else (
        echo %RED%✗ Users endpoint failed with authentication%NC%
    )

    echo Testing GET /api/orders...
    curl -s -H "Authorization: Bearer %TOKEN%" ^
      -H "Accept: application/json" ^
      %API_URL%/orders >nul 2>&1
    if %errorlevel% == 0 (
        echo %GREEN%✓ Orders endpoint working with authentication%NC%
    ) else (
        echo %RED%✗ Orders endpoint failed with authentication%NC%
    )

    echo Testing GET /api/auth/user...
    curl -s -H "Authorization: Bearer %TOKEN%" ^
      -H "Accept: application/json" ^
      %API_URL%/auth/user | findstr "user" >nul 2>&1
    if %errorlevel% == 0 (
        echo %GREEN%✓ User profile endpoint working%NC%
    ) else (
        echo %RED%✗ User profile endpoint failed%NC%
    )
) else (
    echo %RED%Skipping protected route tests - no valid token%NC%
)
echo.

:: Test 5: Test CORS Headers
echo %YELLOW%Test 5: Testing CORS Configuration...%NC%
curl -s -I -X OPTIONS ^
  -H "Origin: %FRONTEND_URL%" ^
  -H "Access-Control-Request-Method: POST" ^
  -H "Access-Control-Request-Headers: Content-Type, Authorization" ^
  %API_URL%/auth/login | findstr "Access-Control-Allow-Origin" >nul 2>&1

if %errorlevel% == 0 (
    echo %GREEN%✓ CORS headers present%NC%
) else (
    echo %RED%✗ CORS headers missing or incorrect%NC%
    echo This may prevent frontend from communicating with backend
)
echo.

:: Test 6: Test Database Connection
echo %YELLOW%Test 6: Testing Database Connection...%NC%
cd /d "%~dp0artisan-bazaar-backend"
if exist "database\database.sqlite" (
    echo %GREEN%✓ SQLite database file exists%NC%

    :: Test if we can query the database
    php artisan tinker --execute="echo 'Users: ' . App\Models\User::count(); echo PHP_EOL; echo 'Products: ' . App\Models\Product::count();" > temp_db_test.txt 2>&1

    findstr "Users:" temp_db_test.txt >nul 2>&1
    if %errorlevel% == 0 (
        echo %GREEN%✓ Database queries working%NC%
        type temp_db_test.txt | findstr "Users:\|Products:"
    ) else (
        echo %RED%✗ Database queries failed%NC%
        type temp_db_test.txt
    )
    del temp_db_test.txt >nul 2>&1
) else (
    echo %RED%✗ SQLite database file not found%NC%
    echo Please run: php artisan migrate --seed
)
cd /d "%~dp0"
echo.

:: Test 7: Test File Upload Directory
echo %YELLOW%Test 7: Testing File Upload Configuration...%NC%
if exist "artisan-bazaar-backend\storage\app\public\uploads" (
    echo %GREEN%✓ Upload directories exist%NC%
) else (
    echo %RED%✗ Upload directories missing%NC%
    echo Please run: php artisan storage:link
)

if exist "artisan-bazaar-backend\public\storage" (
    echo %GREEN%✓ Storage link exists%NC%
) else (
    echo %RED%✗ Storage link missing%NC%
    echo Please run: php artisan storage:link
)
echo.

:: Test 8: Test Frontend Server
echo %YELLOW%Test 8: Checking Frontend Server...%NC%
curl -s %FRONTEND_URL% >nul 2>&1
if %errorlevel% == 0 (
    echo %GREEN%✓ Frontend server is running%NC%
) else (
    echo %RED%✗ Frontend server is not running%NC%
    echo Please start with: ng serve --port 4201
)
echo.

:: Test 9: Test Email Configuration
echo %YELLOW%Test 9: Testing Email Configuration...%NC%
cd /d "%~dp0artisan-bazaar-backend"
if exist ".env" (
    findstr "MAIL_MAILER" .env >nul 2>&1
    if %errorlevel% == 0 (
        echo %GREEN%✓ Email configuration found in .env%NC%
        findstr "MAIL_MAILER\|MAIL_HOST\|MAIL_FROM_ADDRESS" .env | findstr /v "MAIL_PASSWORD"
    ) else (
        echo %RED%✗ Email configuration missing%NC%
    )
) else (
    echo %RED%✗ .env file not found%NC%
)
cd /d "%~dp0"
echo.

:: Test 10: Generate Test Report
echo %YELLOW%Test 10: Generating Test Report...%NC%
echo ======================================== > api_test_report.txt
echo ARTISAN BAZAAR API TEST REPORT >> api_test_report.txt
echo Generated: %date% %time% >> api_test_report.txt
echo ======================================== >> api_test_report.txt
echo. >> api_test_report.txt

echo ENDPOINTS TESTED: >> api_test_report.txt
echo - GET /api/products >> api_test_report.txt
echo - GET /api/exchange-rates >> api_test_report.txt
echo - POST /api/auth/login >> api_test_report.txt
echo - GET /api/users (protected) >> api_test_report.txt
echo - GET /api/orders (protected) >> api_test_report.txt
echo - GET /api/auth/user (protected) >> api_test_report.txt
echo. >> api_test_report.txt

echo CONFIGURATION CHECKED: >> api_test_report.txt
echo - Laravel server status >> api_test_report.txt
echo - Angular server status >> api_test_report.txt
echo - Database connection >> api_test_report.txt
echo - CORS configuration >> api_test_report.txt
echo - File upload setup >> api_test_report.txt
echo - Email configuration >> api_test_report.txt
echo. >> api_test_report.txt

if exist temp_login.json (
    echo ADMIN LOGIN RESPONSE: >> api_test_report.txt
    type temp_login.json >> api_test_report.txt
    echo. >> api_test_report.txt
)

echo %GREEN%✓ Test report saved to api_test_report.txt%NC%
echo.

:: Cleanup
del temp_*.json >nul 2>&1

:: Summary
echo =======================================================
echo                    TEST SUMMARY
echo =======================================================
echo.
echo %BLUE%Tests completed! Check the results above.%NC%
echo.
echo %YELLOW%Next Steps:%NC%
echo 1. If any tests failed, fix the issues shown
echo 2. Start both servers if they're not running:
echo    - Backend: php artisan serve --host=127.0.0.1 --port=8000
echo    - Frontend: ng serve --port 4201
echo 3. Check api_test_report.txt for detailed results
echo 4. Test the frontend at %FRONTEND_URL%
echo.

echo %BLUE%Quick Start Commands:%NC%
echo Backend: cd artisan-bazaar-backend ^&^& php artisan serve --host=127.0.0.1 --port=8000
echo Frontend: cd artisan-bazaar ^&^& ng serve --port 4201
echo.

pause
