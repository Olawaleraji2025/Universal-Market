
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, UserPlus, X } from 'lucide-react';
import Button from "../ui/button";
import MobileSidebar from './MobileSidebar';
import { useNavigate } from 'react-router-dom'
import logo from "../../assets/logos/UM-logo.png";
import LoginForm from "../../Layout/ProductPage/LoginForm";
import { SignupForm } from "../../Layout/ProductPage/signup-form";

export const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const closeAuthModal = () => {
    setAuthOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 transition-all duration-300">
        <nav
          className={`flex items-center justify-between px-6 py-4 h-16 border-b border-gray-200/80 transition-all duration-300 ${
            scrolled
              ? 'bg-white/85 shadow-md backdrop-blur-md'
              : 'bg-white/95'
          }`}
        >
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Universal Market Logo"
              className="w-25 h-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <a href="#" className="hover:text-emerald-600 transition" onClick={() => navigate('/shop')}>
              Shop
            </a>
            <a href="#" className="hover:text-emerald-600 transition" onClick={() => navigate('/wishlist')}>
              Wishlist
            </a>
            <a href="#" className="hover:text-emerald-600 transition">Contact</a>
            <a href="#" className="hover:text-emerald-600 transition">About</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="default" size="sm" onClick={() => openAuthModal('login')}>
              <LogIn className="mr-1 w-4 h-4" />
              Login
            </Button>
            <Button variant="secondary" size="sm" onClick={() => openAuthModal('signup')}>
              <UserPlus className="mr-1 w-4 h-4" />
              Sign up
            </Button>
          </div>

          <div className="md:hidden">
            <MobileSidebar />
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {authOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={closeAuthModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#01241a]">
                  {authMode === 'login' ? 'Login' : 'Create account'}
                </h2>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close auth modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {authMode === 'login' ? <LoginForm /> : <SignupForm />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};