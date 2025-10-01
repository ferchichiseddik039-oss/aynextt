@echo off
echo ========================================
echo   INITIALISATION DES PARAMETRES
echo ========================================
echo.
echo Ce script va initialiser les parametres de la boutique
echo avec des valeurs par defaut.
echo.
echo Appuyez sur une touche pour continuer...
pause >nul

echo.
echo Lancement de l'initialisation...
node scripts/init-settings.js

echo.
echo Appuyez sur une touche pour fermer...
pause >nul
