@echo off
echo ========================================
echo   Mise a jour du nom de la boutique
echo   SHADOWHOOD -> AYNEXT
echo ========================================
echo.

echo Demarrage de MongoDB...
net start MongoDB 2>nul
if %errorlevel% neq 0 (
    echo MongoDB est deja demarre ou n'est pas installe en tant que service
)

echo.
echo Mise a jour de la base de donnees...
node scripts/force-update-shop-name.js

echo.
echo ========================================
echo   Mise a jour terminee !
echo ========================================
pause
