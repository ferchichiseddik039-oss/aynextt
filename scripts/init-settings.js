const mongoose = require('mongoose');
const Settings = require('../src/lib/Settings');
require('dotenv').config();

const initSettings = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique-vetements', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connecté à MongoDB');

    // Vérifier si des paramètres existent déjà
    const existingSettings = await Settings.findOne();
    
    if (existingSettings) {
      console.log('ℹ️  Des paramètres existent déjà dans la base de données');
      console.log('📋 Paramètres actuels:');
      console.log('   - Nom boutique:', existingSettings.informationsGenerales.nomBoutique);
      console.log('   - Frais livraison:', existingSettings.livraison.fraisLivraison, 'TND');
      console.log('   - Seuil livraison gratuite:', existingSettings.livraison.fraisLivraisonGratuite, 'TND');
      console.log('   - Méthodes de paiement actives:', existingSettings.paiement.methodesActives.join(', '));
      console.log('   - Devise:', existingSettings.general.devise);
      
      const response = await new Promise((resolve) => {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        readline.question('Voulez-vous réinitialiser les paramètres aux valeurs par défaut ? (y/N): ', (answer) => {
          readline.close();
          resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
      });
      
      if (response) {
        await Settings.deleteMany({});
        console.log('🗑️  Anciens paramètres supprimés');
      } else {
        console.log('✅ Paramètres conservés');
        process.exit(0);
      }
    }

    // Créer les paramètres par défaut
    const defaultSettings = new Settings({
      informationsGenerales: {
        nomBoutique: 'AYNEXT',
        description: 'Boutique de vêtements tendance et personnalisés',
        email: 'contact@aynext.com',
        telephone: '+216 XX XXX XXX',
        adresse: {
          rue: 'Rue de la Mode',
          ville: 'Tunis',
          codePostal: '1000',
          pays: 'Tunisie'
        },
        logo: ''
      },
      livraison: {
        fraisLivraison: 5.9,
        fraisLivraisonGratuite: 100,
        delaiLivraison: '3-5 jours ouvrables',
        zonesLivraison: [
          {
            nom: 'Tunis Centre',
            frais: 5.9,
            delai: '2-3 jours'
          },
          {
            nom: 'Grand Tunis',
            frais: 7.9,
            delai: '3-4 jours'
          },
          {
            nom: 'Autres gouvernorats',
            frais: 12.9,
            delai: '5-7 jours'
          }
        ],
        livraisonGratuite: true
      },
      paiement: {
        methodesAcceptees: ['carte', 'paypal', 'virement', 'especes'],
        methodesActives: ['carte', 'paypal', 'virement', 'especes'],
        paiementSecurise: true,
        informationsPaiement: {
          carte: {
            active: true,
            nom: 'Carte bancaire',
            description: 'Visa, Mastercard, American Express'
          },
          paypal: {
            active: true,
            nom: 'PayPal',
            description: 'Paiement sécurisé via PayPal'
          },
          virement: {
            active: true,
            nom: 'Virement bancaire',
            description: 'Virement bancaire direct'
          },
          especes: {
            active: true,
            nom: 'Espèces à la livraison',
            description: 'Paiement en espèces lors de la livraison'
          }
        }
      },
      notifications: {
        email: {
          commandeConfirmee: true,
          commandeExpediee: true,
          commandeLivree: true,
          templateEmail: 'default'
        },
        sms: {
          active: false,
          commandeConfirmee: false,
          commandeExpediee: false
        },
        push: {
          active: false,
          promotions: true,
          nouveautes: true
        }
      },
      general: {
        devise: 'TND',
        langue: 'fr',
        fuseauHoraire: 'Africa/Tunis',
        maintenance: {
          active: false,
          message: 'Site en maintenance. Revenez bientôt !'
        }
      }
    });

    await defaultSettings.save();
    
    console.log('✅ Paramètres initialisés avec succès !');
    console.log('📋 Configuration par défaut:');
    console.log('   - Nom boutique: AYNEXT');
    console.log('   - Frais livraison: 5.9 TND');
    console.log('   - Seuil livraison gratuite: 100 TND');
    console.log('   - Méthodes de paiement: carte, paypal, virement, especes');
    console.log('   - Devise: TND');
    console.log('   - Langue: Français');
    console.log('   - Zones de livraison: 3 zones configurées');
    
    console.log('\n🎉 Les paramètres sont maintenant disponibles dans l\'interface d\'administration !');
    console.log('💡 Vous pouvez les modifier via: /admin → Paramètres');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des paramètres:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
    process.exit(0);
  }
};

// Exécuter le script
initSettings();
