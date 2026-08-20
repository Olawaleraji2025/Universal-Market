
import { useEffect, useState } from "react";
import { LogIn, UserPlus } from 'lucide-react';
import Button from "../ui/button";
import MobileSidebar from './MobileSidebar';
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
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
            src="./src/assets/logos/UM-logo.png"
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
          <Button variant="default" size="sm">
            <LogIn className="mr-1 w-4 h-4" />
            Login
          </Button>
          <Button variant="secondary" size="sm">
            <UserPlus className="mr-1 w-4 h-4" />
            Sign up
          </Button>
        </div>

        <div className="md:hidden">
          <MobileSidebar />
        </div>
      </nav>
    </header>
  );
};