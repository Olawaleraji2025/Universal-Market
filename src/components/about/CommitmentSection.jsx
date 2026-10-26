import React from 'react';

export const CommitmentSection = () => {
  return (
    <section className="pt-12 pb-8 sm:pt-16 sm:pb-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-xl font-bold tracking-wider text-[#064E3B] uppercase sm:text-2xl lg:text-3xl">
          Our Commitment to Buyers and Sellers
        </h2>

        {/* Small green decorative accent line */}
        <div 
          className="mx-auto my-3 h-1 w-12 rounded-full bg-[#047857]" 
          aria-hidden="true"
        />

        <p className="mt-4 text-base leading-relaxed text-[#52717A] sm:text-lg">
          We take great care to ensure transparency and protect the best interests of both our sellers and buyers. Our goal is to make every transaction fair, transparent, and trustworthy.
        </p>
      </div>
    </section>
  );
};

export default CommitmentSection;
