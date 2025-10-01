const mongoose = require('mongoose');
require('dotenv').config();

// Fonction de test de connexion MongoDB Atlas
async function testMongoDBAtlas() {
  try {
    console.log('🔍 Test de connexion MongoDB Atlas...');
    console.log('📡 URI utilisée:', process.env.MONGODB_URI || 'Non définie');
    
    if (!process.env.MONGODB_URI) {
      console.log('❌ Erreur: MONGODB_URI non définie dans le fichier .env');
      console.log('📝 Veuillez configurer MongoDB Atlas et mettre à jour votre fichier .env');
      return;
    }

    // Connexion à MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connexion MongoDB Atlas réussie !');
    console.log('🌐 Base de données connectée:', mongoose.connection.name);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('📊 Port:', mongoose.connection.port);

    // Test de création d'une collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ 
      message: 'Test de connexion MongoDB Atlas',
      timestamp: new Date(),
      status: 'success'
    });
    console.log('✅ Test d\'écriture réussi !');

    // Nettoyage du test
    await testCollection.deleteOne({ message: 'Test de connexion MongoDB Atlas' });
    console.log('🧹 Test nettoyé avec succès !');

    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔒 Connexion fermée proprement');

  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB Atlas:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Vérifiez que votre URI MongoDB Atlas est correcte');
      console.log('💡 Assurez-vous que l\'utilisateur et le mot de passe sont corrects');
      console.log('💡 Vérifiez que l\'accès réseau est autorisé (0.0.0.0/0)');
    }
    
    if (error.message.includes('Authentication failed')) {
      console.log('💡 Vérifiez le nom d\'utilisateur et le mot de passe');
      console.log('💡 Assurez-vous que l\'utilisateur a les bonnes permissions');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Vérifiez que l\'URI MongoDB Atlas est correcte');
      console.log('💡 Assurez-vous que le nom du cluster est correct');
    }
  }
}

// Exécuter le test
testMongoDBAtlas();
