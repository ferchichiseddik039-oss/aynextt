# 🔧 Guide de Résolution des Problèmes - Boutique de Vêtements

## 🚨 Problèmes Rencontrés et Solutions

### **Problème 1 : Frontend React - "Invalid options object"**
**Erreur :** `Invalid options object. Dev Server has been initialized using an options object that does not match the API schema. - options.allowedHosts[0] should be a non-empty string.`

**Solution :**
1. Arrêter tous les processus Node.js : `taskkill /f /im node.exe`
2. Nettoyer le dossier client :
   ```bash
   cd client
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   Remove-Item .env.local -ErrorAction SilentlyContinue
   ```
3. Réinstaller les dépendances : `npm install`
4. Créer un fichier `.env.local` stable :
   ```
   SKIP_PREFLIGHT_CHECK=true
   GENERATE_SOURCEMAP=false
   CHOKIDAR_USEPOLLING=true
   FAST_REFRESH=false
   ```
5. Redémarrer : `npm start`

### **Problème 2 : Port déjà utilisé (EADDRINUSE)**
**Erreur :** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution :**
1. Arrêter tous les processus Node.js : `taskkill /f /im node.exe`
2. Attendre 3-5 secondes
3. Redémarrer le serveur : `npm run dev`

### **Problème 3 : Connexion MongoDB échouée**
**Erreur :** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution :**
1. Vérifier le fichier `.env` dans le répertoire racine
2. S'assurer que `MONGODB_URI` est correctement configuré
3. Tester la connexion : `node test-mongodb-atlas.js`

## 🚀 Scripts de Démarrage Disponibles

### **1. Démarrage Complet (Recommandé)**
```bash
# Windows CMD
start-complete.bat

# Windows PowerShell
.\start-complete.ps1
```

### **2. Réparation Frontend Seule**
```bash
# Windows CMD
fix-frontend.bat
```

### **3. Démarrage Manuel**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## 🔧 Configuration Frontend Stable

### **Fichier .env.local recommandé :**
```
SKIP_PREFLIGHT_CHECK=true
GENERATE_SOURCEMAP=false
CHOKIDAR_USEPOLLING=true
FAST_REFRESH=false
```

### **Explication des variables :**
- **SKIP_PREFLIGHT_CHECK=true** : Évite les vérifications de prévol
- **GENERATE_SOURCEMAP=false** : Désactive la génération de source maps
- **CHOKIDAR_USEPOLLING=true** : Améliore la détection des changements
- **FAST_REFRESH=false** : Désactive le rechargement rapide problématique

## 📋 Vérification du Fonctionnement

### **Backend (Port 5000)**
```bash
# Test de l'API
curl http://localhost:5000/api/test
# Devrait retourner : {"message": "Serveur fonctionne correctement !"}
```

### **Frontend (Port 3000)**
```bash
# Vérifier que le port est ouvert
netstat -an | findstr :3000
# Devrait montrer : TCP    0.0.0.0:3000    LISTENING
```

## 🎯 Ordre de Démarrage Recommandé

1. **Arrêter tous les processus** : `taskkill /f /im node.exe`
2. **Démarrer le backend** : `npm run dev`
3. **Attendre 10 secondes** que MongoDB se connecte
4. **Démarrer le frontend** : `cd client && npm start`
5. **Vérifier les deux ports** : 5000 (backend) et 3000 (frontend)

## ❌ Problèmes Courants et Solutions Rapides

### **Frontend ne démarre pas après 5 minutes :**
- Utiliser `fix-frontend.bat`
- Vérifier qu'aucun autre processus n'utilise le port 3000

### **Backend ne se connecte pas à MongoDB :**
- Vérifier le fichier `.env`
- Tester avec `node test-mongodb-atlas.js`

### **Erreurs de dépendances :**
- Supprimer `node_modules` et `package-lock.json`
- Réinstaller avec `npm install`

## 🎉 Résultat Attendu

Après résolution de tous les problèmes :
- ✅ **Backend** : http://localhost:5000 (connecté à MongoDB Atlas)
- ✅ **Frontend** : http://localhost:3000 (React fonctionnel)
- ✅ **Base de données** : Peuplée avec des données de test
- ✅ **Identifiants** : admin@boutiquevetements.fr / admin123

---

**💡 Conseil : Utilisez toujours `start-complete.bat` pour un démarrage sans problème !**
