import { Search } from "lucide-react";
import { Input } from "../ui/input";

export const ShopHero = () =>  (
    <section className="relative bg-[#064e3b] text-white py-20 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Discover Your Next Favorite Gadget</h1>
        <p className="text-lg mb-6">Explore our curated collection of top-quality electronics, handpicked for you.</p>

        <div className="relative inline-flex w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#064e3b]" size={18} />
          <Input
            type="search"
            placeholder="Search products..."
            className="bg-white text-[#064e3b] pl-10 pr-3 py-3 rounded-md font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>
    </section>
  );





