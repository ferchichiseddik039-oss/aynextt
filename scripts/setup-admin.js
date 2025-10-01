const mongoose = require('mongoose');
const User = require('../src/lib/User');
require('dotenv').config();

const setupAdmin = async () => {
  try {
    console.log('🔧 Configuration du système admin...');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connecté à MongoDB');

    // Vérifier s'il y a des comptes admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    if (adminCount === 0) {
      console.log('\n🎉 Aucun compte admin trouvé !');
      console.log('💡 Vous pouvez maintenant créer votre compte admin via:');
      console.log('   - URL: http://localhost:3000/admin/setup');
      console.log('   - Ou utilisez le raccourci Ctrl+Shift+L');
    } else {
      console.log(`\n⚠️ ${adminCount} compte(s) admin trouvé(s) dans la base de données.`);
      
      if (adminCount === 1) {
        const admin = await User.findOne({ role: 'admin' });
        console.log(`👤 Admin existant: ${admin.email}`);
        console.log('✅ Configuration admin déjà en place.');
      } else {
        console.log('❌ Plusieurs comptes admin détectés. Un seul est autorisé.');
        console.log('💡 Supprimez les comptes admin en trop manuellement.');
      }
    }

    console.log('\n📋 Instructions:');
    console.log('1. Visitez http://localhost:3000/admin/setup');
    console.log('2. Créez votre compte admin unique');
    console.log('3. Connectez-vous via http://localhost:3000/admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    process.exit(1);
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  setupAdmin();
}

module.exports = setupAdmin;
