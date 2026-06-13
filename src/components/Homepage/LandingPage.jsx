import { Hero } from "./Hero";
import { Cards } from "./Cards";
import { ProductCard } from "./ProductCard";
import { CategoryCard } from "./CategoryCard";
import { HowToOrder } from "./HowToOrder";
import { FaqSection } from "./FaqSection";
import { CustomOrderCTA } from "./CustomOrderCTA";



export const HomePage = () => {
  return (
    <>
      <Hero />
      <CategoryCard />
      <ProductCard />
      <Cards />
      <HowToOrder />
      <FaqSection />
      <CustomOrderCTA />
    </>
  );
};

