import { z } from 'zod';
import { CATEGORIES, CONDITIONS } from './productConstants';

export const productSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(2, { message: 'Product name must be at least 2 characters long' })
    .max(120, { message: 'Product name cannot exceed 120 characters' }),
  category: z
    .string()
    .min(1, { message: 'Please select a category' })
    .refine((val) => CATEGORIES.includes(val) || val.trim().length > 0, {
      message: 'Please choose a valid category',
    }),
  price: z
    .number({ invalid_type_error: 'Enter a price greater than 0' })
    .int({ message: 'Price must be a whole number' })
    .positive({ message: 'Enter a price greater than 0' }),
  condition: z
    .string()
    .min(1, { message: 'Please select a condition' }),
  location: z
    .string()
    .trim()
    .max(100, { message: 'Location cannot exceed 100 characters' })
    .optional()
    .default(''),
  description: z
    .string()
    .max(2000, { message: 'Description cannot exceed 2000 characters' })
    .optional()
    .default(''),
  specifications: z
    .array(
      z.object({
        key: z.string().trim(),
        value: z.string().trim(),
      })
    )
    .default([]),
  images: z
    .array(
      z.object({
        id: z.string(),
        fileName: z.string(),
        url: z.string().url().or(z.string()),
        isCover: z.boolean().optional(),
        isNew: z.boolean().optional(),
        file: z.any().optional(),
        progress: z.number().optional().nullable(),
        error: z.string().optional().nullable(),
      })
    )
    .min(1, { message: 'Add at least one photo' })
    .max(6, { message: 'You can add up to 6 photos' }),
  is_hidden: z.boolean().default(false),
});
