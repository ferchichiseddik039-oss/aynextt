# Script PowerShell pour le déploiement Netlify
# Boutique de Vêtements

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOIEMENT NETLIFY - BOUTIQUE VETEMENTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Préparation du build pour Netlify..." -ForegroundColor Yellow
node build-netlify.js

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erreur lors de la préparation du build" -ForegroundColor Red
    Write-Host "Veuillez vérifier les erreurs ci-dessus" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

Write-Host ""
Write-Host "[2/3] Build terminé avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "[3/3] Instructions de déploiement :" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 ÉTAPES POUR NETLIFY :" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur https://netlify.com" -ForegroundColor White
Write-Host "2. Connectez-vous ou créez un compte" -ForegroundColor White
Write-Host "3. Glissez-déposez le dossier 'client\build' sur la zone de déploiement" -ForegroundColor White
Write-Host "4. Attendez que le déploiement se termine" -ForegroundColor White
Write-Host ""
Write-Host "⚙️ CONFIGURATION REQUISE :" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dans le dashboard Netlify, ajoutez ces variables d'environnement :" -ForegroundColor White
Write-Host "- REACT_APP_API_URL = https://votre-backend.herokuapp.com" -ForegroundColor White
Write-Host "- REACT_APP_ENVIRONMENT = production" -ForegroundColor White
Write-Host ""
Write-Host "📁 Le dossier 'client\build' est prêt pour le déploiement !" -ForegroundColor Green
Write-Host ""

$response = Read-Host "Voulez-vous ouvrir le dossier build maintenant ? (o/n)"
if ($response -eq "o" -or $response -eq "O" -or $response -eq "oui") {
    Start-Process "explorer.exe" -ArgumentList "client\build"
}

Write-Host ""
Write-Host "✅ Préparation terminée !" -ForegroundColor Green
Write-Host "Consultez GUIDE-DEPLOIEMENT-NETLIFY.md pour plus de détails" -ForegroundColor Yellow
Write-Host ""
Read-Host "Appuyez sur Entrée pour continuer"
