# 🔧 Guide Git et GitHub - Résolution des Problèmes

## 🎯 Objectif
Configurer Git et pousser votre boutique vers GitHub.

## ❌ Problème Actuel
Le push vers GitHub échoue avec l'erreur 403 (Permission denied).

## 🔍 Causes Possibles

### 1. Token GitHub sans permissions
Votre token `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` n'a peut-être pas les bonnes permissions.

### 2. Repository inexistant
Le repository [AYNEXT2](https://github.com/ferchichiseddik039-oss/AYNEXT2) pourrait ne pas exister.

### 3. Token expiré
Le token pourrait avoir expiré.

## ✅ Solutions

### Solution 1 : Vérifier le Repository
1. Allez sur [https://github.com/ferchichiseddik039-oss/AYNEXT2](https://github.com/ferchichiseddik039-oss/AYNEXT2)
2. Si le repository n'existe pas, créez-le :
   - Cliquez sur "New repository"
   - Nom : `AYNEXT2`
   - Description : `Boutique de vêtements en ligne`
   - Public ou Private (votre choix)
   - **NE PAS** initialiser avec README, .gitignore, ou licence

### Solution 2 : Régénérer le Token GitHub
1. Allez sur [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Cliquez sur "Generate new token (classic)"
3. Donnez un nom : `Boutique AYNEXT2`
4. Sélectionnez les permissions :
   - ✅ **repo** (accès complet aux repositories)
   - ✅ **workflow** (si vous voulez GitHub Actions)
5. Cliquez sur "Generate token"
6. **COPIEZ** le nouveau token (il ne sera affiché qu'une fois)

### Solution 3 : Utiliser le Nouveau Token
Remplacez `VOTRE_NOUVEAU_TOKEN` dans cette commande :

```bash
git push https://ferchichiseddik039-oss:VOTRE_NOUVEAU_TOKEN@github.com/ferchichiseddik039-oss/AYNEXT2.git main
```

### Solution 4 : Configuration Git Credentials
```bash
# Configurer Git pour stocker les credentials
git config --global credential.helper store

# Pousser avec authentification
git push -u origin main
# Entrez votre username : ferchichiseddik039-oss
# Entrez votre password : VOTRE_NOUVEAU_TOKEN
```

## 🚀 Commandes Rapides

### 1. Vérifier la configuration actuelle
```bash
git remote -v
git config --list
```

### 2. Reconfigurer le remote
```bash
git remote remove origin
git remote add origin https://github.com/ferchichiseddik039-oss/AYNEXT2.git
```

### 3. Pousser avec le nouveau token
```bash
git push https://ferchichiseddik039-oss:VOTRE_NOUVEAU_TOKEN@github.com/ferchichiseddik039-oss/AYNEXT2.git main
```

## 🛠️ Alternative : GitHub Desktop

Si les commandes Git ne fonctionnent pas :

1. Téléchargez [GitHub Desktop](https://desktop.github.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "Add an Existing Repository from your Hard Drive"
4. Sélectionnez votre dossier `boutique-vetements`
5. Publiez le repository

## 🔧 Script Automatique

Exécutez le script `setup-git-github.bat` qui :
- Configure Git
- Ajoute tous les fichiers
- Fait le commit
- Tente le push

## 📋 Checklist de Vérification

- [ ] Repository GitHub créé
- [ ] Token GitHub avec permissions `repo`
- [ ] Git configuré avec votre nom et email
- [ ] Remote configuré vers le bon repository
- [ ] Fichiers ajoutés et commités
- [ ] Push réussi vers GitHub

## 🎉 Résultat Attendu

Après le push réussi, votre repository sera accessible sur :
**https://github.com/ferchichiseddik039-oss/AYNEXT2**

## 🆘 En cas de Problème Persistant

### Option 1 : Interface Web GitHub
1. Allez sur votre repository GitHub
2. Cliquez sur "uploading an existing file"
3. Glissez-déposez tous vos fichiers
4. Commit directement sur GitHub

### Option 2 : Nouveau Repository
1. Créez un nouveau repository avec un nom différent
2. Suivez les étapes de configuration
3. Poussez vers le nouveau repository

### Option 3 : Support GitHub
- Consultez la [documentation GitHub](https://docs.github.com/en/get-started)
- Contactez le support GitHub si nécessaire

---

**🎯 Une fois le push réussi, vous pourrez déployer votre boutique gratuitement avec Vercel !**
