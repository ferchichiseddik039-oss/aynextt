# 📧 Guide de Configuration Email pour AYNEXT

## 🎯 Objectif
Configurer l'envoi automatique d'emails de bienvenue quand un client se connecte avec Google.

## 🔧 Configuration Gmail

### Étape 1 : Activer la validation en 2 étapes
1. Allez sur [Google Account Security](https://myaccount.google.com/security)
2. Connectez-vous avec votre compte Gmail
3. Dans la section "Se connecter à Google", cliquez sur **"Validation en 2 étapes"**
4. Suivez les instructions pour l'activer

### Étape 2 : Générer un mot de passe d'application
1. Toujours dans [Google Account Security](https://myaccount.google.com/security)
2. Dans la section "Se connecter à Google", cliquez sur **"Mots de passe d'application"**
3. Sélectionnez **"Mail"** comme application
4. Sélectionnez **"Autre (nom personnalisé)"** comme appareil
5. Tapez **"AYNEXT Boutique"** comme nom
6. Cliquez sur **"Générer"**
7. **COPIEZ le mot de passe généré** (16 caractères)

### Étape 3 : Configurer le fichier .env
1. Ouvrez votre fichier `.env`
2. Remplacez `YOUR_GMAIL_APP_PASSWORD` par le mot de passe généré :

```env
EMAIL_USER=ayoubbenromdan8@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application_ici
```

### Étape 4 : Tester la configuration
```bash
node test-email-service.js
```

## 📧 Fonctionnalités

### Email de bienvenue automatique
- ✅ Envoyé automatiquement lors de la connexion Google
- ✅ Template HTML professionnel
- ✅ Informations personnalisées (nom, email)
- ✅ Liens vers les produits
- ✅ Informations de contact

### Contenu de l'email
- 🎉 Message de bienvenue personnalisé
- 📧 Informations du compte créé
- 🛍️ Présentation des services AYNEXT
- 🔗 Liens vers les produits
- 📱 Réseaux sociaux
- 📞 Informations de contact

## 🧪 Test

### Test manuel
1. Connectez-vous avec Google sur votre site
2. Vérifiez votre boîte email
3. L'email de bienvenue devrait arriver dans les 30 secondes

### Test du service
```bash
node test-email-service.js
```

## 🔧 Dépannage

### Erreur "Missing credentials"
- Vérifiez que le mot de passe d'application est correct
- Assurez-vous que la validation en 2 étapes est activée

### Erreur "Invalid login"
- Vérifiez l'email dans EMAIL_USER
- Vérifiez le mot de passe d'application

### Email non reçu
- Vérifiez les spams/courrier indésirable
- Vérifiez les logs du serveur
- Testez avec un autre email

## 📋 Variables d'environnement requises

```env
# Configuration Email
EMAIL_USER=ayoubbenromdan8@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application_gmail
```

## 🎉 Résultat attendu

Quand un client se connecte avec Google :
1. ✅ Compte créé automatiquement
2. ✅ Connexion réussie
3. ✅ Email de bienvenue envoyé
4. ✅ Client redirigé vers la boutique

L'email contient :
- Message de bienvenue personnalisé
- Informations du compte
- Présentation des services
- Liens vers les produits
- Informations de contact
