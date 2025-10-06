# Guide de Déploiement Netlify

Ce guide vous explique comment déployer votre boutique de vêtements sur Netlify.

## 🚀 Préparation du Projet

### 1. Structure du Projet
Votre projet est maintenant configuré pour Netlify avec :
- ✅ `netlify.toml` - Configuration Netlify
- ✅ `build-netlify.js` - Script de build optimisé
- ✅ Configuration axios adaptée pour les variables d'environnement
- ✅ Headers de sécurité et cache optimisés

### 2. Fichiers Créés
- `netlify.toml` - Configuration principale de Netlify
- `client/env.example` - Exemple de variables d'environnement
- `build-netlify.js` - Script de build personnalisé

## 📋 Étapes de Déploiement

### Option 1 : Déploiement par Drag & Drop (Recommandé)

1. **Préparer le build localement :**
   ```bash
   # Dans le dossier racine du projet
   node build-netlify.js
   ```

2. **Aller sur Netlify :**
   - Rendez-vous sur [netlify.com](https://netlify.com)
   - Connectez-vous ou créez un compte

3. **Déployer :**
   - Glissez-déposez le dossier `client/build` sur la zone de déploiement Netlify
   - Attendez que le déploiement se termine

### Option 2 : Déploiement par Git (Automatique)

1. **Connecter votre repository :**
   - Sur Netlify, cliquez sur "New site from Git"
   - Connectez votre compte GitHub/GitLab
   - Sélectionnez votre repository

2. **Configuration du build :**
   - **Base directory :** `client`
   - **Build command :** `npm run build`
   - **Publish directory :** `client/build`

3. **Variables d'environnement :**
   - Allez dans Site settings > Environment variables
   - Ajoutez :
     ```
     REACT_APP_API_URL = https://votre-backend.herokuapp.com
     REACT_APP_ENVIRONMENT = production
     ```

## ⚙️ Configuration des Variables d'Environnement

### Variables Requises
Dans le dashboard Netlify, ajoutez ces variables :

```
REACT_APP_API_URL = https://votre-backend.herokuapp.com
REACT_APP_ENVIRONMENT = production
```

### Variables Optionnelles
```
REACT_APP_GOOGLE_CLIENT_ID = votre-google-client-id
REACT_APP_FACEBOOK_APP_ID = votre-facebook-app-id
```

## 🔧 Configuration du Backend

### Important : Séparer Frontend et Backend
Netlify héberge uniquement le frontend. Votre backend doit être déployé séparément sur :
- **Heroku** (recommandé)
- **Railway**
- **Render**
- **Vercel** (avec des fonctions serverless)

### Configuration CORS
Dans votre backend, assurez-vous que CORS est configuré pour accepter votre domaine Netlify :

```javascript
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://votre-site.netlify.app",
    "https://votre-domaine-personnalise.com"
  ],
  credentials: true
}));
```

## 🎯 Optimisations Incluses

### 1. Headers de Sécurité
- Protection XSS
- Protection contre le clickjacking
- Headers de sécurité modernes

### 2. Cache Optimisé
- Cache long pour les assets statiques
- Cache approprié pour les images
- Optimisation des performances

### 3. Redirections SPA
- Toutes les routes redirigent vers `index.html`
- Support du routing côté client

## 🚨 Points d'Attention

### 1. Backend Séparé
- Netlify ne peut pas héberger votre backend Node.js
- Déployez le backend sur Heroku ou un autre service
- Mettez à jour `REACT_APP_API_URL` avec l'URL de votre backend

### 2. Base de Données
- Utilisez MongoDB Atlas (recommandé)
- Configurez les variables d'environnement du backend

### 3. Uploads de Fichiers
- Netlify ne supporte pas l'upload de fichiers côté serveur
- Utilisez un service externe (Cloudinary, AWS S3, etc.)

## 🔍 Test du Déploiement

### 1. Vérifications
- [ ] Le site se charge correctement
- [ ] Les routes fonctionnent (testez avec F5)
- [ ] Les appels API fonctionnent
- [ ] L'authentification fonctionne
- [ ] Les images se chargent

### 2. Debug
Si des problèmes surviennent :
- Vérifiez les variables d'environnement
- Consultez les logs Netlify
- Testez l'API backend séparément

## 📱 Configuration Mobile

### PWA Ready
Votre application est prête pour être installée comme PWA grâce au `manifest.json` existant.

### Responsive Design
Le design est optimisé pour mobile avec Tailwind CSS.

## 🎉 Félicitations !

Votre boutique de vêtements est maintenant prête pour Netlify ! 

### Prochaines Étapes
1. Déployez le backend sur Heroku
2. Configurez les variables d'environnement
3. Testez l'application complète
4. Configurez un domaine personnalisé (optionnel)

### Support
En cas de problème, consultez :
- [Documentation Netlify](https://docs.netlify.com/)
- [Guide React sur Netlify](https://docs.netlify.com/integrations/frameworks/react/)
