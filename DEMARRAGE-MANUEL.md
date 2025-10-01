# 🚀 Guide de Démarrage Manuel - Boutique de Vêtements

## 📋 Prérequis
- ✅ Node.js installé
- ✅ MongoDB Atlas configuré
- ✅ Dépendances installées (`npm install` dans le répertoire racine et `client`)

## 🔧 Démarrage Étape par Étape

### Étape 1 : Démarrer le Backend
```bash
# Dans le répertoire racine (boutique-vetements)
npm run dev
```

**Attendez de voir :**
```
✅ Connecté à MongoDB
🌐 Serveur démarré sur le port 5000
```

### Étape 2 : Démarrer le Frontend (dans un NOUVEAU terminal)
```bash
# Ouvrez un nouveau terminal
cd client
npm start
```

**Attendez de voir :**
```
Local:            http://localhost:3000
On Your Network:  http://192.168.x.x:3000
```

## 🌐 Accès à l'Application

### Backend API
- **URL :** http://localhost:5000
- **Test :** http://localhost:5000/api/test
- **Status :** ✅ Connecté à MongoDB Atlas

### Frontend React
- **URL :** http://localhost:3000
- **Status :** 🎨 Interface utilisateur

## 🔑 Identifiants de Test

### Compte Administrateur
- **Email :** `admin@boutiquevetements.fr`
- **Mot de passe :** `admin123`

### Fonctionnalités Disponibles
- 👤 Connexion/Inscription
- 🛍️ Catalogue de produits
- 🛒 Panier d'achat
- 📦 Gestion des commandes
- ⚙️ Administration (produits, utilisateurs, commandes)

## ❌ Résolution des Problèmes

### Problème : "Cannot find module 'mongoose'"
**Solution :** Exécutez `npm install` dans le répertoire racine

### Problème : "Error: connect ECONNREFUSED"
**Solution :** Vérifiez que MongoDB Atlas est configuré dans `.env`

### Problème : Frontend ne démarre pas
**Solution :** 
1. Supprimez le dossier `node_modules` dans `client`
2. Exécutez `npm install` dans `client`
3. Redémarrez avec `npm start`

### Problème : Port déjà utilisé
**Solution :** 
1. Arrêtez tous les processus Node.js : `taskkill /f /im node.exe`
2. Redémarrez l'application

## 🎯 Vérification du Fonctionnement

### Test Backend
```bash
curl http://localhost:5000/api/test
# Devrait retourner : {"message": "Serveur fonctionne correctement !"}
```

### Test Frontend
1. Ouvrez http://localhost:3000
2. Vérifiez que la page d'accueil se charge
3. Testez la navigation entre les pages

## 📱 Utilisation de l'Application

1. **Page d'accueil** : Présentation de la boutique
2. **Produits** : Catalogue avec filtres et recherche
3. **Connexion** : Créez un compte ou connectez-vous
4. **Panier** : Ajoutez des produits et passez commande
5. **Administration** : Gérez les produits et commandes (admin uniquement)

## 🚀 Scripts de Démarrage Automatique

### Windows (CMD)
```bash
start-app-improved.bat
```

### Windows (PowerShell)
```powershell
.\start-app.ps1
```

---

**🎉 Votre boutique de vêtements est maintenant prête à être utilisée !**
