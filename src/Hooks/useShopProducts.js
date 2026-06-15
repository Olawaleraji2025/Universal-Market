import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

const fetchProducts = async () => {
  // 1) Fetch all products
  const { data: products, error } = await supabase
    .from('ProductInformation')
    .select('*');

  if (error) throw error;

  // 2) Create Public URL for each product image
  // NOTE: getPublicUrl is synchronous; do not await.
  const productsWithImages = (products ?? []).map((product) => {
    const { data } = supabase.storage
      .from('Items images')
      .getPublicUrl(product.ImageName);

    return {
      ...product,
      imageUrl: data.publicUrl,
    };
  });

  return productsWithImages;
};

export default function useShopProducts(options = {}) {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    // When switching pages, react-query will keep cached data.
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  // Ensure caller always gets stable defaults.
  const memoized = useMemo(() => query, [query]);

  return memoized;
}

