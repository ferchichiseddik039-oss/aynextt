const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../lib/Order');
const Cart = require('../lib/Cart');
const Product = require('../lib/Product');
const Settings = require('../lib/Settings');
const User = require('../lib/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const emailService = require('../services/emailService');

const router = express.Router();

// @route   POST /api/orders
// @desc    Créer une nouvelle commande
// @access  Private
router.post('/', [auth, [
  body('adresseLivraison.nom').notEmpty().withMessage('Nom de livraison requis'),
  body('adresseLivraison.prenom').notEmpty().withMessage('Prénom de livraison requis'),
  body('adresseLivraison.rue').notEmpty().withMessage('Rue de livraison requise'),
  body('adresseLivraison.ville').notEmpty().withMessage('Ville de livraison requise'),
  body('adresseLivraison.codePostal').notEmpty().withMessage('Code postal de livraison requis'),
  body('adresseLivraison.pays').notEmpty().withMessage('Pays de livraison requis'),
  body('adresseLivraison.telephone').notEmpty().withMessage('Téléphone de livraison requis'),
  body('methodePaiement').custom(async (value) => {
    const settings = await Settings.getSettings();
    const validMethods = settings.paiement.methodesActives;
    if (!validMethods.includes(value)) {
      throw new Error('Méthode de paiement invalide');
    }
    return true;
  })
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { adresseLivraison, adresseFacturation, methodePaiement, notes } = req.body;

    // Récupérer le panier de l'utilisateur
    const cart = await Cart.findOne({ utilisateur: req.user.id })
      .populate('articles.produit', 'nom prix prixReduit');

    if (!cart || cart.articles.length === 0) {
      return res.status(400).json({ message: 'Panier vide' });
    }

    // Préparer les articles de la commande
    const articlesCommande = cart.articles.map(article => ({
      produit: article.produit._id,
      nom: article.produit.nom,
      quantite: article.quantite,
      taille: article.taille,
      couleur: article.couleur,
      prixUnitaire: article.prixUnitaire,
      prixTotal: article.prixUnitaire * article.quantite
    }));

    // Calculer les totaux
    const sousTotal = articlesCommande.reduce((total, article) => total + article.prixTotal, 0);
    
    // Récupérer les paramètres de livraison
    const settings = await Settings.getSettings();
    const { fraisLivraison: fraisLivraisonBase, fraisLivraisonGratuite, livraisonGratuite } = settings.livraison;
    
    // Calculer les frais de livraison selon les paramètres
    const fraisLivraison = (livraisonGratuite && sousTotal >= fraisLivraisonGratuite) ? 0 : fraisLivraisonBase;
    const total = sousTotal + fraisLivraison;

    // Créer la commande
    const order = new Order({
      utilisateur: req.user.id,
      articles: articlesCommande,
      adresseLivraison,
      adresseFacturation: adresseFacturation || adresseLivraison,
      methodePaiement,
      sousTotal,
      fraisLivraison,
      total,
      notes
    });

    await order.save();

    // Émettre un événement WebSocket pour les statistiques mises à jour
    const io = req.app.get('io');
    if (io && global.emitStatsUpdate) {
      global.emitStatsUpdate(io);
    }

    // Mettre à jour le stock des produits
    for (const article of cart.articles) {
      await Product.findByIdAndUpdate(article.produit._id, {
        $inc: { 'tailles.$[taille].stock': -article.quantite }
      }, {
        arrayFilters: [{ 'taille.nom': article.taille }]
      });
    }

    // Vider le panier
    await cart.viderPanier();

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET /api/orders
// @desc    Obtenir les commandes de l'utilisateur
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log(`📤 Récupération des commandes pour l'utilisateur: ${req.user.id}`);
    
    // Timeout de sécurité côté serveur
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout serveur (10 secondes)')), 10000);
    });

    // Optimisation: limiter les champs et ajouter un timeout
    const ordersPromise = Order.find({ utilisateur: req.user.id })
      .select('_id statut total dateCommande articles adresseLivraison methodePaiement')
      .sort({ dateCommande: -1 })
      .limit(50) // Limiter à 50 commandes pour éviter les problèmes de performance
      .lean(); // Utiliser lean() pour de meilleures performances

    const orders = await Promise.race([ordersPromise, timeoutPromise]);

    console.log(`✅ ${orders.length} commande(s) trouvée(s) pour l'utilisateur`);
    res.json(orders);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des commandes:', err.message);
    if (err.message.includes('Timeout')) {
      res.status(408).json({ message: 'Timeout: La requête prend trop de temps' });
    } else {
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des commandes' });
    }
  }
});

