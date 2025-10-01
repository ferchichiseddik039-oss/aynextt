Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    CONFIGURATION ADMIN BOUTIQUE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Suppression du compte admin par défaut..." -ForegroundColor Yellow
node scripts/remove-default-admin.js
Write-Host ""

Write-Host "[2/3] Vérification de la configuration..." -ForegroundColor Yellow
node scripts/setup-admin.js
Write-Host ""

Write-Host "[3/3] Démarrage de l'application..." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Configuration terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Instructions :" -ForegroundColor Blue
Write-Host "    1. Visitez http://localhost:3000/admin/setup" -ForegroundColor White
Write-Host "    2. Créez votre compte admin unique" -ForegroundColor White
Write-Host "    3. Connectez-vous via http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Démarrage du serveur..." -ForegroundColor Green
npm start
