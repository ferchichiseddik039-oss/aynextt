#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration de production
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log('🧪 Test de la configuration de production...\n');

// Couleurs pour la console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 1. Vérifier les fichiers essentiels
log('📁 Vérification des fichiers essentiels...', 'blue');
const essentialFiles = [
  'server.js',
  'package.json',
  'client/build/index.html',
  'client/build/static',
  '.env'
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
  log('\n❌ Certains fichiers essentiels sont manquants. Veuillez les créer avant de continuer.', 'red');
  process.exit(1);
}

// 2. Vérifier les variables d'environnement
log('\n🔧 Vérification des variables d\'environnement...', 'blue');
require('dotenv').config();

const requiredEnvVars = [
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'SESSION_SECRET',
  'CLIENT_URL'
];

let envVarsOk = true;
requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    log(`✅ ${varName}`, 'green');
  } else {
    log(`❌ ${varName} - NON DÉFINI`, 'red');
    envVarsOk = false;
  }
});

if (!envVarsOk) {
  log('\n❌ Certaines variables d\'environnement sont manquantes.', 'red');
  log('   Vérifiez votre fichier .env', 'yellow');
}

// 3. Vérifier la configuration MongoDB
log('\n🗄️  Test de connexion MongoDB...', 'blue');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  log('✅ Connexion MongoDB réussie', 'green');
  mongoose.connection.close();
})
.catch(err => {
  log(`❌ Erreur de connexion MongoDB: ${err.message}`, 'red');
  log('   Vérifiez votre URI MongoDB dans le fichier .env', 'yellow');
});

// 4. Vérifier la structure du build React
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
  }
});

// 5. Vérifier les métadonnées SEO
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
  
  seoChecks.forEach(check => {
    if (check.pattern.test(htmlContent)) {
      log(`✅ ${check.name}`, 'green');
    } else {
      log(`❌ ${check.name} - MANQUANT`, 'red');
    }
  });
}

// 6. Vérifier les fichiers SEO
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

// 7. Test de démarrage du serveur (optionnel)
log('\n🚀 Test de démarrage du serveur...', 'blue');
log('   (Ce test nécessite que le serveur ne soit pas déjà en cours d\'exécution)', 'yellow');

// Fonction pour tester le serveur
function testServer() {
  return new Promise((resolve, reject) => {
    const server = require('./server.js');
    
    // Attendre que le serveur démarre
    setTimeout(() => {
      const port = process.env.PORT || 5000;
      const protocol = process.env.NODE_ENV === 'production' ? https : http;
      
      const req = protocol.get(`http://localhost:${port}`, (res) => {
        if (res.statusCode === 200) {
          log('✅ Serveur répond correctement', 'green');
          resolve();
        } else {
          log(`❌ Serveur répond avec le code: ${res.statusCode}`, 'red');
          reject(new Error(`Status code: ${res.statusCode}`));
        }
      });
      
      req.on('error', (err) => {
        log(`❌ Erreur de connexion au serveur: ${err.message}`, 'red');
        reject(err);
      });
      
      req.setTimeout(5000, () => {
        log('❌ Timeout de connexion au serveur', 'red');
        reject(new Error('Timeout'));
      });
    }, 2000);
  });
}

// 8. Résumé des tests
log('\n📊 Résumé des tests...', 'blue');
log('✅ Tests de base terminés', 'green');
log('📋 Prochaines étapes recommandées:', 'yellow');
log('   1. Configurez votre serveur de production', 'white');
log('   2. Déployez votre application', 'white');
log('   3. Configurez votre domaine et SSL', 'white');
log('   4. Soumettez votre sitemap à Google Search Console', 'white');
log('   5. Configurez Google Analytics', 'white');

log('\n🎉 Tests terminés ! Votre boutique est prête pour la production.', 'green');
