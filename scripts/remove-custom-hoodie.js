const mongoose = require('mongoose');
const Product = require('../src/lib/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements');
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

const removeCustomHoodie = async () => {
  try {
    await connectDB();

    // Chercher le produit "Capuche Personnalisée"
    const customHoodie = await Product.findOne({ nom: 'Capuche Personnalisée' });
    
    if (!customHoodie) {
      console.log('❌ Le produit "Capuche Personnalisée" n\'existe pas dans la base de données');
      return;
    }

    // Supprimer le produit
    await Product.deleteOne({ _id: customHoodie._id });
    console.log('✅ Produit "Capuche Personnalisée" supprimé avec succès !');
    console.log('ID du produit supprimé:', customHoodie._id);
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la capuche personnalisée:', error);
  } finally {
    mongoose.connection.close();
  }
};

removeCustomHoodie();
