import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Image as ImageIcon, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import AvailabilityToggle from './AvailabilityToggle';
import { PRODUCT_STATUS } from '../lib/productConstants';

export default function ProductTable({
  products = [],
  onToggleStatus,
  onDeleteProduct,
  isTogglingId,
  page = 1,
  totalCount = 0,
  pageSize = 20,
  totalPages = 1,
  onPageChange,
}) {
  const fromIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const toIndex = Math.min(page * pageSize, totalCount);

  return (
    <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Products Catalogue Table">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-xs font-bold text-[#475569] uppercase tracking-wider">
              <th scope="col" className="py-3.5 pl-6 pr-3 w-16">
                Image
              </th>
              <th scope="col" className="py-3.5 px-4">
                Product Name
              </th>
              <th scope="col" className="py-3.5 px-4 w-36">
                Category
              </th>
              <th scope="col" className="py-3.5 px-4 w-36">
                Price
              </th>
              <th scope="col" className="py-3.5 px-4 w-52">
                Availability
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-6 text-right w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] text-sm">
            {products.map((product) => {
              const isSold = Boolean(product?.isSold);
              const formattedPrice = `₦${Number(product.price).toLocaleString('en-NG')}`;
              const isUpdatingThis = isTogglingId === product.id;

              return (
                <tr
                  key={product.id}
                  className={`transition-colors duration-150 hover:bg-[#f8fafc]/80 ${
                    isSold ? 'bg-[#f8fafc]/40 text-[#475569] opacity-80' : 'text-[#01241a]'
                  }`}
                >
                  {/* Thumbnail (48px rounded) */}
                  <td className="py-3.5 pl-6 pr-3 whitespace-nowrap">
                    <div className="w-12 h-12 rounded-[10px] bg-[#f1f5f9] border border-[#e2e8f0] overflow-hidden flex items-center justify-center shrink-0">
                      {product.coverImageUrl ? (
                        <img
                          src={product.coverImageUrl}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-[#94a3b8]" />
                      )}
                    </div>
                  </td>

                  {/* Name + tags */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="font-bold text-[#01241a] hover:text-[#047857] transition-colors line-clamp-1"
                        >
                          {product.productName}
                        </Link>
                        {product.is_hidden && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e2e8f0] text-[#475569] border border-[#cbd5e1]"
                            title="Hidden products don't appear in the shop"
                          >
                            <EyeOff className="w-3 h-3" />
                            Hidden
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#475569] mt-0.5">
                        Condition: <span className="font-medium text-[#01241a]">{product.condition}</span>
                        {product.location ? ` • ${product.location}` : ''}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#475569]">
                    <span className="inline-block px-2.5 py-1 rounded-[8px] bg-[#f1f5f9] text-xs font-semibold text-[#01241a]">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#01241a]">
                    {formattedPrice}
                  </td>

                  {/* Availability Toggle */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <AvailabilityToggle
                      productName={product.productName}
                      status={product.availability || (isSold ? 'SOLD' : null)}
                      disabled={isUpdatingThis}
                      onChange={(newStatus) =>
                        onToggleStatus(product.id, newStatus, product.productName)
                      }
                    />
                  </td>

                  {/* Actions (Edit, Delete) */}
                  <td className="py-3.5 pl-4 pr-6 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        aria-label={`Edit ${product.productName}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] text-xs font-semibold text-[#047857] hover:bg-[#ecfdf5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#047857]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDeleteProduct(product)}
                        aria-label={`Delete ${product.productName}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] text-xs font-semibold text-[#b91c1c] hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#b91c1c]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
        <p className="text-xs text-[#475569]">
          Showing <span className="font-bold text-[#01241a]">{fromIndex}</span> to{' '}
          <span className="font-bold text-[#01241a]">{toIndex}</span> of{' '}
          <span className="font-bold text-[#01241a]">{totalCount}</span> products
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] border border-[#e2e8f0] bg-white text-xs font-semibold text-[#01241a] hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#047857]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-semibold px-2 text-[#475569]">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] border border-[#e2e8f0] bg-white text-xs font-semibold text-[#01241a] hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#047857]"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
