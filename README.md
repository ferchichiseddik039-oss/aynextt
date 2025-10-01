# 🛍️ Boutique Vêtements - Site E-commerce Complet

Une boutique de vêtements en ligne moderne et complète avec backend Node.js/Express et frontend React.

## ✨ Fonctionnalités

### 🎯 Frontend
- **Interface moderne et responsive** avec design Material Design
- **Navigation intuitive** avec menu mobile adaptatif
- **Recherche de produits** avec filtres avancés
- **Système de panier** en temps réel
- **Gestion des comptes utilisateurs** (inscription, connexion, profil)
- **Processus de commande** complet
- **Tableau de bord administrateur** pour la gestion

### 🔧 Backend
- **API REST complète** avec Express.js
- **Base de données MongoDB** avec Mongoose
- **Authentification JWT** sécurisée
- **Gestion des rôles** (client/admin)
- **Validation des données** avec express-validator
- **Gestion des fichiers** avec Multer
- **Sécurité renforcée** avec Helmet et CORS

### 📊 Base de Données
- **Modèles complets** : Utilisateurs, Produits, Panier, Commandes
- **Relations optimisées** entre les entités
- **Index de recherche** pour de meilleures performances
- **Validation des schémas** MongoDB

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd boutique-vetements
```

### 2. Installer les dépendances backend
```bash
npm install
```

### 3. Installer les dépendances frontend
```bash
cd client
npm install
cd ..
```

### 4. Configuration des variables d'environnement
Créer un fichier `.env` à la racine du projet :
```env
MONGODB_URI=mongodb://localhost:27017/boutique-vetements
JWT_SECRET=votre_secret_jwt_tres_securise_ici
PORT=5000
NODE_ENV=development
```

### 5. Démarrer MongoDB
```bash
# Local
mongod

