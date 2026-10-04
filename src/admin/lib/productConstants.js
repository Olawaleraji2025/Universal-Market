export const CATEGORIES = [
  'Phones',
  'Laptops',
  'TVs',
  'Refrigerators',
  'Gaming Consoles',
  'Home Appliances',
  'Gadgets',
  'Audio & Studio Equipment',
  'Other',
];

export const CONDITIONS = [
  'New',
  'Used',
  'Refurbished',
];

export const PRODUCT_STATUS = {
  IN_STOCK: 'In Stock',
  OUT_OF_STOCK: 'Out of Stock',
};

export const STATUS_FILTER_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
  { label: 'Hidden from Shop', value: 'hidden' },
];

export const MAX_IMAGES = 6;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const STORAGE_BUCKET = 'Items images';
