#!/usr/bin/env node

/**
 * Script de build optimisé pour Netlify
 * Ce script prépare le projet pour le déploiement sur Netlify
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage du build Netlify...');

try {
  // 1. Installer les dépendances du client
  console.log('📦 Installation des dépendances du client...');
  execSync('cd client && npm install', { stdio: 'inherit' });

  // 2. Créer le fichier .env pour la production si il n'existe pas
  const envPath = path.join(__dirname, 'client', '.env.production');
  if (!fs.existsSync(envPath)) {
    console.log('⚙️ Création du fichier .env.production...');
    const envContent = `# Configuration pour l'environnement de production
REACT_APP_API_URL=${process.env.REACT_APP_API_URL || 'https://votre-backend.herokuapp.com'}
REACT_APP_ENVIRONMENT=production
`;
    fs.writeFileSync(envPath, envContent);
  }

  // 3. Build du client React
  console.log('🔨 Build du client React...');
  execSync('cd client && npm run build', { stdio: 'inherit' });

  // 4. Vérifier que le build a réussi
  const buildPath = path.join(__dirname, 'client', 'build');
  if (!fs.existsSync(buildPath)) {
    throw new Error('Le build a échoué - le dossier build n\'existe pas');
  }

  // 5. Créer un fichier _redirects pour Netlify (fallback pour SPA)
  const redirectsPath = path.join(buildPath, '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    console.log('📝 Création du fichier _redirects...');
    fs.writeFileSync(redirectsPath, '/*    /index.html   200');
  }

  // 6. Créer un fichier _headers pour les headers de sécurité
  const headersPath = path.join(buildPath, '_headers');
  if (!fs.existsSync(headersPath)) {
    console.log('🔒 Création du fichier _headers...');
    const headersContent = `/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000

/*.jpg
  Cache-Control: public, max-age=31536000

/*.jpeg
  Cache-Control: public, max-age=31536000

/*.svg
  Cache-Control: public, max-age=31536000

/*.css
  Cache-Control: public, max-age=31536000

/*.js
  Cache-Control: public, max-age=31536000
`;
    fs.writeFileSync(headersPath, headersContent);
  }

  console.log('✅ Build Netlify terminé avec succès !');
  console.log('📁 Les fichiers sont prêts dans le dossier client/build/');
  console.log('🌐 Vous pouvez maintenant déployer sur Netlify');

} catch (error) {
  console.error('❌ Erreur lors du build Netlify:', error.message);
  process.exit(1);
}
