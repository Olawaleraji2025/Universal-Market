import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, MessageCircle, Phone } from 'lucide-react';

import logo from '../../assets/logos/UM-logo2.png';
import { WHATSAPP_NUMBER, PRE_FILLED_MESSAGE, buildWhatsAppUrl } from '../../lib/whatsappConfig';

const shopCategories = [
  { label: 'All Products', href: '/shop' },
  { label: 'Phones', href: '/shop?category=Phones' },
  { label: 'Laptops', href: '/shop?category=Laptops' },
  { label: 'Home Appliances', href: '/shop?category=Home Appliances' },
  { label: 'Gadgets', href: '/shop?category=Gadgets' },
  { label: 'Audio & Studio Equipment', href: '/shop?category=Audio & Studio Equipment' },
  { label: 'Real Estate', href: '/shop?category=Real Estate' },
  { label: 'Cars & Motorcycles', href: '/shop?category=Cars & Motorcycles' },
  { label: 'Others', href: '/shop?category=Others' },
];

const infoLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
];

const whatsappUrl = buildWhatsAppUrl(WHATSAPP_NUMBER, PRE_FILLED_MESSAGE) ?? 'https://wa.me/2347033190225';

export const Footer = () => {
  const navigate = useNavigate();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#011c15] text-emerald-100/80">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mb-6 inline-flex items-center rounded-full ring-offset-2 ring-offset-[#011c15] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              aria-label="Go to homepage"
            >
              <img src={logo} alt="Universal Market Logo" className="h-14 w-auto" />
            </button>

            <p className="max-w-md text-sm leading-relaxed text-emerald-50/70">
              Ibadan&apos;s trusted marketplace for quality second-hand tech, appliances, and everyday essentials.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-900/30 px-3 py-2 text-sm font-medium text-emerald-50 transition hover:border-emerald-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>

              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-white/5 px-3 py-2 text-sm font-medium text-emerald-50 transition hover:border-emerald-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <Phone className="h-4 w-4" />
                Call us
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white">Shop</h4>
            <ul className="space-y-3 text-sm text-emerald-50/75">
              {shopCategories.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#011c15] rounded"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white">Company</h4>
            <ul className="space-y-3 text-sm text-emerald-50/75">
              {infoLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#011c15] rounded"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white">Support</h4>
            <ul className="space-y-3 text-sm text-emerald-50/75">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#011c15] rounded"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp support
                </a>
              </li>
              <li>
                <a
                  href={`tel:${WHATSAPP_NUMBER}`}
                  className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#011c15] rounded"
                >
                  <Phone className="h-4 w-4" />
                  {WHATSAPP_NUMBER}
                </a>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#011c15] rounded"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Browse all products
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-emerald-900/80 pt-6 text-xs text-emerald-50/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Universal Market.</p>
          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex items-center self-start rounded-full border border-emerald-500/40 bg-white/5 px-3 py-2 font-medium text-emerald-50 transition hover:border-emerald-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#011c15]"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

