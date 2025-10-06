@echo off
echo ========================================
echo   DEPLOIEMENT INFINITYFREE - BOUTIQUE VETEMENTS
echo ========================================
echo.

echo [1/4] Verification du build React...
if not exist "client\build\index.html" (
    echo ❌ Le fichier index.html n'existe pas dans client\build\
    echo Veuillez d'abord executer: npm run build
    pause
    exit /b 1
)

echo [2/4] Creation du dossier de deploiement InfinityFree...
if exist "infinityfree-deploy" (
    echo Suppression de l'ancien dossier...
    rmdir /s /q "infinityfree-deploy"
)
mkdir "infinityfree-deploy"

echo [3/4] Copie des fichiers du build...
xcopy "client\build\*" "infinityfree-deploy\" /E /I /H /Y

echo [4/4] Verification des fichiers essentiels...
if not exist "infinityfree-deploy\index.html" (
    echo ❌ Erreur: index.html manquant
    pause
    exit /b 1
)

echo.
echo ✅ DEPLOIEMENT PREPARE AVEC SUCCES !
echo.
echo 📁 INSTRUCTIONS POUR INFINITYFREE :
echo.
echo 1. Connectez-vous a votre panel InfinityFree
echo 2. Allez dans "File Manager"
echo 3. Naviguez vers le dossier "htdocs"
echo 4. Supprimez TOUS les fichiers existants dans htdocs
echo 5. Uploadez TOUS les fichiers du dossier "infinityfree-deploy"
echo    (ou glissez-deposez le contenu du dossier)
echo.
echo 📋 FICHIERS A UPLOADER :
echo    - index.html (OBLIGATOIRE)
echo    - static\ (dossier avec CSS et JS)
echo    - Tous les autres fichiers du dossier
echo.
echo ⚠️  IMPORTANT :
echo    - Uploadez le CONTENU du dossier, pas le dossier lui-meme
echo    - Le fichier index.html doit etre directement dans htdocs
echo    - Votre backend doit etre heberge ailleurs (Heroku, Railway, etc.)
echo.
echo 🔗 CONFIGURATION BACKEND :
echo    Mettez a jour REACT_APP_API_URL dans votre .env de production
echo    avec l'URL de votre backend heberge
echo.

echo Appuyez sur une touche pour ouvrir le dossier de deploiement...
pause >nul

start explorer "infinityfree-deploy"

echo.
echo ✅ Preparation terminee !
echo Le dossier "infinityfree-deploy" contient tous les fichiers a uploader
echo.
pause
