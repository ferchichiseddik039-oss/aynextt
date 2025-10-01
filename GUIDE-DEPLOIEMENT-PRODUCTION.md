# 🚀 Guide de Déploiement en Production

Ce guide vous accompagne pour déployer votre boutique en ligne et la rendre visible sur Google.

## 📋 Prérequis

### 1. Serveur/VPS
- **Serveur Linux** (Ubuntu 20.04+ recommandé)
- **RAM**: Minimum 2GB (4GB recommandé)
- **Stockage**: Minimum 20GB
- **CPU**: 2 vCPU minimum

### 2. Services externes
- **MongoDB Atlas** (base de données cloud)
- **Nom de domaine** (ex: votreboutique.com)
- **Certificat SSL** (Let's Encrypt gratuit)

## 🔧 Configuration du Serveur

### 1. Mise à jour du système
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installation de Node.js
```bash
# Installation de Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérification
node --version
npm --version
```

### 3. Installation de PM2 (gestionnaire de processus)
```bash
sudo npm install -g pm2
```

### 4. Installation de Nginx (reverse proxy)
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 🗄️ Configuration MongoDB Atlas

### 1. Créer un cluster
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un compte gratuit
3. Créez un nouveau cluster
4. Configurez l'accès réseau (0.0.0.0/0 pour tous les IPs)
5. Créez un utilisateur de base de données

### 2. Obtenir l'URI de connexion
```
mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements?retryWrites=true&w=majority
```

## 📁 Déploiement de l'Application

### 1. Upload des fichiers
```bash
# Créer le dossier de l'application
sudo mkdir -p /var/www/boutique-vetements
sudo chown -R $USER:$USER /var/www/boutique-vetements

# Uploader vos fichiers (via SCP, Git, etc.)
scp -r . user@votre-serveur:/var/www/boutique-vetements/
```

### 2. Configuration des variables d'environnement
```bash
cd /var/www/boutique-vetements
cp env.production.example .env
nano .env
```

**Contenu du fichier .env :**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_tres_securise_pour_production_2024
SESSION_SECRET=votre_session_secret_tres_securise_pour_production_2024
CLIENT_URL=https://votre-domaine.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application
```

### 3. Installation et construction
```bash
# Installer les dépendances
npm install --production

# Construire le frontend
cd client
npm install
npm run build
cd ..
```

### 4. Démarrage avec PM2
```bash
# Démarrer l'application
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

## 🌐 Configuration Nginx

### 1. Créer la configuration du site
```bash
sudo nano /etc/nginx/sites-available/boutique-vetements
```

**Contenu de la configuration :**
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Redirection vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # Certificats SSL (seront configurés avec Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    # Configuration SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Gestion des fichiers statiques
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache pour les fichiers statiques
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### 2. Activer le site
```bash
sudo ln -s /etc/nginx/sites-available/boutique-vetements /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Configuration SSL avec Let's Encrypt

### 1. Installation de Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Obtenir le certificat SSL
```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

### 3. Renouvellement automatique
```bash
sudo crontab -e
# Ajouter cette ligne :
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔍 Optimisation SEO pour Google

### 1. Google Search Console
1. Allez sur [Google Search Console](https://search.google.com/search-console)
2. Ajoutez votre propriété (votre-domaine.com)
3. Vérifiez la propriété (via fichier HTML ou DNS)
4. Soumettez votre sitemap : `https://votre-domaine.com/sitemap.xml`

### 2. Google Analytics
1. Créez un compte [Google Analytics](https://analytics.google.com)
2. Ajoutez le code de suivi dans votre application
3. Configurez les objectifs de conversion

### 3. Optimisations techniques
- **PageSpeed Insights** : Testez vos performances
- **Mobile-Friendly Test** : Vérifiez la compatibilité mobile
- **Rich Results Test** : Testez vos données structurées

## 📊 Monitoring et Maintenance

### 1. Surveillance avec PM2
```bash
# Voir les logs
pm2 logs boutique-vetements

# Redémarrer l'application
pm2 restart boutique-vetements

# Voir les statistiques
pm2 monit
```

### 2. Sauvegarde de la base de données
```bash
# Script de sauvegarde quotidienne
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="votre_uri_mongodb" --out="/backup/mongodb_$DATE"
```

### 3. Mise à jour de l'application
```bash
# Arrêter l'application
pm2 stop boutique-vetements

# Mettre à jour le code
git pull origin main

# Reconstruire le frontend
cd client && npm run build && cd ..

# Redémarrer l'application
pm2 start boutique-vetements
```

## 🚨 Résolution de Problèmes

### Problèmes courants

1. **Application ne démarre pas**
   ```bash
   pm2 logs boutique-vetements
   # Vérifier les variables d'environnement
   ```

2. **Erreur de base de données**
   ```bash
   # Vérifier la connexion MongoDB
   node -e "require('mongoose').connect('votre_uri').then(() => console.log('OK')).catch(console.error)"
   ```

3. **Problèmes SSL**
   ```bash
   sudo certbot renew --dry-run
   ```

4. **Nginx ne fonctionne pas**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

## 📈 Optimisations Avancées

### 1. CDN (Content Delivery Network)
- Utilisez Cloudflare ou AWS CloudFront
- Configurez la mise en cache des images

### 2. Compression
- Activez la compression Gzip dans Nginx
- Optimisez les images (WebP, compression)

### 3. Cache Redis
- Installez Redis pour le cache des sessions
- Configurez le cache des requêtes fréquentes

## ✅ Checklist de Déploiement

- [ ] Serveur configuré et sécurisé
- [ ] MongoDB Atlas configuré
- [ ] Variables d'environnement définies
- [ ] Application déployée et testée
- [ ] Nginx configuré
- [ ] SSL configuré avec Let's Encrypt
- [ ] Google Search Console configuré
- [ ] Sitemap soumis à Google
- [ ] Google Analytics configuré
- [ ] Monitoring en place
- [ ] Sauvegardes configurées

## 🎯 Résultats Attendus

Après le déploiement, votre boutique sera :
- ✅ Accessible via votre domaine
- ✅ Sécurisée avec SSL
- ✅ Optimisée pour Google
- ✅ Rapide et performante
- ✅ Prête pour les clients

## 📞 Support

En cas de problème :
1. Vérifiez les logs : `pm2 logs boutique-vetements`
2. Testez la connectivité : `curl https://votre-domaine.com`
3. Vérifiez Nginx : `sudo nginx -t`
4. Consultez la documentation des services utilisés

---

**🎉 Félicitations ! Votre boutique en ligne est maintenant en ligne et optimisée pour Google !**
