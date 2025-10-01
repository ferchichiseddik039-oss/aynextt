# 🗄️ Configuration MongoDB Atlas - Guide Gratuit

## 🎯 Objectif
Configurer une base de données MongoDB gratuite pour votre boutique.

## 📋 Étapes Détaillées

### 1. Créer un compte MongoDB Atlas
1. Allez sur [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Cliquez sur **"Try Free"**
3. Remplissez le formulaire :
   - **Email** : Votre email
   - **Password** : Mot de passe sécurisé
   - **Username** : Votre nom d'utilisateur
4. Cliquez sur **"Create your Atlas account"**

### 2. Choisir le plan gratuit
1. Sélectionnez **"M0 Sandbox"** (GRATUIT)
2. Cliquez sur **"Create a cluster"**

### 3. Configurer le cluster
1. **Cloud Provider** : AWS (recommandé)
2. **Region** : Choisissez une région proche (ex: Europe - Ireland)
3. **Cluster Name** : `boutique-vetements`
4. Cliquez sur **"Create Cluster"**

### 4. Créer un utilisateur de base de données
1. Dans la section **"Database Access"**
2. Cliquez sur **"Add New Database User"**
3. **Authentication Method** : Password
4. **Username** : `boutique-admin`
5. **Password** : Générez un mot de passe sécurisé (sauvegardez-le !)
6. **Database User Privileges** : Atlas admin
7. Cliquez sur **"Add User"**

### 5. Autoriser l'accès réseau
1. Dans la section **"Network Access"**
2. Cliquez sur **"Add IP Address"**
3. Cliquez sur **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Cliquez sur **"Confirm"**

### 6. Obtenir l'URI de connexion
1. Dans la section **"Database"**
2. Cliquez sur **"Connect"** sur votre cluster
3. Choisissez **"Connect your application"**
4. **Driver** : Node.js
5. **Version** : 4.1 or later
6. Copiez l'URI qui ressemble à :
```
mongodb+srv://boutique-admin:<password>@cluster0.xxxxx.mongodb.net/boutique-vetements?retryWrites=true&w=majority
```

### 7. Remplacer le mot de passe
**IMPORTANT** : Remplacez `<password>` par votre vrai mot de passe dans l'URI.

**Exemple :**
```
mongodb+srv://boutique-admin:MonMotDePasse123@cluster0.abc123.mongodb.net/boutique-vetements?retryWrites=true&w=majority
```

## 🔧 Configuration dans Vercel

### 1. Variables d'environnement
Dans Vercel, ajoutez cette variable :
```
MONGODB_URI=mongodb+srv://boutique-admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/boutique-vetements?retryWrites=true&w=majority
```

### 2. Autres variables nécessaires
```
NODE_ENV=production
JWT_SECRET=votre_secret_jwt_tres_securise_2024
SESSION_SECRET=votre_session_secret_tres_securise_2024
CLIENT_URL=https://votre-boutique.vercel.app
```

## 🧪 Test de connexion

### Test local
Créez un fichier `test-mongodb.js` :
```javascript
const mongoose = require('mongoose');

const uri = 'mongodb+srv://boutique-admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/boutique-vetements?retryWrites=true&w=majority';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connexion MongoDB réussie !');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  });
```

Exécutez :
```bash
node test-mongodb.js
```

## 📊 Limites du plan gratuit

### ✅ Inclus gratuitement :
- **512 MB** de stockage
- **Connexions illimitées**
- **Backup automatique**
- **Monitoring de base**
- **SSL/TLS**

### ⚠️ Limites :
- **512 MB** de données maximum
- **Pas de sharding**
- **Pas de clusters multiples**

### 💡 Pour une boutique :
- **Suffisant** pour des milliers de produits
- **Suffisant** pour des milliers d'utilisateurs
- **Suffisant** pour des milliers de commandes

## 🚨 Sécurité

### ✅ Bonnes pratiques :
- **Mot de passe fort** pour l'utilisateur DB
- **Accès réseau** limité si possible
- **Variables d'environnement** pour les secrets
- **Backup régulier** (automatique avec Atlas)

### ❌ À éviter :
- **Mot de passe faible**
- **URI exposée** dans le code
- **Accès admin** pour l'application

## 🆘 Résolution de problèmes

### Erreur de connexion
1. **Vérifiez l'URI** : Mot de passe correct ?
2. **Vérifiez l'accès réseau** : IP autorisée ?
3. **Vérifiez l'utilisateur** : Existe-t-il ?

### Erreur d'authentification
1. **Vérifiez le nom d'utilisateur**
2. **Vérifiez le mot de passe**
3. **Vérifiez les privilèges** de l'utilisateur

### Erreur de réseau
1. **Vérifiez l'accès réseau** dans Atlas
2. **Vérifiez votre connexion internet**
3. **Vérifiez le firewall** de votre réseau

## 📈 Évolution future

### Quand passer au plan payant ?
- **Stockage** > 512 MB
- **Besoin** de clusters multiples
- **Besoin** de sharding
- **Besoin** de support prioritaire

### Plans payants :
- **M2** : $9/mois - 2 GB
- **M5** : $25/mois - 5 GB
- **M10** : $57/mois - 10 GB

## 🎉 Résultat

Après cette configuration, vous aurez :
- ✅ **Base de données** MongoDB gratuite
- ✅ **Connexion sécurisée** avec SSL
- ✅ **Backup automatique**
- ✅ **Monitoring** de base
- ✅ **Prêt** pour la production

---

**🗄️ Votre base de données est maintenant prête pour votre boutique !**