// @route   GET /api/orders/:id
// @desc    Obtenir une commande par ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('articles.produit', 'nom images marque')
      .populate('utilisateur', 'nom prenom email');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que l'utilisateur peut accéder à cette commande
    if (order.utilisateur._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST /api/orders/custom-hoodie
// @desc    Créer une commande de hoodie personnalisé
// @access  Private
router.post('/custom-hoodie', auth, [
  body('type').equals('custom_hoodie').withMessage('Type de commande invalide'),
  body('couleur').notEmpty().withMessage('Couleur requise'),
  body('logo').notEmpty().withMessage('Logo requis'),
  body('logoPosition').notEmpty().withMessage('Position du logo requise'),
  body('logoSize').isInt({ min: 40, max: 120 }).withMessage('Taille du logo invalide'),
  body('prix').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('quantite').isInt({ min: 1 }).withMessage('Quantité invalide'),
  body('taille').notEmpty().withMessage('Taille requise')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      type,
      couleur,
      couleurNom,
      logo,
      logoPosition,
      logoSize,
      prix,
      quantite,
      taille,
      notes
    } = req.body;

    // Log pour débogage
    console.log('=== DONNÉES REÇUES POUR COMMANDE PERSONNALISÉE ===');
    console.log('Type:', type);
    console.log('Couleur:', couleur);
    console.log('Couleur nom:', couleurNom);
    console.log('Logo (premiers 100 caractères):', logo ? logo.substring(0, 100) + '...' : 'AUCUN LOGO');
    console.log('Position logo:', logoPosition);
    console.log('Taille logo:', logoSize);
    console.log('Prix:', prix);
    console.log('Quantité:', quantite);
    console.log('Taille:', taille);
    console.log('Notes:', notes);
    console.log('================================================');

    // Créer l'ordre personnalisé
    const customOrder = new Order({
      utilisateur: req.user.id,
      statut: 'en_attente',
      sousTotal: prix * quantite,
      fraisLivraison: 0,
      reduction: 0,
      total: prix * quantite,
      articles: [{
        produit: null, // Pas de produit spécifique pour un hoodie personnalisé
        nom: `Hoodie personnalisé - ${couleurNom || 'Couleur personnalisée'}`,
        quantite: quantite,
        taille: taille,
        couleur: couleur,
        prixUnitaire: prix,
        prixTotal: prix * quantite,
        type: 'custom_hoodie',
        customData: {
          logo: logo,
          logoPosition: logoPosition,
          logoSize: logoSize,
          couleurCode: couleur,
          couleurNom: couleurNom || 'Couleur personnalisée'
        }
      }],
      adresseLivraison: {
        // Utiliser les données de l'utilisateur par défaut
        nom: req.user.nom || '',
        prenom: req.user.prenom || '',
        rue: req.user.adresse?.rue || '',
        ville: req.user.adresse?.ville || '',
        codePostal: req.user.adresse?.codePostal || '',
        pays: req.user.adresse?.pays || 'Tunisie',
        telephone: req.user.telephone || ''
      },
      methodePaiement: 'en_attente',
      notes: notes || ''
    });

    await customOrder.save();

    // Émettre un événement WebSocket pour les statistiques mises à jour
    const io = req.app.get('io');
    if (io && global.emitStatsUpdate) {
      global.emitStatsUpdate(io);
    }

    console.log(`✅ Commande de hoodie personnalisé créée - ID: ${customOrder._id}`);

    res.status(201).json({
      success: true,
      message: 'Commande de hoodie personnalisé créée avec succès',
      order: customOrder
    });

  } catch (err) {
    console.error('❌ Erreur lors de la création de la commande personnalisée:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la création de la commande personnalisée' 
    });
  }
});

