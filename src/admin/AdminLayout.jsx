import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { clearAuth, selectCurrentUser, selectUserProfile } from '../features/authSlice';
import { useAdminStats } from './hooks/useAdminStats';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MobileDrawer from './components/MobileDrawer';

/**
 * AdminLayout
 * Renders the Admin Shell:
 * - Laptop (1024px+): Fixed 240px dark green sidebar (#064e3b)
 * - Mobile and Tablet (<1024px): 64px top bar with menu button, page title, admin initials, and 300px slide-in drawer
 */
export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const currentUser = useSelector(selectCurrentUser);
  const profile = useSelector(selectUserProfile);

  // Use dashboard stats query so pending counts never disagree between sidebar and dashboard
  const { data: stats } = useAdminStats();
  const pendingCount = stats?.pending ?? 0;

  // Determine admin display name and initials
  const adminName =
    profile?.full_name ||
    currentUser?.user_metadata?.full_name ||
    currentUser?.email?.split('@')[0] ||
    'Admin';

  const adminInitials = React.useMemo(() => {
    if (!adminName) return 'AD';
    const parts = adminName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return adminName.slice(0, 2).toUpperCase();
  }, [adminName]);

  // Determine dynamic mobile header title based on current route
  const pageTitle = React.useMemo(() => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/products/new')) return 'Add Product';
    if (path.includes('/edit')) return 'Edit Product';
    if (path.startsWith('/admin/products')) return 'Products';
    if (path.match(/\/admin\/requests\/[^/]+/)) return 'Request Detail';
    if (path.startsWith('/admin/requests')) return 'Requests';
    if (path.startsWith('/admin/users')) return 'Users';
    return 'Admin';
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      queryClient.clear();
      dispatch(clearAuth());
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Admin logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#01241a] flex flex-col lg:flex-row antialiased">
      {/* Laptop Fixed Sidebar (1024px+) */}
      <Sidebar
        pendingCount={pendingCount}
        adminName={adminName}
        onLogout={handleLogout}
      />

      {/* Mobile / Tablet Top Bar (<1024px) */}
      <TopBar
        title={pageTitle}
        adminInitials={adminInitials}
        onOpenMenu={() => setDrawerOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Mobile Slide-in Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pendingCount={pendingCount}
        adminName={adminName}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
