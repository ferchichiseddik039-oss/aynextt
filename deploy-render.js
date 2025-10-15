#!/usr/bin/env node

/**
 * Script de déploiement automatique pour Render
 * Ce script prépare et déploie votre backend sur Render
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Préparation du déploiement Render...');

// Vérifier que tous les fichiers nécessaires existent
const requiredFiles = [
  'server.js',
  'package.json',
  'render.yaml',
  'env.render.example'
];

console.log('📋 Vérification des fichiers requis...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} manquant`);
    process.exit(1);
  }
});

// Vérifier les variables d'environnement
console.log('\n🔧 Vérification des variables d\'environnement...');
const envExample = fs.readFileSync('env.render.example', 'utf8');
const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

requiredVars.forEach(varName => {
  if (envExample.includes(varName)) {
    console.log(`✅ ${varName}`);
  } else {
    console.log(`❌ ${varName} manquant`);
  }
});

console.log('\n📝 Instructions pour le déploiement :');
console.log('1. Allez sur https://render.com');
console.log('2. Créez un nouveau Web Service');
console.log('3. Connectez votre repository GitHub');
console.log('4. Utilisez les paramètres du fichier render.yaml');
console.log('5. Ajoutez toutes les variables d\'env.render.example');
console.log('6. Déployez !');

console.log('\n🎯 Après le déploiement :');
console.log('- Votre backend sera disponible sur : https://votre-app.onrender.com');
console.log('- L\'endpoint de santé : https://votre-app.onrender.com/api/health');
console.log('- Mettez à jour client/src/config/api.js avec votre URL Render');

console.log('\n✅ Préparation terminée !');
