import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import emailService from '../services/emailService';

const EmailNotificationHandler = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  
  console.log('📧 [EmailNotificationHandler] Composant initialisé', { socket: !!socket, user: !!user });

  useEffect(() => {
    if (!socket) {
      console.log('📧 [EmailNotificationHandler] Pas de socket disponible');
      return;
    }

    console.log('📧 [EmailNotificationHandler] Socket disponible, configuration des écouteurs');

    // Écouter les changements de statut de commande
    const handleOrderStatusChanged = async (data) => {
      console.log('📧 [Frontend] Réception notification changement de statut:', data);
      
      try {
        // Créer un objet utilisateur pour EmailJS
        const user = {
          email: data.userEmail,
          prenom: data.userName.split(' ')[0],
          nom: data.userName.split(' ').slice(1).join(' ')
        };

        // Créer un objet commande pour EmailJS
        const order = {
          numeroCommande: data.orderNumber,
          total: data.orderTotal,
          dateCreation: data.orderDate
        };

        // Envoyer l'email via EmailJS
        const result = await emailService.sendOrderStatusEmail(user, order, data.newStatus);
        
        if (result.success) {
          console.log('✅ [Frontend] Email de statut envoyé avec succès via EmailJS');
        } else {
          console.error('❌ [Frontend] Erreur envoi email:', result.error);
        }
      } catch (error) {
        console.error('❌ [Frontend] Erreur lors de l\'envoi de l\'email:', error);
      }
    };

    // Écouter les nouveaux produits
    const handleNewProduct = async (data) => {
      console.log('📧 [Frontend] Réception notification nouveau produit:', data);
      
      try {
        // Créer un objet utilisateur pour EmailJS (utilisateur actuel)
        const currentUser = {
          email: user?.email,
          prenom: user?.prenom,
          nom: user?.nom
        };

        if (currentUser.email) {
          const result = await emailService.sendNewProductEmail(currentUser, data.product);
          
          if (result.success) {
            console.log('✅ [Frontend] Email nouveau produit envoyé avec succès via EmailJS');
          } else {
            console.error('❌ [Frontend] Erreur envoi email nouveau produit:', result.error);
          }
        }
      } catch (error) {
        console.error('❌ [Frontend] Erreur lors de l\'envoi de l\'email nouveau produit:', error);
      }
    };

    // S'abonner aux événements
    socket.on('order-status-changed', handleOrderStatusChanged);
    socket.on('product-added', handleNewProduct);

    // Nettoyer les écouteurs
    return () => {
      socket.off('order-status-changed', handleOrderStatusChanged);
      socket.off('product-added', handleNewProduct);
    };
  }, [socket, user]);

  // Envoyer un email de bienvenue une seule fois (première connexion)
  useEffect(() => {
    if (user && user.email) {
      // Vérifier si l'email de bienvenue a déjà été envoyé
      const welcomeEmailSent = localStorage.getItem(`welcome_email_sent_${user._id}`);
      
      if (!welcomeEmailSent) {
        // Délai pour s'assurer que l'utilisateur est bien connecté
        const timer = setTimeout(async () => {
          try {
            console.log('📧 [Frontend] Envoi email de bienvenue pour nouvel utilisateur:', user.email);
            const result = await emailService.sendWelcomeEmail(user);
            
            if (result.success) {
              console.log('✅ [Frontend] Email de bienvenue envoyé avec succès via EmailJS');
              // Marquer que l'email de bienvenue a été envoyé
              localStorage.setItem(`welcome_email_sent_${user._id}`, 'true');
            } else {
              console.error('❌ [Frontend] Erreur envoi email de bienvenue:', result.error);
            }
          } catch (error) {
            console.error('❌ [Frontend] Erreur lors de l\'envoi de l\'email de bienvenue:', error);
          }
        }, 2000); // Attendre 2 secondes après la connexion

        return () => clearTimeout(timer);
      } else {
        console.log('📧 [Frontend] Email de bienvenue déjà envoyé pour cet utilisateur');
      }
    }
  }, [user]);

  // Ce composant ne rend rien, il gère juste les emails
  return null;
};

export default EmailNotificationHandler;
