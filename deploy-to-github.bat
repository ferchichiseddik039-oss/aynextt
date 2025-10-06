@echo off
echo ========================================
echo   DEPLOIEMENT VERS GITHUB
echo ========================================
echo.
echo Veuillez entrer l'URL de votre repository GitHub :
echo (exemple: https://github.com/VOTRE_USERNAME/boutique-unified-aynext.git)
echo.
set /p GITHUB_URL="URL du repository : "

echo.
echo Ajout du remote GitHub...
git remote add origin %GITHUB_URL%

echo.
echo Changement vers la branche main...
git branch -M main

echo.
echo Push vers GitHub...
git push -u origin main

echo.
echo ========================================
echo   DEPLOIEMENT TERMINE !
echo ========================================
echo.
echo Votre code est maintenant sur GitHub !
echo.
echo Prochaines etapes :
echo 1. Allez sur https://render.com
echo 2. Connectez votre repository GitHub
echo 3. Deployez votre application
echo.
pause
