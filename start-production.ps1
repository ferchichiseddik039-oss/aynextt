# Script PowerShell pour démarrer la boutique en mode production
Write-Host "🚀 Démarrage de la boutique en mode production..." -ForegroundColor Green
Write-Host ""

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Vérifier si le fichier .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Fichier .env manquant. Création depuis env.production.example..." -ForegroundColor Yellow
    Copy-Item "env.production.example" ".env"
    Write-Host "✅ Fichier .env créé. Veuillez le modifier avec vos vraies valeurs." -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Ouvrez le fichier .env et modifiez les valeurs suivantes :" -ForegroundColor Cyan
    Write-Host "   - MONGODB_URI : Votre URI MongoDB Atlas" -ForegroundColor White
    Write-Host "   - JWT_SECRET : Un secret sécurisé" -ForegroundColor White
    Write-Host "   - CLIENT_URL : Votre domaine (ex: https://votre-domaine.com)" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour continuer"
}

# Installer les dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Blue
    npm install
}

# Construire le frontend
Write-Host "🏗️  Construction du frontend..." -ForegroundColor Blue
Set-Location "client"
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Blue
    npm install
}
npm run build
Set-Location ".."

# Démarrer l'application
Write-Host "🚀 Démarrage de l'application..." -ForegroundColor Green
Write-Host ""
Write-Host "📊 L'application sera accessible sur : http://localhost:5000" -ForegroundColor Cyan
Write-Host "🔧 Mode : Production" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter l'application" -ForegroundColor Yellow
Write-Host ""

$env:NODE_ENV = "production"
node server.js

Read-Host "Appuyez sur Entrée pour quitter"
