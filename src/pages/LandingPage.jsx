import { Hero } from "../layout/Homepage/Hero";
import { Cards } from "../layout/Homepage/Cards";
import { ProductCard } from "../layout/Homepage/ProductCard";
import  CategoryCard  from "../layout/Homepage/CategoryCard";
import { HowToOrder } from "../layout/Homepage/HowToOrder";
import { FaqSection } from "../layout/Homepage/FaqSection";
import { CustomOrderCTA } from "../layout/Homepage/CustomOrderCTA";
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
  );
};

