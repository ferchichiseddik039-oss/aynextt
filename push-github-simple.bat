@echo off
echo 🚀 Push simple vers GitHub
echo.

echo 📋 COMMANDE À EXÉCUTER :
echo.
echo git push https://ferchichiseddik039-oss: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@github.com/ferchichiseddik039-oss/AYNEXT2.git main
echo.

echo 🔄 Exécution de la commande...
git push https://ferchichiseddik039-oss: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@github.com/ferchichiseddik039-oss/AYNEXT2.git main

if errorlevel 1 (
    echo.
    echo ❌ Push échoué. Vérifiez :
    echo    1. Le repository existe sur GitHub
    echo    2. Le token a les bonnes permissions
    echo    3. Votre connexion internet
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
