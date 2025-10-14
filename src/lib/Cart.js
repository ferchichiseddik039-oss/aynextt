const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: function() {
      return this.type === 'standard'; // Requis seulement pour les articles standard
    }
  },
  nom: {
    type: String,
    required: false // Pour les articles personnalisés
  },
  quantite: {
    type: Number,
    required: true,
    min: 1
  },
  taille: {
    type: String,
    required: false // Pas requis pour tous les types d'articles
  },
  couleur: {
    type: String,
    required: false // Pas requis pour tous les types d'articles
  },
  prix: {
    type: Number,
    required: true
  },
  prixUnitaire: {
    type: Number,
    required: false // Pour compatibilité avec l'ancien système
  },
  // Champs pour les articles personnalisés
  type: {
    type: String,
    enum: ['standard', 'custom_hoodie'],
    default: 'standard'
  },
  customData: {
    logo: String,
    logoPosition: String,
    logoSize: Number,
    couleurCode: String,
    couleurNom: String
  },
  notes: String
});

const cartSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  articles: [cartItemSchema],
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Méthode pour calculer le total du panier
cartSchema.methods.calculerTotal = function() {
  return this.articles.reduce((total, article) => {
    const prix = article.prix || article.prixUnitaire || 0;
    return total + (prix * article.quantite);
  }, 0);
};

// Méthode pour ajouter un article
cartSchema.methods.ajouterArticle = function(produitId, quantite, taille, couleur, prix) {
  const articleExistant = this.articles.find(article => 
    article.produit.toString() === produitId.toString() &&
    article.taille === taille &&
    article.couleur === couleur
  );

  if (articleExistant) {
    articleExistant.quantite += quantite;
  } else {
    this.articles.push({
      produit: produitId,
      quantite,
      taille,
      couleur,
      prixUnitaire: prix
    });
  }

  this.dateModification = new Date();
  return this.save();
};

// Méthode pour supprimer un article
cartSchema.methods.supprimerArticle = function(articleId) {
  this.articles = this.articles.filter(article => 
    article._id.toString() !== articleId.toString()
  );
  this.dateModification = new Date();
  return this.save();
};

// Méthode pour vider le panier
cartSchema.methods.viderPanier = function() {
  this.articles = [];
  this.dateModification = new Date();
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
