@echo off
echo 🚀 Démarrage de la Boutique de Vêtements
echo ========================================
echo.

echo 📡 Démarrage du serveur backend...
start "Backend Server" cmd /k "npm run dev"

echo ⏳ Attente de 5 secondes pour le démarrage du backend...
timeout /t 5 /nobreak > nul

echo 🌐 Démarrage du frontend React...
start "Frontend React" cmd /k "cd client && npm start"

echo.
echo ✅ Application démarrée !
echo 🌐 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:3000
echo.
echo 📋 Identifiants de test:
echo 👤 Admin - Email: admin@boutiquevetements.fr
echo 🔑 Mot de passe: admin123
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause > nul
