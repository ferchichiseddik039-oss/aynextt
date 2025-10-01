const mongoose = require('mongoose');
const User = require('../src/lib/User');
require('dotenv').config();

const removeDefaultAdmin = async () => {
  try {
    console.log('🗑️ Suppression du compte admin par défaut...');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connecté à MongoDB');

    // Supprimer le compte admin par défaut
    const result = await User.deleteOne({ 
      email: 'admin@boutiquevetements.fr' 
    });

    if (result.deletedCount > 0) {
      console.log('✅ Compte admin par défaut supprimé avec succès');
    } else {
      console.log('ℹ️ Aucun compte admin par défaut trouvé');
    }

    // Vérifier s'il reste des comptes admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`📊 Nombre de comptes admin restants: ${adminCount}`);

    if (adminCount === 0) {
      console.log('\n🎉 Parfait ! Aucun compte admin dans la base de données.');
      console.log('💡 Vous pouvez maintenant créer votre propre compte admin via l\'interface web.');
    } else {
      console.log('\n⚠️ Il reste des comptes admin dans la base de données.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    process.exit(1);
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  removeDefaultAdmin();
}

module.exports = removeDefaultAdmin;
