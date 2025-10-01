Write-Host "🚀 Démarrage de la Boutique de Vêtements" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Arrêter les processus Node.js existants
Write-Host "🛑 Arrêt des processus Node.js existants..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Démarrer le backend
Write-Host "📡 Démarrage du serveur backend..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/k", "npm run dev" -WindowStyle Normal

# Attendre que le backend démarre
Write-Host "⏳ Attente de 8 secondes pour le démarrage du backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Démarrer le frontend
Write-Host "🌐 Démarrage du frontend React..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd client && npm start" -WindowStyle Normal

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
Write-Host "⚠️  Note: Le frontend peut prendre 1-2 minutes à démarrer" -ForegroundColor Red
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
