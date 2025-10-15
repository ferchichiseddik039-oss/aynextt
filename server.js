require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const passport = require('./src/config/passport');
const emailService = require('./src/services/emailService');

// Import des routeurs
const settingsRoutes = require('./src/routes/settings');
const productsRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5001;

let mongoConnected = false;

// Endpoint de santé pour Render
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoConnected ? 'connected' : 'disconnected'
  });
});

// Fonction utilitaire pour gérer les erreurs MongoDB
const handleMongoError = (error, res, fallbackData = null) => {
  console.error('❌ Erreur MongoDB:', error);
  
  if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError' || error.name === 'MongooseServerSelectionError') {
    console.log('⚠️ MongoDB non disponible, utilisation du mode fallback');
    if (fallbackData) {
      return res.json({ success: true, ...fallbackData });
    } else {
      return res.status(503).json({ 
        success: false, 
        message: 'Service temporairement indisponible - Base de données non accessible',
        fallback: true
      });
    }
  } else {
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ayoubbenromdan8:52141707@cluster0.6rx5.mongodb.net/boutique-vetements?retryWrites=true&w=majority';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connecté à MongoDB Atlas');
  mongoConnected = true;
})
.catch(err => {
  console.error('Erreur de connexion à MongoDB Atlas:', err);
  console.warn('Démarrage en mode fallback (données statiques)');
  mongoConnected = false;
});

// Middleware CORS - Plus permissif pour l'application unifiée
app.use(cors({
  origin: true, // Permet toutes les origines
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'client', 'public', 'uploads')));

// Configuration de session pour Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'aynext_session_secret_2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());

// Import des modèles complets
const Settings = require('./src/lib/Settings');
const Cart = require('./src/lib/Cart');
const Order = require('./src/lib/Order');
const User = require('./src/lib/User');
const Product = require('./src/lib/Product');

// Fallback Data
const fallbackAdmin = {
  _id: 'admin-123',
  email: 'ayoubbenromdan8@gmail.com',
  nom: 'Ben Romdan',
  prenom: 'Ayoub',
  motDePasse: '$2a$10$A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.1.2.3.4.5.6.7.8.9.0', // Hashed '52141707'
  role: 'admin'
};
const fallbackProducts = [
  {
    _id: 'product-1',
    nom: 'Hoodie AYNEXT Premium Noir',
    prix: 89.99,
    description: 'Hoodie de qualité premium avec logo AYNEXT personnalisable',
    images: ['/hoodie-real.png', '/hoodie-base.png'],
    couleurs: ['Noir', 'Blanc', 'Gris'],
    tailles: ['S', 'M', 'L', 'XL'],
    categorie: 'Hoodies',
    marque: 'AYNEXT',
    enStock: true
  },
  {
    _id: 'product-2',
    nom: 'Hoodie AYNEXT Premium Blanc',
    prix: 89.99,
    description: 'Hoodie blanc premium avec logo AYNEXT personnalisable',
    images: ['/hoodie-white.jpg', '/hoodie-simple.svg'],
    couleurs: ['Blanc', 'Noir'],
    tailles: ['S', 'M', 'L', 'XL'],
    categorie: 'Hoodies',
    marque: 'AYNEXT',
    enStock: true
  }
];
const fallbackSettings = {
  informationsGenerales: {
    nomBoutique: "AYNEXT",
    email: "contact@aynext.com",
    telephone: "+216 XX XXX XXX",
    adresse: {
      rue: "123 Rue de la Mode",
      ville: "Paris",
      codePostal: "75001"
    }
  },
  paiement: {
    stripe: {
      active: false,
      clePublique: "",
      cleSecrete: ""
    }
  },
  reseauxSociaux: {
    facebook: "https://facebook.com/aynext",
    instagram: "https://instagram.com/aynext"
  }
};

// --- SERVIR LE FRONTEND BUILDÉ ---
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoConnected ? 'connected' : 'fallback_mode'
  });
});

// Admin Login endpoint
app.post('/api/auth/connexion-admin', async (req, res) => {
  const { email, motDePasse } = req.body;
  try {
    let user;
    if (mongoConnected) {
      user = await User.findOne({ email });
    } else {
      user = (email === fallbackAdmin.email) ? fallbackAdmin : null;
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    let isMatch;
    if (mongoConnected) {
      isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    } else {
      // For fallback, compare directly with the hardcoded password
      isMatch = (motDePasse === '52141707');
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès administrateur requis' });
    }
    // Créer un objet user complet pour le token
    const userForToken = {
      _id: user._id,
      email: user.email,
      nom: user.nom || '',
      prenom: user.prenom || '',
      role: user.role
    };
    
    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email, 
      role: user.role,
      user: userForToken  // Ajouter l'objet user complet
    }, process.env.JWT_SECRET || 'fallback_secret_key_2024', { expiresIn: '1h' });
    
    res.status(200).json({ 
      success: true, 
      message: 'Connexion admin réussie', 
      token,
      user: userForToken  // Retourner aussi l'utilisateur dans la réponse
    });
  } catch (error) {
    console.error('Erreur connexion admin:', error);
    return handleMongoError(error, res);
  }
});

