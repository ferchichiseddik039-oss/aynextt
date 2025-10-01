const express = require('express');
const mongoose = require('mongoose');
const User = require('./src/lib/User');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Route pour vérifier/créer un admin
app.get('/api/admin/check', async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    if (adminCount === 0) {
      // Créer un admin par défaut
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        nom: 'Admin',
        prenom: 'AYNEXT',
        email: 'admin@aynext.com',
        motDePasse: hashedPassword,
        role: 'admin',
        telephone: '+33 1 23 45 67 89',
        adresse: {
          rue: '123 Rue de la Mode',
          ville: 'Paris',
          codePostal: '75001',
          pays: 'France'
        }
      });
      
      await admin.save();
      console.log('✅ Admin créé par défaut: admin@aynext.com / admin123');
      
      res.json({ 
        exists: true, 
        message: 'Admin créé par défaut',
        email: 'admin@aynext.com'
      });
    } else {
      const admin = await User.findOne({ role: 'admin' });
      res.json({ 
        exists: true, 
        message: 'Admin existe déjà',
        email: admin.email
      });
    }
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route de connexion
app.post('/api/auth/connexion', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur de test démarré sur le port ${PORT}`);
  console.log('📧 Email admin: admin@aynext.com');
  console.log('🔑 Mot de passe: admin123');
});
