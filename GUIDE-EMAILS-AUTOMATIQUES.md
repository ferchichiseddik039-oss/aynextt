# Guide des Emails Automatiques AYNEXT

## 📧 Vue d'ensemble

Le système AYNEXT envoie automatiquement des emails aux clients dans trois situations :
1. **Email de bienvenue** lors de la connexion avec Google OAuth
2. **Email de nouveau produit** quand l'admin ajoute un produit
3. **Email de statut de commande** quand l'admin modifie le statut d'une commande

---

## 🎉 Email de Bienvenue (OAuth)

### Quand est-il envoyé ?
- Automatiquement lors de la première connexion avec Google OAuth
- Uniquement pour les nouveaux utilisateurs OAuth

### Contenu de l'email
- Message de bienvenue personnalisé avec le prénom et nom
- Logo AYNEXT avec design moderne
- Avantages de la boutique (livraison, paiement, qualité)
- Lien vers la boutique
- Informations de contact

### Template
Le template est géré dans `src/services/emailService.js` :
- `generateWelcomeEmailHTML(user)` - Version HTML stylisée
- `generateWelcomeEmailText(user)` - Version texte brut

---

## 🆕 Email de Nouveau Produit

### Quand est-il envoyé ?
- Automatiquement quand l'admin ajoute un nouveau produit
- Envoyé à **tous les clients actifs** de la boutique

### Contenu de l'email
- Badge "NOUVEAU PRODUIT" en évidence
- Image du produit (première image disponible)
- Nom et description du produit
- Prix (avec prix barré si en réduction)
- Détails : marque, catégorie, genre
- Icônes pour livraison et stock
- Bouton CTA "Voir le produit" vers la page produit
- Footer avec informations AYNEXT

### Template
Le template est géré dans `src/services/emailService.js` :
- `generateNewProductEmailHTML(client, product)` - Version HTML stylisée
- `generateNewProductEmailText(client, product)` - Version texte brut

---

## 📦 Email de Statut de Commande

### Quand est-il envoyé ?
- Automatiquement quand l'admin **modifie le statut** d'une commande
- Envoyé uniquement au **client concerné** par la commande

### Statuts disponibles :
1. **✅ Confirmée** - Commande confirmée et acceptée
2. **🔧 En préparation** - Commande en cours de préparation
3. **🚚 Expédiée** - Commande expédiée avec numéro de suivi
4. **📦 Livrée** - Commande livrée avec succès
5. **❌ Annulée** - Commande annulée

### Contenu de l'email
- Badge de statut avec couleur spécifique (vert, orange, bleu, rouge)
- Icône du statut (emoji)
- Message personnalisé selon le statut
- Détails de la commande :
  - Numéro de commande
  - Date
  - Total
  - Numéro de suivi (si disponible)
- Liste des articles commandés
- Timeline visuelle du suivi
- Bouton "Voir mes commandes"
- Bouton "Suivre ma commande" (si numéro de suivi)
- Informations de contact

