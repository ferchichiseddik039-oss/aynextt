# Guide de Déploiement sur InfinityFree

## 🎯 Objectif
Déployer votre application React (frontend) sur InfinityFree et connecter avec votre backend hébergé ailleurs.

## ⚠️ Limitations d'InfinityFree
- **PHP uniquement** : Ne peut pas exécuter Node.js
- **Fichiers statiques** : Parfait pour React compilé
- **Backend séparé** : Votre API doit être hébergée ailleurs (Heroku, Railway, etc.)

## 📋 Prérequis
1. Compte InfinityFree créé
2. Backend déployé et accessible (URL publique)
3. Build React généré (`npm run build`)

## 🚀 Étapes de Déploiement

### 1. Préparation du Build
```bash
# Dans le dossier racine du projet
npm run build
```

### 2. Exécution du Script de Déploiement
```bash
# Double-cliquez sur le fichier
deploy-infinityfree.bat
```

### 3. Upload sur InfinityFree

#### A. Accès au File Manager
1. Connectez-vous à votre panel InfinityFree
2. Cliquez sur "File Manager"
3. Naviguez vers le dossier `htdocs`

#### B. Suppression des Fichiers Existants
1. Sélectionnez TOUS les fichiers dans `htdocs`
2. Supprimez-les (videz complètement le dossier)

#### C. Upload des Nouveaux Fichiers
1. Dans le dossier `infinityfree-deploy` (créé par le script)
2. Sélectionnez TOUS les fichiers ET dossiers
3. Glissez-déposez ou uploadez dans `htdocs`

**⚠️ IMPORTANT :**
- Uploadez le **CONTENU** du dossier, pas le dossier lui-même
- Le fichier `index.html` doit être directement dans `htdocs`
- Incluez le dossier `static` et tous ses contenus

### 4. Structure Finale dans htdocs
```
htdocs/
├── index.html          ← OBLIGATOIRE
├── manifest.json
├── favicon.ico
├── logo192.png
├── static/
│   ├── css/
│   │   └── main.xxx.css
│   └── js/
│       └── main.xxx.js
└── [autres fichiers...]
```

## ⚙️ Configuration Backend

### Variables d'Environnement
Mettez à jour votre fichier `.env` de production :

```env
REACT_APP_API_URL=https://votre-backend.herokuapp.com
REACT_APP_ENVIRONMENT=production
```

### Options d'Hébergement Backend
1. **Heroku** (gratuit avec limitations)
2. **Railway** (gratuit avec limitations)
3. **Render** (gratuit avec limitations)
4. **Vercel** (pour API serverless)

## 🔧 Résolution des Problèmes

### "No index file was found"
- ✅ Vérifiez que `index.html` est dans `htdocs`
- ✅ Vérifiez l'extension `.html` (pas `.htm`)
- ✅ Vérifiez les permissions du fichier

### Erreurs 404 pour les Assets
- ✅ Vérifiez que le dossier `static` est uploadé
- ✅ Vérifiez la structure des dossiers
- ✅ Vérifiez les chemins dans `index.html`

### Backend Non Accessible
- ✅ Vérifiez l'URL de votre backend
- ✅ Testez l'API directement dans le navigateur
- ✅ Vérifiez les variables d'environnement

## 📊 Vérification du Déploiement

### Test des Fonctionnalités
1. **Page d'accueil** : Charge-t-elle ?
2. **Navigation** : Les liens fonctionnent-ils ?
3. **API** : Les appels au backend fonctionnent-ils ?
4. **Assets** : Images et CSS se chargent-ils ?

### Outils de Debug
- **Console du navigateur** : F12 → Console
- **Network** : F12 → Network (vérifier les requêtes)
- **Elements** : F12 → Elements (vérifier le HTML)

## 🔄 Mise à Jour

Pour mettre à jour votre site :
1. Modifiez votre code
2. Relancez `npm run build`
3. Relancez `deploy-infinityfree.bat`
4. Re-uploadez les fichiers sur InfinityFree

## 📞 Support

### Ressources
- [Documentation InfinityFree](https://infinityfree.net/support/)
- [Guide File Manager](https://infinityfree.net/support/file-manager/)

### Problèmes Courants
- **Limites de stockage** : 5GB maximum
- **Limites de bande passante** : 5GB/mois
- **Limites de CPU** : 1 minute max par requête

## ✅ Checklist de Déploiement

- [ ] Build React généré (`npm run build`)
- [ ] Script `deploy-infinityfree.bat` exécuté
- [ ] Dossier `htdocs` vidé sur InfinityFree
- [ ] Tous les fichiers uploadés dans `htdocs`
- [ ] `index.html` accessible directement
- [ ] Dossier `static` uploadé
- [ ] Backend configuré et accessible
- [ ] Variables d'environnement mises à jour
- [ ] Site testé et fonctionnel

---

🎉 **Félicitations !** Votre boutique est maintenant en ligne sur InfinityFree !
