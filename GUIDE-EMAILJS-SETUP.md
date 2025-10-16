# 📧 GUIDE CONFIGURATION EMAILJS

## 🎯 **AVANTAGES EMAILJS**

- ✅ **Gratuit** : 200 emails/mois
- ✅ **Simple** : Configuration en 5 minutes
- ✅ **Fiable** : Pas de timeouts comme Gmail
- ✅ **Dashboard** : Interface visuelle pour créer les templates
- ✅ **Compatible Render** : API directe, pas de SMTP

---

## 🚀 **ÉTAPES DE CONFIGURATION**

### **1. Créer un compte EmailJS**

1. **Allez sur** : https://www.emailjs.com/
2. **Cliquez sur "Sign Up"**
3. **Créez votre compte** (gratuit)

### **2. Créer un service email**

1. **Dans le dashboard**, cliquez sur **"Email Services"**
2. **Cliquez sur "Add New Service"**
3. **Choisissez votre fournisseur** :
   - **Gmail** (recommandé pour commencer)
   - **Outlook**
   - **Yahoo**
   - Ou autres

4. **Configurez Gmail** :
   - **Service Name** : `gmail`
   - **Gmail Address** : `ayoubbenromdan8@gmail.com`
   - **Gmail App Password** : Utilisez le mot de passe d'application Gmail

### **3. Créer les templates d'emails**

#### **Template 1 : Email de bienvenue**

1. **Cliquez sur "Email Templates"**
2. **Cliquez sur "Create New Template"**
3. **Template ID** : `template_welcome`
4. **Contenu** :

```
Subject: {{subject}}

Bonjour {{to_name}},

{{message}}

L'équipe AYNEXT
```

#### **Template 2 : Email de statut de commande**

1. **Créez un nouveau template**
2. **Template ID** : `template_order_status`
3. **Contenu** :

```
Subject: {{subject}}

Bonjour {{to_name}},

Votre commande {{order_number}} a été mise à jour !

Statut : {{order_status_emoji}} {{order_status}}
Date : {{order_date}}
Total : {{order_total}}

{{message}}

L'équipe AYNEXT
```

### **4. Récupérer les clés API**

1. **Cliquez sur "Account"** dans le dashboard
2. **Copiez** :
   - **Service ID** : `service_xxxxxxxxx`
   - **Public Key** : `xxxxxxxxxxxxxxxx`

### **5. Configurer Render**

**Dans Render Dashboard → Environment Variables, ajoutez :**

```
EMAILJS_SERVICE_ID=service_xxxxxxxxx
EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

---

## 📧 **FONCTIONNEMENT**

### **Ordre de priorité :**
1. **EmailJS** (si configuré) ✅
2. **Resend** (si configuré)
3. **Gmail SMTP** (fallback)

### **Logs attendus :**
```
📧 [EmailJS] Configuration détectée - Utilisation d'EmailJS
📧 [EmailJS] Tentative d'envoi email de bienvenue à: client@example.com
✅ [EmailJS] Email de bienvenue envoyé avec succès à: client@example.com
📧 [EmailJS] Email ID: abc123...
```

---

## 🔧 **DÉPANNAGE**

### **Erreur "Service not found"**
- Vérifiez que le **Service ID** est correct
- Assurez-vous que le service email est **activé**

### **Erreur "Template not found"**
- Vérifiez que les **Template ID** sont corrects :
  - `template_welcome`
  - `template_order_status`

### **Erreur d'authentification**
- Vérifiez que la **Public Key** est correcte
- Assurez-vous que le service email est **configuré**

---

## ✅ **AVANTAGES vs Gmail SMTP**

| Fonctionnalité | EmailJS | Gmail SMTP |
|----------------|---------|------------|
| **Configuration** | ✅ Simple | ❌ Complexe |
| **Timeouts** | ✅ Aucun | ❌ Fréquents |
| **Fiabilité** | ✅ Très fiable | ⚠️ Variable |
| **Dashboard** | ✅ Interface visuelle | ❌ Pas d'interface |
| **Templates** | ✅ Éditeur visuel | ❌ Code uniquement |
| **Gratuit** | ✅ 200/mois | ✅ Illimité |

---

## 🎯 **RÉSULTAT ATTENDU**

Une fois configuré, EmailJS enverra les emails **instantanément** sans timeout, avec une interface professionnelle et des templates personnalisables !

**Les clients recevront leurs emails en quelques secondes !** 🚀📧✨
