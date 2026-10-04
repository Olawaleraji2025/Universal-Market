import { supabase } from '../../supabaseClient';
import {
  STORAGE_BUCKET,
  MAX_IMAGE_SIZE_BYTES,
  ACCEPTED_IMAGE_TYPES,
} from './productConstants';

/**
 * Validates a single image file for type and size.
 */
export function validateImageFile(file) {
  if (!file) return 'No file selected';

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Invalid file type. Only JPG, PNG, and WebP are supported.';
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'File is too large. Maximum size is 5 MB.';
  }

  return null;
}

/**
 * Compresses an image in the browser using HTML5 Canvas.
 * Resizes so longest side is max 1600px and saves as JPEG/WebP with 0.82 quality.
 */
export async function compressImage(file, maxDimension = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    // If browser doesn't support Image or Canvas (rare), return original file
    if (typeof window === 'undefined' || !window.createImageBitmap) {
      return resolve(file);
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return resolve(file);
      }

      // Draw onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Determine export mime type
      const targetType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file);
          }
          // Preserve filename extension
          const compressedFile = new File([blob], file.name, {
            type: targetType,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        targetType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // Fallback to raw file if decode fails
    };

    img.src = objectUrl;
  });
}

/**
 * Generates a clean, unique filename: timestamp + random string + sanitized base name.
 */
export function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const cleanName = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');
  return `${timestamp}-${randomStr}-${cleanName}`;
}

/**
 * Gets the public URL for an image filename in 'Items images'.
 */
export function getProductImageUrl(fileName) {
  if (!fileName) return null;
  if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
    return fileName;
  }
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return data?.publicUrl ?? null;
}

/**
 * Uploads a file to Supabase storage 'Items images' with simulated/actual progress callback.
 */
export async function uploadProductImage(file, onProgress) {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  // Step 1: Compress image
  if (onProgress) onProgress(20);
  const compressed = await compressImage(file);
  if (onProgress) onProgress(50);

  // Step 2: Upload to Supabase storage
  const fileName = generateUniqueFileName(compressed.name);
  if (onProgress) onProgress(75);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, compressed, {
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    throw new Error(error.message || 'Failed to upload image to storage');
  }

  if (onProgress) onProgress(100);

  const publicUrl = getProductImageUrl(fileName);
  return {
    fileName,
    publicUrl,
  };
}

/**
 * Deletes a single image from 'Items images' bucket.
 */
export async function deleteProductImage(fileName) {
  if (!fileName) return;
  // If it's a full URL, extract the filename
  const cleanName = fileName.includes('/')
    ? fileName.split('/').pop().split('?')[0]
    : fileName;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([cleanName]);

  if (error) {
    console.warn(`Failed to delete image ${cleanName}:`, error.message);
  }
}

/**
 * Batch deletes multiple images from 'Items images' bucket.
 */
export async function deleteProductImages(fileNames) {
  if (!fileNames || !fileNames.length) return;
  const cleanNames = fileNames
    .filter(Boolean)
    .map((name) => (name.includes('/') ? name.split('/').pop().split('?')[0] : name));

  if (cleanNames.length === 0) return;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove(cleanNames);

  if (error) {
    console.warn('Failed to delete image batch:', error.message);
  }
}
