@echo off
echo 🆓 Déploiement 100%% GRATUIT de votre boutique en ligne
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git n'est pas installé. Installez-le depuis https://git-scm.com
    pause
    exit /b 1
)

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé. Installez-le depuis https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Git et Node.js sont installés
echo.

REM Construire le frontend
echo 🏗️  Construction du frontend...
cd client
if not exist node_modules (
    echo 📦 Installation des dépendances frontend...
    npm install
)
npm run build
cd ..

REM Initialiser Git si nécessaire
if not exist .git (
    echo 📁 Initialisation de Git...
    git init
    git branch -M main
)

REM Ajouter tous les fichiers
echo 📝 Ajout des fichiers à Git...
git add .

REM Commit
echo 💾 Sauvegarde des modifications...
git commit -m "Ready for free deployment - Boutique production ready"

echo.
echo 🚀 ÉTAPES SUIVANTES :
echo.
echo 1. 📋 Créez un compte GitHub : https://github.com
echo 2. 🗄️  Créez un compte MongoDB Atlas : https://mongodb.com/atlas
echo 3. 🌐 Créez un compte Vercel : https://vercel.com
echo 4. 📖 Suivez le guide : DEPLOIEMENT-GRATUIT-COMPLET.md
echo.
echo 💡 Votre boutique sera en ligne en moins de 1h30, 100%% GRATUIT !
echo.

REM Demander si l'utilisateur veut pousser vers GitHub
set /p push_github="Voulez-vous pousser vers GitHub maintenant ? (y/n): "
if /i "%push_github%"=="y" (
    echo.
    echo 📤 Poussez vers GitHub...
    echo ⚠️  Vous devez d'abord configurer votre repository GitHub
    echo    git remote add origin https://github.com/VOTRE-USERNAME/boutique-vetements.git
    echo    git push -u origin main
    echo.
    echo 🔗 Après avoir configuré le remote, exécutez :
    echo    git push -u origin main
) else (
    echo.
    echo 📋 Pour pousser plus tard, exécutez :
    echo    git remote add origin https://github.com/VOTRE-USERNAME/boutique-vetements.git
    echo    git push -u origin main
)

echo.
echo ✅ Préparation terminée ! Suivez le guide DEPLOIEMENT-GRATUIT-COMPLET.md
echo.
pause
