# 🚀 Guide de Déploiement Backend sur Render

## 📋 Prérequis

1. **Compte Render** : Créez un compte sur [render.com](https://render.com)
2. **MongoDB Atlas** : Base de données cloud gratuite
3. **Gmail** : Pour l'envoi d'emails
4. **Google OAuth** : Pour la connexion Google
5. **Facebook OAuth** : Pour la connexion Facebook (optionnel)

## 🔧 Étape 1 : Configuration MongoDB Atlas

### 1.1 Créer un cluster MongoDB Atlas
1. Allez sur [mongodb.com/atlas](https://mongodb.com/atlas)
2. Créez un compte gratuit
3. Créez un nouveau cluster (gratuit M0)
4. Configurez l'accès réseau (0.0.0.0/0 pour tous)
5. Créez un utilisateur de base de données

### 1.2 Obtenir la chaîne de connexion
```bash
mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements
```

## 📧 Étape 2 : Configuration Email (Gmail)

### 2.1 Activer l'authentification à 2 facteurs
1. Allez dans votre compte Google
2. Sécurité > Authentification à 2 facteurs
3. Activez-la

### 2.2 Créer un mot de passe d'application
1. Sécurité > Mots de passe d'application
2. Générez un mot de passe pour "Mail"
3. Utilisez ce mot de passe (pas votre mot de passe Gmail)

## 🔐 Étape 3 : Configuration OAuth Google

### 3.1 Créer un projet Google Cloud
1. Allez sur [console.cloud.google.com](https://console.cloud.google.com)
2. Créez un nouveau projet
3. Activez l'API Google+ et OAuth

### 3.2 Configurer OAuth
1. Credentials > Create Credentials > OAuth 2.0 Client IDs
2. Application type : Web application
3. Authorized redirect URIs :
   - `https://votre-app.onrender.com/auth/google/callback`
   - `http://localhost:5001/auth/google/callback` (pour le dev)

## 📱 Étape 4 : Configuration OAuth Facebook (Optionnel)

### 4.1 Créer une app Facebook
1. Allez sur [developers.facebook.com](https://developers.facebook.com)
2. Créez une nouvelle app
3. Ajoutez Facebook Login

### 4.2 Configurer les URLs
1. Facebook Login > Settings
2. Valid OAuth Redirect URIs :
   - `https://votre-app.onrender.com/auth/facebook/callback`

## 🚀 Étape 5 : Déploiement sur Render

### 5.1 Créer un nouveau service
1. Connectez-vous à [render.com](https://render.com)
2. Dashboard > New + > Web Service
3. Connectez votre repository GitHub
4. Sélectionnez le repository `ferchichiseddik039-oss/aynextt`

### 5.2 Configuration du service
```
Name: aynextt-backend
Environment: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### 5.3 Variables d'environnement
Ajoutez toutes ces variables dans Render :

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements
JWT_SECRET=votre_super_secret_jwt_key_ici
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
FACEBOOK_APP_ID=votre_facebook_app_id
FACEBOOK_APP_SECRET=votre_facebook_app_secret
REMOVE_BG_API_KEY=votre_remove_bg_api_key
CLIENT_URL=https://ferchichiseddik039-oss.github.io
CORS_ORIGIN=https://ferchichiseddik039-oss.github.io
```

## 🔗 Étape 6 : Configuration du Frontend

### 6.1 Mettre à jour l'URL de l'API
Dans `client/src/config/api.js`, changez :
```javascript
const API_BASE_URL = 'https://votre-app.onrender.com/api';
```

### 6.2 Rebuild et déployer le frontend
```bash
cd client
npm run build
cd ..
# Les fichiers sont automatiquement à la racine
git add .
git commit -m "Configuration pour backend Render"
git push
```

## ✅ Étape 7 : Test complet

### 7.1 Tester l'endpoint de santé
```
https://votre-app.onrender.com/api/health
```

### 7.2 Tester les fonctionnalités
1. **Inscription/Connexion** : Créez un compte
2. **Produits** : Ajoutez des produits via l'admin
3. **Panier** : Ajoutez des articles au panier
4. **Commandes** : Passez une commande
5. **Emails** : Vérifiez la réception des emails
6. **OAuth** : Testez la connexion Google/Facebook

## 🎯 URLs finales

- **Frontend** : https://ferchichiseddik039-oss.github.io/aynextt/
- **Backend API** : https://votre-app.onrender.com/api
- **Admin** : https://ferchichiseddik039-oss.github.io/aynextt/admin-login

## 🔧 Fonctionnalités déployées

✅ **Authentification complète**
- Inscription/Connexion
- JWT tokens
- OAuth Google
- OAuth Facebook
- Mot de passe oublié

✅ **Gestion des produits**
- CRUD complet
- Upload d'images
- Suppression d'arrière-plan
- Personnalisation de hoodies

✅ **Système de commandes**
- Panier d'achat
- Validation des commandes
- Emails automatiques
- Suivi des commandes

✅ **Interface admin**
- Dashboard complet
- Statistiques temps réel
- Gestion des utilisateurs
- Gestion des produits
- Gestion des commandes

✅ **WebSocket temps réel**
- Notifications admin
- Mises à jour en direct
- Statistiques live

✅ **Système d'emails**
- Confirmation de commande
- Notifications admin
- Emails transactionnels

## 🆘 Dépannage

### Problèmes courants :
1. **MongoDB non connecté** : Vérifiez MONGODB_URI
2. **Emails non envoyés** : Vérifiez EMAIL_USER/PASS
3. **OAuth ne fonctionne pas** : Vérifiez les URLs de callback
4. **CORS errors** : Vérifiez CORS_ORIGIN

### Logs Render :
1. Allez dans votre service Render
2. Logs > View logs
3. Vérifiez les erreurs en temps réel

## 🎉 Résultat final

Votre boutique e-commerce complète sera déployée avec :
- Frontend sur GitHub Pages (gratuit)
- Backend sur Render (gratuit)
- Base de données MongoDB Atlas (gratuit)
- Toutes les fonctionnalités opérationnelles !
