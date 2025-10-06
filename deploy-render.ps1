Write-Host "🚀 DÉPLOIEMENT RENDER - APPLICATION UNIFIÉE" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 VÉRIFICATION PRÉ-DÉPLOIEMENT..." -ForegroundColor Yellow
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Erreur: server.js non trouvé" -ForegroundColor Red
    Write-Host "Veuillez exécuter ce script depuis le dossier boutique-unified"
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json non trouvé" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

Write-Host "✅ Fichiers principaux trouvés" -ForegroundColor Green
Write-Host ""

Write-Host "🔧 VÉRIFICATION DES DÉPENDANCES..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🏗️ BUILD DE L'APPLICATION..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

Write-Host "✅ Build réussi" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 OUVERTURE DU GUIDE DE DÉPLOIEMENT..." -ForegroundColor Yellow
Start-Process "DEPLOIEMENT-RENDER-COMPLET.md"

Write-Host ""
Write-Host "📋 ÉTAPES SUIVANTES :" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 🌐 Allez sur https://render.com" -ForegroundColor White
Write-Host "2. 📦 Créez un nouveau Web Service" -ForegroundColor White
Write-Host "3. 🔗 Connectez le repository : ferchichiseddik039-oss/boutique-unified-aynext" -ForegroundColor White
Write-Host "4. ⚙️ Utilisez la configuration du guide" -ForegroundColor White
Write-Host "5. 🔑 Ajoutez les variables d'environnement" -ForegroundColor White
Write-Host "6. 🚀 Déployez !" -ForegroundColor White
Write-Host ""
Write-Host "🎯 URL finale : https://boutique-aynext-unified.onrender.com" -ForegroundColor Green
Write-Host ""
Read-Host "Appuyez sur Entrée pour continuer"
