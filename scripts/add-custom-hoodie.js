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

const addCustomHoodie = async () => {
  try {
    await connectDB();

    // Vérifier si le produit existe déjà
    const existingHoodie = await Product.findOne({ nom: 'Capuche Personnalisée' });
    if (existingHoodie) {
      console.log('Le produit capuche personnalisée existe déjà');
      return;
    }

    const customHoodie = new Product({
      nom: 'Capuche Personnalisée',
      description: 'Créez votre capuche unique avec nos options de personnalisation. Choisissez la couleur et ajoutez votre logo personnalisé.',
      prix: 45.99,
      categorie: 'hauts',
      sousCategorie: 'capuches',
      marque: 'CustomWear',
      images: [{
        url: '/uploads/products/custom-hoodie-base.jpg',
        alt: 'Capuche personnalisée - Vue de base'
      }],
      tailles: [
        { nom: 'S', stock: 10 },
        { nom: 'M', stock: 15 },
        { nom: 'L', stock: 12 },
        { nom: 'XL', stock: 8 },
        { nom: 'XXL', stock: 5 }
      ],
      couleurs: [
        { nom: 'Noir', code: '#000000' },
        { nom: 'Blanc', code: '#FFFFFF' },
        { nom: 'Rouge', code: '#FF0000' },
        { nom: 'Bleu', code: '#0000FF' },
        { nom: 'Vert', code: '#00FF00' },
        { nom: 'Gris', code: '#808080' }
      ],
      materiau: '100% Coton',
      entretien: 'Lavage à 30°C, ne pas repasser sur les impressions',
      estPersonnalise: true,
      optionsPersonnalisation: {
        couleursDisponibles: [
          { nom: 'Noir', code: '#000000', image: '/hoodie-base.svg' },
          { nom: 'Blanc', code: '#FFFFFF', image: '/hoodie-base.svg' },
          { nom: 'Rouge', code: '#FF0000', image: '/hoodie-base.svg' },
          { nom: 'Bleu', code: '#0000FF', image: '/hoodie-base.svg' },
          { nom: 'Vert', code: '#00FF00', image: '/hoodie-base.svg' },
          { nom: 'Gris', code: '#808080', image: '/hoodie-base.svg' },
          { nom: 'Rose', code: '#FF69B4', image: '/hoodie-base.svg' },
          { nom: 'Violet', code: '#800080', image: '/hoodie-base.svg' },
          { nom: 'Orange', code: '#FFA500', image: '/hoodie-base.svg' },
          { nom: 'Jaune', code: '#FFFF00', image: '/hoodie-base.svg' }
        ],
        logosDisponibles: [
          { 
            nom: 'Logo A', 
            image: '/logo-test-1.svg',
            position: { x: 50, y: 50 },
            taille: { largeur: 60, hauteur: 60 }
          },
          { 
            nom: 'Logo B', 
            image: '/logo-test-2.svg',
            position: { x: 50, y: 50 },
            taille: { largeur: 60, hauteur: 60 }
          },
          { 
            nom: 'Logo C', 
            image: '/logo-test-3.svg',
            position: { x: 50, y: 50 },
            taille: { largeur: 60, hauteur: 60 }
          },
          { 
            nom: 'Logo D', 
            image: '/logo-test-4.svg',
            position: { x: 50, y: 50 },
            taille: { largeur: 60, hauteur: 60 }
          }
        ],
        positionsLogo: [
          { nom: 'Centre', x: 50, y: 50 },
          { nom: 'Haut gauche', x: 25, y: 35 },
          { nom: 'Haut droite', x: 75, y: 35 },
          { nom: 'Bas gauche', x: 25, y: 65 },
          { nom: 'Bas droite', x: 75, y: 65 }
        ]
      },
      estNouveau: true,
      estPopulaire: true,
      tags: ['personnalisé', 'capuche', 'logo', 'couleur', 'unique']
    });

    await customHoodie.save();
    console.log('✅ Capuche personnalisée ajoutée avec succès !');
    console.log('ID du produit:', customHoodie._id);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la capuche personnalisée:', error);
  } finally {
    mongoose.connection.close();
  }
};

addCustomHoodie();
