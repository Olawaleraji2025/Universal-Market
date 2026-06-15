import { useState } from "react";
import { ShopHero } from "./shopHero";
import ShopProductList from "./ShopProductList";

export default function ShopPage() {
  // const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <ShopHero/>
      <ShopProductList />
    </>
  );
}


