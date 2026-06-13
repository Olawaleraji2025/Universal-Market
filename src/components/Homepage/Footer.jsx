export const Footer = () => (
  <footer className="bg-[#011c15] text-emerald-100/80 py-20 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl text-white">Universal Market</span>
        </div>
        <p className="text-sm leading-relaxed opacity-60">
          Ibadan's #1 trusted marketplace for pre-owned electronics. Fast, reliable, and verified.
        </p>
      </div>

      <div>
        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Shop</h4>
        <ul className="space-y-4 text-sm">
          <li>
            <a href="#" className="hover:text-white transition">
              Phones & Tablets
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition">
              Laptops
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition">
              Home Appliances
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Quick Links</h4>
        <ul className="space-y-4 text-sm">
          <li>
            <a href="#" className="hover:text-white transition">
              About Us
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition">
              WhatsApp Support
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition">
              Shipping Policy
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Legal</h4>
        <ul className="space-y-4 text-sm">
          <li>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-emerald-900 flex justify-between text-xs opacity-60">
      <p>© 2026 Universal Market, Ibadan's Premium Recommerce.</p>
    </div>
  </footer>
);

