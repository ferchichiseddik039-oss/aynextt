const mongoose = require('mongoose');

// Remplacez par votre vraie URI MongoDB
const MONGODB_URI = 'mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔄 Tentative de connexion à MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 secondes
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connexion MongoDB réussie !');
    console.log('📊 État de la connexion:', mongoose.connection.readyState);
    
    // Test d'une requête simple
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections disponibles:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('🔐 Problème d\'authentification - Vérifiez username/password');
    } else if (error.message.includes('timeout')) {
      console.log('⏰ Timeout - Vérifiez votre connexion internet et les IP autorisées');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('🌐 Cluster introuvable - Vérifiez l\'URL du cluster');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

testConnection();
