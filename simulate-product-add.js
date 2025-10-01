const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('🔌 Connecté à MongoDB');
  
  const Product = require('./src/lib/Product');
  
  console.log('📦 Simulation d\'ajout de produit...\n');
  
  // Compter les produits avant
  const productsBefore = await Product.countDocuments();
  console.log('📊 Produits avant ajout:', productsBefore);
  
  // Créer un nouveau produit de test
  const testProduct = new Product({
    nom: 'Test Temps Réel ' + Date.now(),
    description: 'Produit de test pour vérifier les mises à jour en temps réel',
    prix: 29.99,
    categorie: 'hauts',
    marque: 'Test Brand',
    images: [{ url: 'test-realtime.jpg', alt: 'Test Temps Réel' }],
    tailles: [{ nom: 'M', stock: 10 }],
    couleurs: [{ nom: 'noir', code: '#000000' }],
    materiau: 'coton',
    entretien: 'lavage machine',
    estPersonnalise: false
  });
  
  // Sauvegarder le produit
  await testProduct.save();
  console.log('✅ Produit ajouté:', testProduct.nom);
  
  // Compter les produits après
  const productsAfter = await Product.countDocuments();
  console.log('📊 Produits après ajout:', productsAfter);
  
  if (productsAfter === productsBefore + 1) {
    console.log('✅ SUCCÈS: Le produit a été ajouté correctement');
    console.log('\n💡 Vérifiez maintenant:');
    console.log('   1. Le tableau de bord admin devrait afficher', productsAfter, 'produits');
    console.log('   2. La liste des produits devrait contenir le nouveau produit');
    console.log('   3. Les statistiques devraient se mettre à jour automatiquement');
    
    console.log('\n🧹 Nettoyage automatique dans 10 secondes...');
    setTimeout(async () => {
      await Product.findByIdAndDelete(testProduct._id);
      console.log('🗑️ Produit de test supprimé');
      process.exit(0);
    }, 10000);
    
  } else {
    console.log('❌ ERREUR: Le nombre de produits n\'a pas changé');
    process.exit(1);
  }
  
}).catch(err => {
  console.error('❌ Erreur de connexion:', err.message);
  process.exit(1);
});
