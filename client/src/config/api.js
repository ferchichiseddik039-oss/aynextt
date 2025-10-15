// Configuration API pour Render (production) ou local (développement)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://aynextt.onrender.com/api'  // URL de votre backend Render
  : '/api';  // Pour le développement local

export default API_BASE_URL;
