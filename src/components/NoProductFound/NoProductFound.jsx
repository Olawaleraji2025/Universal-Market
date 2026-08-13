import React from 'react';
import Button from '../ui/button';
import { Search, Plus } from 'lucide-react';

export default function NoProductFound({ searchQuery = '', category = '', onRequestCustomItem, onBrowseCategories }) {
  const isSearch = Boolean(searchQuery && searchQuery.trim());

  return (
    <section className="px-6 py-12 flex items-center justify-center m-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 flex flex-col items-center text-center ">
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700 mb-4">
          <Search className="w-10 h-10" aria-hidden />
        </div>

        <h2 className="text-2xl font-semibold text-[#01241a]">No products found</h2>

        <p className="text-gray-600 mt-3 max-w-xl">
          {isSearch
            ? `We couldn't find any products matching "${searchQuery}".`
            : category && category !== 'All'
            ? `We couldn't find any products in this category.`
            : `We couldn't find any products.`}
        </p>

        <p className="text-gray-500 mt-2 max-w-lg">Try searching with different keywords or request this item and we'll help you find it.</p>

        <div className="mt-6 w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={() => onRequestCustomItem && onRequestCustomItem()}
            className="bg-[#064e3b] text-white px-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900"
          >
            <Plus className="w-4 h-4" aria-hidden />
            Request Custom Item
          </Button>

          <button
            type="button"
            onClick={() => onBrowseCategories && onBrowseCategories()}
            className="text-[#064e3b] text-sm font-medium mt-1 sm:mt-0"
            aria-label="Browse all categories"
          >
            Browse all categories →
          </button>
        </div>
      </div>
    </section>
  );
}
