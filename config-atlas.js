// Configuration MongoDB Atlas - Instructions étape par étape
// Suivez ces étapes pour configurer votre base de données cloud gratuite

/*
ÉTAPE 1 : Créer un compte MongoDB Atlas
==========================================
1. Allez sur : https://www.mongodb.com/atlas
2. Cliquez sur "Try Free" ou "Get Started Free"
3. Créez un compte avec votre email

ÉTAPE 2 : Créer un cluster gratuit
===================================
1. Choisissez "FREE" (M0 Sandbox)
2. Sélectionnez un provider (AWS, Google Cloud, ou Azure)
3. Choisissez une région proche de vous
4. Cliquez sur "Create Cluster"

ÉTAPE 3 : Configurer la sécurité
================================
1. Dans "Security" > "Database Access"
2. Cliquez sur "Add New Database User"
3. Créez un utilisateur avec :
   - Username: boutiquevetements
   - Password: [créez un mot de passe sécurisé]
   - Role: "Read and write to any database"
4. Cliquez sur "Add User"

ÉTAPE 4 : Autoriser l'accès réseau
==================================
1. Dans "Security" > "Network Access"
2. Cliquez sur "Add IP Address"
3. Cliquez sur "Allow Access from Anywhere" (0.0.0.0/0)
4. Cliquez sur "Confirm"

ÉTAPE 5 : Obtenir l'URI de connexion
=====================================
1. Dans "Database" > "Connect"
2. Choisissez "Connect your application"
3. Copiez l'URI qui ressemble à :
   mongodb+srv://boutiquevetements:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

ÉTAPE 6 : Mettre à jour le fichier .env
========================================
Remplacez <password> par votre vrai mot de passe dans l'URI
*/

// Exemple d'URI (à remplacer par le vôtre) :
const MONGODB_URI_EXAMPLE = "mongodb+srv://boutiquevetements:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/boutique-vetements?retryWrites=true&w=majority";

// Une fois configuré, mettez à jour votre fichier .env avec :
// MONGODB_URI=mongodb+srv://boutiquevetements:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/boutique-vetements?retryWrites=true&w=majority

console.log("📋 Instructions MongoDB Atlas créées !");
console.log("📖 Suivez les étapes dans ce fichier pour configurer votre base de données");
console.log("🔗 Allez sur : https://www.mongodb.com/atlas");
console.log("✅ Une fois configuré, mettez à jour votre fichier .env");
