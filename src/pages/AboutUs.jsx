import React, { useEffect } from 'react';
import AboutHero from '../components/about/AboutHero';
import CommitmentSection from '../components/about/CommitmentSection';
import SellerBuyerCards from '../components/about/SellerBuyerCards';
import TrustBanner from '../components/about/TrustBanner';

export const AboutUs = () => {
  useEffect(() => {
    document.title = 'About Us | Universal Market';
  }, []);

  return (
    <main className="w-full bg-white text-gray-900">
      {/* 1. Hero Section */}
      <AboutHero />

      {/* 2. Content Container: Commitment, Policy Cards, Trust Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CommitmentSection />
        <SellerBuyerCards />
        <TrustBanner />
      </div>
    </main>
  );
};

export default AboutUs;
