const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Configuration MongoDB Atlas pour votre boutique de vêtements');
console.log('=============================================================\n');

// Fonction pour poser une question
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Fonction principale de configuration
async function setupMongoDBAtlas() {
  try {
    console.log('📋 Instructions de configuration MongoDB Atlas :\n');
    
    console.log('1️⃣  Allez sur : https://www.mongodb.com/atlas');
    console.log('2️⃣  Créez un compte gratuit');
    console.log('3️⃣  Créez un cluster M0 (gratuit)');
    console.log('4️⃣  Configurez un utilisateur de base de données');
    console.log('5️⃣  Autorisez l\'accès réseau (0.0.0.0/0)');
    console.log('6️⃣  Obtenez l\'URI de connexion\n');
    
    console.log('⏳ Une fois ces étapes terminées, nous configurerons votre application...\n');
    
    // Demander l'URI MongoDB Atlas
    const mongoURI = await askQuestion('🔗 Collez votre URI MongoDB Atlas ici : ');
    
    if (!mongoURI || mongoURI.trim() === '') {
      console.log('❌ URI non fournie. Configuration annulée.');
      rl.close();
      return;
    }
    
    // Vérifier le format de l'URI
    if (!mongoURI.includes('mongodb+srv://')) {
      console.log('⚠️  Attention : L\'URI ne semble pas être au bon format MongoDB Atlas');
      console.log('   Format attendu : mongodb+srv://username:password@cluster...');
      
      const continueAnyway = await askQuestion('Voulez-vous continuer quand même ? (y/n) : ');
      if (continueAnyway.toLowerCase() !== 'y' && continueAnyway.toLowerCase() !== 'yes') {
        console.log('❌ Configuration annulée.');
        rl.close();
        return;
      }
    }
    
    // Mettre à jour le fichier .env
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Ajouter ou mettre à jour MONGODB_URI
    if (envContent.includes('MONGODB_URI=')) {
      envContent = envContent.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${mongoURI}`);
    } else {
      envContent += `\nMONGODB_URI=${mongoURI}`;
    }
    
    // Écrire le fichier .env
    fs.writeFileSync(envPath, envContent.trim());
    console.log('✅ Fichier .env mis à jour avec succès !');
    
    // Tester la connexion
    console.log('\n🧪 Test de la connexion MongoDB Atlas...');
    
    // Importer et tester la connexion
    const { testMongoDBAtlas } = require('./test-mongodb-atlas');
    await testMongoDBAtlas();
    
    console.log('\n🎉 Configuration MongoDB Atlas terminée avec succès !');
    console.log('🚀 Vous pouvez maintenant démarrer votre serveur avec : npm run dev');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration :', error.message);
  } finally {
    rl.close();
  }
}

// Démarrer la configuration
setupMongoDBAtlas();