// Products endpoint - Géré par src/routes/products.js

// Settings endpoint - maintenant géré par le routeur settings

// Cart endpoint
app.get('/api/cart', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    
    // Récupérer le panier de l'utilisateur depuis la base de données
    const userId = decoded.user?.id || decoded.userId;
    console.log('🔍 GET /api/cart - User ID:', userId);
    
    const cart = await Cart.findOne({ utilisateur: userId })
      .populate('articles.produit');
    
    console.log('🔍 GET /api/cart - Panier trouvé:', cart ? 'OUI' : 'NON');
    if (cart && cart.articles) {
      console.log('🔍 GET /api/cart - Nombre d\'articles:', cart.articles.length);
      cart.articles.forEach((article, index) => {
        console.log(`🔍 GET /api/cart - Article ${index}:`, {
          produit: article.produit ? 'PEUPLÉ' : 'NON PEUPLÉ',
          nom: article.produit?.nom,
          images: article.produit?.images?.length || 0,
          prix: article.prix
        });
      });
    }
    
    if (!cart) {
      // Créer un panier vide si l'utilisateur n'en a pas
      const newCart = new Cart({
        utilisateur: userId,
        articles: []
      });
      await newCart.save();
      res.json({ success: true, cart: newCart });
    } else {
      res.json({ success: true, cart });
    }
    
  } catch (error) {
    console.error('❌ Erreur récupération panier:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: "Token invalide ou expiré" });
    } else {
      return handleMongoError(error, res, { cart: [] });
    }
  }
});

app.post('/api/cart', (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    res.json({ success: true, message: "Article ajouté au panier" });
  } catch (jwtError) {
    res.status(401).json({ success: false, message: "Token invalide ou expiré" });
  }
});

// Endpoint pour ajouter un article au panier
app.post('/api/cart/ajouter', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    const { produitId, quantite, taille, couleur } = req.body;
    const userId = decoded.user?.id || decoded.userId;
    
    console.log('🛒 Ajout au panier:', { produitId, quantite, taille, couleur, userId });
    
    // Vérifier que le produit existe
    const produit = await Product.findById(produitId);
    if (!produit) {
      return res.status(404).json({ success: false, message: "Produit non trouvé" });
    }
    
    // Vérifier le stock
    if (taille) {
      const tailleStock = produit.tailles.find(t => t.nom === taille);
      if (!tailleStock || tailleStock.stock < quantite) {
        return res.status(400).json({ 
          success: false, 
          message: `Stock insuffisant pour la taille ${taille}` 
        });
      }
    }
    
    // Trouver ou créer le panier de l'utilisateur
    let cart = await Cart.findOne({ utilisateur: userId });
    if (!cart) {
      cart = new Cart({
        utilisateur: userId,
        articles: []
      });
    }
    
    // Vérifier si l'article existe déjà dans le panier
    const existingItem = cart.articles.find(item => 
      item.produit.toString() === produitId && 
      item.taille === taille && 
      item.couleur === couleur
    );
    
    if (existingItem) {
      // Mettre à jour la quantité
      existingItem.quantite += quantite;
    } else {
      // Ajouter un nouvel article
      cart.articles.push({
        produit: produitId,
        quantite,
        taille,
        couleur,
        prix: produit.prix
      });
    }
    
    await cart.save();
    
    console.log('✅ Article ajouté au panier avec succès');
    res.json({ 
      success: true, 
      message: "Article ajouté au panier",
      cart: cart
    });
    
  } catch (error) {
    console.error('❌ Erreur ajout panier:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: "Token invalide ou expiré" });
    } else {
      return handleMongoError(error, res);
    }
  }
});

// Endpoint pour vider le panier
app.delete('/api/cart/vider', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    const userId = decoded.user?.id || decoded.userId;
    
    console.log('🗑️ Vidage du panier pour utilisateur:', userId);
    
    // Trouver le panier de l'utilisateur
    const cart = await Cart.findOne({ utilisateur: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Panier non trouvé" });
    }
    
    // Vider le panier
    cart.articles = [];
    await cart.save();
    
    console.log('✅ Panier vidé avec succès');
    res.json({ 
      success: true, 
      message: "Panier vidé avec succès",
      cart: cart
    });
    
  } catch (error) {
    console.error('❌ Erreur vidage panier:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: "Token invalide ou expiré" });
    } else {
      return handleMongoError(error, res);
    }
  }
});

// ==================== OAUTH ROUTES ====================
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

// ==================== PRODUCTS ROUTES ====================
app.use('/api/products', productsRoutes);

// ==================== CART ROUTES ====================
app.use('/api/cart', cartRoutes);

