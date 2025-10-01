const mongoose = require('mongoose');
const User = require('../src/lib/User');
const Product = require('../src/lib/Product');
require('dotenv').config();

// Données d'exemple pour les produits
const sampleProducts = [
  {
    nom: "T-shirt Premium",
    description: "T-shirt en coton bio de haute qualité, coupe moderne et confortable",
    prix: 29.99,
    categorie: "hauts",
    marque: "StyleModerne",
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", alt: "T-shirt Premium" }
    ],
    tailles: [
      { nom: "S", stock: 50 },
      { nom: "M", stock: 75 },
      { nom: "L", stock: 60 },
      { nom: "XL", stock: 40 }
    ],
    couleurs: [
      { nom: "Blanc", code: "#FFFFFF" },
      { nom: "Noir", code: "#000000" },
      { nom: "Bleu", code: "#2563EB" }
    ],
    materiau: "100% Coton bio",
    entretien: "Lavage à 30°C, repassage à basse température",
    estNouveau: true,
    tags: ["basique", "confortable", "bio"]
  },
  {
    nom: "Jean Slim Fit",
    description: "Jean moderne en denim stretch, coupe slim élégante",
    prix: 79.99,
    categorie: "bas",
    marque: "DenimLuxe",
    images: [
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", alt: "Jean Slim Fit" }
    ],
    tailles: [
      { nom: "30", stock: 30 },
      { nom: "32", stock: 45 },
      { nom: "34", stock: 55 },
      { nom: "36", stock: 35 }
    ],
    couleurs: [
      { nom: "Bleu", code: "#1E40AF" },
      { nom: "Noir", code: "#000000" }
    ],
    materiau: "98% Coton, 2% Élasthanne",
    entretien: "Lavage à 30°C, ne pas repasser",
    estPopulaire: true,
    tags: ["denim", "stretch", "moderne"]
  },
  {
    nom: "Robe d'Été",
    description: "Robe légère et élégante parfaite pour l'été",
    prix: 89.99,
    categorie: "robes",
    marque: "Élégance",
    images: [
      { url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400", alt: "Robe d'Été" }
    ],
    tailles: [
      { nom: "XS", stock: 25 },
      { nom: "S", stock: 40 },
      { nom: "M", stock: 50 },
      { nom: "L", stock: 35 }
    ],
    couleurs: [
      { nom: "Rose", code: "#EC4899" },
      { nom: "Bleu", code: "#3B82F6" },
      { nom: "Vert", code: "#10B981" }
    ],
    materiau: "100% Soie",
    entretien: "Lavage à la main, repassage à basse température",
    estEnPromotion: true,
    prixReduit: 69.99,
    tags: ["soie", "élégant", "été"]
  },
  {
    nom: "Veste en Cuir",
    description: "Veste en cuir véritable, style intemporel et robuste",
    prix: 299.99,
    categorie: "vestes",
    marque: "CuirLuxe",
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", alt: "Veste en Cuir" }
    ],
    tailles: [
      { nom: "S", stock: 20 },
      { nom: "M", stock: 30 },
      { nom: "L", stock: 25 },
      { nom: "XL", stock: 15 }
    ],
    couleurs: [
      { nom: "Noir", code: "#000000" },
      { nom: "Marron", code: "#92400E" }
    ],
    materiau: "100% Cuir véritable",
    entretien: "Nettoyage professionnel recommandé",
    estPopulaire: true,
    tags: ["cuir", "intemporel", "robuste"]
  }
];

// Note: Le compte admin par défaut a été supprimé
// Utilisez /admin/setup pour créer votre compte admin

const seedDatabase = async () => {
  try {
    console.log('🌱 Début du peuplement de la base de données...');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connecté à MongoDB');

    // Nettoyer la base de données (sauf les admins existants)
    await User.deleteMany({ role: 'client' });
    await Product.deleteMany({});

    console.log('🧹 Base de données nettoyée (comptes clients et produits)');

    // Créer les produits
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
    }
    console.log(`📦 ${sampleProducts.length} produits créés`);

    console.log('\n🎉 Base de données peuplée avec succès !');
    console.log('\n📋 Configuration :');
    console.log('👤 Pour créer votre compte admin, visitez: /admin/setup');
    console.log(`🛍️ ${sampleProducts.length} produits disponibles`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    process.exit(1);
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
