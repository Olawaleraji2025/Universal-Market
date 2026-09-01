import React from 'react';
import {
  ChevronRight,
  Compass,
  FileText,
  ShoppingBag,
  Sparkles,
  Plus,
} from 'lucide-react';
import Button from '../ui/button';

export default function RequestEmptyState() {
  const tabs = ['All', 'Pending', 'Approved', 'Completed'];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-12">
        <main className="mx-auto max-w-xl">
          <section className="rounded-[28px] border border-dashed border-emerald-200 bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <ShoppingBag className="h-9 w-9" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#01241a]">No requests yet</h2>
            <p className="mt-3 text-sm text-gray-500 md:text-base">
              You haven’t made any requests yet. Create a request or browse products to get started.
            </p>

            <Button type="button" className="mt-6 bg-[#064e3b] text-white hover:bg-emerald-900">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Make a Request
            </Button>

            <Button type="button" className="mt-4 bg-white text-emerald-700 border border-emerald-100 hover:bg-emerald-50">
              <Compass className="mr-2 h-4 w-4" />
              Browse products
            </Button>
          </section>

          
        </main>
      </div>

    </div>
  );
}
