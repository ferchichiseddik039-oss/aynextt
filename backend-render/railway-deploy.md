# Déploiement Backend sur Railway

## Installation Railway CLI

```bash
# Windows (PowerShell)
iwr -useb https://railway.app/install.ps1 | iex

# Ou via npm
npm install -g @railway/cli
```

## Connexion et déploiement

```bash
# Se connecter à Railway
railway login

# Initialiser le projet
railway init

# Déployer
railway up

# Voir les logs
railway logs

# Ouvrir dans le navigateur
railway open
```

## Variables d'environnement

Configurez ces variables dans Railway Dashboard ou via CLI :

```bash
# MongoDB
railway variables set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements"

# JWT
railway variables set JWT_SECRET="votre_secret_jwt_tres_securise_ici"
railway variables set SESSION_SECRET="votre_session_secret_tres_securise_ici"

# Client URL (URL de votre frontend Vercel)
railway variables set CLIENT_URL="https://votre-frontend.vercel.app"

# Environnement
railway variables set NODE_ENV="production"
railway variables set PORT="5000"
```

## Commandes utiles

```bash
# Voir le statut
railway status

# Voir les variables d'environnement
railway variables

# Redémarrer le service
railway redeploy

# Supprimer le service
railway delete
```

## URL du backend

Après déploiement, Railway vous donnera une URL comme :
`https://votre-projet-production.up.railway.app`

Utilisez cette URL dans les variables d'environnement de votre frontend Vercel.

