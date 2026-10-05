import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import { uploadProductImage, deleteProductImages } from '../lib/imageUtils';
import { ADMIN_PRODUCTS_QUERY_KEY } from './useAdminProducts';
import { ADMIN_PRODUCT_QUERY_KEY } from './useAdminProduct';

export function useSaveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      productName,
      category,
      price,
      condition,
      location,
      productStatus,
      description,
      specifications,
      images,
      // is_hidden,
      originalImageNames = [],
    }) => {
      // 1. Process specifications array into Key-Value object format
      const specsObject = {};
      if (Array.isArray(specifications)) {
        specifications.forEach(({ key, value }) => {
          const trimmedKey = String(key || '').trim();
          const trimmedValue = String(value || '').trim();
          if (trimmedKey && trimmedValue) {
            specsObject[trimmedKey] = trimmedValue;
          }
        });
      }

      // 2. Separate existing images from newly added files that need upload
      const newlyUploadedFileNames = [];
      const finalImageNames = [];

      try {
        for (const item of images) {
          if (item.isNew && item.file) {
            // Upload new file
            const { fileName } = await uploadProductImage(item.file);
            newlyUploadedFileNames.push(fileName);
            finalImageNames.push(fileName);
          } else if (item.fileName) {
            finalImageNames.push(item.fileName);
          }
        }

        if (finalImageNames.length === 0) {
          throw new Error('At least one product photo is required');
        }

        // 3. Prepare payload for EachProductInformation
        const coverFileName = finalImageNames[0];
        const payload = {
          ProductName: productName,
          Category: category,
          ProductPrice: Number(price),
          ProductStatus: productStatus,
          ProductDescription: description || '',
          ProductSpecifications: specsObject,
          ImageName: finalImageNames, // Saved as array of filenames
          ImageItems: coverFileName || null,  // Legacy cover filename support
          Location: location || '',
        };

        // If condition column exists or can be stored
        if (condition) {
          payload.ProductCondition = condition;
        }

        // Add is_hidden
        // payload.is_hidden = Boolean(is_hidden);

        let savedData = null;

        if (id) {
          // UPDATE
          let { data, error } = await supabase
            .from('EachProductInformation')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

          // Graceful fallback if is_hidden or ProductCondition columns do not exist in the database table
          if (error && (error.message?.includes('is_hidden') || error.message?.includes('ProductCondition'))) {
            const fallbackPayload = { ...payload };
            // if (error.message?.includes('is_hidden')) delete fallbackPayload.is_hidden;
            if (error.message?.includes('ProductCondition')) delete fallbackPayload.ProductCondition;

            const retry = await supabase
              .from('EachProductInformation')
              .update(fallbackPayload)
              .eq('id', id)
              .select()
              .single();

            if (retry.error) throw retry.error;
            data = retry.data;
          } else if (error) {
            throw error;
          }

          savedData = data;

          // After successful update, safely delete any old images that were removed
          const removedImages = originalImageNames.filter(
            (origName) => !finalImageNames.includes(origName)
          );
          if (removedImages.length > 0) {
            await deleteProductImages(removedImages);
          }
        } else {
          // CREATE / INSERT
          let { data, error } = await supabase
            .from('EachProductInformation')
            .insert([payload])
            .select()
            .single();

          // Graceful fallback if is_hidden or ProductCondition columns do not exist in the database table
          if (error && (error.message?.includes('is_hidden') || error.message?.includes('ProductCondition'))) {
            const fallbackPayload = { ...payload };
            // if (error.message?.includes('is_hidden')) delete fallbackPayload.is_hidden;  
            if (error.message?.includes('ProductCondition')) delete fallbackPayload.ProductCondition;

            const retry = await supabase
              .from('EachProductInformation')
              .insert([fallbackPayload])
              .select()
              .single();

            if (retry.error) throw retry.error;
            data = retry.data;
          } else if (error) {
            throw error;
          }

          savedData = data;
        }

        return savedData;
      } catch (err) {
        // If create failed or unhandled error occurred, clean up any files uploaded in this session
        if (!id && newlyUploadedFileNames.length > 0) {
          await deleteProductImages(newlyUploadedFileNames);
        }

          throw err;
        
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate queries so admin list, single view, shop, and dashboard immediately sync
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCT_QUERY_KEY, variables.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    },
  });
}
