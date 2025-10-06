@echo off
echo ========================================
echo   DEPLOIEMENT COMPLET - BOUTIQUE AYNEXT
echo ========================================
echo.
echo Cette procedure va vous guider pour :
echo 1. Creer le repository GitHub
echo 2. Pousser le code
echo 3. Deployer sur Render
echo.
echo ========================================
echo   ETAPE 1 : CREATION DU REPOSITORY GITHUB
echo ========================================
echo.
echo 1. Ouvrez https://github.com dans votre navigateur
echo 2. Cliquez sur "New Repository" (bouton vert)
echo 3. Nom du repository : boutique-unified-aynext
echo 4. Description : Application e-commerce unifiee - AYNEXT
echo 5. Choisissez Public ou Private
echo 6. NE PAS cocher "Add a README file"
echo 7. NE PAS cocher "Add .gitignore"
echo 8. NE PAS cocher "Choose a license"
echo 9. Cliquez sur "Create repository"
echo.
echo Une fois cree, copiez l'URL du repository
echo (exemple: https://github.com/VOTRE_USERNAME/boutique-unified-aynext.git)
echo.
pause

echo.
echo ========================================
echo   ETAPE 2 : PUSH VERS GITHUB
echo ========================================
echo.
set /p GITHUB_URL="Entrez l'URL de votre repository GitHub : "

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
echo   ETAPE 3 : DEPLOIEMENT SUR RENDER
echo ========================================
echo.
echo 1. Ouvrez https://render.com dans votre navigateur
echo 2. Connectez-vous avec votre compte GitHub
echo 3. Cliquez sur "New +" puis "Web Service"
echo 4. Connectez votre repository "boutique-unified-aynext"
echo 5. Configuration :
echo    - Name: boutique-aynext-unified
echo    - Build Command: npm run build
echo    - Start Command: npm start
echo.
echo 6. Variables d'environnement a ajouter :
echo    - MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boutique-vetements
echo    - JWT_SECRET=your_jwt_secret_key_here_2024
echo    - NODE_ENV=production
echo    - PORT=10000
echo.
echo 7. Cliquez sur "Create Web Service"
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
