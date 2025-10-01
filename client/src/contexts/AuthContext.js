import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Configurer api avec le token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['x-auth-token'] = token;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Charger les informations de l'utilisateur
  const loadUser = async () => {
    try {
      const res = await api.get('/api/auth/utilisateur');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['x-auth-token'];
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      const res = await api.post('/api/auth/inscription', userData);
      const { token: newToken, user: newUser } = res.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['x-auth-token'] = newToken;
      
      toast.success('Inscription réussie !');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Connexion (clients uniquement)
  const login = async (credentials) => {
    try {
      const res = await api.post('/api/auth/connexion', credentials);
      const { token: newToken, user: newUser } = res.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['x-auth-token'] = newToken;
      
      toast.success('Connexion réussie !');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la connexion';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Connexion admin
  const loginAdmin = async (credentials) => {
    try {
      const res = await api.post('/api/auth/connexion-admin', credentials);
      const { token: newToken, user: newUser } = res.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['x-auth-token'] = newToken;
      
      toast.success('Connexion administrateur réussie !');
      return { success: true };
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
      const res = await api.put('/api/users/profile', profileData);
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
      await api.put('/api/users/password', passwordData);
      toast.success('Mot de passe mis à jour avec succès !');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors du changement de mot de passe';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Méthode pour définir le token (utilisée par OAuth)
  const setAuthToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['x-auth-token'] = newToken;
    loadUser(); // Recharger les informations utilisateur
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
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
