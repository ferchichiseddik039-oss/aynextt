@echo off
echo 🚀 Démarrage de la Boutique de Vêtements
echo ========================================
echo.

echo 🛑 Arrêt des processus Node.js existants...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 📡 Démarrage du serveur backend...
start "Backend Server" cmd /k "npm run dev"

echo ⏳ Attente de 8 secondes pour le démarrage du backend...
timeout /t 8 /nobreak >nul

echo 🌐 Démarrage du frontend React...
start "Frontend React" cmd /k "cd client && npm start"

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
echo ⚠️  Note: Le frontend peut prendre 1-2 minutes à démarrer
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
