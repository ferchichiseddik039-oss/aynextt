import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { SocketProvider } from './contexts/SocketContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import GenderPage from './pages/GenderPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Stores from './pages/Stores';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminSetup from './pages/AdminSetup';
import Orders from './pages/Orders';
import OrdersDebug from './pages/OrdersDebug';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import TestHoodie from './components/TestHoodie';
import SimpleHoodieTest from './components/SimpleHoodieTest';
import MaintenanceMode from './components/MaintenanceMode';
import OAuthSuccess from './pages/OAuthSuccess';

// Composant interne qui utilise les hooks
const AppContent = () => {
  // Activer les raccourcis clavier
  useKeyboardShortcuts();
  
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isLoading, setIsLoading] = useState(true);

  // Gérer le chargement initial pour GitHub Pages
  useEffect(() => {
    const handleInitialLoad = () => {
      // Vérifier si on est sur GitHub Pages et si le contenu est chargé
      if (window.location.hostname.includes('github.io')) {
        const checkContent = () => {
          const rootElement = document.getElementById('root');
          if (rootElement && rootElement.children.length > 0) {
            setIsLoading(false);
          } else {
            // Si pas de contenu après 2 secondes, forcer le rechargement
            setTimeout(() => {
              if (document.getElementById('root').children.length === 0) {
                window.location.reload();
              }
            }, 2000);
          }
        };
        
        // Vérifier immédiatement et après un délai
        checkContent();
        setTimeout(checkContent, 1000);
      } else {
        setIsLoading(false);
      }
    };

    handleInitialLoad();
  }, []);

  // Afficher un loader pendant le chargement initial
  if (isLoading && window.location.hostname.includes('github.io')) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }}></div>
          <h2>🚀 AYNEXT</h2>
          <p>Chargement de votre boutique...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="App min-h-screen flex flex-col">
      <MaintenanceMode />
      {!isAdminRoute && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/genre/:genre" element={<GenderPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/test-hoodie" element={<TestHoodie />} />
          <Route path="/simple-test" element={<SimpleHoodieTest />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          
          {/* Routes protégées */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/orders-debug" element={
            <ProtectedRoute>
              <OrdersDebug />
            </ProtectedRoute>
          } />
          
          {/* Routes admin */}
          <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <SocketProvider>
            <OrdersProvider>
              <AppContent />
            </OrdersProvider>
          </SocketProvider>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
