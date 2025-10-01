const mongoose = require('mongoose');
const User = require('./src/lib/User');
require('dotenv').config();

const checkClients = async () => {
  try {
    console.log('🔍 Vérification des comptes clients...');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connecté à MongoDB');

    // Compter les clients
    const clientCount = await User.countDocuments({ role: 'client' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const totalUsers = await User.countDocuments();

    console.log('\n📊 Statistiques des comptes :');
    console.log(`👥 Total d'utilisateurs : ${totalUsers}`);
    console.log(`👤 Comptes clients : ${clientCount}`);
    console.log(`🔧 Comptes admin : ${adminCount}`);

    if (clientCount > 0) {
      console.log('\n👥 Liste des clients :');
      const clients = await User.find({ role: 'client' }).select('nom prenom email dateCreation');
      
      clients.forEach((client, index) => {
        console.log(`${index + 1}. ${client.prenom} ${client.nom} (${client.email}) - Créé le ${client.dateCreation.toLocaleDateString('fr-FR')}`);
      });
    } else {
      console.log('\n❌ Aucun compte client trouvé');
    }

    if (adminCount > 0) {
      console.log('\n🔧 Liste des admins :');
      const admins = await User.find({ role: 'admin' }).select('nom prenom email dateCreation');
      
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.prenom} ${admin.nom} (${admin.email}) - Créé le ${admin.dateCreation.toLocaleDateString('fr-FR')}`);
      });
    } else {
      console.log('\n❌ Aucun compte admin trouvé');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    process.exit(1);
  }
};

// Exécuter le script
checkClients();
