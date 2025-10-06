@echo off
echo 🚀 DÉPLOIEMENT RENDER - APPLICATION UNIFIÉE
echo ================================================

echo.
echo 📋 VÉRIFICATION PRÉ-DÉPLOIEMENT...
echo.

REM Vérifier que nous sommes dans le bon répertoire
if not exist "server.js" (
    echo ❌ Erreur: server.js non trouvé
    echo Veuillez exécuter ce script depuis le dossier boutique-unified
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ❌ Erreur: package.json non trouvé
    pause
    exit /b 1
)

echo ✅ Fichiers principaux trouvés
echo.

echo 🔧 VÉRIFICATION DES DÉPENDANCES...
if exist "node_modules" (
    echo ✅ node_modules existe
) else (
    echo 📦 Installation des dépendances...
    npm install
)

echo.
echo 🏗️ BUILD DE L'APPLICATION...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo ✅ Build réussi
echo.

echo 🌐 OUVERTURE DU GUIDE DE DÉPLOIEMENT...
start DEPLOIEMENT-RENDER-COMPLET.md

echo.
echo 📋 ÉTAPES SUIVANTES :
echo.
echo 1. 🌐 Allez sur https://render.com
echo 2. 📦 Créez un nouveau Web Service
echo 3. 🔗 Connectez le repository : ferchichiseddik039-oss/boutique-unified-aynext
echo 4. ⚙️ Utilisez la configuration du guide
echo 5. 🔑 Ajoutez les variables d'environnement
echo 6. 🚀 Déployez !
echo.
echo 🎯 URL finale : https://boutique-aynext-unified.onrender.com
echo.
pause
