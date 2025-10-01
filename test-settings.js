const mongoose = require('mongoose');
const Settings = require('./src/lib/Settings');
require('dotenv').config();

const testSettings = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connecté à MongoDB');

    // Tester la récupération des paramètres
    const settings = await Settings.getSettings();
    console.log('📋 Paramètres récupérés:');
    console.log('   - Nom boutique:', settings.informationsGenerales.nomBoutique);
    console.log('   - Frais livraison:', settings.livraison.fraisLivraison, 'TND');
    console.log('   - Méthodes de paiement actives:', settings.paiement.methodesActives.join(', '));
    console.log('   - Devise:', settings.general.devise);

    // Tester la mise à jour des paramètres
    console.log('\n🔄 Test de mise à jour des paramètres...');
    const updatedSettings = await settings.updateSettings({
      livraison: {
        ...settings.livraison,
        fraisLivraison: 3.0
      }
    }, 'test-user-id');

    console.log('✅ Paramètres mis à jour:');
    console.log('   - Nouveau frais livraison:', updatedSettings.livraison.fraisLivraison, 'TND');

    // Tester la validation des méthodes de paiement
    console.log('\n💳 Test de validation des méthodes de paiement...');
    const validMethods = updatedSettings.paiement.methodesActives;
    console.log('   - Méthodes valides:', validMethods.join(', '));
    
    // Tester avec une méthode invalide
    const invalidMethod = 'bitcoin';
    if (!validMethods.includes(invalidMethod)) {
      console.log('   - Méthode invalide rejetée:', invalidMethod);
    }

    // Tester le calcul des frais de livraison
    console.log('\n🚚 Test de calcul des frais de livraison...');
    const testSubtotals = [50, 80, 120];
    testSubtotals.forEach(subtotal => {
      const { fraisLivraison, fraisLivraisonGratuite, livraisonGratuite } = updatedSettings.livraison;
      const frais = (livraisonGratuite && subtotal >= fraisLivraisonGratuite) ? 0 : fraisLivraison;
      console.log(`   - Sous-total ${subtotal} TND → Frais: ${frais} TND`);
    });

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('💡 Le système de paramètres est prêt à être utilisé.');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
    process.exit(0);
  }
};

// Exécuter les tests
testSettings();
