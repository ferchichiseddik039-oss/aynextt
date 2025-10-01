const mongoose = require('mongoose');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements';

async function forceUpdateShopName() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Utiliser la collection directement pour forcer la mise à jour
    const db = mongoose.connection.db;
    const collection = db.collection('settings');

    // Mettre à jour le nom de la boutique et l'email
    const result = await collection.updateOne(
      {}, // Trouver le premier document
      {
        $set: {
          'informationsGenerales.nomBoutique': 'AYNEXT',
          'informationsGenerales.email': 'contact@aynext.com'
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Nom de la boutique mis à jour avec succès !');
      console.log('📋 Nouveaux paramètres:');
      console.log('   - Nom boutique: AYNEXT');
      console.log('   - Email: contact@aynext.com');
    } else {
      console.log('ℹ️  Aucun document modifié (peut-être déjà à jour)');
    }

    // Vérifier le résultat
    const updatedSettings = await collection.findOne({});
    if (updatedSettings && updatedSettings.informationsGenerales) {
      console.log('🔍 Vérification:');
      console.log('   - Nom boutique:', updatedSettings.informationsGenerales.nomBoutique);
      console.log('   - Email:', updatedSettings.informationsGenerales.email);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le script
forceUpdateShopName();
