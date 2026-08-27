import { Hero } from "../Layout/Homepage/Hero";
import { Cards } from "../Layout/Homepage/Cards";
import { ProductCard } from "../Layout/Homepage/ProductCard";
import CategoryCard from "../Layout/Homepage/CategoryCard";
import { HowToOrder } from "../Layout/Homepage/HowToOrder";
import { FaqSection } from "../Layout/Homepage/FaqSection";
import { CustomOrderCTA } from "../Layout/Homepage/CustomOrderCTA";
import AnimatedSection from "../components/ui/AnimatedSection";
// import ErrorBoundary from "../components/ErrorBoundary";

export const HomePage = () => {
  return (
    // <ErrorBoundary>
      <>
        <AnimatedSection>
          <Hero />
        </AnimatedSection>

        <AnimatedSection>
          <CategoryCard />
        </AnimatedSection>

        <AnimatedSection>
          <ProductCard />
        </AnimatedSection>

        <AnimatedSection>
          <Cards />
        </AnimatedSection>

        <AnimatedSection>
          <HowToOrder />
        </AnimatedSection>

        <AnimatedSection>
          <FaqSection />
        </AnimatedSection>

        <AnimatedSection>
          <CustomOrderCTA />
        </AnimatedSection>
      </>
    // </ErrorBoundary>
  );
};

