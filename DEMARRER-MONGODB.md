# 🚀 Guide pour Démarrer MongoDB

## ✅ État actuel

MongoDB est **installé** et le service est **en cours d'exécution** sur votre système.

## 🔧 Vérification du statut

### 1. Vérifier que MongoDB fonctionne
```powershell
Get-Service -Name "*mongo*"
```

**Résultat attendu :**
```
Status   Name               DisplayName
------   ----               -----------
Running  MongoDB            MongoDB Server (MongoDB)
```

### 2. Si MongoDB n'est pas en cours d'exécution
```powershell
Start-Service MongoDB
```

### 3. Redémarrer MongoDB si nécessaire
```powershell
Restart-Service MongoDB
```

## 🧪 Test de connexion

### Option 1 : Test avec votre application
1. **Démarrez votre serveur :**
   ```bash
   npm start
   ```

2. **Vérifiez les logs** - vous devriez voir :
   ```
   ✅ Google OAuth configuré
   Connecté à MongoDB
   Serveur démarré sur le port 5000
   ```

### Option 2 : Test direct
```bash
node test-mongodb-connection.js
```

## 🔧 Dépannage

### Erreur "ECONNREFUSED"
- **Cause :** MongoDB n'est pas démarré
- **Solution :** `Start-Service MongoDB`

### Erreur "Access denied"
- **Cause :** Privilèges insuffisants
- **Solution :** Exécutez PowerShell en tant qu'administrateur

### Port 27017 occupé
- **Cause :** Autre instance de MongoDB
- **Solution :** `Stop-Service MongoDB` puis `Start-Service MongoDB`

## 📋 Checklist

- [ ] Service MongoDB en cours d'exécution
- [ ] Port 27017 accessible
- [ ] Serveur AYNEXT démarre sans erreur MongoDB
- [ ] Connexion OAuth Google fonctionnelle

## 🎯 Prochaines étapes

1. **Vérifiez le statut :** `Get-Service -Name "*mongo*"`
2. **Démarrez MongoDB :** `Start-Service MongoDB` (si nécessaire)
3. **Testez votre serveur :** `npm start`
4. **Vérifiez les logs** pour confirmer la connexion

---

**MongoDB devrait maintenant fonctionner avec votre application AYNEXT !** 🎉
