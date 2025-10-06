# 🚀 Boutique AYNEXT - Application Unifiée

## 📋 Description
Application e-commerce complète avec frontend React et backend Express unifiés dans un seul déploiement.

## 🏗️ Structure
```
boutique-unified/
├── build/              # Frontend React construit
├── frontend/           # Code source React
├── server.js          # Serveur Express unifié
├── package.json       # Dépendances et scripts
└── README.md          # Documentation
```

## 🚀 Déploiement Rapide

### 1. Variables d'environnement
Créez un fichier `.env` avec :
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements
JWT_SECRET=your_jwt_secret_key_here
PORT=5001
NODE_ENV=production
```

### 2. Installation et Build
```bash
npm install
npm run build
```

### 3. Démarrage
```bash
npm start
```

## 🔧 Scripts Disponibles

- `npm start` - Démarre le serveur de production
- `npm run build` - Construit le frontend et copie dans build/
- `npm run build:frontend` - Construit uniquement le frontend
- `npm run copy:build` - Copie le build frontend dans build/
- `npm run dev` - Démarre en mode développement avec nodemon

## 🌐 Accès

- **Frontend** : `http://localhost:5001`
- **API** : `http://localhost:5001/api`
- **Admin** : `http://localhost:5001/admin-login`

## 👤 Connexion Admin
- Email : `ayoubbenromdan8@gmail.com`
- Mot de passe : `52141707`

## 📱 Fonctionnalités

### Frontend
- ✅ Interface React complète
- ✅ Authentification
- ✅ Gestion des produits
- ✅ Panier d'achat
- ✅ Interface admin
- ✅ Personnalisation de hoodies

### Backend
- ✅ API REST complète
- ✅ Authentification JWT
- ✅ Base de données MongoDB
- ✅ Mode fallback (données statiques)
- ✅ Gestion des uploads
- ✅ CORS configuré

## 🔄 Déploiement Render

1. Créez un nouveau Web Service sur Render
2. Connectez votre repository GitHub
3. Configurez les variables d'environnement
4. Build Command : `npm run build`
5. Start Command : `npm start`

L'application sera accessible via l'URL fournie par Render !