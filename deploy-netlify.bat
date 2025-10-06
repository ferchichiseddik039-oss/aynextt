@echo off
echo ========================================
echo   DEPLOIEMENT NETLIFY - BOUTIQUE VETEMENTS
echo ========================================
echo.

echo [1/3] Preparation du build pour Netlify...
node build-netlify.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Erreur lors de la preparation du build
    echo Veuillez verifier les erreurs ci-dessus
    pause
    exit /b 1
)

echo.
echo [2/3] Build termine avec succes !
echo.
echo [3/3] Instructions de deploiement :
echo.
echo 🌐 ETAPES POUR NETLIFY :
echo.
echo 1. Allez sur https://netlify.com
echo 2. Connectez-vous ou creez un compte
echo 3. Glissez-deposez le dossier 'client\build' sur la zone de deploiement
echo 4. Attendez que le deploiement se termine
echo.
echo ⚙️ CONFIGURATION REQUISE :
echo.
echo Dans le dashboard Netlify, ajoutez ces variables d'environnement :
echo - REACT_APP_API_URL = https://votre-backend.herokuapp.com
echo - REACT_APP_ENVIRONMENT = production
echo.
echo 📁 Le dossier 'client\build' est pret pour le deploiement !
echo.
echo Appuyez sur une touche pour ouvrir le dossier build...
pause >nul

start explorer "client\build"

echo.
echo ✅ Preparation terminee !
echo Consultez GUIDE-DEPLOIEMENT-NETLIFY.md pour plus de details
echo.
pause
