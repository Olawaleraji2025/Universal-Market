import { Hero } from "../Layout/Homepage/Hero";
import { Cards } from "../Layout/Homepage/Cards";
import { ProductCard } from "../Layout/Homepage/ProductCard";
import  CategoryCard  from "../Layout/Homepage/CategoryCard";
import { HowToOrder } from "../Layout/Homepage/HowToOrder";
import { FaqSection } from "../Layout/Homepage/FaqSection";
import { CustomOrderCTA } from "../Layout/Homepage/CustomOrderCTA";
import AnimatedSection from "../components/ui/AnimatedSection";



export const HomePage = () => {
  return (
    <>
      <AnimatedSection>
        <Hero />
      </AnimatedSection>

      <AnimatedSection>
        <CategoryCard />
      </AnimatedSection>

      <AnimatedSection>
        <ProductCa />
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
  );
};

