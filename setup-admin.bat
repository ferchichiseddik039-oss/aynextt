@echo off
echo ========================================
echo    CONFIGURATION ADMIN BOUTIQUE
echo ========================================
echo.

echo [1/3] Suppression du compte admin par defaut...
node scripts/remove-default-admin.js
echo.

echo [2/3] Verification de la configuration...
node scripts/setup-admin.js
echo.

echo [3/3] Demarrage de l'application...
echo.
echo ✅ Configuration terminee !
echo.
echo 📋 Instructions :
echo    1. Visitez http://localhost:3000/admin/setup
echo    2. Creez votre compte admin unique
echo    3. Connectez-vous via http://localhost:3000/admin/login
echo.
echo 🚀 Demarrage du serveur...
npm start
