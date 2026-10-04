import React from 'react';
import { House, ShoppingBag, Heart, ClipboardList, Info, Phone, PieChart, Package, Users } from 'lucide-react';

import { menus as defaultMenus } from './menus';

export default function SidebarNav({ menus = defaultMenus, role = 'user', onNavigate }) {
  const activeMenus = menus || defaultMenus;
  const items = activeMenus[role] || [];
  return (
    <nav className="w-full">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.label}>
            <button
              onClick={() => onNavigate(item.to)}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                item.highlight
                  ? 'bg-emerald-50 text-[#064e3b] font-bold border border-emerald-200/80 hover:bg-emerald-100/70'
                  : item.active
                  ? 'text-emerald-600 font-semibold hover:bg-gray-100'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.highlight ? 'text-[#064e3b]' : 'text-gray-600'}`} />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
