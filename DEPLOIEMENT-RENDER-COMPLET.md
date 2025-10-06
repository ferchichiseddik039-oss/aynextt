# 🚀 GUIDE DE DÉPLOIEMENT RENDER - APPLICATION UNIFIÉE

## 📋 ÉTAPES DE DÉPLOIEMENT

### 1. 🌐 Aller sur Render.com
- Visitez : https://render.com
- Connectez-vous avec votre compte GitHub

### 2. 📦 Créer un nouveau Web Service
- Cliquez sur **"New +"**
- Sélectionnez **"Web Service"**
- Connectez votre repository : `ferchichiseddik039-oss/boutique-unified-aynext`

### 3. ⚙️ Configuration du Service

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `boutique-aynext-unified` |
| **Language** | `Node` |
| **Branch** | `main` |
| **Root Directory** | *(laisser vide)* |
| **Region** | `Oregon (US West)` |
| **Instance Type** | `Free` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

### 4. 🔑 Variables d'Environnement

Ajoutez ces variables dans la section **"Environment Variables"** :

| Variable | Valeur |
|----------|--------|
| `MONGODB_URI` | `mongodb+srv://ferchichiseddik039:52141707@cluster0.6rx5.mongodb.net/boutique-vetements?retryWrites=true&w=majority` |
| `JWT_SECRET` | `aynext_jwt_secret_2024_secure_key` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

### 5. 🚀 Déploiement
- Cliquez sur **"Create Web Service"**
- Attendez 5-8 minutes pour le déploiement

## 🎯 RÉSULTAT ATTENDU

Votre application sera accessible via :
**https://boutique-aynext-unified.onrender.com**

## ✅ FONCTIONNALITÉS DISPONIBLES

- ✅ Frontend React (interface boutique)
- ✅ Backend Express (API)
- ✅ Base de données MongoDB Atlas
- ✅ Authentification admin/client
- ✅ Gestion des produits
- ✅ Système de commandes
- ✅ Personnalisation de hoodies

## 🔧 EN CAS DE PROBLÈME

Si le déploiement échoue :
1. Vérifiez les logs dans Render Dashboard
2. Assurez-vous que toutes les variables d'environnement sont correctes
3. Le script de build est maintenant compatible Linux

## 📞 SUPPORT

En cas de problème, les logs détaillés sont disponibles dans le Render Dashboard.
