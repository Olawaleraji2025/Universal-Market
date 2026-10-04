import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { useAdminProduct } from '../hooks/useAdminProduct';
import { useSaveProduct } from '../hooks/useSaveProduct';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading, error, refetch } = useAdminProduct(id);
  const saveProductMutation = useSaveProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleSave = async (formData) => {
    try {
      await saveProductMutation.mutateAsync(formData);
      toast.success('Product updated', {
        description: 'Changes have been saved successfully.',
      });
      navigate('/admin/products');
    } catch (err) {
      toast.error('Failed to update product', {
        description: err.message || 'Please check your inputs and try again.',
      });
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    try {
      await deleteProductMutation.mutateAsync({
        id: product.id,
        productName: product.productName,
        imageNames: product.imageNames || [],
      });
      navigate('/admin/products');
    } catch (err) {
      // toast is handled in mutation
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-[#047857] animate-spin mb-3" />
        <p className="text-sm font-medium text-[#475569]">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-[14px] border border-[#e2e8f0] text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-[#b91c1c] flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#01241a]">Product Not Found</h2>
        <p className="text-sm text-[#475569] mt-1.5 mb-6">
          {error?.message || 'The product you are trying to edit could not be found or has been removed.'}
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#e2e8f0] text-sm font-semibold text-[#01241a] hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-[10px] bg-[#047857] text-white text-sm font-semibold hover:bg-[#064e3b] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      initialData={product}
      isEdit={true}
      onSave={handleSave}
      onDelete={handleDelete}
      isSaving={saveProductMutation.isPending}
      isDeleting={deleteProductMutation.isPending}
    />
  );
}
