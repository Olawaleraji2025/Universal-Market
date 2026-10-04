import React from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { buildAdminWhatsAppUrl } from '../lib/whatsappMessages';

export default function WhatsAppButton({
  phone,
  status = 'Pending',
  customerName = '',
  itemName = '',
  className = '',
}) {
  const hasPhone = Boolean(phone && String(phone).trim());
  const whatsappUrl = hasPhone
    ? buildAdminWhatsAppUrl(phone, status, customerName, itemName)
    : null;

  const handleClick = (e) => {
    if (!hasPhone || !whatsappUrl) {
      e.preventDefault();
      return;
    }

    // Opens WhatsApp in a new tab without altering database state
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={!hasPhone || !whatsappUrl}
        className={`w-full min-h-[48px] px-5 py-3 rounded-[10px] text-white font-semibold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 ${
          hasPhone && whatsappUrl
            ? 'bg-[#047857] hover:bg-[#036146] active:scale-[0.99] cursor-pointer'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
        }`}
        aria-label={hasPhone ? 'Chat on WhatsApp' : 'Chat on WhatsApp (Disabled: No phone number)'}
      >
        <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span>Chat on WhatsApp</span>
      </button>

      {!hasPhone && (
        <p className="mt-2 text-xs text-[#475569] flex items-center justify-center gap-1.5 text-center">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>No phone number given</span>
        </p>
      )}
    </div>
  );
}
