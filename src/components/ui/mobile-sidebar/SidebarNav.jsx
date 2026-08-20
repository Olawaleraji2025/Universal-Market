import React from 'react';
import { House, ShoppingBag, Heart, ClipboardList, Info, Phone, PieChart, Package, Users } from 'lucide-react';

const menus = {
  guest: [
    { label: 'Home', icon: House, to: '/', active: true },
    { label: 'Shop', icon: ShoppingBag, to: '/shop' },
    { label: 'Wishlist', icon: Heart, to: '/wishlist' },
    { label: 'About Us', icon: Info, to: '/about' },
    { label: 'Contact Us', icon: Phone, to: '/contact' },
  ],
  user: [
    { label: 'Home', icon: House, to: '/', active: true },
    { label: 'Shop', icon: ShoppingBag, to: '/shop' },
    { label: 'Wishlist', icon: Heart, to: '/wishlist' },
    { label: 'My Requests', icon: ClipboardList, to: '/my-requests' },
    { label: 'About Us', icon: Info, to: '/about' },
    { label: 'Contact Us', icon: Phone, to: '/contact' },
  ],
  admin: [
    { label: 'Dashboard', icon: PieChart, to: '/admin' },
    { label: 'Products', icon: Package, to: '/admin/products' },
    { label: 'Requests', icon: ClipboardList, to: '/admin/requests' },
    { label: 'Users', icon: Users, to: '/admin/users' },
  ],
};



export default function SidebarNav({ menus, role='user', onNavigate }) {
  const items = menus[role] || [];
  return (
    <nav className="flex-1">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.label}>
            <button
              onClick={() => onNavigate(item.to)}
              className={`w-full text-left flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${item.active ? 'text-emerald-600 font-semibold' : 'text-gray-700'}`}
            >
              <item.icon className="w-5 h-5 text-gray-600" />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