# Ou utiliser MongoDB Atlas (cloud)
```

### 6. Démarrer le serveur de développement
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

### 7. Accéder à l'application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000

### 🗄️ Peupler la base de données
```bash
npm run seed
```
Cela créera un utilisateur admin et des produits de démonstration.

## 📁 Structure du Projet

```
boutique-vetements/
├── src/
│   ├── lib/                 # Modèles MongoDB
│   │   ├── User.js         # Modèle utilisateur
│   │   ├── Product.js      # Modèle produit
│   │   ├── Cart.js         # Modèle panier
│   │   └── Order.js        # Modèle commande
│   ├── routes/             # Routes API
│   │   ├── auth.js         # Authentification
│   │   ├── products.js     # Gestion produits
│   │   ├── cart.js         # Gestion panier
│   │   ├── orders.js       # Gestion commandes
│   │   └── users.js        # Gestion utilisateurs
│   └── middleware/         # Middleware
│       ├── auth.js         # Vérification JWT
│       └── admin.js        # Vérification admin
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   │   ├── Header.js   # En-tête avec navigation
│   │   │   ├── Footer.js   # Pied de page
│   │   │   ├── ProtectedRoute.js # Route protégée
│   │   │   └── AdminRoute.js     # Route admin
│   │   ├── pages/          # Pages de l'application
│   │   │   ├── Home.js     # Page d'accueil
│   │   │   ├── Products.js # Catalogue des produits
│   │   │   ├── ProductDetail.js # Détail d'un produit
│   │   │   ├── Login.js    # Connexion
│   │   │   ├── Register.js # Inscription
│   │   │   ├── Cart.js     # Panier d'achat
│   │   │   ├── Profile.js  # Profil utilisateur
│   │   │   └── Admin.js    # Interface d'administration
│   │   ├── contexts/       # Contextes React
│   │   │   ├── AuthContext.js # Gestion de l'authentification
│   │   │   └── CartContext.js  # Gestion du panier
│   │   ├── styles/         # Fichiers CSS
│   │   └── App.js          # Composant principal
│   └── public/             # Fichiers statiques
├── server.js               # Serveur Express principal
├── package.json            # Dépendances backend
└── README.md               # Documentation
```

## 🔐 API Endpoints

### Authentification
- `POST /api/auth/inscription` - Inscription utilisateur
- `POST /api/auth/connexion` - Connexion utilisateur
- `GET /api/auth/utilisateur` - Profil utilisateur connecté

### Produits
- `GET /api/products` - Liste des produits avec filtres
- `GET /api/products/:id` - Détail d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Panier
- `GET /api/cart` - Obtenir le panier
- `POST /api/cart/ajouter` - Ajouter un article
- `PUT /api/cart/modifier/:id` - Modifier la quantité
- `DELETE /api/cart/supprimer/:id` - Supprimer un article
- `DELETE /api/cart/vider` - Vider le panier

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Historique des commandes
- `GET /api/orders/:id` - Détail d'une commande
- `PUT /api/orders/:id/statut` - Mettre à jour le statut (admin)

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil
- `PUT /api/users/password` - Changer le mot de passe

## ✨ Fonctionnalités

### 🛍️ Boutique en ligne
- **Catalogue de produits** avec filtres avancés (catégorie, marque, prix, taille, couleur)
- **Recherche de produits** avec suggestions
- **Galerie d'images** pour chaque produit
- **Système de tailles et couleurs** avec gestion du stock
- **Prix promotionnels** et calcul automatique des réductions

### 👤 Gestion des utilisateurs
- **Inscription et connexion** sécurisées
- **Profils personnalisables** avec adresses de livraison
- **Historique des commandes** détaillé
- **Liste de souhaits** personnelle
- **Gestion des préférences** de communication

### 🛒 Panier et commandes
- **Panier persistant** synchronisé avec le compte utilisateur
- **Gestion des quantités** et options de produits
- **Processus de commande** simplifié
- **Suivi des commandes** en temps réel
- **Calcul automatique** des frais de livraison

### 🔐 Administration
- **Tableau de bord** avec statistiques en temps réel
- **Gestion des produits** (CRUD complet)
- **Gestion des commandes** avec mise à jour des statuts
- **Gestion des utilisateurs** et rôles
- **Interface responsive** pour tous les appareils

### 📱 Expérience utilisateur
- **Design responsive** optimisé mobile/desktop
- **Navigation intuitive** avec breadcrumbs
- **Notifications toast** pour le feedback utilisateur
- **Chargement progressif** des données
- **Gestion des erreurs** élégante

## 🎨 Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hashage des mots de passe
- **express-validator** - Validation des données
- **Multer** - Gestion des fichiers
- **Helmet** - Sécurité
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React** - Bibliothèque UI
- **React Router** - Navigation
- **Axios** - Client HTTP
- **React Icons** - Icônes
- **React Toastify** - Notifications
- **CSS Variables** - Design system

## 🔒 Sécurité

- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe
- **Helmet** pour les en-têtes de sécurité
- **Validation** des données côté serveur
- **CORS** configuré pour la sécurité
- **Variables d'environnement** pour les secrets

## 📱 Responsive Design

- **Mobile-first** approach
- **Grid CSS** pour la mise en page
- **Flexbox** pour l'alignement
- **Media queries** pour l'adaptation
- **Design system** cohérent

## 🧪 Test de l'application

### Identifiants de test
Après avoir exécuté `npm run seed`, vous pouvez vous connecter avec :

**Compte administrateur :**
- Email: `admin@boutiquevetements.fr`
- Mot de passe: `admin123`

**Fonctionnalités à tester :**
1. **Navigation** : Parcourez toutes les pages
2. **Inscription** : Créez un nouveau compte
3. **Connexion** : Connectez-vous avec le compte admin
4. **Produits** : Explorez le catalogue avec filtres
5. **Panier** : Ajoutez des produits et gérez les quantités
6. **Commande** : Passez une commande complète
7. **Administration** : Accédez au tableau de bord admin
8. **Gestion** : Modifiez des produits et commandes

## 🚀 Déploiement

### Production
```bash
# Build du frontend
npm run build

# Démarrage en production
npm start
```

### Variables d'environnement production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secret_production_tres_securise
PORT=5000
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation API

## 🎯 Roadmap

- [ ] Système de paiement (Stripe)
- [ ] Notifications push
- [ ] Système de fidélité
- [ ] Application mobile
- [ ] Intégration analytics
- [ ] Tests automatisés
- [ ] CI/CD pipeline

---

**Développé avec ❤️ pour la mode et le style**
