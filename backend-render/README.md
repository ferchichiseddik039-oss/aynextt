# Backend Boutique Vêtements

## Configuration pour Render

### Variables d'environnement requises

Copiez le fichier `.env.example` vers `.env` et configurez les variables suivantes :

```bash
# Configuration MongoDB (OBLIGATOIRE)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements

# Configuration JWT (OBLIGATOIRE)
JWT_SECRET=votre_secret_jwt_tres_securise_ici
SESSION_SECRET=votre_session_secret_tres_securise_ici

# Configuration serveur
PORT=5000
NODE_ENV=production

# Configuration client (URL de votre frontend)
CLIENT_URL=https://votre-frontend-url.com

# Configuration Google OAuth (optionnel)
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret

# Configuration email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
```

### Déploiement sur Render

1. Créez un nouveau Web Service sur Render
2. Connectez votre repository GitHub ou uploadez ce fichier ZIP
3. Configurez les variables d'environnement dans l'interface Render
4. Le service démarrera automatiquement

### Commandes disponibles

- `npm start` : Démarre le serveur en production
- `npm run dev` : Démarre le serveur en mode développement

### Structure du projet

- `server.js` : Point d'entrée principal
- `src/routes/` : Routes API
- `src/lib/` : Modèles de données
- `src/middleware/` : Middlewares d'authentification
- `src/config/` : Configuration Passport
- `src/services/` : Services (email, etc.)
- `uploads/` : Dossier pour les fichiers uploadés

### API Endpoints

- `/api/auth` : Authentification
- `/api/products` : Gestion des produits
- `/api/cart` : Panier d'achat
- `/api/orders` : Commandes
- `/api/users` : Utilisateurs
- `/api/admin` : Administration
- `/api/settings` : Paramètres
- `/api/upload` : Upload de fichiers

