# 🚀 Guide MongoDB Atlas - Boutique de Vêtements

## 📋 Étapes de Configuration

### 1️⃣ **Créer un compte MongoDB Atlas**
- Allez sur : https://www.mongodb.com/atlas
- Cliquez sur "Try Free" ou "Get Started Free"
- Créez un compte avec votre email

### 2️⃣ **Créer un cluster gratuit**
- Choisissez "FREE" (M0 Sandbox)
- Sélectionnez un provider (AWS, Google Cloud, ou Azure)
- Choisissez une région proche de vous (ex: Europe)
- Cliquez sur "Create Cluster"
- ⏳ Attendez 2-3 minutes que le cluster se crée

### 3️⃣ **Configurer la sécurité - Utilisateur**
- Dans le menu de gauche, cliquez sur "Security" > "Database Access"
- Cliquez sur "Add New Database User"
- Remplissez :
  - **Username**: `boutiquevetements`
  - **Password**: [créez un mot de passe sécurisé]
  - **Role**: "Read and write to any database"
- Cliquez sur "Add User"

### 4️⃣ **Autoriser l'accès réseau**
- Dans "Security" > "Network Access"
- Cliquez sur "Add IP Address"
- Cliquez sur "Allow Access from Anywhere" (0.0.0.0/0)
- Cliquez sur "Confirm"

### 5️⃣ **Obtenir l'URI de connexion**
- Dans "Database" > "Connect"
- Choisissez "Connect your application"
- Copiez l'URI qui ressemble à :
```
mongodb+srv://boutiquevetements:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6️⃣ **Configurer votre application**
- Remplacez `<password>` par votre vrai mot de passe
- Ajoutez `/boutique-vetements` à la fin de l'URI (avant `?`)
- Exemple final :
```
mongodb+srv://boutiquevetements:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/boutique-vetements?retryWrites=true&w=majority
```

## 🚀 Démarrage Rapide

### Option A : Configuration automatique
```bash
node setup-mongodb-atlas.js
```

### Option B : Configuration manuelle
1. Mettez à jour votre fichier `.env` :
```
MONGODB_URI=mongodb+srv://boutiquevetements:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/boutique-vetements?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_tres_securise_ici
PORT=5000
NODE_ENV=development
```

2. Testez la connexion :
```bash
node test-mongodb-atlas.js
```

3. Démarrez votre serveur :
```bash
npm run dev
```

## 🧪 Test de la Connexion

Après configuration, testez avec :
```bash
node test-mongodb-atlas.js
```

Vous devriez voir :
```
✅ Connexion MongoDB Atlas réussie !
🌐 Base de données connectée: boutique-vetements
🔗 Host: cluster0.xxxxx.mongodb.net
📊 Port: 27017
```

## ❌ Résolution des Problèmes

### Erreur "ECONNREFUSED"
- Vérifiez que l'URI est correcte
- Assurez-vous que l'utilisateur et le mot de passe sont corrects
- Vérifiez que l'accès réseau est autorisé (0.0.0.0/0)

### Erreur "Authentication failed"
- Vérifiez le nom d'utilisateur et le mot de passe
- Assurez-vous que l'utilisateur a les bonnes permissions

### Erreur "ENOTFOUND"
- Vérifiez que l'URI MongoDB Atlas est correcte
- Assurez-vous que le nom du cluster est correct

## 🎯 Prochaines Étapes

Une fois MongoDB Atlas configuré :
1. ✅ Démarrer le serveur : `npm run dev`
2. ✅ Peupler la base : `npm run seed`
3. ✅ Tester l'API : http://localhost:5000
4. ✅ Démarrer le frontend : `npm run client`

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez ce guide étape par étape
2. Utilisez le script de test : `node test-mongodb-atlas.js`
3. Vérifiez les logs d'erreur MongoDB Atlas

---

**🎉 Félicitations ! Votre boutique de vêtements sera bientôt connectée à une base de données cloud professionnelle !**
