const mongoose = require('mongoose');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements';

async function updateEmail() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Utiliser la collection directement pour forcer la mise à jour
    const db = mongoose.connection.db;
    const collection = db.collection('settings');

    // Mettre à jour seulement le nom de la boutique (garder l'email modifiable)
    const result = await collection.updateOne(
      {}, // Trouver le premier document
      {
        $set: {
          'informationsGenerales.nomBoutique': 'AYNEXT'
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Nom de la boutique mis à jour avec succès !');
    } else {
      console.log('ℹ️  Aucun document modifié (peut-être déjà à jour)');
    }

    // Vérifier le résultat
    const updatedSettings = await collection.findOne({});
    if (updatedSettings && updatedSettings.informationsGenerales) {
      console.log('🔍 Vérification:');
      console.log('   - Nom boutique:', updatedSettings.informationsGenerales.nomBoutique);
      console.log('   - Email:', updatedSettings.informationsGenerales.email);
      console.log('   - Téléphone:', updatedSettings.informationsGenerales.telephone);
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
updateEmail();
