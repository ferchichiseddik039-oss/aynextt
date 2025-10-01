@echo off
echo 🚀 Démarrage de la boutique en mode production...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org
    pause
    exit /b 1
)

REM Vérifier si le fichier .env existe
if not exist .env (
    echo ⚠️  Fichier .env manquant. Création depuis env.production.example...
    copy env.production.example .env
    echo ✅ Fichier .env créé. Veuillez le modifier avec vos vraies valeurs.
    echo.
    echo 📝 Ouvrez le fichier .env et modifiez les valeurs suivantes :
    echo    - MONGODB_URI : Votre URI MongoDB Atlas
    echo    - JWT_SECRET : Un secret sécurisé
    echo    - CLIENT_URL : Votre domaine (ex: https://votre-domaine.com)
    echo.
    pause
)

REM Installer les dépendances si nécessaire
if not exist node_modules (
    echo 📦 Installation des dépendances backend...
    npm install
)

REM Construire le frontend
echo 🏗️  Construction du frontend...
cd client
if not exist node_modules (
    echo 📦 Installation des dépendances frontend...
    npm install
)
npm run build
cd ..

REM Démarrer l'application
echo 🚀 Démarrage de l'application...
echo.
echo 📊 L'application sera accessible sur : http://localhost:5000
echo 🔧 Mode : Production
echo.
echo Appuyez sur Ctrl+C pour arrêter l'application
echo.

set NODE_ENV=production
node server.js

pause
