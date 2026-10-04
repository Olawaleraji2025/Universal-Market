import { House, ShoppingBag, Heart, ClipboardList, Info, Phone, PieChart, Package, Users } from 'lucide-react';

export const menus = {
  guest: [
    { label: 'Home', icon: House, to: '/', active: true },
    { label: 'Shop', icon: ShoppingBag, to: '/shop' },
    { label: 'Wishlist', icon: Heart, to: '/wishlist' },
    // { label: 'About Us', icon: Info, to: '/about' },
    // { label: 'Contact Us', icon: Phone, to: '/contact' },
  ],
  user: [
    { label: 'Home', icon: House, to: '/', active: true },
    { label: 'Shop', icon: ShoppingBag, to: '/shop' },
    { label: 'Wishlist', icon: Heart, to: '/wishlist' },
    { label: 'My Requests', icon: ClipboardList, to: '/my-requests' },
    // { label: 'About Us', icon: Info, to: '/about' },
    // { label: 'Contact Us', icon: Phone, to: '/contact' },
  ],
  admin: [
    { label: 'Home', icon: House, to: '/' },
    { label: 'Shop', icon: ShoppingBag, to: '/shop' },
    { label: 'Wishlist', icon: Heart, to: '/wishlist' },
    { label: 'My Requests', icon: ClipboardList, to: '/my-requests' },
    { label: 'Admin Dashboard', icon: PieChart, to: '/admin', highlight: true },
  ],
};
