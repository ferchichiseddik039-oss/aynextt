# Script PowerShell pour déploiement 100% GRATUIT
Write-Host "🆓 Déploiement 100% GRATUIT de votre boutique en ligne" -ForegroundColor Green
Write-Host ""

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "✅ Git version: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé. Installez-le depuis https://git-scm.com" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Installez-le depuis https://nodejs.org" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""

# Construire le frontend
Write-Host "🏗️  Construction du frontend..." -ForegroundColor Blue
Set-Location "client"
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Blue
    npm install
}
npm run build
Set-Location ".."

# Initialiser Git si nécessaire
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initialisation de Git..." -ForegroundColor Blue
    git init
    git branch -M main
}

# Ajouter tous les fichiers
Write-Host "📝 Ajout des fichiers à Git..." -ForegroundColor Blue
git add .

# Commit
Write-Host "💾 Sauvegarde des modifications..." -ForegroundColor Blue
git commit -m "Ready for free deployment - Boutique production ready"

Write-Host ""
Write-Host "🚀 ÉTAPES SUIVANTES :" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 📋 Créez un compte GitHub : https://github.com" -ForegroundColor Cyan
Write-Host "2. 🗄️  Créez un compte MongoDB Atlas : https://mongodb.com/atlas" -ForegroundColor Cyan
Write-Host "3. 🌐 Créez un compte Vercel : https://vercel.com" -ForegroundColor Cyan
Write-Host "4. 📖 Suivez le guide : DEPLOIEMENT-GRATUIT-COMPLET.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Votre boutique sera en ligne en moins de 1h30, 100% GRATUIT !" -ForegroundColor Green
Write-Host ""

# Demander si l'utilisateur veut pousser vers GitHub
$pushGitHub = Read-Host "Voulez-vous pousser vers GitHub maintenant ? (y/n)"
if ($pushGitHub -eq "y" -or $pushGitHub -eq "Y") {
    Write-Host ""
    Write-Host "📤 Poussez vers GitHub..." -ForegroundColor Blue
    Write-Host "⚠️  Vous devez d'abord configurer votre repository GitHub" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/VOTRE-USERNAME/boutique-vetements.git" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Après avoir configuré le remote, exécutez :" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "📋 Pour pousser plus tard, exécutez :" -ForegroundColor Cyan
    Write-Host "   git remote add origin https://github.com/VOTRE-USERNAME/boutique-vetements.git" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Préparation terminée ! Suivez le guide DEPLOIEMENT-GRATUIT-COMPLET.md" -ForegroundColor Green
Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"
