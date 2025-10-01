const { body, validationResult } = require('express-validator');

// Test de validation pour les paramètres de livraison
const testValidation = () => {
  console.log('🧪 Test de validation des paramètres de livraison...');
  
  // Données de test
  const testData = {
    fraisLivraison: 3.0,
    fraisLivraisonGratuite: 100,
    delaiLivraison: '3-5 jours ouvrables',
    zonesLivraison: [
      {
        nom: 'Tunis Centre',
        frais: 5.9,
        delai: '2-3 jours'
      }
    ],
    livraisonGratuite: true
  };
  
  console.log('📦 Données de test:', testData);
  
  // Validation
  const validation = [
    body('fraisLivraison').optional().isNumeric().isFloat({ min: 0 }),
    body('fraisLivraisonGratuite').optional().isNumeric().isFloat({ min: 0 }),
    body('delaiLivraison').optional().isString().trim(),
    body('zonesLivraison').optional().isArray(),
    body('livraisonGratuite').optional().isBoolean()
  ];
  
  // Simuler la validation
  validation.forEach(validator => {
    try {
      const result = validator.run({ body: testData });
      console.log('✅ Validation OK pour:', validator._fields);
    } catch (error) {
      console.log('❌ Erreur de validation:', error.message);
    }
  });
  
  console.log('🎉 Test terminé');
};

testValidation();
