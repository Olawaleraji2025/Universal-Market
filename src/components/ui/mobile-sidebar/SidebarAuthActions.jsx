import React from 'react';
import { User, UserPlus, LogOut, ExternalLink } from 'lucide-react';

export default function SidebarAuthActions({ role = 'user', onNavigate, onLogout }) {
  return (
    <div className="mt-4 border-t pt-4">
      {role === 'guest' && (
        <div className="space-y-2">
          <button
            onClick={() => onNavigate('/login')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 text-gray-700 justify-center"
          >
            <User className="w-4 h-4" />
            Log in
          </button>

          <button
            onClick={() => onNavigate('/signup')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white justify-center"
          >
            <UserPlus className="w-4 h-4" />
            Create account
          </button>
        </div>
      )}

      {role === 'user' && (
        <div className="space-y-2">
          <button
            onClick={() => onNavigate('/profile')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 justify-start"
          >
            <User className="w-4 h-4" />
            My Profile
          </button>

          <button
            onClick={() => onLogout && onLogout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-red-600 justify-start"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

      {role === 'admin' && (
        <div className="space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 justify-start"
          >
            <ExternalLink className="w-4 h-4" />
            View Store
          </button>

          <button
            onClick={() => onLogout && onLogout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-red-600 justify-start"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
