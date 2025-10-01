@echo off
echo 🔧 Réparation du Frontend React
echo ================================
echo.

echo 🛑 Arrêt des processus Node.js...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo 🧹 Nettoyage des fichiers de configuration...
cd client
if exist .env del .env
if exist .env.local del .env.local

echo 📦 Réinstallation des dépendances...
rmdir /s /q node_modules
del package-lock.json
npm install

echo 🔧 Création de la configuration minimale...
echo SKIP_PREFLIGHT_CHECK=true > .env.local
echo GENERATE_SOURCEMAP=false >> .env.local

echo 🚀 Démarrage du frontend...
npm start

echo.
echo ✅ Frontend réparé et démarré !
echo 🌐 Accès: http://localhost:3000
echo.
pause
