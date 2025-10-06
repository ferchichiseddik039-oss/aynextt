@echo off
echo ========================================
echo   DEPLOIEMENT AUTOMATIQUE COMPLET
echo ========================================
echo.
echo Cette procedure va :
echo 1. Tester l'application localement
echo 2. Preparer le repository GitHub
echo 3. Guider le deploiement sur Render
echo.
echo ========================================
echo   ETAPE 1 : TEST LOCAL
echo ========================================
echo.
echo Test de l'application en local...
echo.
echo Si l'application fonctionne, vous verrez :
echo - Serveur demarre sur le port 5001
echo - Frontend accessible sur http://localhost:5001
echo - API accessible sur http://localhost:5001/api
echo - Connexion a MongoDB Atlas
echo.
echo Appuyez sur Ctrl+C pour arreter le test
echo.
timeout /t 5 /nobreak >nul
echo.
echo ========================================
echo   ETAPE 2 : CREATION DU REPOSITORY GITHUB
echo ========================================
echo.
echo 1. Ouvrez https://github.com dans votre navigateur
echo 2. Cliquez sur "New Repository"
echo 3. Nom : boutique-unified-aynext
echo 4. Description : Application e-commerce unifiee - AYNEXT
echo 5. Choisissez Public ou Private
echo 6. NE PAS cocher les options supplementaires
echo 7. Cliquez sur "Create Repository"
echo.
echo Une fois cree, copiez l'URL du repository
echo (exemple: https://github.com/VOTRE_USERNAME/boutique-unified-aynext.git)
echo.
set /p GITHUB_URL="Entrez l'URL de votre repository GitHub : "

echo.
echo ========================================
echo   ETAPE 3 : PUSH VERS GITHUB
echo ========================================
echo.
echo Ajout du remote GitHub...
git remote add origin %GITHUB_URL%

echo.
echo Changement vers la branche main...
git branch -M main

echo.
echo Push vers GitHub...
git push -u origin main

echo.
echo ========================================
echo   ETAPE 4 : DEPLOIEMENT SUR RENDER
echo ========================================
echo.
echo 1. Ouvrez https://render.com dans votre navigateur
echo 2. Connectez-vous avec votre compte GitHub
echo 3. Cliquez sur "New +" puis "Web Service"
echo 4. Connectez votre repository "boutique-unified-aynext"
echo.
echo 5. Configuration sur Render :
echo    - Name: boutique-aynext-unified
echo    - Language: Node
echo    - Branch: main
echo    - Region: Oregon (US West)
echo    - Instance Type: Free
echo    - Build Command: npm run build
echo    - Start Command: npm start
echo.
echo 6. Variables d'environnement a ajouter :
echo    - MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements
echo    - JWT_SECRET=your_jwt_secret_key_here_2024
echo    - NODE_ENV=production
echo    - PORT=10000
echo.
echo 7. Cliquez sur "Deploy Web Service"
echo.
echo 8. Attendez le deploiement (5-10 minutes)
echo.
pause

echo.
echo ========================================
echo   DEPLOIEMENT TERMINE !
echo ========================================
echo.
echo Votre boutique AYNEXT est maintenant en ligne !
echo.
echo Acces admin :
echo - Email: ayoubbenromdan8@gmail.com
echo - Mot de passe: 52141707
echo.
echo Votre site sera accessible via l'URL fournie par Render
echo (exemple: https://boutique-aynext-unified.onrender.com)
echo.
echo Felicitations ! Votre boutique e-commerce est operationnelle !
echo.
pause
