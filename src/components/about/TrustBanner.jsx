import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const TrustBanner = () => {
  return (
    <section className="pt-2 pb-14 sm:pb-20">
      <div className="rounded-2xl border border-emerald-200/80 bg-[#ECFDF5] p-6 sm:p-8 lg:p-10 transition-shadow duration-200 hover:shadow-sm">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* Shield-check icon inside a dark green circular background */}
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#064E3B] text-white shadow-sm">
            <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-100" aria-hidden="true" />
          </div>

          {/* Heading and Description */}
          <div className="flex-1">
            <h3 className="text-base font-bold tracking-wider text-[#064E3B] uppercase sm:text-lg lg:text-xl">
              Your Trust Matters to Us.
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#52717A] sm:text-base">
              We are committed to providing a reliable marketplace where sellers can find buyers and buyers can shop with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBanner;
