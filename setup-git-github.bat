@echo off
echo 🔧 Configuration Git et GitHub pour votre boutique
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git n'est pas installé. Installez-le depuis https://git-scm.com
    pause
    exit /b 1
)

echo ✅ Git est installé
echo.

REM Configuration Git
echo 📝 Configuration de Git...
git config user.name "ferchichiseddik039-oss"
git config user.email "ferchichiseddik039@gmail.com"

REM Initialiser Git si nécessaire
if not exist .git (
    echo 📁 Initialisation de Git...
    git init
)

REM Configurer le remote
echo 🔗 Configuration du remote GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/ferchichiseddik039-oss/AYNEXT2.git

REM Ajouter tous les fichiers
echo 📦 Ajout des fichiers...
git add .

REM Commit
echo 💾 Sauvegarde des modifications...
git commit -m "Initial commit - Boutique vêtements prête pour production"

echo.
echo 🚀 INSTRUCTIONS POUR PUSH VERS GITHUB :
echo.
echo 1. Allez sur https://github.com/ferchichiseddik039-oss/AYNEXT2
echo 2. Vérifiez que le repository existe et est vide
echo 3. Si le repository n'existe pas, créez-le sur GitHub
echo 4. Vérifiez que votre token GitHub a les permissions :
echo    - repo (accès complet aux repositories)
echo    - workflow (si vous voulez utiliser GitHub Actions)
echo.
echo 5. Essayez le push avec cette commande :
echo    git push -u origin main
echo.
echo 6. Si ça ne marche pas, utilisez cette commande avec votre token :
echo    git push https://ferchichiseddik039-oss:VOTRE_TOKEN@github.com/ferchichiseddik039-oss/AYNEXT2.git main
echo.

REM Essayer le push
echo 🔄 Tentative de push vers GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Push échoué. Vérifiez :
    echo    1. Le repository existe sur GitHub
    echo    2. Votre token a les bonnes permissions
    echo    3. Vous êtes connecté à GitHub
    echo.
    echo 💡 Solutions :
    echo    - Créez le repository sur GitHub s'il n'existe pas
    echo    - Régénérez un token avec les permissions 'repo'
    echo    - Utilisez GitHub Desktop ou l'interface web
) else (
    echo.
    echo ✅ Push réussi ! Votre boutique est maintenant sur GitHub
    echo 🌐 Repository : https://github.com/ferchichiseddik039-oss/AYNEXT2
)

echo.
pause
