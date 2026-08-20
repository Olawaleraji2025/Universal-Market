
import { Smartphone, Laptop, Tv, ChevronLeft, ChevronRight, Refrigerator, Gamepad2  } from "lucide-react";
import { GiWashingMachine } from "react-icons/gi";
import { CiCircleMore } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const theIcons = [{ name: "Phones", icon: Smartphone },
  { name: "Laptops", icon: Laptop },
  { name: "TVs", icon: Tv },
 { name: "Refrigerators", icon: Refrigerator },
  { name: "Gaming Consoles", icon: Gamepad2 },
  { name: "Appliances", icon: GiWashingMachine },
  { name: "Others", icon: CiCircleMore },
];

export default function CategoryCard() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  function onCategoryClick(category) {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  }

  function scrollCategories(direction) {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.querySelector('.category-card')?.offsetWidth ?? 160;
    container.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: 'smooth',
    });
  }

  return (
    <section className="mx-3 md:mx-11">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-bold md:text-2xl">Popular Categories</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollCategories(-1)}
            aria-label="Scroll categories left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollCategories(1)}
            aria-label="Scroll categories right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {theIcons.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="text-center category-card min-w-35 flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm transition duration-200 hover:scale-105 hover:border-emerald-400 hover:text-emerald-600 cursor-pointer sm:min-w-40"
            onClick={() => onCategoryClick(item.name)}
            tabIndex={0}
            role="button"
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onCategoryClick(item.name);
              }
            }}
          >
            <item.icon className="h-6 w-6 cursor-pointer" />
            <p className="text-xs font-medium uppercase tracking-wider">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}