// ==================== SETTINGS ROUTES ====================
// Passer l'instance io au routeur settings
app.use('/api/settings', (req, res, next) => {
  req.app.set('io', io);
  next();
}, settingsRoutes);

// Endpoint pour créer une commande
app.post('/api/orders', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    const userId = decoded.user?.id || decoded.userId;
    
    const { articles, adresseLivraison, methodePaiement, notes } = req.body;
    
    console.log('📦 Création de commande:', { 
      userId, 
      articles: articles?.length, 
      methodePaiement,
      adresseLivraison,
      notes,
      bodyKeys: Object.keys(req.body)
    });
    
    // Vérifier que le panier existe et n'est pas vide
    const cart = await Cart.findOne({ utilisateur: userId }).populate('articles.produit');
    if (!cart || !cart.articles || cart.articles.length === 0) {
      return res.status(400).json({ success: false, message: "Panier vide" });
    }
    
    console.log('🛒 Panier récupéré:', {
      articlesCount: cart.articles.length,
      articles: cart.articles.map(article => ({
        nom: article.nom,
        type: article.type,
        prix: article.prix,
        prixUnitaire: article.prixUnitaire,
        quantite: article.quantite,
        produit: article.produit ? article.produit._id : 'null',
        customData: article.customData
      }))
    });
    
    // Calculer le total
    const total = cart.articles.reduce((sum, article) => {
      const prix = Number(article.prix) || Number(article.prixUnitaire) || 0;
      console.log('💰 Calcul prix article:', {
        nom: article.nom,
        prix: article.prix,
        prixUnitaire: article.prixUnitaire,
        prixCalcule: prix,
        quantite: article.quantite,
        total: prix * article.quantite
      });
      return sum + (prix * Number(article.quantite));
    }, 0);
    
    // Générer un numéro de commande unique
    const numeroCommande = 'CMD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    // Créer la commande
    const order = new Order({
      numeroCommande,
      utilisateur: userId,
      articles: cart.articles.map(article => {
        const orderArticle = {
          produit: article.produit ? article.produit._id : null,
          nom: article.nom || (article.produit ? article.produit.nom : 'Article personnalisé'),
          quantite: article.quantite,
          taille: article.taille,
          couleur: article.couleur,
          prixUnitaire: article.prix || article.prixUnitaire,
          prixTotal: (article.prix || article.prixUnitaire) * article.quantite,
          type: article.type || 'standard'
        };
        
        // Ajouter les données personnalisées si c'est un article personnalisé
        if (article.type === 'custom_hoodie' && article.customData) {
          orderArticle.customData = article.customData;
        }
        
        return orderArticle;
      }),
      sousTotal: total,
      fraisLivraison: 10.00,
      reduction: 0,
      total: parseFloat((total + 10.00).toFixed(2)), // + frais de livraison
      statut: 'en_attente',
      adresseLivraison: adresseLivraison || {},
      methodePaiement: methodePaiement || 'carte',
      notes: notes || ''
    });
    
    console.log('💾 Sauvegarde de la commande avec methodePaiement:', order.methodePaiement);
    await order.save();
    
    // Vider le panier après création de la commande
    cart.articles = [];
    await cart.save();
    
    console.log('✅ Commande créée:', order.numeroCommande);
    
    // Émettre un événement WebSocket pour la nouvelle commande
    io.emit('new-order', {
      type: 'new_order',
      order: order,
      timestamp: new Date()
    });
    
    // Émettre aussi aux admins
    io.to('admin-room').emit('admin-new-order', {
      type: 'admin_new_order',
      order: order,
      timestamp: new Date()
    });
    
    console.log('🔌 Événement WebSocket émis: nouvelle commande créée');
    
    res.status(201).json({ 
      success: true, 
      message: "Commande créée avec succès",
      order: {
        _id: order._id,
        numeroCommande: order.numeroCommande,
        total: order.total,
        statut: order.statut,
        dateCommande: order.dateCommande
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur création commande:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: "Token invalide ou expiré" });
    } else {
      return handleMongoError(error, res);
    }
  }
});

