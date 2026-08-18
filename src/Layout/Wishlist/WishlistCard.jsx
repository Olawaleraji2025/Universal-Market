import { Check, Trash2 } from 'lucide-react';
import { TbCurrencyNaira } from 'react-icons/tb';

export default function WishlistCard({ product, selected, onToggleSelect, onRemove, onViewDetails }) {
  const condition = product.ProductStatus === 'In Stock' ? 'Excellent' : product.ProductStatus || 'Good';

  return (
    <article
      className={`group flex w-full items-center gap-4 rounded-2xl border bg-white p-3 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 ${
        selected ? 'border-emerald-200 bg-emerald-50/50 ring-1 ring-emerald-100' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-center pl-1">
        <button
          type="button"
          aria-label={`Select ${product.ProductName}`}
          onClick={() => onToggleSelect(product.id)}
          className={`flex h-6 w-6 min-w-[24px] items-center justify-center rounded-md border transition-all ${
            selected
              ? 'border-emerald-700 bg-emerald-700 text-white'
              : 'border-gray-300 bg-white text-transparent hover:border-emerald-400'
          }`}
        >
          {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </button>
      </div>

      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 sm:h-20 sm:w-20">
        <img
          src={product.imageUrl}
          alt={product.ProductName}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onViewDetails(product)}
          className="text-left text-sm font-semibold text-[#01241a] transition hover:text-emerald-700 sm:text-base"
        >
          {product.ProductName}
        </button>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="flex items-center font-bold text-[#01241a]">
            <TbCurrencyNaira className="text-base" />
            {Number(product.ProductPrice ?? 0).toLocaleString()}
          </span>
          <span className="text-gray-300">•</span>
          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
            {condition}
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label={`Remove ${product.ProductName} from wishlist`}
        onClick={() => onRemove(product)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </article>
  );
}
