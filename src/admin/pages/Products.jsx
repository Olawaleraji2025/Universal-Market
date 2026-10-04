import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Plus,
  Package,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Inbox,
  FilterX,
  Play,
} from 'lucide-react';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useToggleAvailability } from '../hooks/useToggleAvailability';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import ProductFilters from '../components/ProductFilters';
import ProductTable from '../components/ProductTable';
import ProductCard from '../components/ProductCard';
import ProductDeleteDialog from '../components/ProductDeleteDialog';
import AdminProductDemo from '../components/AdminProductDemo';
import { PRODUCT_STATUS } from '../lib/productConstants';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from URL query params
  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Mobile load more pagination support
  const [mobileVisibleCount, setMobileVisibleCount] = useState(10);

  // Dialog & demo states
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Queries & Mutations
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminProducts({
    search,
    category,
    status,
    page,
    pageSize: 20,
  });

  const toggleAvailabilityMutation = useToggleAvailability();
  const deleteProductMutation = useDeleteProduct();

  // URL query synchronizers
  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === 'all' || (key === 'page' && value === 1)) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      // Reset page to 1 on filter changes
      if (key !== 'page') {
        next.delete('page');
      }
      return next;
    });
  };

  const handleSearchChange = (val) => updateParam('q', val);
  const handleCategoryChange = (val) => updateParam('category', val);
  const handleStatusChange = (val) => updateParam('status', val);
  const handlePageChange = (newPage) => updateParam('page', newPage);

  const handleResetFilters = () => {
    setSearchParams({});
  };

  // Toggle availability
  const handleToggleStatus = (id, newStatus, productName) => {
    toggleAvailabilityMutation.mutate({ id, newStatus, productName });
  };

  // Delete product
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductMutation.mutateAsync({
        id: productToDelete.id,
        productName: productToDelete.productName,
        imageNames: productToDelete.imageNames || [],
      });
      setProductToDelete(null);
    } catch {
      // Toast handled by mutation
    }
  };

  const handleMarkOutOfStockInstead = async () => {
    if (!productToDelete) return;
    toggleAvailabilityMutation.mutate({
      id: productToDelete.id,
      newStatus: PRODUCT_STATUS.OUT_OF_STOCK,
      productName: productToDelete.productName,
    });
    setProductToDelete(null);
  };

  const products = data?.products || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const hasFilterActive = Boolean(search || category !== 'all' || status !== 'all');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#01241a] tracking-tight">
              Products
            </h1>
            {totalCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e2e8f0] text-[#334155]">
                {totalCount}
              </span>
            )}
          </div>
          <p className="text-sm text-[#475569] mt-0.5">
            Manage catalogue items, stock availability, and specifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Interactive Prototype Launcher */}
          <button
            type="button"
            onClick={() => setShowDemoModal(true)}
            className="min-h-[44px] px-3.5 py-2.5 rounded-[10px] border border-[#047857]/40 bg-[#ecfdf5] hover:bg-emerald-100 text-[#064e3b] text-xs font-semibold inline-flex items-center justify-center gap-2 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857]"
            title="Launch interactive Section 4 Prototype & Section 5 States simulator"
          >
            <Play className="w-3.5 h-3.5 text-[#047857] fill-current" />
            <span>Interactive Prototype</span>
          </button>

          {/* Add product button (Full-width on mobile, auto on desktop) */}
          <Link
            to="/admin/products/new"
            className="flex-1 sm:flex-initial min-h-[44px] px-5 py-2.5 rounded-[10px] bg-[#047857] hover:bg-[#064e3b] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add product</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <ProductFilters
        search={search}
        category={category}
        status={status}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilters}
      />

      {/* Main Content Area */}
      {isLoading ? (
        /* LOADING SKELETON STATE */
        <div className="bg-white rounded-[14px] border border-[#e2e8f0] p-6 shadow-xs space-y-4">
          <div className="h-6 w-48 bg-slate-200 animate-pulse rounded-md" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 border-b border-[#e2e8f0] last:border-none animate-pulse"
              >
                <div className="w-12 h-12 bg-slate-200 rounded-[10px] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
                <div className="w-24 h-4 bg-slate-200 rounded" />
                <div className="w-20 h-6 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        /* ERROR STATE WITH RETRY */
        <div className="bg-white rounded-[14px] border border-rose-200 p-8 shadow-xs text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-[#b91c1c] flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#01241a]">Failed to load products</h2>
          <p className="text-sm text-[#475569] mt-1.5 mb-6">
            {error?.message || 'A network error occurred while connecting to the database.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#047857] hover:bg-[#064e3b] text-white text-sm font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      ) : products.length === 0 ? (
        hasFilterActive ? (
          /* NO MATCH WITH ACTIVE FILTERS */
          <div className="bg-white rounded-[14px] border border-[#e2e8f0] p-10 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-[#475569] flex items-center justify-center mx-auto mb-3">
              <FilterX className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#01241a]">No products match</h2>
            <p className="text-sm text-[#475569] mt-1 mb-5">
              Try adjusting your search query, choosing another category or clearing filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#e2e8f0] text-sm font-semibold text-[#01241a] hover:bg-slate-50 transition"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* NO PRODUCTS YET EMPTY STATE */
          <div className="bg-white rounded-[14px] border border-[#e2e8f0] p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#ecfdf5] text-[#047857] flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-[#01241a]">No products yet</h2>
            <p className="text-sm text-[#475569] mt-1.5 mb-6 max-w-sm mx-auto">
              Add your first product to start showcasing phones, appliances, and electronics to customers.
            </p>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#047857] hover:bg-[#064e3b] text-white text-sm font-semibold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add your first product</span>
            </Link>
          </div>
        )
      ) : (
        /* PRODUCTS LIST DISPLAY */
        <div>
          {/* LAPTOP / DESKTOP TABLE VIEW (1024px+) */}
          <div className="hidden lg:block">
            <ProductTable
              products={products}
              onToggleStatus={handleToggleStatus}
              onDeleteProduct={setProductToDelete}
              isTogglingId={
                toggleAvailabilityMutation.isPending
                  ? toggleAvailabilityMutation.variables?.id
                  : null
              }
              page={page}
              totalCount={totalCount}
              pageSize={20}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          {/* MOBILE CARDS VIEW (<1024px) */}
          <div className="lg:hidden space-y-3">
            {products.slice(0, mobileVisibleCount).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onToggleStatus={handleToggleStatus}
                onDeleteProduct={setProductToDelete}
                isToggling={
                  toggleAvailabilityMutation.isPending &&
                  toggleAvailabilityMutation.variables?.id === prod.id
                }
              />
            ))}

            {/* Mobile "Load more" button */}
            {mobileVisibleCount < products.length && (
              <div className="pt-2 pb-4">
                <button
                  type="button"
                  onClick={() => setMobileVisibleCount((prev) => prev + 10)}
                  className="w-full min-h-[48px] py-3 rounded-[10px] border border-[#e2e8f0] bg-white text-sm font-bold text-[#01241a] hover:bg-slate-50 transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857]"
                >
                  Load more products ({products.length - mobileVisibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ProductDeleteDialog
        isOpen={Boolean(productToDelete)}
        productName={productToDelete?.productName}
        isLoading={deleteProductMutation.isPending}
        onConfirmDelete={handleConfirmDelete}
        onMarkOutOfStock={handleMarkOutOfStockInstead}
        onCancel={() => setProductToDelete(null)}
      />

      {/* Interactive Prototype & Screen 5 States Showcase Modal */}
      <AdminProductDemo
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />
    </div>
  );
}
