import { useState } from "react";
import { ShopHero } from "../Layout/Shop/shopHero";
import ShopProductList from "../Layout/Shop/ShopProductList";
import AnimatedSection from "../components/ui/AnimatedSection";

export default function ShopPage() {
  // const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
    <AnimatedSection>
      <ShopHero/>
    </AnimatedSection>

    <AnimatedSection>
      <ShopProductList />
    </AnimatedSection>
    </>
  );
}


