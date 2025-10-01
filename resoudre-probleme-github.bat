@echo off
echo 🔧 Résolution du problème GitHub - Permission denied
echo.

echo ❌ PROBLÈME : Permission denied (403)
echo.
echo 🔍 CAUSES POSSIBLES :
echo    1. Token GitHub sans permissions "repo"
echo    2. Token expiré
echo    3. Repository avec restrictions
echo.

echo ✅ SOLUTIONS :
echo.
echo 1. 🔑 VÉRIFIER LES PERMISSIONS DU TOKEN :
echo    - Allez sur https://github.com/settings/tokens
echo    - Trouvez votre token : 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
echo    - Vérifiez qu'il a la permission "repo" (accès complet aux repositories)
echo    - Si pas, modifiez les permissions ou créez un nouveau token
echo.

echo 2. 🆕 CRÉER UN NOUVEAU TOKEN :
echo    - Allez sur https://github.com/settings/tokens
echo    - Cliquez sur "Generate new token (classic)"
echo    - Nom : "Boutique AYNEXT2"
echo    - Permissions : ✅ repo (accès complet aux repositories)
echo    - Cliquez sur "Generate token"
echo    - COPIEZ le nouveau token
echo.

echo 3. 🔄 UTILISER LE NOUVEAU TOKEN :
echo    git push https://ferchichiseddik039-oss:NOUVEAU_TOKEN@github.com/ferchichiseddik039-oss/AYNEXT2.git main
echo.

echo 4. 🌐 ALTERNATIVE - Interface Web GitHub :
echo    - Allez sur https://github.com/ferchichiseddik039-oss/AYNEXT2
echo    - Cliquez sur "uploading an existing file"
echo    - Glissez-déposez tous vos fichiers
echo    - Commit directement sur GitHub
echo.

echo 5. 🖥️ ALTERNATIVE - GitHub Desktop :
echo    - Téléchargez GitHub Desktop
echo    - Connectez-vous avec votre compte
echo    - Ajoutez le repository local
echo    - Publiez sur GitHub
echo.

echo 📋 ÉTAT ACTUEL :
echo    - Repository GitHub : ✅ Créé et vide
echo    - Code local : ✅ Prêt et commité
echo    - Problème : ❌ Permissions token
echo.

echo 🎯 ACTION RECOMMANDÉE :
echo    1. Créez un nouveau token avec permission "repo"
echo    2. Utilisez-le dans la commande de push
echo    3. Ou utilisez l'interface web GitHub
echo.

pause
