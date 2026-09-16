import './index.css'
import './App.css'

import { Navbar } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HomePage } from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import WishListPage from './pages/WishListPage';
import MyRequestsPage from './pages/MyRequestsPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import { Toaster } from './components/ui/sonner';
import NetworkConnectionModal from './components/ui/NetworkConnectionModal';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuthListener } from './Hooks/useAuthListener';
import { selectAuthLoading, selectCurrentUser, selectIsAuthenticated } from './features/authSlice';
import { canSyncWishlistToSupabase, selectWishlistIds, syncWishlistToSupabase } from './features/wishlistSlice';
import { saveReturnTarget } from './lib/authRedirect';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  
  return null;
}

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthLoading = useSelector(selectAuthLoading);

  if (isAuthLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    saveReturnTarget(location);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const App = () => {
  useAuthListener();
  const currentUser = useSelector(selectCurrentUser);
  const wishlistIds = useSelector(selectWishlistIds);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!currentUser?.id || !canSyncWishlistToSupabase(currentUser.id)) return;

    syncWishlistToSupabase(wishlistIds, currentUser).catch((err) => {
      console.error('Failed to persist wishlist for authenticated user:', err);
    });
  }, [currentUser, wishlistIds]);

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

  const { pathname } = useLocation();

  const hideShell = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/update-password';

  return (
    <div className="mx-auto max-w-[90rem]">
      {!hideShell && <Navbar />}
      <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900 ">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute><MyRequestsPage /></ProtectedRoute>} />
          <Route path="/requests/:id" element={<ProtectedRoute><RequestDetailsPage /></ProtectedRoute>} />
        </Routes>
      </div>
      {!hideShell && <Footer />}

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
