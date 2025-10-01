@echo off
echo 🚀 Push de votre boutique vers GitHub
echo.

REM Vérifier l'état Git
echo 📊 État actuel du repository...
git status
echo.

REM Vérifier le remote
echo 🔗 Configuration du remote...
git remote -v
echo.

echo 📋 ÉTAPES À SUIVRE :
echo.
echo 1. 🌐 Créez le repository sur GitHub :
echo    - Allez sur https://github.com/ferchichiseddik039-oss
echo    - Cliquez sur "New repository"
echo    - Nom : AYNEXT2
echo    - Description : Boutique de vêtements en ligne
echo    - Public ou Private (votre choix)
echo    - NE PAS initialiser avec README, .gitignore, ou licence
echo    - Cliquez sur "Create repository"
echo.

echo 2. 🔑 Vérifiez les permissions de votre token :
echo    - Allez sur https://github.com/settings/tokens
echo    - Vérifiez que votre token a la permission "repo"
echo.

echo 3. 🚀 Poussez vers GitHub :
echo    git push -u origin main
echo.

echo 4. 🔄 Si ça ne marche pas, essayez :
echo    git push https://ferchichiseddik039-oss:VOTRE_TOKEN@github.com/ferchichiseddik039-oss/AYNEXT2.git main
echo.

REM Essayer le push
echo 🔄 Tentative de push...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Push échoué. Suivez les étapes ci-dessus.
    echo.
    echo 💡 Le repository doit être créé sur GitHub d'abord !
) else (
    echo.
    echo ✅ Push réussi ! Votre boutique est maintenant sur GitHub
    echo 🌐 Repository : https://github.com/ferchichiseddik039-oss/AYNEXT2
    echo.
    echo 🎉 Prochaine étape : Déployez avec Vercel !
    echo 📖 Guide : DEPLOIEMENT-GRATUIT-COMPLET.md
)

echo.
pause
