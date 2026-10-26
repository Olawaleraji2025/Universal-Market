import React from 'react';
import { Store, ShieldCheck } from 'lucide-react';

export const SellerBuyerCards = () => {
  return (
    <section className="py-6 sm:py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {/* Card A: For Sellers */}
        <div className="flex flex-col rounded-2xl border border-emerald-100/90 bg-[#ECFDF5]/80 p-6 sm:p-8 transition-shadow duration-200 hover:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#064E3B]">
              <Store className="h-6 w-6 text-[#064E3B]" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold tracking-wider text-[#064E3B] uppercase sm:text-lg">
              For Sellers
            </h3>
          </div>

          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-[#52717A] sm:text-base">
            <li className="flex items-start gap-3">
              <span 
                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#047857]" 
                aria-hidden="true"
              />
              <span className="flex-1">
                A 10% commission applies to every successful sale.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span 
                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#047857]" 
                aria-hidden="true"
              />
              <span className="flex-1">
                All items submitted must be in good working condition and suitable for resale.
              </span>
            </li>
          </ul>
        </div>

        {/* Card B: For Buyers */}
        <div className="flex flex-col rounded-2xl border border-emerald-100/90 bg-[#ECFDF5]/80 p-6 sm:p-8 transition-shadow duration-200 hover:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#064E3B]">
              <ShieldCheck className="h-6 w-6 text-[#064E3B]" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold tracking-wider text-[#064E3B] uppercase sm:text-lg">
              For Buyers
            </h3>
          </div>

          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-[#52717A] sm:text-base">
            <li className="flex items-start gap-3">
              <span 
                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#047857]" 
                aria-hidden="true"
              />
              <span className="flex-1">
                Every item is inspected and tested, where applicable, before purchase.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span 
                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#047857]" 
                aria-hidden="true"
              />
              <span className="flex-1">
                Once an item has been inspected, confirmed to be in good working condition, and accepted by the buyer, the sale is final, with no returns or refunds, except where required by applicable law.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SellerBuyerCards;