// Endpoint pour ajouter un hoodie personnalisé au panier
app.post('/api/orders/custom-hoodie', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    const userId = decoded.user?.id || decoded.userId;
    
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
    
    console.log('🎨 Ajout de hoodie personnalisé au panier:', { 
      userId, 
      type,
      couleur,
      couleurNom,
      logoPosition,
      logoSize,
      prix,
      quantite,
      taille
    });
    
    // Validation des données
    if (!type || type !== 'custom_hoodie') {
      return res.status(400).json({ success: false, message: "Type de commande invalide" });
    }
    
    if (!couleur || !logo || !logoPosition || !prix || !quantite || !taille) {
      return res.status(400).json({ success: false, message: "Données manquantes pour le hoodie personnalisé" });
    }
    
    // Trouver ou créer le panier de l'utilisateur
    let cart = await Cart.findOne({ utilisateur: userId });
    if (!cart) {
      cart = new Cart({ 
        utilisateur: userId, 
        articles: [] 
      });
    }
    
    // Créer l'article personnalisé pour le panier
    const customHoodieArticle = {
      produit: null, // Pas de produit spécifique
      nom: `Hoodie personnalisé - ${couleurNom || 'Couleur personnalisée'}`,
      quantite: parseInt(quantite),
      taille: taille,
      couleur: couleur,
      prix: parseFloat(prix),
      type: 'custom_hoodie',
      customData: {
        logo: logo,
        logoPosition: logoPosition,
        logoSize: parseInt(logoSize),
        couleurCode: couleur,
        couleurNom: couleurNom || 'Couleur personnalisée'
      },
      notes: notes || ''
    };
    
    // Ajouter l'article au panier
    cart.articles.push(customHoodieArticle);
    await cart.save();
    
    console.log('✅ Hoodie personnalisé ajouté au panier:', customHoodieArticle.nom);
    
    res.status(201).json({
      success: true,
      message: 'Hoodie personnalisé ajouté au panier avec succès',
      article: customHoodieArticle,
      cart: cart
    });
    
  } catch (error) {
    console.error('❌ Erreur ajout hoodie personnalisé au panier:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: "Token invalide ou expiré" });
    } else {
      return handleMongoError(error, res);
    }
  }
});

// Orders endpoint
app.get('/api/orders', async (req, res) => {
  console.log('📦 GET /api/orders - Requête reçue');
  console.log('📋 Headers:', req.headers);
  
  const token = req.headers['x-auth-token'];
  console.log('🔑 Token reçu:', token ? `${token.substring(0, 50)}...` : 'AUCUN');
  
  if (!token) {
    console.log('❌ Aucun token fourni');
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    const userId = decoded.user?.id || decoded.userId;
    
    console.log('📦 Récupération des commandes pour utilisateur:', userId);
    
    // Récupérer les commandes de l'utilisateur depuis la base de données
    const orders = await Order.find({ utilisateur: userId })
      .populate('articles.produit')
      .sort({ dateCommande: -1 }); // Plus récentes en premier
    
    console.log(`✅ ${orders.length} commandes trouvées pour l'utilisateur`);
    console.log('📋 Première commande methodePaiement:', orders[0]?.methodePaiement);
    
    // Debug des articles
    if (orders.length > 0) {
      orders.forEach((order, orderIndex) => {
        console.log(`🔍 Commande ${orderIndex + 1} (${order.numeroCommande}):`);
        console.log(`   - Articles: ${order.articles?.length || 0}`);
        if (order.articles && order.articles.length > 0) {
          order.articles.forEach((article, articleIndex) => {
            console.log(`   - Article ${articleIndex + 1}:`, {
              produit: article.produit ? 'PEUPLÉ' : 'NON PEUPLÉ',
              nom: article.produit?.nom || article.nom,
              images: article.produit?.images?.length || 0,
              prix: article.prix
            });
          });
        }
      });
    }
    
    res.json({ 
      success: true, 
      orders: orders.map(order => ({
        _id: order._id,
        numeroCommande: order.numeroCommande,
        statut: order.statut,
        total: order.total,
        dateCommande: order.dateCommande,
        adresseLivraison: order.adresseLivraison,
        methodePaiement: order.methodePaiement,
        notes: order.notes,
        articles: order.articles.map(article => ({
          _id: article._id,
          quantite: article.quantite,
          taille: article.taille,
          couleur: article.couleur,
          prix: article.prix,
          prixUnitaire: article.prixUnitaire,
          type: article.type,
          customData: article.customData,
          produit: article.produit ? {
            _id: article.produit._id,
            nom: article.produit.nom,
            marque: article.produit.marque,
            images: article.produit.images
          } : null
        }))
      }))
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération commandes:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: "Token invalide ou expiré" });
    } else {
      return handleMongoError(error, res, { orders: [] });
    }
  }
});

// Admin orders endpoint
app.get('/api/orders/admin/toutes', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Accès administrateur requis" });
    }
    
    let orders = [];
    if (mongoConnected) {
      orders = await Order.find().populate('utilisateur', 'email nom').populate('articles.produit');
      console.log('🔍 Orders found in DB:', orders.length);
      if (orders.length > 0) {
        console.log('🔍 First order from DB:', orders[0]);
        console.log('🔍 First order _id:', orders[0]._id);
        console.log('🔍 First order id:', orders[0].id);
        console.log('🔍 First order keys:', Object.keys(orders[0]));
        console.log('🔍 First order _id type:', typeof orders[0]._id);
        console.log('🔍 First order _id value:', orders[0]._id?.toString());
      }
    }
    
    res.json({ success: true, commandes: orders, total: orders.length });
  } catch (jwtError) {
    res.status(401).json({ success: false, message: "Token invalide ou expiré" });
  }
});

