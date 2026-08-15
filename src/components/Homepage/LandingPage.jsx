import { Hero } from "./Hero";
import { Cards } from "./Cards";
import { ProductCard } from "./ProductCard";
import  CategoryCard  from "./CategoryCard";
import { HowToOrder } from "./HowToOrder";
import { FaqSection } from "./FaqSection";
import { CustomOrderCTA } from "./CustomOrderCTA";
import AnimatedSection from "../ui/AnimatedSection";



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

