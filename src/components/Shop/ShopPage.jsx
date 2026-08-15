import { useState } from "react";
import { ShopHero } from "./shopHero";
import ShopProductList from "./ShopProductList";
import AnimatedSection from "../ui/AnimatedSection";

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