// Configuration de multer pour l'upload d'images
const uploadsDir = path.join(__dirname, 'client', 'public', 'uploads', 'products');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accepter uniquement les images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Upload endpoint (pour l'admin)
app.post('/api/upload/product-images', (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Accès administrateur requis" });
    }
    
    // Continuer avec l'upload
    next();
  } catch (jwtError) {
    return res.status(401).json({ success: false, message: "Token invalide ou expiré" });
  }
}, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Aucune image n'a été uploadée" 
      });
    }
    
    // Générer les URLs des images uploadées
    const imageUrls = req.files.map(file => ({
      url: `/uploads/products/${file.filename}`,
      filename: file.filename
    }));
    
    console.log(`📸 ${req.files.length} image(s) uploadée(s):`, imageUrls.map(img => img.filename));
    
    res.json({ 
      success: true, 
      images: imageUrls
    });
  } catch (error) {
    console.error('❌ Erreur upload images:', error);
    return handleMongoError(error, res);
  }
});

// Product creation endpoint
app.post('/api/products', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Accès administrateur requis" });
    }
    
    const productData = req.body;
    
    // Log des données reçues pour débogage
    console.log('📦 Données produit reçues:', JSON.stringify(productData, null, 2));
    
    // Validation des données requises
    if (!productData.nom || !productData.prix) {
      return res.status(400).json({ 
        success: false, 
        message: "Le nom et le prix sont requis" 
      });
    }
    
    let newProduct;
    if (mongoConnected) {
      // Créer le produit en base de données
      newProduct = new Product({
        nom: productData.nom,
        prix: parseFloat(productData.prix),
        prixReduit: productData.prixReduit ? parseFloat(productData.prixReduit) : null,
        description: productData.description || '',
        images: productData.images || [],
        categories: productData.categories || [],
        marques: productData.marques || [],
        categorie: productData.categorie || '',
        marque: productData.marque || '',
        genre: productData.genre || '',
        tailles: productData.tailles || [],
        couleurs: Array.isArray(productData.couleurs) ? productData.couleurs : [],
        stock: parseInt(productData.stock) || 0,
        estPersonnalise: productData.estPersonnalise || false,
        estNouveau: productData.estNouveau || false,
        estEnVente: productData.estEnVente || false
      });
      
      await newProduct.save();
      console.log('✅ Produit créé en base de données:', newProduct._id);
      
      // Émettre l'événement WebSocket aux admins
      if (global.emitToAdmins) {
        global.emitToAdmins('product-added', {
          product: newProduct,
          addedBy: decoded.email || 'Admin'
        });
      }
    } else {
      return res.status(503).json({ 
        success: false, 
        message: "Base de données non disponible" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Produit créé avec succès",
      product: newProduct
    });
  } catch (error) {
    console.error('❌ Erreur création produit:', error);
    return handleMongoError(error, res);
  }
});

// Admin check endpoint
app.get('/api/admin/check', (req, res) => {
  res.json({ success: true, exists: true });
});

// Test endpoint pour vérifier l'utilisateur admin
app.get('/api/admin/test-user', async (req, res) => {
  try {
    const adminEmail = 'ayoubbenromdan8@gmail.com';
    const user = await User.findOne({ email: adminEmail });
    
    if (!user) {
      res.json({ 
        success: false, 
        message: 'Utilisateur admin non trouvé',
        email: adminEmail
      });
    } else {
      res.json({ 
        success: true, 
        user: {
          _id: user._id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role
        }
      });
    }
  } catch (error) {
    console.error('Erreur test utilisateur admin:', error);
    return handleMongoError(error, res, { exists: false });
  }
});

