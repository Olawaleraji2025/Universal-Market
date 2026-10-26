import React from 'react';
import heroImage from '../../assets/images/Hero-image.webp';

export const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-[#ECFDF5] border-b border-emerald-100/70">
      {/* Soft decorative background circles */}
      <div 
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute top-1/2 -right-24 h-80 w-80 -translate-y-1/2 rounded-full bg-teal-200/30 blur-3xl"
        aria-hidden="true" 
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column: Badge, Heading, Supporting text, Description */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1 text-xs font-bold tracking-widest text-[#064E3B] uppercase shadow-xs">
              ABOUT US
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#064E3B] sm:text-4xl lg:text-5xl">
              Universal Market
            </h1>

            <p className="mt-3 text-lg font-semibold text-[#047857] sm:text-xl lg:text-2xl">
              Quality Pre-Owned Gadgets &amp; Appliances You Can Trust.
            </p>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#52717A] sm:text-lg">
              We connect buyers and sellers of quality pre-owned gadgets and appliances, making it easy, safe and reliable for everyone.
            </p>
          </div>

          {/* Right Column: Product Imagery */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none">
              <div 
                className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-100/60 to-transparent blur-xl"
                aria-hidden="true"
              />
              <img
                src={heroImage}
                alt="Universal Market featured pre-owned gadgets and appliances including smartphones, laptops, and headphones"
                className="relative mx-auto max-h-[300px] sm:max-h-[380px] lg:max-h-[440px] w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-[1.01]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