// @route   PUT /api/orders/:id/statut
// @desc    Mettre à jour le statut d'une commande (Admin)
// @access  Private (Admin)
router.put('/:id/statut', [auth, admin], [
  body('statut').isIn(['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee']).withMessage('Statut invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { statut, numeroSuivi } = req.body;

    const order = await Order.findById(req.params.id)
      .populate('utilisateur', 'nom prenom email')
      .populate('articles.produit', 'nom');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const oldStatus = order.statut;
    order.statut = statut;
    if (numeroSuivi) order.numeroSuivi = numeroSuivi;

    await order.mettreAJourStatut(statut);

    console.log(`✅ Statut de commande mis à jour: ${oldStatus} → ${statut} (Commande #${order.numeroCommande})`);

    // Émettre un événement WebSocket pour les statistiques mises à jour
    const io = req.app.get('io');
    if (io && global.emitStatsUpdate) {
      global.emitStatsUpdate(io);
    }

    // Notifier le frontend pour envoyer l'email (EmailJS côté client)
    try {
      if (order.utilisateur && order.utilisateur.email) {
        console.log(`📧 Notification de changement de statut pour: ${order.utilisateur.email}`);
        console.log(`📧 Le frontend enverra l'email via EmailJS`);
        
        // Envoyer les données via WebSocket pour que le frontend puisse envoyer l'email
        if (io) {
          io.emit('order-status-changed', {
            orderId: order._id,
            userId: order.utilisateur._id,
            userEmail: order.utilisateur.email,
            userName: `${order.utilisateur.prenom} ${order.utilisateur.nom}`,
            newStatus: statut,
            orderNumber: order.numeroCommande,
            orderTotal: order.total,
            orderDate: order.dateCreation
          });
          console.log('🔌 Données envoyées via WebSocket pour envoi d\'email côté frontend');
        }
      } else {
        console.log('⚠️ Pas d\'email utilisateur disponible pour la notification');
      }
    } catch (emailError) {
      console.error('❌ Erreur lors de la préparation de l\'email:', emailError.message);
      // Ne pas bloquer la mise à jour du statut si l'email échoue
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET /api/orders/admin/all
// @desc    Obtenir toutes les commandes (Admin)
// @access  Private (Admin)
router.get('/admin/all', [auth, admin], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtres optionnels
    const filter = {};
    if (req.query.statut) filter.statut = req.query.statut;
    if (req.query.dateDebut) filter.dateCommande = { $gte: new Date(req.query.dateDebut) };
    if (req.query.dateFin) {
      filter.dateCommande = { 
        ...filter.dateCommande, 
        $lte: new Date(req.query.dateFin) 
      };
    }

    const orders = await Order.find(filter)
      .populate('utilisateur', 'nom prenom email')
      .populate('articles.produit', 'nom images marque')
      .sort({ dateCommande: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        ordersPerPage: limit
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET /api/orders/admin/stats
// @desc    Obtenir les statistiques des commandes (Admin)
// @access  Private (Admin)
router.get('/admin/stats', [auth, admin], async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const enAttente = await Order.countDocuments({ statut: 'en_attente' });
    const confirmees = await Order.countDocuments({ statut: 'confirmee' });
    const enPreparation = await Order.countDocuments({ statut: 'en_preparation' });
    const expediees = await Order.countDocuments({ statut: 'expediee' });
    const livrees = await Order.countDocuments({ statut: 'livree' });
    const annulees = await Order.countDocuments({ statut: 'annulee' });

    // Calculer le chiffre d'affaires total
    const chiffreAffaires = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      success: true,
      stats: {
        total,
        enAttente,
        confirmees,
        enPreparation,
        expediees,
        livrees,
        annulees,
        chiffreAffaires: chiffreAffaires[0]?.total || 0
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET /api/orders/admin/search
// @desc    Rechercher des commandes (Admin)
// @access  Private (Admin)
router.get('/admin/search', [auth, admin], async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Paramètre de recherche requis' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Recherche dans les commandes
    const orders = await Order.find({
      $or: [
        { numeroCommande: { $regex: q, $options: 'i' } },
        { 'adresseLivraison.nom': { $regex: q, $options: 'i' } },
        { 'adresseLivraison.prenom': { $regex: q, $options: 'i' } },
        { 'adresseLivraison.email': { $regex: q, $options: 'i' } }
      ]
    })
    .populate('utilisateur', 'nom prenom email')
    .populate('articles.produit', 'nom')
    .sort({ dateCommande: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Order.countDocuments({
      $or: [
        { numeroCommande: { $regex: q, $options: 'i' } },
        { 'adresseLivraison.nom': { $regex: q, $options: 'i' } },
        { 'adresseLivraison.prenom': { $regex: q, $options: 'i' } },
        { 'adresseLivraison.email': { $regex: q, $options: 'i' } }
      ]
    });

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;