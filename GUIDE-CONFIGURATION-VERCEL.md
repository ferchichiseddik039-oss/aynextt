# Guide de Configuration Vercel - Backend Séparé

## 🎯 Problème Actuel
Votre frontend Vercel essaie d'accéder à `localhost:5001` au lieu de votre backend déployé.

## 🔧 Solutions

### Option 1 : Déployer le Backend sur Vercel (Recommandé)

#### 1. Variables d'Environnement à Configurer dans Vercel

Dans votre dashboard Vercel, ajoutez ces variables :

```env
# URL du frontend (votre site Vercel)
CLIENT_URL=https://aynext-boutique-rlhta2fk6-seddik-s-projects-c94a56ab.vercel.app

# Base de données MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boutique

# Session et sécurité
SESSION_SECRET=votre_secret_session_tres_long_et_complexe

# OAuth Google (si utilisé)
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret

# OAuth Facebook (si utilisé)
FACEBOOK_APP_ID=votre_facebook_app_id
FACEBOOK_APP_SECRET=votre_facebook_app_secret

# Email (si configuré)
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
```

#### 2. Redéployer avec les Variables
```bash
vercel --prod
```

### Option 2 : Déployer le Backend Séparément

#### A. Heroku (Gratuit)
```bash
# Installer Heroku CLI
# Créer une nouvelle app
heroku create aynext-backend

# Ajouter les variables d'environnement
heroku config:set CLIENT_URL=https://aynext-boutique-rlhta2fk6-seddik-s-projects-c94a56ab.vercel.app
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set SESSION_SECRET=votre_secret

# Déployer
git push heroku main
```

#### B. Railway (Gratuit)
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter et déployer
railway login
railway init
railway up
```

#### C. Render (Gratuit)
1. Connectez votre repository GitHub
2. Créez un nouveau "Web Service"
3. Configurez les variables d'environnement
4. Déployez

### Option 3 : Configuration Frontend pour Backend Externe

Si vous déployez le backend ailleurs, mettez à jour les variables d'environnement Vercel :

```env
REACT_APP_API_URL=https://votre-backend.herokuapp.com
REACT_APP_ENVIRONMENT=production
```

## 🚀 Étapes Immédiates

### 1. Configurer Vercel (Recommandé)

1. **Allez sur** https://vercel.com/dashboard
2. **Sélectionnez** votre projet `aynext-boutique`
3. **Allez dans** Settings → Environment Variables
4. **Ajoutez** ces variables :

| Variable | Valeur |
|----------|--------|
| `CLIENT_URL` | `https://aynext-boutique-rlhta2fk6-seddik-s-projects-c94a56ab.vercel.app` |
| `MONGODB_URI` | Votre URI MongoDB Atlas |
| `SESSION_SECRET` | Un secret long et complexe |
| `NODE_ENV` | `production` |

### 2. Redéployer
```bash
vercel --prod
```

### 3. Vérifier
- Votre site devrait maintenant fonctionner
- Les API calls iront vers le bon backend

## 🔍 Debug

### Vérifier les Variables d'Environnement
Dans votre code, ajoutez temporairement :
```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);
console.log('Environment:', process.env.NODE_ENV);
```

### Vérifier les CORS
Dans votre backend, ajoutez :
```javascript
console.log('CORS Origin:', process.env.CLIENT_URL);
```

## ⚠️ Points Importants

1. **Ne jamais** exposer vos secrets dans le code
2. **Toujours** utiliser les variables d'environnement
3. **Vérifier** que CLIENT_URL correspond à votre domaine Vercel
4. **Tester** les API calls après chaque déploiement

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel
2. Vérifiez les variables d'environnement
3. Testez les endpoints API individuellement
