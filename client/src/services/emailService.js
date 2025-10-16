import emailjs from '@emailjs/browser';

class EmailService {
  constructor() {
    // Clés EmailJS en dur pour GitHub Pages
    this.serviceId = 'service_e5v64h2';
    this.publicKey = 'AwvXaO-k4jHjlLX_mV6vH';
    this.initialized = false;
    console.log('📧 [EmailJS] Service configuré avec:', { serviceId: this.serviceId, publicKey: this.publicKey.substring(0, 10) + '...' });
  }

  initialize() {
    if (!this.serviceId || !this.publicKey) {
      console.warn('⚠️ Service EmailJS non configuré. Variables d\'environnement manquantes.');
      return false;
    }

    if (!this.initialized) {
      emailjs.init(this.publicKey);
      this.initialized = true;
      console.log('✅ Service EmailJS initialisé avec succès');
    }

    return true;
  }

  async sendWelcomeEmail(user) {
    try {
      console.log('📧 [EmailJS] Tentative d\'envoi email de bienvenue à:', user.email);
      
      if (!this.initialize()) {
        return { success: false, error: 'Service EmailJS non configuré' };
      }

      const templateParams = {
        to_email: user.email,
        to_name: `${user.prenom} ${user.nom}`,
        subject: '🎉 Bienvenue chez AYNEXT !',
        message: this.generateWelcomeMessage(user)
      };

      const result = await emailjs.send(
        this.serviceId,
        'template_welcome',
        templateParams
      );

      console.log('✅ [EmailJS] Email de bienvenue envoyé avec succès à:', user.email);
      console.log('📧 [EmailJS] Email ID:', result.text);
      return { success: true, emailId: result.text, provider: 'EmailJS' };
    } catch (error) {
      console.error('❌ [EmailJS] Erreur lors de l\'envoi de l\'email de bienvenue:', error);
      return { success: false, error: error.message, provider: 'EmailJS' };
    }
  }

  async sendOrderStatusEmail(user, order, newStatus) {
    try {
      console.log('📧 [EmailJS] Tentative d\'envoi email de statut à:', user.email, 'Statut:', newStatus);
      
      if (!this.initialize()) {
        return { success: false, error: 'Service EmailJS non configuré' };
      }

      const statusInfo = this.getStatusInfo(newStatus);

      const templateParams = {
        to_email: user.email,
        to_name: `${user.prenom} ${user.nom}`,
        subject: `${statusInfo.emoji} ${statusInfo.subject} - Commande #${order.numeroCommande}`,
        order_number: order.numeroCommande,
        order_status: statusInfo.subject,
        order_status_emoji: statusInfo.emoji,
        order_total: `${order.total}€`,
        order_date: new Date(order.dateCreation).toLocaleDateString('fr-FR'),
        message: this.generateOrderStatusMessage(user, order, newStatus, statusInfo)
      };

      const result = await emailjs.send(
        this.serviceId,
        'template_order_status',
        templateParams
      );

      console.log('✅ [EmailJS] Email de statut envoyé avec succès à:', user.email);
      console.log('📧 [EmailJS] Email ID:', result.text);
      return { success: true, emailId: result.text, provider: 'EmailJS' };
    } catch (error) {
      console.error('❌ [EmailJS] Erreur lors de l\'envoi de l\'email de statut:', error);
      return { success: false, error: error.message, provider: 'EmailJS' };
    }
  }

  getStatusInfo(newStatus) {
    const statusMap = {
      'en_attente': {
        emoji: '⏳',
        subject: 'Commande en attente'
      },
      'confirmee': {
        emoji: '✅',
        subject: 'Commande confirmée'
      },
      'en_preparation': {
        emoji: '👨‍🍳',
        subject: 'Commande en préparation'
      },
      'expediee': {
        emoji: '🚚',
        subject: 'Commande expédiée'
      },
      'livree': {
        emoji: '📦',
        subject: 'Commande livrée'
      },
      'annulee': {
        emoji: '❌',
        subject: 'Commande annulée'
      }
    };

    return statusMap[newStatus] || {
      emoji: '📋',
      subject: 'Statut de commande mis à jour'
    };
  }

  generateWelcomeMessage(user) {
    return `
Bonjour ${user.prenom} ${user.nom},

Bienvenue chez AYNEXT ! 🎉

Nous sommes ravis de vous compter parmi nos clients. Votre compte a été créé avec succès.

Vous pouvez maintenant :
• Parcourir notre collection de vêtements tendance
• Personnaliser vos hoodies
• Suivre vos commandes en temps réel
• Profiter de nos offres exclusives

Merci de votre confiance !

L'équipe AYNEXT
Boutique de vêtements tendance
    `;
  }

  generateOrderStatusMessage(user, order, newStatus, statusInfo) {
    return `
Bonjour ${user.prenom} ${user.nom},

${statusInfo.emoji} Votre commande #${order.numeroCommande} a été mise à jour !

Nouveau statut : ${statusInfo.subject}

Détails de la commande :
• Numéro : #${order.numeroCommande}
• Date : ${new Date(order.dateCreation).toLocaleDateString('fr-FR')}
• Total : ${order.total}€

Merci de votre confiance !

L'équipe AYNEXT
Boutique de vêtements tendance
    `;
  }
}

export default new EmailService();
