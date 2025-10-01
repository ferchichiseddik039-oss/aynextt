const mongoose = require('mongoose');
const Settings = require('../src/lib/Settings');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements';

async function updateShopName() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer les paramètres existants
    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('❌ Aucun paramètre trouvé dans la base de données');
      return;
    }

    console.log('📋 Paramètres actuels:');
    console.log('   - Nom boutique:', settings.informationsGenerales?.nomBoutique || 'Non défini');
    console.log('   - Email:', settings.informationsGenerales?.email || 'Non défini');

    // Mettre à jour le nom de la boutique et l'email
    if (settings.informationsGenerales) {
      settings.informationsGenerales.nomBoutique = 'AYNEXT';
      settings.informationsGenerales.email = 'contact@aynext.com';
    } else {
      settings.informationsGenerales = {
        nomBoutique: 'AYNEXT',
        email: 'contact@aynext.com',
        description: 'Boutique de vêtements tendance',
        telephone: '+216 XX XXX XXX',
        adresse: {
          rue: 'Rue de la Mode',
          ville: 'Tunis',
          codePostal: '1000',
          pays: 'Tunisie'
        },
        logo: ''
      };
    }

    // Sauvegarder les modifications
    await settings.save();
    
    console.log('✅ Nom de la boutique mis à jour avec succès !');
    console.log('📋 Nouveaux paramètres:');
    console.log('   - Nom boutique:', settings.informationsGenerales.nomBoutique);
    console.log('   - Email:', settings.informationsGenerales.email);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le script
updateShopName();
