#!/usr/bin/env node

/**
 * Script de déploiement en production pour la boutique en ligne
 * Ce script prépare l'application pour la production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Démarrage du déploiement en production...\n');

// Vérifier que nous sommes en mode production
if (process.env.NODE_ENV !== 'production') {
  console.log('⚠️  Attention: NODE_ENV n\'est pas défini sur "production"');
  console.log('   Le script va continuer mais vérifiez votre configuration.\n');
}

// 1. Vérifier les variables d'environnement
console.log('📋 Vérification des variables d\'environnement...');
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'SESSION_SECRET',
  'CLIENT_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:', missingVars.join(', '));
  console.error('   Créez un fichier .env avec ces variables avant de continuer.');
  process.exit(1);
}
console.log('✅ Variables d\'environnement OK\n');

// 2. Installer les dépendances
console.log('📦 Installation des dépendances...');
try {
  execSync('npm install --production', { stdio: 'inherit' });
  console.log('✅ Dépendances backend installées\n');
} catch (error) {
  console.error('❌ Erreur lors de l\'installation des dépendances backend:', error.message);
  process.exit(1);
}

// 3. Installer et construire le frontend
console.log('🏗️  Construction du frontend...');
try {
  execSync('cd client && npm install', { stdio: 'inherit' });
  execSync('cd client && npm run build', { stdio: 'inherit' });
  console.log('✅ Frontend construit avec succès\n');
} catch (error) {
  console.error('❌ Erreur lors de la construction du frontend:', error.message);
  process.exit(1);
}

// 4. Vérifier la structure des fichiers
console.log('🔍 Vérification de la structure des fichiers...');
const requiredFiles = [
  'client/build/index.html',
  'client/build/static',
  'server.js',
  'package.json'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Fichiers manquants:', missingFiles.join(', '));
  process.exit(1);
}
console.log('✅ Structure des fichiers OK\n');

// 5. Créer le fichier de démarrage de production
console.log('📝 Création du script de démarrage...');
const startScript = `#!/bin/bash
# Script de démarrage en production
export NODE_ENV=production
export PORT=\${PORT:-5000}

echo "🚀 Démarrage de la boutique en ligne en production..."
echo "📊 Port: $PORT"
echo "🌍 Environnement: $NODE_ENV"

# Démarrer l'application
node server.js
`;

fs.writeFileSync('start-production.sh', startScript);
fs.chmodSync('start-production.sh', '755');
console.log('✅ Script de démarrage créé\n');

// 6. Créer le fichier de configuration PM2 (optionnel)
console.log('📝 Création de la configuration PM2...');
const pm2Config = {
  apps: [{
    name: 'boutique-vetements',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};

fs.writeFileSync('ecosystem.config.js', `module.exports = ${JSON.stringify(pm2Config, null, 2)}`);
console.log('✅ Configuration PM2 créée\n');

// 7. Créer le dossier logs
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
  console.log('📁 Dossier logs créé\n');
}

// 8. Instructions finales
console.log('🎉 Déploiement préparé avec succès!\n');
console.log('📋 Prochaines étapes:');
console.log('   1. Configurez votre serveur (VPS, Heroku, etc.)');
console.log('   2. Uploadez tous les fichiers sur votre serveur');
console.log('   3. Installez les dépendances: npm install --production');
console.log('   4. Démarrez l\'application: ./start-production.sh');
console.log('   5. Configurez un reverse proxy (Nginx) si nécessaire');
console.log('   6. Configurez SSL avec Let\'s Encrypt');
console.log('   7. Soumettez votre sitemap à Google Search Console\n');

console.log('🔧 Commandes utiles:');
console.log('   - Démarrage simple: node server.js');
console.log('   - Avec PM2: pm2 start ecosystem.config.js');
console.log('   - Logs PM2: pm2 logs boutique-vetements');
console.log('   - Redémarrage PM2: pm2 restart boutique-vetements\n');

console.log('🌐 SEO et Google:');
console.log('   - Soumettez votre sitemap: https://votre-domaine.com/sitemap.xml');
console.log('   - Configurez Google Search Console');
console.log('   - Vérifiez Google Analytics');
console.log('   - Testez avec Google PageSpeed Insights\n');

console.log('✅ Déploiement terminé!');
