const axios = require('axios');

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5000/api';

async function updateShopNameViaAPI() {
  try {
    console.log('🔄 Mise à jour du nom de la boutique via l\'API...');

    // D'abord, récupérer les paramètres actuels
    console.log('📥 Récupération des paramètres actuels...');
    const getResponse = await axios.get(`${API_BASE_URL}/settings`);
    console.log('✅ Paramètres récupérés:', getResponse.data.informationsGenerales?.nomBoutique);

    // Préparer les nouvelles données
    const newSettings = {
      ...getResponse.data,
      informationsGenerales: {
        ...getResponse.data.informationsGenerales,
        nomBoutique: 'AYNEXT',
        email: 'contact@aynext.com'
      }
    };

    // Mettre à jour les paramètres
    console.log('📤 Mise à jour des paramètres...');
    const updateResponse = await axios.put(`${API_BASE_URL}/settings`, newSettings);
    
    console.log('✅ Paramètres mis à jour avec succès !');
    console.log('📋 Nouveaux paramètres:');
    console.log('   - Nom boutique:', updateResponse.data.informationsGenerales?.nomBoutique);
    console.log('   - Email:', updateResponse.data.informationsGenerales?.email);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Astuce: Assurez-vous d\'être connecté en tant qu\'administrateur');
    }
  }
}

// Exécuter le script
updateShopNameViaAPI();
