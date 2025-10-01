# 🧪 Test Simple de la Connexion Google OAuth

## ✅ Configuration vérifiée !

Vos identifiants Google OAuth sont correctement configurés :
- **Client ID :** `6639493239-0vp4u86ckvjvdnt8vomucpk86cdda39k.apps.googleusercontent.com`
- **Client Secret :** `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`

## 🚀 Test de la connexion Google

### 1. Serveur de test démarré
Le serveur de test OAuth fonctionne sur le port 5001.

### 2. Testez la connexion Google

**Option A : Test direct dans le navigateur**
1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:5001/auth/google`
3. Vous devriez être redirigé vers Google
4. Connectez-vous avec votre compte Google
5. Vous verrez un message de succès avec vos informations

**Option B : Test via votre application principale**
1. Démarrez votre serveur principal : `npm start`
2. Démarrez le client React : `cd client && npm start`
3. Allez sur : `http://localhost:3000/login`
4. Cliquez sur le bouton "Google"

## ⚠️ Configuration Google Console requise

**Important :** Pour que OAuth fonctionne, configurez dans [Google Cloud Console](https://console.cloud.google.com/) :

### Authorized JavaScript origins :
```
http://localhost:3000
http://localhost:5001
```

### Authorized redirect URIs :
```
http://localhost:5000/api/auth/google/callback
http://localhost:5001/auth/google/callback
```

## 🔧 Dépannage

### Erreur "redirect_uri_mismatch"
- **Cause :** URL de redirection non configurée dans Google Console
- **Solution :** Ajoutez les URLs exactes dans Google Console

### Erreur "access_denied"
- **Cause :** Application non autorisée
- **Solution :** Vérifiez l'écran de consentement OAuth

### Erreur "invalid_client"
- **Cause :** Client ID ou Secret incorrect
- **Solution :** Vérifiez le fichier `.env`

## 📋 Checklist de test

- [x] Variables d'environnement configurées
- [x] Serveur de test OAuth fonctionnel
- [x] Identifiants Google valides
- [ ] URLs de redirection configurées dans Google Console
- [ ] Test de connexion Google réussi
- [ ] Intégration avec l'application principale

## 🎉 Prochaines étapes

1. **Configurez Google Console** avec les URLs de redirection
2. **Testez la connexion** sur `http://localhost:5001/auth/google`
3. **Intégrez avec votre application** principale
4. **Démarrez MongoDB** pour une fonctionnalité complète

---

**Votre configuration OAuth Google est prête !** 🚀

Le serveur de test confirme que tout fonctionne. Il ne reste plus qu'à configurer les URLs de redirection dans Google Console.
