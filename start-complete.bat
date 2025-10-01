@echo off
echo 🚀 Démarrage Complet de la Boutique de Vêtements
echo ================================================
echo.

echo 🛑 Arrêt de tous les processus Node.js...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo 📡 Démarrage du serveur backend...
start "Backend Server" cmd /k "npm run dev"

echo ⏳ Attente de 10 secondes pour le démarrage du backend...
timeout /t 10 /nobreak >nul

echo 🔧 Réparation du frontend...
cd client

echo 🧹 Nettoyage des fichiers de configuration...
if exist .env del .env
if exist .env.local del .env.local

echo 📝 Création de la configuration stable...
echo SKIP_PREFLIGHT_CHECK=true > .env.local
echo GENERATE_SOURCEMAP=false >> .env.local
echo CHOKIDAR_USEPOLLING=true >> .env.local
echo FAST_REFRESH=false >> .env.local

echo 🌐 Démarrage du frontend React...
start "Frontend React" cmd /k "npm start"

cd ..

echo.
echo ✅ Application en cours de démarrage !
echo.
echo 📋 Informations importantes:
echo 🌐 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:3000
echo.
echo 📋 Identifiants de test:
echo 👤 Admin - Email: admin@boutiquevetements.fr
echo 🔑 Mot de passe: admin123
echo.
echo ⚠️  Notes importantes:
echo - Le frontend peut prendre 2-3 minutes à démarrer
echo - Si le frontend ne démarre pas, utilisez: fix-frontend.bat
echo - Le backend est déjà connecté à MongoDB Atlas
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