// Endpoint pour récupérer les informations utilisateur
app.get('/api/auth/utilisateur', async (req, res) => {
  const token = req.headers['x-auth-token'];
  console.log('🔑 /api/auth/utilisateur - Token reçu:', token ? `${token.substring(0, 50)}...` : 'AUCUN');
  
  if (!token) {
    console.log('❌ /api/auth/utilisateur - Aucun token fourni');
    return res.status(401).json({ success: false, message: 'Token requis' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    console.log('✅ /api/auth/utilisateur - Token décodé:', decoded);
    console.log('🔍 /api/auth/utilisateur - Structure du token:', {
      hasUser: !!decoded.user,
      hasUserId: !!decoded.userId,
      userStructure: decoded.user,
      userIdValue: decoded.userId
    });
    
    // Essayer différentes structures de token
    let userId;
    if (decoded.user && decoded.user.id) {
      userId = decoded.user.id;
    } else if (decoded.userId) {
      userId = decoded.userId;
    } else if (decoded.id) {
      userId = decoded.id;
    } else {
      console.log('❌ /api/auth/utilisateur - Aucun ID utilisateur trouvé dans le token');
      return res.status(401).json({ success: false, message: 'Token invalide - ID utilisateur manquant' });
    }
    
    console.log('🔍 /api/auth/utilisateur - ID utilisateur à chercher:', userId);
    
    // Pour les admins, utiliser directement les données du token pour éviter les problèmes de DB
    if (decoded.role === 'admin' && decoded.user) {
      console.log('🚨🚨🚨 CORRECTION ADMIN APPLIQUÉE - SERVEUR MODIFIÉ 🚨🚨🚨');
      console.log('👑 /api/auth/utilisateur - Admin détecté, utilisation des données du token');
      console.log('✅ /api/auth/utilisateur - Admin depuis token:', decoded.user);
      return res.json({ success: true, user: decoded.user });
    }
    
    // Vérifier si MongoDB est connecté
    if (!mongoConnected) {
      console.log('⚠️ /api/auth/utilisateur - MongoDB non connecté, utilisation des données du token');
      // Retourner les informations du token si MongoDB n'est pas disponible
      const userFromToken = decoded.user || {
        _id: userId,
        email: decoded.email || 'user@example.com',
        nom: decoded.nom || '',
        prenom: decoded.prenom || '',
        role: decoded.role || 'client'
      };
      console.log('✅ /api/auth/utilisateur - Utilisateur depuis token:', userFromToken);
      return res.json({ success: true, user: userFromToken });
    }
    
    // Récupérer les informations complètes de l'utilisateur depuis la base de données
    console.log('🔍 /api/auth/utilisateur - Recherche utilisateur avec ID:', userId);
    const user = await User.findById(userId).select('-motDePasse');
    console.log('🔍 /api/auth/utilisateur - Utilisateur trouvé:', user ? `${user.email} (${user._id})` : 'AUCUN');
    console.log('🔍 /api/auth/utilisateur - Type de user:', typeof user);
    console.log('🔍 /api/auth/utilisateur - User null?', user === null);
    
    if (!user) {
      console.log('⚠️ /api/auth/utilisateur - Utilisateur non trouvé dans la DB, utilisation des données du token');
      // Si l'utilisateur n'est pas trouvé dans la DB, utiliser les données du token
      const userFromToken = decoded.user || {
        _id: userId,
        email: decoded.email || 'user@example.com',
        nom: decoded.nom || '',
        prenom: decoded.prenom || '',
        role: decoded.role || 'client'
      };
      console.log('✅ /api/auth/utilisateur - Utilisateur depuis token:', userFromToken);
      return res.json({ success: true, user: userFromToken });
    }
    
    console.log('✅ /api/auth/utilisateur - Envoi utilisateur:', { email: user.email, nom: user.nom, prenom: user.prenom });
    res.json({ success: true, user: user });
  } catch (error) {
    console.error('❌ /api/auth/utilisateur - Erreur complète:', error);
    console.error('❌ /api/auth/utilisateur - Message d\'erreur:', error.message);
    console.error('❌ /api/auth/utilisateur - Stack trace:', error.stack);
    
    // Si c'est une erreur de connexion MongoDB, retourner une erreur plus spécifique
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
      console.log('⚠️ /api/auth/utilisateur - Erreur de connexion MongoDB, utilisation des données du token');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
        const userFromToken = decoded.user || {
          _id: decoded.userId || decoded.id,
          email: decoded.email || 'user@example.com',
          nom: decoded.nom || '',
          prenom: decoded.prenom || '',
          role: decoded.role || 'client'
        };
        return res.json({ success: true, user: userFromToken });
      } catch (jwtError) {
        return res.status(401).json({ success: false, message: 'Token invalide' });
      }
    }
    
    return handleMongoError(error, res);
  }
});

// Endpoint pour les statistiques admin
app.get('/api/admin/stats', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requis' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès admin requis' });
    }
    
    let stats = {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0
    };
    
    if (mongoConnected) {
      stats.totalUsers = await User.countDocuments();
      stats.totalProducts = await Product.countDocuments();
      stats.totalOrders = await Order.countDocuments();
      
      // Calculer le revenu total SEULEMENT pour les commandes confirmées
      const revenueResult = await Order.aggregate([
        { $match: { statut: 'confirmee' } }, // Filtrer seulement les commandes confirmées
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]);
      stats.totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    } else {
      // Mode fallback - utiliser les données statiques
      console.log('⚠️ /api/admin/stats - Mode fallback activé');
      stats.totalUsers = 1; // L'admin existe
      stats.totalProducts = fallbackProducts.length;
      stats.totalOrders = 0; // Pas de commandes en mode fallback
      stats.totalRevenue = 0; // Pas de revenu en mode fallback
    }
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token invalide' });
    } else {
      return handleMongoError(error, res, { 
        stats: {
          totalUsers: 0, 
          totalProducts: 0, 
          totalOrders: 0, 
          totalRevenue: 0 
        }
      });
    }
  }
});

