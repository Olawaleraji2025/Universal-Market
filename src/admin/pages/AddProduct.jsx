import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { useSaveProduct } from '../hooks/useSaveProduct';
import { toast } from 'sonner';

export default function AddProduct() {
  const navigate = useNavigate();
  const saveProductMutation = useSaveProduct();

  const handleSave = async (formData) => {
    try {
      await saveProductMutation.mutateAsync(formData);
      toast.success('Product added', {
        description: 'New product is now live in the catalogue.',
      });
      navigate('/admin/products');
    } catch (err) {
      toast.error('Failed to add product', {
        description: err.message || 'Please check your inputs and try again.',
      });
    }
  };

  return (
    <ProductForm
      isEdit={false}
      onSave={handleSave}
      isSaving={saveProductMutation.isPending}
    />
  );
}
