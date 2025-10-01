Write-Host "🚀 Démarrage Complet de la Boutique de Vêtements" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Arrêter tous les processus Node.js
Write-Host "🛑 Arrêt de tous les processus Node.js..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Démarrer le backend
Write-Host "📡 Démarrage du serveur backend..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/k", "npm run dev" -WindowStyle Normal

# Attendre que le backend démarre
Write-Host "⏳ Attente de 10 secondes pour le démarrage du backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Réparer le frontend
Write-Host "🔧 Réparation du frontend..." -ForegroundColor Cyan
Set-Location "client"

# Nettoyer les fichiers de configuration
Write-Host "🧹 Nettoyage des fichiers de configuration..." -ForegroundColor Yellow
Remove-Item ".env" -ErrorAction SilentlyContinue
Remove-Item ".env.local" -ErrorAction SilentlyContinue

# Créer une configuration stable
Write-Host "📝 Création de la configuration stable..." -ForegroundColor Yellow
@"
SKIP_PREFLIGHT_CHECK=true
GENERATE_SOURCEMAP=false
CHOKIDAR_USEPOLLING=true
FAST_REFRESH=false
"@ | Out-File -FilePath ".env.local" -Encoding UTF8

# Démarrer le frontend
Write-Host "🌐 Démarrage du frontend React..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/k", "npm start" -WindowStyle Normal

# Retourner au répertoire racine
Set-Location ".."

Write-Host ""
Write-Host "✅ Application en cours de démarrage !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Informations importantes:" -ForegroundColor White
Write-Host "🌐 Backend: http://localhost:5000" -ForegroundColor Blue
Write-Host "🎨 Frontend: http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "📋 Identifiants de test:" -ForegroundColor White
Write-Host "👤 Admin - Email: admin@boutiquevetements.fr" -ForegroundColor Yellow
Write-Host "🔑 Mot de passe: admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Notes importantes:" -ForegroundColor Red
Write-Host "- Le frontend peut prendre 2-3 minutes à démarrer" -ForegroundColor Gray
Write-Host "- Si le frontend ne démarre pas, utilisez: fix-frontend.bat" -ForegroundColor Gray
Write-Host "- Le backend est déjà connecté à MongoDB Atlas" -ForegroundColor Gray
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