// Endpoint pour récupérer tous les utilisateurs (admin)
app.get('/api/users/admin/tous', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requis' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès admin requis' });
    }
    
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    let query = {};
    
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }
    if (role) {
      query.role = role;
    }
    
    let users = [];
    let total = 0;
    
    if (mongoConnected) {
      users = await User.find(query)
        .select('-motDePasse')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ dateCreation: -1 });
      
      total = await User.countDocuments(query);
    }
    
    res.json({
      success: true,
      utilisateurs: users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
});

// Endpoint pour récupérer un produit par ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    let product;
    
    if (mongoConnected) {
      product = await Product.findById(productId);
    } else {
      // Fallback data
      product = null;
    }
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    return handleMongoError(error, res);
  }
});

// Endpoint pour mettre à jour un produit
app.put('/api/products/:id', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requis' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès admin requis' });
    }
    
    const productId = req.params.id;
    const updateData = req.body;
    
    let updatedProduct;
    if (mongoConnected) {
      updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    } else {
      return res.status(503).json({ success: false, message: 'Base de données non disponible' });
    }
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    
    // Émettre l'événement WebSocket aux admins
    if (global.emitToAdmins) {
      global.emitToAdmins('product-updated', {
        product: updatedProduct,
        updatedBy: decoded.email || 'Admin'
      });
    }
    
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    return handleMongoError(error, res);
  }
});

// Endpoint pour supprimer un produit
app.delete('/api/products/:id', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requis' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès admin requis' });
    }
    
    const productId = req.params.id;
    
    if (mongoConnected) {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      }
      
      // Émettre l'événement WebSocket aux admins
      if (global.emitToAdmins) {
        global.emitToAdmins('product-deleted', {
          productId: productId,
          productName: deletedProduct.nom,
          deletedBy: decoded.email || 'Admin'
        });
      }
    } else {
      return res.status(503).json({ success: false, message: 'Base de données non disponible' });
    }
    
    res.json({ success: true, message: 'Produit supprimé avec succès' });
  } catch (error) {
    return handleMongoError(error, res);
  }
});

// Endpoint pour mettre à jour le statut d'une commande
app.put('/api/orders/:id/statut', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requis' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès admin requis' });
    }
    
    const orderId = req.params.id;
    const { statut } = req.body;
    
    console.log('🔍 PUT /api/orders/:id/statut - Order ID:', orderId);
    console.log('🔍 PUT /api/orders/:id/statut - New status:', statut);
    console.log('🔍 PUT /api/orders/:id/statut - Order ID type:', typeof orderId);
    
    if (!orderId || orderId === 'undefined') {
      console.error('❌ Invalid order ID:', orderId);
      return res.status(400).json({ success: false, message: 'ID de commande invalide' });
    }
    
    if (mongoConnected) {
      const updatedOrder = await Order.findByIdAndUpdate(orderId, { statut }, { new: true })
        .populate('utilisateur', 'email nom prenom')
        .populate('articles.produit');
      
      if (!updatedOrder) {
        console.error('❌ Order not found with ID:', orderId);
        return res.status(404).json({ success: false, message: 'Commande non trouvée' });
      }
      
      console.log('✅ Order updated successfully:', updatedOrder._id);
      
      // Envoyer un email au client pour le nouveau statut
      try {
        if (updatedOrder.utilisateur && updatedOrder.utilisateur.email) {
          console.log(`📧 Envoi d'email de notification de statut au client: ${updatedOrder.utilisateur.email}`);
          
          // Envoyer l'email de manière asynchrone (ne pas bloquer la réponse)
          emailService.sendOrderStatusEmail(updatedOrder.utilisateur, updatedOrder, statut)
            .then(result => {
              if (result.success) {
                console.log(`✅ Email de statut envoyé avec succès à ${updatedOrder.utilisateur.email}`);
                console.log(`📧 Message ID: ${result.messageId}`);
              } else {
                console.log(`⚠️ Erreur lors de l'envoi de l'email: ${result.error}`);
              }
            })
            .catch(error => {
              console.error(`❌ Erreur lors de l'envoi de l'email de statut:`, error.message);
            });
        } else {
          console.log('⚠️ Pas d\'email utilisateur disponible pour la notification');
        }
      } catch (emailError) {
        console.error('❌ Erreur lors de la préparation de l\'email:', emailError.message);
        // Ne pas bloquer la mise à jour du statut si l'email échoue
      }
      
      // Émettre un événement WebSocket pour notifier tous les clients
      console.log('🔌 Émission WebSocket: order-status-updated');
      io.emit('order-status-updated', {
        type: 'order_status_updated',
        orderId: updatedOrder._id,
        newStatus: statut,
        order: updatedOrder,
        timestamp: new Date(),
        updatedBy: decoded.email || 'admin'
      });
      
      // Émettre aussi un événement spécifique pour les admins
      io.to('admin-room').emit('admin-order-updated', {
        type: 'admin_order_updated',
        orderId: updatedOrder._id,
        newStatus: statut,
        order: updatedOrder,
        timestamp: new Date(),
        updatedBy: decoded.email || 'admin'
      });
      
      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(503).json({ success: false, message: 'Base de données non disponible' });
    }
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    return handleMongoError(error, res);
  }
});

