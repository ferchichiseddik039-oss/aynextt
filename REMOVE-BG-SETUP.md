# Configuration Remove.bg API

## 🎯 Objectif
Supprimer automatiquement l'arrière-plan des logos uploadés pour un rendu professionnel sur la capuche.

## 🔑 Obtenir une clé API gratuite

1. **Aller sur** [remove.bg/api](https://www.remove.bg/api)
2. **Créer un compte** gratuit
3. **Obtenir votre clé API** (gratuite jusqu'à 50 images/mois)
4. **Copier la clé API**

## ⚙️ Configuration

### Étape 1: Modifier le fichier de configuration
Ouvrez `client/src/config/removeBg.js` et remplacez :

```javascript
API_KEY: "YOUR_REMOVE_BG_API_KEY",
```

Par votre vraie clé API :

```javascript
API_KEY: "votre_cle_api_ici",
```

### Étape 2: Redémarrer l'application
```bash
cd client
npm start
```

## 🧪 Test

1. **Aller sur** `http://localhost:3000`
2. **Cliquer sur** "TESTER LE DESIGNER DE CAPUCHE"
3. **Uploader un logo** avec arrière-plan (ex: logo sur fond blanc)
4. **Voir le résultat** : logo transparent sur la capuche

## 📊 Fonctionnalités

### ✅ Avec clé API configurée
- **Suppression automatique** de l'arrière-plan
- **Logo transparent** parfait
- **Traitement en temps réel**
- **Indicateur de progression**

### 🔄 Sans clé API (fallback)
- **Upload normal** du logo
- **Pas de suppression** d'arrière-plan
- **Fonctionne quand même**

## 🎨 Exemples de logos à tester

- Logo d'entreprise sur fond blanc
- Image avec arrière-plan coloré
- Photo de personne
- Dessin/illustration

## 💡 Conseils

1. **Formats supportés** : JPG, PNG, WebP
2. **Taille recommandée** : 100x100px à 1000x1000px
3. **Qualité** : Plus l'image est nette, meilleur est le résultat
4. **Contraste** : Les logos avec un bon contraste fonctionnent mieux

## 🚨 Limites de l'API gratuite

- **50 images/mois** maximum
- **Taille max** : 25MB par image
- **Résolution max** : 25MP

## 🔧 Alternatives

Si vous voulez éviter l'API externe, vous pouvez :

1. **Utiliser des logos PNG** déjà transparents
2. **Pré-traiter les images** avec un outil comme GIMP/Photoshop
3. **Implémenter une solution locale** (plus complexe)

## 📝 Code d'exemple

```javascript
// Dans votre composant
const handleLogoUpload = async (e) => {
  const file = e.target.files[0];
  if (file && isApiKeyConfigured()) {
    setIsProcessing(true);
    try {
      const logoUrl = await removeBackground(file);
      setLogo(logoUrl);
    } catch (error) {
      // Fallback vers l'image originale
      setLogo(URL.createObjectURL(file));
    }
    setIsProcessing(false);
  }
};
```

## 🎉 Résultat final

Un designer de capuche professionnel avec :
- ✅ Changement de couleur réaliste
- ✅ Upload de logo avec suppression d'arrière-plan
- ✅ Interface utilisateur intuitive
- ✅ Fallback robuste
