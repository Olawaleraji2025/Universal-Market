import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, UserPlus, X, LogOut, User as UserIcon, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/button";
import MobileSidebar from "./MobileSidebar";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos/UM-logo.png";
import LoginForm from "../../Layout/ProductPage/LoginForm";
import { SignupForm } from "../../Layout/ProductPage/signup-form";
import { supabase } from "../../supabaseClient";
import { clearAuth } from "../../features/authSlice";
import { toast } from "sonner";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, profile } = useSelector((state) => state.auth);
  const role =
    profile?.role ||
    user?.user_metadata?.role ||
    (user ? "user" : "guest");
  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const closeAuthModal = () => {
    setAuthOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(clearAuth());
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Error signing out");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 transition-all duration-300">
        <nav
          className={`flex items-center justify-between px-6 py-4 h-16 border-b border-gray-200/80 transition-all duration-300 ${
            scrolled
              ? "bg-white/85 shadow-md backdrop-blur-md"
              : "bg-white/95"
          }`}
        >
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Universal Market Logo"
              className="w-25 h-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <a
              href="#"
              className="hover:text-emerald-600 transition"
              onClick={(e) => {
                e.preventDefault();
                navigate("/shop");
              }}
            >
              Shop
            </a>
            <a
              href="#"
              className="hover:text-emerald-600 transition"
              onClick={(e) => {
                e.preventDefault();
                navigate("/wishlist");
              }}
            >
              Wishlist
            </a>
            <a
              href="#"
              className="hover:text-emerald-600 transition"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Contact
            </a>
            <a
              href="#"
              className="hover:text-emerald-600 transition"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              About
            </a>
          </div>

          {/* Desktop Auth State / User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold text-xs overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {displayName}
                  </span>
                  {role === "admin" && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 cursor-pointer"
                >
                  <LogOut className="mr-1 w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => openAuthModal("login")}
                >
                  <LogIn className="mr-1 w-4 h-4" />
                  Login
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openAuthModal("signup")}
                >
                  <UserPlus className="mr-1 w-4 h-4" />
                  Sign up
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <MobileSidebar
              user={
                user
                  ? {
                      name: displayName,
                      email: user.email,
                      avatar: avatarUrl,
                      role,
                    }
                  : null
              }
              onOpenAuth={openAuthModal}
            />
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
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeAuthModal}
                className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 z-10"
                aria-label="Close auth modal"
              >
                <X className="h-5 w-5" />
              </button>

              {authMode === "login" ? (
                <LoginForm
                  showBackButton={false}
                  onSwitchToSignup={() => setAuthMode("signup")}
                  onSuccess={closeAuthModal}
                />
              ) : (
                <SignupForm
                  showBackButton={false}
                  onSwitchToLogin={() => setAuthMode("login")}
                  onSuccess={closeAuthModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};