import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

const fetchProducts = async () => {
  // 1) Fetch all products
  const { data: products, error } = await supabase
    .from('ProductInformation')
    .select('*');

  if (error) throw error;

  // 2) Resolve public URLs for every product image.
  //
  //    `ImageName` can be stored in two shapes:
  //      a) A plain string  → "iphone-front.jpg"
  //      b) A JSON array    → '["iphone-front.jpg","iphone-side.jpg"]'
  //
  //    We handle both so the hook works today (single image per product)
  //    and automatically supports multiple images the moment you start
  //    storing a JSON array in the `ImageItems` column — no DB migration
  //    required beyond updating the column value.
  //
  //    NOTE: getPublicUrl is synchronous — do NOT await it.

  const productsWithImages = (products ?? []).map((product) => {
    // ── Parse the image filenames ─────────────────────────────────────────
    let fileNames = [];

    if (Array.isArray(product.ImageName)) {
      // Already a JS array (Supabase JSONB column)
      fileNames = product.ImageName.filter(Boolean);
    } else if (typeof product.ImageName === 'string' && product.ImageName.trim()) {
      const raw = product.ImageName.trim();
      if (raw.startsWith('[')) {
        // Stored as a JSON string — parse it
        try {
          const parsed = JSON.parse(raw);
          fileNames = Array.isArray(parsed) ? parsed.filter(Boolean) : [raw];
        } catch {
          // Malformed JSON — treat the whole string as one filename
          fileNames = [raw];
        }
      } else {
        // Plain single filename
        fileNames = [raw];
      }
    }

    // ── Generate a public URL for each filename ───────────────────────────
    const images = fileNames.map((name) => {
      const { data } = supabase.storage
        .from('Items images')
        .getPublicUrl(name);
      return data.publicUrl;
    }).filter(Boolean);

    return {
      ...product,
      // `imageUrl`  — first image URL kept for backward compatibility
      // `images`    — full array consumed by ProductImageGallery
      imageUrl: images[0] ?? null,
      images,
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

