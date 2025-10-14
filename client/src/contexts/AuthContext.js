import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../config/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Charger les informations de l'utilisateur
  const loadUser = useCallback(async () => {
    try {
      console.log('🔄 AuthContext - loadUser appelé');
      console.log('🔑 Token actuel:', token ? `${token.substring(0, 50)}...` : 'AUCUN');
      console.log('📡 Headers API:', api.defaults.headers.common);
      
      const res = await api.get('/auth/utilisateur');
      console.log('📡 AuthContext - Réponse complète:', res);
      console.log('📡 AuthContext - Réponse data:', res.data);
      console.log('📡 AuthContext - Status:', res.status);
      
      if (res.data.success) {
        // Si user est null mais que le token contient des informations admin, les utiliser
        if (!res.data.user && token) {
          try {
            // Décoder le JWT côté frontend (sans vérification de signature)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const decoded = JSON.parse(jsonPayload);
            
            if (decoded && decoded.role === 'admin' && decoded.user) {
              console.log('⚠️ AuthContext - User null mais token admin détecté, utilisation des données du token');
              setUser(decoded.user);
              console.log('✅ AuthContext - Utilisateur admin défini depuis token:', decoded.user);
            } else {
              setUser(res.data.user);
              console.log('✅ AuthContext - Utilisateur défini:', res.data.user);
            }
          } catch (jwtError) {
            console.error('❌ AuthContext - Erreur décodage JWT:', jwtError);
            setUser(res.data.user);
            console.log('✅ AuthContext - Utilisateur défini:', res.data.user);
          }
        } else {
          setUser(res.data.user);
          console.log('✅ AuthContext - Utilisateur défini:', res.data.user);
        }
      } else {
        console.error('❌ AuthContext - Réponse sans success:', res.data);
        throw new Error(`Erreur de chargement utilisateur: ${res.data.message || 'Raison inconnue'}`);
      }
    } catch (err) {
      console.error('❌ AuthContext - Erreur loadUser complète:', err);
      console.error('❌ AuthContext - Erreur response:', err.response);
      console.error('❌ AuthContext - Erreur status:', err.response?.status);
      console.error('❌ AuthContext - Erreur data:', err.response?.data);
      
      localStorage.removeItem('token');
      delete api.defaults.headers.common['x-auth-token'];
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Configurer api avec le token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['x-auth-token'] = token;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  // Inscription
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/inscription', userData);
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['x-auth-token'] = newToken;
        
        toast.success('Inscription réussie !');
        return { success: true };
      } else {
        throw new Error(res.data.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Connexion (clients uniquement)
  const login = async (credentials) => {
    try {
      const res = await api.post('/auth/connexion', credentials);
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['x-auth-token'] = newToken;
        
        toast.success('Connexion réussie !');
        return { success: true };
      } else {
        throw new Error(res.data.message || 'Erreur lors de la connexion');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la connexion';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Connexion admin
  const loginAdmin = async (credentials) => {
    try {
      const res = await api.post('/auth/connexion-admin', credentials);
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['x-auth-token'] = newToken;
        
        toast.success('Connexion administrateur réussie !');
        return { success: true };
      } else {
        throw new Error(res.data.message || 'Erreur lors de la connexion admin');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la connexion admin';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Déconnexion
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['x-auth-token'];
    toast.success('Déconnexion réussie');
  };

  // Mettre à jour le profil
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/users/profile', profileData);
      setUser(res.data);
      toast.success('Profil mis à jour avec succès !');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Changer le mot de passe
  const changePassword = async (passwordData) => {
    try {
      await api.put('/users/password', passwordData);
      toast.success('Mot de passe mis à jour avec succès !');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors du changement de mot de passe';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Méthode pour définir le token (utilisée par OAuth)
  const setAuthToken = async (newToken) => {
    console.log('🔄 AuthContext - setAuthToken appelé avec token:', newToken ? 'PRÉSENT' : 'ABSENT');
    setToken(newToken);
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['x-auth-token'] = newToken;
    console.log('🔄 AuthContext - Appel de loadUser...');
    await loadUser(); // Recharger les informations utilisateur
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    loginAdmin,
    logout,
    updateProfile,
    changePassword,
    setAuthToken,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
