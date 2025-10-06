# 🚀 DÉPLOIEMENT SUR RENDER - GUIDE ÉTAPE PAR ÉTAPE

## 📋 **PRÉREQUIS**
- ✅ Repository GitHub créé et code poussé
- ✅ Compte Render.com créé
- ✅ Variables d'environnement MongoDB prêtes

---

## 🌐 **ÉTAPE 1 : CONNEXION À RENDER**

1. **Allez sur [Render.com](https://render.com)**
2. **Connectez-vous** avec votre compte GitHub
3. **Autorisez** l'accès à vos repositories

---

## 🆕 **ÉTAPE 2 : CRÉER UN NOUVEAU WEB SERVICE**

1. **Cliquez sur "New +"** (bouton bleu en haut)
2. **Sélectionnez "Web Service"**
3. **Connectez votre repository** `boutique-unified-aynext`
4. **Cliquez sur "Connect"**

---

## ⚙️ **ÉTAPE 3 : CONFIGURATION DU SERVICE**

### **Informations de base :**
- **Name :** `boutique-aynext-unified`
- **Region :** `Oregon (US West)` (recommandé)
- **Branch :** `main`
- **Runtime :** `Node`
- **Build Command :** `npm run build`
- **Start Command :** `npm start`

### **Variables d'environnement :**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements
JWT_SECRET=your_jwt_secret_key_here_2024
NODE_ENV=production
PORT=10000
```

---

## 🔧 **ÉTAPE 4 : AJOUTER LES VARIABLES D'ENVIRONNEMENT**

1. **Cliquez sur "Add Environment Variable"**
2. **Ajoutez chaque variable une par une :**

| Variable | Valeur |
|----------|--------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements` |
| `JWT_SECRET` | `your_jwt_secret_key_here_2024` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

---

## 🚀 **ÉTAPE 5 : DÉPLOIEMENT**

1. **Cliquez sur "Create Web Service"**
2. **Attendez le déploiement** (5-10 minutes)
3. **Surveillez les logs** pour voir le progrès

---

## ✅ **ÉTAPE 6 : VÉRIFICATION**

Une fois déployé, votre site sera accessible via :
`https://boutique-aynext-unified.onrender.com`

### **Test des fonctionnalités :**
- ✅ Page d'accueil
- ✅ Connexion admin : `ayoubbenromdan8@gmail.com` / `52141707`
- ✅ Gestion des produits
- ✅ Personnalisation de hoodies
- ✅ API endpoints

---

## 🔍 **DÉPANNAGE**

### **Si le déploiement échoue :**
1. **Vérifiez les logs** de déploiement
2. **Vérifiez les variables d'environnement**
3. **Vérifiez que le repository est public** (pour le plan gratuit)

### **Si l'application ne démarre pas :**
1. **Vérifiez le Start Command** : `npm start`
2. **Vérifiez le PORT** : `10000`
3. **Vérifiez les logs** d'erreur

### **Si MongoDB ne se connecte pas :**
1. **Vérifiez l'URI MongoDB**
2. **Vérifiez les permissions** sur MongoDB Atlas
3. **Ajoutez l'IP de Render** dans MongoDB Atlas (0.0.0.0/0)

---

## 🎉 **FÉLICITATIONS !**

Votre boutique AYNEXT est maintenant **en ligne** et **100% fonctionnelle** !

**URL de votre site :** `https://boutique-aynext-unified.onrender.com`

---

## 📞 **SUPPORT**

Si vous avez des problèmes :
1. Consultez les logs Render
2. Vérifiez la documentation Render
3. Testez localement d'abord