// Endpoint pour les statistiques utilisateur (admin)
app.get('/api/users/admin/:userId/stats', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requis' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès admin requis' });
    }
    
    const userId = req.params.userId;
    console.log('📊 Récupération des statistiques pour l\'utilisateur:', userId);
    
    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId).select('-motDePasse');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Récupérer les commandes de l'utilisateur depuis la collection orders
    const orders = await Order.find({ utilisateur: userId });
    console.log('📦 Nombre total de commandes trouvées:', orders.length);
    
    // Filtrer uniquement les commandes confirmées
    const commandesConfirmees = orders.filter(order => order.statut === 'confirmee');
    const nombreCommandes = commandesConfirmees.length;
    const totalDepense = commandesConfirmees.reduce((total, order) => {
      return total + (order.total || 0);
    }, 0);
    
    console.log('✅ Statistiques calculées:', {
      nombreCommandes,
      totalDepense
    });
    
    res.json({
      utilisateur: user,
      statistiques: {
        nombreCommandes,
        totalDepense,
        commandes: orders
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors du chargement des statistiques:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
});

// Auth check endpoint
app.get('/api/auth/check', (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token d'authentification requis" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    res.json({ 
      success: true, 
      user: { 
        _id: decoded.userId, 
        email: decoded.email, 
        role: decoded.role 
      } 
    });
  } catch (jwtError) {
    res.status(401).json({ success: false, message: "Token invalide ou expiré" });
  }
});

// Endpoint de test pour émettre manuellement les statistiques
app.get('/api/test/emit-stats', async (req, res) => {
  try {
    console.log('🧪 Test manuel d\'émission des statistiques...');
    
    if (global.emitStatsUpdate) {
      await global.emitStatsUpdate(io);
      res.json({ success: true, message: 'Statistiques émises via WebSocket' });
    } else {
      res.json({ success: false, message: 'emitStatsUpdate non disponible' });
    }
  } catch (error) {
    console.error('Erreur test émission:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'émission' });
  }
});

// --- SERVIR LE FRONTEND POUR TOUTES LES AUTRES ROUTES ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// WebSocket Events
io.on('connection', (socket) => {
  console.log('✅ Client connecté:', socket.id);

  // Test de connexion
  socket.on('test-connection', (data) => {
    console.log('🧪 Test reçu de', socket.id, ':', data);
    socket.emit('test-response', { message: 'Test réussi depuis le serveur', timestamp: new Date() });
  });

  // Rejoindre la room admin
  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log('👨‍💼 Admin rejoint la room:', socket.id);
    console.log('📡 Nombre total de clients dans admin-room:', io.sockets.adapter.rooms.get('admin-room')?.size || 0);
  });

  // Quitter la room admin
  socket.on('leave-admin', () => {
    socket.leave('admin-room');
    console.log('👋 Admin quitte la room:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client déconnecté:', socket.id);
  });
});

// Fonction pour émettre les statistiques mises à jour
const emitStatsUpdate = async (io) => {
  try {
    const User = require('./src/lib/User');
    const Product = require('./src/lib/Product');
    const Order = require('./src/lib/Order');
    
    const [
      totalUsers,
      totalProducts,
      totalOrders
    ] = await Promise.all([
      User.countDocuments({ role: 'client' }),
      Product.countDocuments(),
      Order.countDocuments()
    ]);

    // Calculer le chiffre d'affaires (seulement les commandes confirmées)
    const confirmedOrders = await Order.find({ statut: 'confirmee' }, 'total');
    const chiffreAffaires = confirmedOrders.reduce((total, order) => total + (order.total || 0), 0);

    const stats = {
      totalUsers,
      totalProducts,
      totalOrders,
      chiffreAffaires
    };

    // Émettre les statistiques mises à jour à tous les admins connectés
    console.log('📊 Émission des statistiques WebSocket:', stats);
    console.log('📡 Nombre de clients dans admin-room:', io.sockets.adapter.rooms.get('admin-room')?.size || 0);
    io.to('admin-room').emit('stats-updated', stats);
    console.log('✅ Statistiques mises à jour émises via WebSocket');
  } catch (error) {
    console.error('Erreur lors de l\'émission des statistiques:', error);
  }
};

// Rendre la fonction accessible globalement
global.emitStatsUpdate = emitStatsUpdate;

// Rendre io accessible aux routes
app.set('io', io);


// Fonction helper pour émettre aux admins
global.emitToAdmins = (event, data) => {
  io.to('admin-room').emit(event, data);
  console.log(`📡 Événement émis aux admins: ${event}`, data);
};

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Serveur unifié démarré sur le port ${PORT}`);
  console.log(`📱 Frontend accessible sur: http://localhost:${PORT}`);
  console.log(`🔧 API accessible sur: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket activé sur le port ${PORT}`);
});