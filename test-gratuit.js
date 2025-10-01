#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration de déploiement gratuit
 */

const fs = require('fs');
const path = require('path');

console.log('🆓 Test de configuration pour déploiement GRATUIT...\n');

// Couleurs pour la console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 1. Vérifier les fichiers essentiels pour le déploiement gratuit
log('📁 Vérification des fichiers pour déploiement gratuit...', 'blue');
const essentialFiles = [
  'server.js',
  'package.json',
  'vercel.json',
  'client/build/index.html',
  'client/build/static',
  'client/public/robots.txt',
  'client/public/sitemap.xml'
];

let allFilesExist = true;
essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    log(`✅ ${file}`, 'green');
  } else {
    log(`❌ ${file} - MANQUANT`, 'red');
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  log('\n❌ Certains fichiers essentiels sont manquants.', 'red');
  log('   Construisez d\'abord le frontend : cd client && npm run build', 'yellow');
}

// 2. Vérifier la configuration Vercel
log('\n🌐 Vérification de la configuration Vercel...', 'blue');
if (fs.existsSync('vercel.json')) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    log('✅ vercel.json configuré', 'green');
    
    if (vercelConfig.builds && vercelConfig.routes) {
      log('✅ Configuration builds et routes OK', 'green');
    } else {
      log('⚠️  Configuration builds/routes manquante', 'yellow');
    }
  } catch (error) {
    log('❌ Erreur dans vercel.json', 'red');
  }
} else {
  log('❌ vercel.json manquant', 'red');
}

// 3. Vérifier les métadonnées SEO
log('\n🔍 Vérification des métadonnées SEO...', 'blue');
const indexPath = path.join(__dirname, 'client', 'build', 'index.html');
if (fs.existsSync(indexPath)) {
  const htmlContent = fs.readFileSync(indexPath, 'utf8');
  
  const seoChecks = [
    { name: 'Meta description', pattern: /<meta name="description"/ },
    { name: 'Meta keywords', pattern: /<meta name="keywords"/ },
    { name: 'Open Graph title', pattern: /<meta property="og:title"/ },
    { name: 'Twitter Card', pattern: /<meta name="twitter:card"/ },
    { name: 'Structured Data', pattern: /<script type="application\/ld\+json"/ },
    { name: 'Canonical URL', pattern: /<link rel="canonical"/ }
  ];
  
  let seoScore = 0;
  seoChecks.forEach(check => {
    if (check.pattern.test(htmlContent)) {
      log(`✅ ${check.name}`, 'green');
      seoScore++;
    } else {
      log(`❌ ${check.name} - MANQUANT`, 'red');
    }
  });
  
  log(`\n📊 Score SEO: ${seoScore}/${seoChecks.length}`, seoScore === seoChecks.length ? 'green' : 'yellow');
}

// 4. Vérifier les fichiers SEO
log('\n📄 Vérification des fichiers SEO...', 'blue');
const seoFiles = [
  'client/public/robots.txt',
  'client/public/sitemap.xml'
];

seoFiles.forEach(file => {
  if (fs.existsSync(file)) {
    log(`✅ ${file}`, 'green');
  } else {
    log(`❌ ${file} - MANQUANT`, 'red');
  }
});

// 5. Vérifier la structure du build React
log('\n🏗️  Vérification du build React...', 'blue');
const buildPath = path.join(__dirname, 'client', 'build');
const buildFiles = [
  'index.html',
  'static/css',
  'static/js'
];

buildFiles.forEach(file => {
  const filePath = path.join(buildPath, file);
  if (fs.existsSync(filePath)) {
    log(`✅ ${file}`, 'green');
  } else {
    log(`❌ ${file} - MANQUANT`, 'red');
    log('   Exécutez: cd client && npm run build', 'yellow');
  }
});

// 6. Vérifier les scripts de déploiement
log('\n🚀 Vérification des scripts de déploiement...', 'blue');
const deployScripts = [
  'deploy-gratuit.bat',
  'deploy-gratuit.ps1',
  'DEPLOIEMENT-GRATUIT-COMPLET.md',
  'MONGODB-ATLAS-SETUP.md',
  'VERCEL-DEPLOYMENT-GUIDE.md'
];

deployScripts.forEach(script => {
  if (fs.existsSync(script)) {
    log(`✅ ${script}`, 'green');
  } else {
    log(`❌ ${script} - MANQUANT`, 'red');
  }
});

// 7. Instructions finales
log('\n🎯 RÉSUMÉ ET PROCHAINES ÉTAPES', 'cyan');
log('', 'reset');

if (allFilesExist) {
  log('✅ Votre boutique est PRÊTE pour le déploiement gratuit !', 'green');
  log('', 'reset');
  
  log('📋 ÉTAPES SUIVANTES (100% GRATUIT) :', 'yellow');
  log('', 'reset');
  
  log('1. 🗄️  MongoDB Atlas (10 min) :', 'blue');
  log('   - Créez un compte sur mongodb.com/atlas', 'white');
  log('   - Suivez le guide : MONGODB-ATLAS-SETUP.md', 'white');
  log('', 'reset');
  
  log('2. 🌐 Vercel (15 min) :', 'blue');
  log('   - Créez un compte sur vercel.com', 'white');
  log('   - Suivez le guide : VERCEL-DEPLOYMENT-GUIDE.md', 'white');
  log('', 'reset');
  
  log('3. 🔍 Google (20 min) :', 'blue');
  log('   - Configurez Google Search Console', 'white');
  log('   - Ajoutez Google Analytics', 'white');
  log('   - Suivez le guide : GOOGLE-SETUP-GUIDE.md', 'white');
  log('', 'reset');
  
  log('💡 TEMPS TOTAL : ~45 minutes pour une boutique complètement en ligne !', 'green');
  log('', 'reset');
  
  log('🚀 COMMANDES RAPIDES :', 'yellow');
  log('   - Déploiement : deploy-gratuit.bat (Windows) ou deploy-gratuit.ps1 (PowerShell)', 'white');
  log('   - Guide complet : DEPLOIEMENT-GRATUIT-COMPLET.md', 'white');
  log('', 'reset');
  
} else {
  log('⚠️  Certains fichiers sont manquants.', 'yellow');
  log('   Construisez d\'abord le frontend :', 'white');
  log('   cd client && npm install && npm run build', 'white');
  log('', 'reset');
}

log('🎉 Votre boutique sera bientôt en ligne et visible sur Google !', 'green');
log('', 'reset');
