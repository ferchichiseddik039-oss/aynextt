const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

// Route de test identique à celle du serveur
app.put('/test-livraison', [
  body('fraisLivraison').optional().isNumeric().isFloat({ min: 0 }),
  body('fraisLivraisonGratuite').optional().isNumeric().isFloat({ min: 0 }),
  body('delaiLivraison').optional().isString().trim(),
  body('zonesLivraison').optional().isArray(),
  body('livraisonGratuite').optional().isBoolean()
], (req, res) => {
  console.log('📦 Données reçues:', req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Erreurs de validation:', errors.array());
    return res.status(400).json({ 
      message: 'Données invalides', 
      errors: errors.array() 
    });
  }
  
  console.log('✅ Validation réussie');
  res.json({ message: 'OK' });
});

// Test avec différentes données
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

// Simuler une requête
const req = {
  body: testData
};

const res = {
  status: (code) => {
    console.log(`📊 Status: ${code}`);
    return {
      json: (data) => console.log('📤 Response:', data)
    };
  },
  json: (data) => console.log('📤 Response:', data)
};

console.log('🧪 Test de validation API...');
console.log('📦 Données de test:', testData);

// Exécuter la validation
const validation = [
  body('fraisLivraison').optional().isNumeric().isFloat({ min: 0 }),
  body('fraisLivraisonGratuite').optional().isNumeric().isFloat({ min: 0 }),
  body('delaiLivraison').optional().isString().trim(),
  body('zonesLivraison').optional().isArray(),
  body('livraisonGratuite').optional().isBoolean()
];

// Simuler la validation
Promise.all(validation.map(validator => validator.run(req)))
  .then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erreurs de validation:', errors.array());
    } else {
      console.log('✅ Validation réussie');
    }
  })
  .catch(error => {
    console.log('❌ Erreur:', error);
  });
