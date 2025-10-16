// Service email simplifié - EmailJS géré côté frontend
class EmailService {
  constructor() {
    console.log('📧 [Backend] Service email initialisé - EmailJS géré côté frontend');
  }

  async sendWelcomeEmail(user) {
    // EmailJS géré côté frontend - Pas d'email backend
    console.log('📧 [Backend] Email de bienvenue géré côté frontend via EmailJS');
    return { success: true, message: 'Email géré côté frontend' };
  }

  async sendOrderStatusEmail(user, order, newStatus) {
    // EmailJS géré côté frontend - Pas d'email backend
    console.log('📧 [Backend] Email de statut géré côté frontend via EmailJS');
    return { success: true, message: 'Email géré côté frontend' };
  }
}

module.exports = new EmailService();