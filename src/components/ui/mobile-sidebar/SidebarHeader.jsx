import React from 'react';
import { X } from 'lucide-react';
// import logo from "../../assets/logos/UM-logo.png";

export default function SidebarHeader({ onClose, logo, title = 'Universal Market', subtitle = 'Quality you can trust.' }) {
  return (
    <div className="flex items-start justify-between px-4 pt-5 border-b">
      <div>
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-18 h-auto" />
          <div>
            <div className="font-semibold">{title}</div>
            <div className="text-xs text-gray-500">{subtitle}</div>
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
