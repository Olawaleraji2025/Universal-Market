import './index.css'
import './App.css'

import { Navbar } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { Routes, Route, useLocation } from 'react-router-dom'
import { HomePage } from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import WishListPage from './pages/WishListPage';
import { Toaster } from './components/ui/sonner';
import NetworkConnectionModal from './components/ui/NetworkConnectionModal';
import { useEffect, useState } from 'react';
import { useAuthListener } from './Hooks/useAuthListener';

function ScrollToTop() {
  const { pathname } = useLocation();
  window.scrollTo(0, 0);
  return null;
}

const App = () => {
  useAuthListener();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const updateConnectionStatus = () => {
      const online = navigator.onLine;
      setIsOffline(!online);
    };

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOffline(false);
      return;
    }

    setIsRetrying(true);
    window.setTimeout(() => {
      setIsOffline(!navigator.onLine);
      setIsRetrying(false);
    }, 800);
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <Navbar />
      <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900 ">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </div>
      <Footer />

      <NetworkConnectionModal
        open={isOffline}
        onRetry={handleRetry}
        isRetrying={isRetrying}
      />

      <Toaster richColors />
    </div>
  );
};

export default App;
