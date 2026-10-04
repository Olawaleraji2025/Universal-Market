import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AccessDenied Page
 * Displayed when a authenticated customer or non-admin attempts to access /admin routes.
 * Friendly, calm, and trustworthy.
 */
export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#01241a] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-[440px] bg-white border border-[#e2e8f0] rounded-[14px] p-6 sm:p-8 text-center shadow-xs">
        {/* Shield / Lock Icon */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-[#064e3b] flex items-center justify-center mx-auto mb-5">
          <Shield className="w-7 h-7" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#01241a] tracking-tight">
          You do not have access to this area.
        </h1>

        {/* Friendly helper text */}
        <p className="mt-2.5 text-sm sm:text-base text-[#475569] leading-relaxed">
          This portal is reserved for Universal Market shop administrators and staff.
        </p>

        {/* Primary Action Button */}
        <div className="mt-7">
          <Link
            to="/"
            className="w-full min-h-[48px] sm:min-h-[44px] px-6 py-3 rounded-[10px] bg-[#047857] hover:bg-[#064e3b] active:bg-[#064e3b] text-white text-sm sm:text-base font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2"
          >
            <span>Back to site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
