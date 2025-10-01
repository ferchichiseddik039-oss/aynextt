# 🔧 Configuration Google Console pour le Port 5001

## ✅ URLs de redirection à configurer

**Important :** Votre serveur fonctionne maintenant sur le port **5001** au lieu de 5000.

### 1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)

### 2. Sélectionnez votre projet

### 3. APIs & Services > Credentials

### 4. Cliquez sur votre Client ID : `6639493239-0vp4u86ckvjvdnt8vomucpk86cdda39k.apps.googleusercontent.com`

### 5. Configurez les URLs :

**Authorized JavaScript origins :**
```
http://localhost:3000
```

**Authorized redirect URIs :**
```
http://localhost:5001/api/auth/google/callback
```

## 🚀 Test de la connexion

1. **Démarrez le serveur** (port 5001) :
   ```bash
   npm start
   ```

2. **Démarrez le client React** (port 3000) :
   ```bash
   cd client
   npm start
   ```

3. **Allez sur** `http://localhost:3000/login`

4. **Cliquez sur le bouton "Google"**

5. **Vous devriez être redirigé vers Google !** 🎉

## 📋 État actuel

- ✅ **Serveur** : Port 5001 (évite le conflit avec le port 5000)
- ✅ **Client** : Port 3000
- ✅ **Base de données** : MongoDB Atlas
- ✅ **OAuth Google** : Configuré avec vos credentials
- ⚠️ **Google Console** : URLs de redirection à mettre à jour

---

**Votre connexion Google OAuth est maintenant prête à fonctionner sur le port 5001 !** 🚀