### Couleurs par statut :
- **Confirmée** : Vert (#10b981)
- **En préparation** : Orange (#f59e0b)
- **Expédiée** : Bleu (#3b82f6)
- **Livrée** : Vert (#10b981)
- **Annulée** : Rouge (#ef4444)

### Template
Le template est géré dans `src/services/emailService.js` :
- `sendOrderStatusEmail(user, order, newStatus)` - Méthode d'envoi
- `getStatusInfo(status)` - Informations de chaque statut
- `generateOrderStatusEmailHTML(user, order, newStatus, statusInfo)` - Version HTML
- `generateOrderStatusEmailText(user, order, newStatus, statusInfo)` - Version texte

---

## ⚙️ Configuration Email

### Variables d'environnement (`.env`)
```env
EMAIL_USER=ayoubbenromdan8@gmail.com
EMAIL_PASSWORD=fjcotwleonbpcbbu
```

### Configuration SMTP Gmail
- **Host**: smtp.gmail.com
- **Port**: 465
- **Secure**: true (SSL/TLS)
- **Auth**: Mot de passe d'application Gmail

### Comment obtenir un mot de passe d'application Gmail ?

1. **Activer la validation en deux étapes** :
   - Accédez à [myaccount.google.com](https://myaccount.google.com)
   - Sécurité → Validation en deux étapes → Activer

2. **Générer un mot de passe d'application** :
   - Sécurité → Mots de passe des applications
   - Sélectionnez "Mail" et votre appareil
   - Copiez le mot de passe généré (16 caractères)
   - Collez-le dans `.env` comme `EMAIL_PASSWORD`

---

## 🔧 Architecture Technique

### Service Email (`src/services/emailService.js`)

```javascript
class EmailService {
  // Initialisation paresseuse du transporter
  initializeTransporter()
  
  // Email de bienvenue
  async sendWelcomeEmail(user)
  generateWelcomeEmailHTML(user)
  generateWelcomeEmailText(user)
  
  // Email de nouveau produit
  async sendNewProductEmail(clients, product)
  generateNewProductEmailHTML(client, product)
  generateNewProductEmailText(client, product)
}
```

### Intégration dans les Routes

#### Route OAuth (`src/routes/auth.js`)
```javascript
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // ... authentification
    
    // Envoi email de bienvenue
    if (user.isOAuth && user.googleId) {
      await emailService.sendWelcomeEmail(user);
    }
    
    // ... redirection
  }
);
```

#### Route Produits (`src/routes/products.js`)
```javascript
router.post('/', [auth, admin], async (req, res) => {
  // ... création du produit
  
  // Récupération de tous les clients actifs
  const clients = await User.find({ role: 'client', estActif: true });
  
  // Envoi asynchrone des emails (non bloquant)
  emailService.sendNewProductEmail(clients, produit);
  
  // ... réponse
});
```

#### Route Commandes (`src/routes/orders.js`)
```javascript
router.put('/:id/statut', [auth, admin], async (req, res) => {
  // ... récupération de la commande
  
  const order = await Order.findById(req.params.id)
    .populate('utilisateur', 'nom prenom email')
    .populate('articles.produit', 'nom');
  
  // Mise à jour du statut
  order.statut = statut;
  await order.mettreAJourStatut(statut);
  
  // Envoi email au client
  if (order.utilisateur && order.utilisateur.email) {
    emailService.sendOrderStatusEmail(order.utilisateur, order, statut);
  }
  
  // ... réponse
});
```

---

## 🎨 Design des Emails

### Styles communs
- **Couleurs principales** : Noir (#000) et Rouge (#ef4444)
- **Dégradé** : `linear-gradient(135deg, #000 0%, #ef4444 100%)`
- **Police** : Arial, sans-serif
- **Largeur max** : 600px
- **Border radius** : 10px pour les conteneurs
- **Ombres** : `box-shadow: 0 0 20px rgba(0,0,0,0.1)`

### Responsive
- Design adapté aux mobiles
- Meta viewport inclus
- Images responsives (width: 100%)

---

## 📊 Logs et Monitoring

### Logs lors de l'envoi

```bash
✅ Service email initialisé avec succès
📧 Tentative d'envoi d'email de bienvenue à: user@example.com
✅ Email de bienvenue envoyé avec succès à: user@example.com
📧 Message ID: <xxx@gmail.com>
```

### Logs pour nouveau produit

```bash
✅ Nouveau produit créé: Hoodie Nike Premium
📧 Récupération des clients pour notification email...
📧 3 client(s) trouvé(s)
✅ Email envoyé à client1@example.com
✅ Email envoyé à client2@example.com
✅ Email envoyé à client3@example.com
✅ Emails de nouveau produit envoyés: 3 succès, 0 échecs
```

---

## 🚫 Gestion des Erreurs

### Philosophie
- **Ne jamais bloquer l'opération principale** (connexion OAuth ou ajout produit)
- Logs détaillés des erreurs
- Continuer même si l'email échoue

### Cas d'erreur gérés
1. Service email non configuré (pas de credentials)
2. Échec d'envoi d'un email spécifique
3. Erreur de connexion SMTP
4. Pas de clients à notifier

### Exemple de gestion
```javascript
try {
  const result = await emailService.sendWelcomeEmail(user);
  if (result.success) {
    console.log('✅ Email envoyé');
  }
} catch (emailError) {
  console.error('❌ Erreur email:', emailError.message);
  // La connexion OAuth continue normalement
}
```

---

## 🧪 Tests

### Test Email de Bienvenue
1. Créer un nouveau compte avec Google OAuth
2. Vérifier la boîte email
3. Vérifier les logs du serveur

### Test Email Nouveau Produit
1. Se connecter en tant qu'admin
2. Ajouter un nouveau produit avec image
3. Vérifier les logs du serveur
4. Vérifier la boîte email de tous les clients

### Test Email Statut de Commande
1. Se connecter en tant qu'admin
2. Aller dans la gestion des commandes
3. Modifier le statut d'une commande (ex: "En préparation")
4. Vérifier les logs du serveur
5. Vérifier la boîte email du client concerné
6. Tester tous les statuts : Confirmée, En préparation, Expédiée, Livrée, Annulée

### Script de Test Manuel
```javascript
// test-new-product-email.js
const emailService = require('./src/services/emailService');
const User = require('./src/lib/User');

async function testEmail() {
  const clients = await User.find({ role: 'client' });
  const testProduct = {
    _id: '123',
    nom: 'Test Hoodie',
    description: 'Produit de test',
    prix: 99,
    marque: 'Nike',
    categorie: 'hoodie',
    genre: 'homme',
    images: ['http://example.com/image.jpg']
  };
  
  await emailService.sendNewProductEmail(clients, testProduct);
}

testEmail();
```

---

## 📝 Personnalisation

### Modifier le contenu des emails
1. Ouvrir `src/services/emailService.js`
2. Modifier les méthodes `generate*EmailHTML()` ou `generate*EmailText()`
3. Redémarrer le serveur

### Ajouter de nouveaux types d'emails
1. Créer les méthodes `send*Email()`, `generate*EmailHTML()`, `generate*EmailText()`
2. Appeler dans la route appropriée
3. Tester

### Désactiver les emails
Dans `.env`, retirer ou commenter :
```env
# EMAIL_USER=
# EMAIL_PASSWORD=
```

---

## 🔒 Sécurité

### Bonnes pratiques
- ✅ Utiliser des mots de passe d'application Gmail (pas le mot de passe principal)
- ✅ Ne jamais commiter le fichier `.env`
- ✅ Limiter les permissions du mot de passe d'application
- ✅ Révoquer les mots de passe inutilisés

### Variables sensibles
- `EMAIL_USER` : Email expéditeur
- `EMAIL_PASSWORD` : Mot de passe d'application (16 caractères)
- Ne JAMAIS les partager publiquement

---

## 📈 Performance

### Envoi asynchrone
- Les emails de nouveau produit sont envoyés de manière **asynchrone**
- N'attend pas la fin de l'envoi pour répondre à l'admin
- Utilise `Promise.all()` pour envoyer plusieurs emails en parallèle

### Limites
- Gmail impose des limites d'envoi :
  - **500 emails/jour** pour un compte Gmail standard
  - **2000 emails/jour** pour Google Workspace
- Pour de gros volumes, considérer SendGrid, Mailgun, ou AWS SES

---

## 🆘 Dépannage

### "Missing credentials for PLAIN"
- Vérifier que `EMAIL_USER` et `EMAIL_PASSWORD` sont définis dans `.env`
- Vérifier qu'il n'y a pas d'espaces dans le mot de passe
- Redémarrer le serveur après modification du `.env`

### "Unauthorized" ou "Invalid credentials"
- Vérifier que la validation en deux étapes est activée
- Régénérer un nouveau mot de passe d'application
- Vérifier que c'est bien un mot de passe d'application (pas le mot de passe Gmail)

### Emails non reçus
- Vérifier les spams/courrier indésirable
- Vérifier les logs du serveur pour les erreurs
- Tester avec un email différent
- Vérifier la connectivité SMTP (port 465)

### Performance lente
- Vérifier le nombre de clients (logs)
- Envisager un système de queue (Bull, RabbitMQ)
- Envisager un service d'emailing dédié

---

## 📚 Ressources

- [Documentation Nodemailer](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Mots de passe d'application Google](https://myaccount.google.com/apppasswords)
- [SMTP Gmail Settings](https://support.google.com/mail/answer/7126229)

---

**Dernière mise à jour** : Octobre 2025
**Version** : 1.0.0
**Auteur** : Équipe AYNEXT

