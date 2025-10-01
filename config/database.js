const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    
    // Créer les index pour optimiser les performances
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // Index pour les produits
    await mongoose.model('Product').createIndexes();
    
    // Index pour les utilisateurs
    await mongoose.model('User').createIndexes();
    
    // Index pour les commandes
    await mongoose.model('Order').createIndexes();
    
    // Index pour les paniers
    await mongoose.model('Cart').createIndexes();
    
    console.log('✅ Index de base de données créés avec succès');
  } catch (error) {
    console.error('⚠️ Erreur lors de la création des index:', error.message);
  }
};

module.exports = connectDB;
