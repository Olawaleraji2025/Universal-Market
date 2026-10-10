import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { CATEGORIES, CONDITIONS } from '../lib/productConstants';
import { productSchema } from '../lib/productSchema';
import ImageUploader from '../components/ImageUploader';
import SpecsEditor from '../components/SpecsEditor';
import UnsavedChangesDialog from '../components/UnsavedChangesDialog';
import ProductDeleteDialog from '../components/ProductDeleteDialog';

export default function ProductForm({
  initialData = null,
  isEdit = false,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
}) {
  const navigate = useNavigate();

  // Form State
  const [productName, setProductName] = useState(initialData?.productName || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [rawPriceString, setRawPriceString] = useState(
    initialData?.price ? Number(initialData.price).toLocaleString('en-US') : ''
  );
  const [condition, setCondition] = useState(initialData?.condition || CONDITIONS[0]);
  const [location, setLocation] = useState(initialData?.location || '');
  const [isHidden, setIsHidden] = useState(Boolean(initialData?.is_hidden));
  const [description, setDescription] = useState(initialData?.description || '');
  const [specifications, setSpecifications] = useState(
    initialData?.specifications || [
      { key: 'Storage', value: '' },
      { key: 'Colour', value: '' },
    ]
  );
  const [images, setImages] = useState(initialData?.formattedImages || []);

  // Validation & Touched state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Dialogs
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Field refs for focus-on-error
  const nameInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const priceInputRef = useRef(null);
  const conditionInputRef = useRef(null);
  const imagesContainerRef = useRef(null);

  // Pre-fill when editing data loads
  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || '');
      setCategory(initialData.category || CATEGORIES[0]);
      setRawPriceString(
        initialData.price ? Number(initialData.price).toLocaleString('en-US') : ''
      );
      setCondition(initialData.condition || CONDITIONS[0]);
      setLocation(initialData.location || '');
      setIsHidden(Boolean(initialData.is_hidden));
      setDescription(initialData.description || '');
      setSpecifications(
        initialData.specifications?.length
          ? initialData.specifications
          : [{ key: 'Storage', value: '' }]
      );
      setImages(initialData.formattedImages || []);
      setIsDirty(false);
    }
  }, [initialData]);

  // Handle price typing with thousands separators
  const handlePriceChange = (e) => {
    setIsDirty(true);
    const inputVal = e.target.value.replace(/[^0-9]/g, '');
    if (!inputVal) {
      setRawPriceString('');
      return;
    }
    const num = parseInt(inputVal, 10);
    setRawPriceString(num.toLocaleString('en-US'));
  };

  const getNumericPrice = () => {
    const digitsOnly = rawPriceString.replace(/[^0-9]/g, '');
    return digitsOnly ? parseInt(digitsOnly, 10) : 0;
  };

  const validateField = (fieldName) => {
    const formData = {
      productName,
      category,
      price: getNumericPrice(),
      condition,
      location,
      description,
      specifications,
      images,
      is_hidden: isHidden,
    };

    const result = productSchema.safeParse(formData);
    if (!result.success) {
      const issues = result.error?.issues || result.error?.errors || [];
      const fieldError = issues.find((err) => err.path[0] === fieldName);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError ? fieldError.message : undefined,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      productName,
      category,
      price: getNumericPrice(),
      condition,
      location,
      description,
      specifications,
      images,
      is_hidden: isHidden,
    };

    const result = productSchema.safeParse(formData);

    if (!result.success) {
      const issues = result.error?.issues || result.error?.errors || [];
      const newErrors = {};
      issues.forEach((err) => {
        const field = err.path[0];
        if (!newErrors[field]) {
          newErrors[field] = err.message;
        }
      });
      setErrors(newErrors);
      setTouched({
        productName: true,
        category: true,
        price: true,
        condition: true,
        images: true,
      });

      // Scroll and focus first error
      if (newErrors.productName) {
        nameInputRef.current?.focus();
        nameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.price) {
        priceInputRef.current?.focus();
        priceInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.category) {
        categoryInputRef.current?.focus();
        categoryInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.images) {
        imagesContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    onSave({
      id: initialData?.id,
      ...formData,
      originalImageNames: initialData?.imageNames || [],
    });
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      navigate('/admin/products');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2e8f0] pb-4">
        <div>
          <button
            type="button"
            onClick={handleCancelClick}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#047857] hover:text-[#064e3b] transition mb-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857] rounded"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to products</span>
          </button>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#01241a] tracking-tight">
            {isEdit
              ? `Edit ${initialData?.productName || 'product'}`
              : 'Add product'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* CARD 1: Basic Info */}
        <section
          aria-labelledby="card-basic-title"
          className="bg-white rounded-[14px] border border-[#e2e8f0] p-5 sm:p-6 shadow-xs"
        >
          <h2
            id="card-basic-title"
            className="text-base font-bold text-[#01241a] pb-3 border-b border-[#e2e8f0] mb-4"
          >
            Basic info
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="product-name"
                className="block text-xs font-semibold text-[#01241a] mb-1.5"
              >
                Product Name <span className="text-[#b91c1c]">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="product-name"
                type="text"
                value={productName}
                onChange={(e) => {
                  setIsDirty(true);
                  setProductName(e.target.value);
                }}
                onBlur={() => handleBlur('productName')}
                placeholder="e.g. iPhone 13 Pro 256GB"
                aria-describedby={errors.productName ? 'name-error' : undefined}
                className={`w-full min-h-[44px] px-3.5 text-sm text-[#01241a] bg-white border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] transition ${
                  touched.productName && errors.productName
                    ? 'border-[#b91c1c] bg-rose-50/20'
                    : 'border-[#e2e8f0]'
                }`}
              />
              {touched.productName && errors.productName && (
                <p id="name-error" className="mt-1.5 text-xs text-[#b91c1c]">
                  {errors.productName}
                </p>
              )}
            </div>

            {/* Category & Condition (2 cols on laptop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category-select"
                  className="block text-xs font-semibold text-[#01241a] mb-1.5"
                >
                  Category <span className="text-[#b91c1c]">*</span>
                </label>
                <select
                  ref={categoryInputRef}
                  id="category-select"
                  value={category}
                  onChange={(e) => {
                    setIsDirty(true);
                    setCategory(e.target.value);
                  }}
                  onBlur={() => handleBlur('category')}
                  className="w-full min-h-[44px] px-3.5 text-sm text-[#01241a] bg-white border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] transition cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {touched.category && errors.category && (
                  <p className="mt-1.5 text-xs text-[#b91c1c]">{errors.category}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="condition-select"
                  className="block text-xs font-semibold text-[#01241a] mb-1.5"
                >
                  Condition <span className="text-[#b91c1c]">*</span>
                </label>
                <select
                  ref={conditionInputRef}
                  id="condition-select"
                  value={condition}
                  onChange={(e) => {
                    setIsDirty(true);
                    setCondition(e.target.value);
                  }}
                  onBlur={() => handleBlur('condition')}
                  className="w-full min-h-[44px] px-3.5 text-sm text-[#01241a] bg-white border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] transition cursor-pointer"
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Location (2 cols on laptop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price-input"
                  className="block text-xs font-semibold text-[#01241a] mb-1.5"
                >
                  Price in Naira (₦) <span className="text-[#b91c1c]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-bold text-[#475569] pointer-events-none">
                    ₦
                  </span>
                  <input
                    ref={priceInputRef}
                    id="price-input"
                    type="text"
                    inputMode="numeric"
                    value={rawPriceString}
                    onChange={handlePriceChange}
                    onBlur={() => handleBlur('price')}
                    placeholder="650,000"
                    aria-describedby={errors.price ? 'price-error' : undefined}
                    className={`w-full min-h-[44px] pl-8 pr-3.5 text-sm font-semibold text-[#01241a] bg-white border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] transition ${
                      touched.price && errors.price
                        ? 'border-[#b91c1c] bg-rose-50/20'
                        : 'border-[#e2e8f0]'
                    }`}
                  />
                </div>
                {touched.price && errors.price && (
                  <p id="price-error" className="mt-1.5 text-xs text-[#b91c1c]">
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location-input"
                  className="block text-xs font-semibold text-[#01241a] mb-1.5"
                >
                  Location <span className="text-[#475569] font-normal">(Optional)</span>
                </label>
                <input
                  id="location-input"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setIsDirty(true);
                    setLocation(e.target.value);
                  }}
                  placeholder="e.g. Lagos, Abuja, Osogbo"
                  className="w-full min-h-[44px] px-3.5 text-sm text-[#01241a] bg-white border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] transition"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Hide from shop toggle */}
        <section
          aria-labelledby="card-visibility-title"
          className="bg-white rounded-[14px] border border-[#e2e8f0] p-5 sm:p-6 shadow-xs"
        >
          <h2
            id="card-visibility-title"
            className="text-base font-bold text-[#01241a] pb-3 border-b border-[#e2e8f0] mb-4"
          >
            Visibility
          </h2>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isHidden}
              onChange={(e) => {
                setIsDirty(true);
                setIsHidden(e.target.checked);
              }}
              className="w-4 h-4 mt-0.5 rounded text-[#047857] focus:ring-[#047857]"
            />
            <div>
              <span className="text-sm font-semibold text-[#01241a] block">
                Hide from shop
              </span>
              <span className="text-xs text-[#475569]">
                Hidden products don't appear in the shop catalogue.
              </span>
            </div>
          </label>
        </section>

        {/* CARD 3: Images */}
        <section
          ref={imagesContainerRef}
          aria-labelledby="card-images-title"
          className="bg-white rounded-[14px] border border-[#e2e8f0] p-5 sm:p-6 shadow-xs"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] mb-4">
            <h2 id="card-images-title" className="text-base font-bold text-[#01241a]">
              Product Photos <span className="text-[#b91c1c]">*</span>
            </h2>
            <span className="text-xs font-medium text-[#475569]">
              {images.length}/6 photos added
            </span>
          </div>

          <ImageUploader
            images={images}
            onChange={(newImages) => {
              setIsDirty(true);
              setImages(newImages);
              if (touched.images) {
                setErrors((prev) => ({
                  ...prev,
                  images: newImages.length === 0 ? 'Add at least one photo' : undefined,
                }));
              }
            }}
            error={touched.images ? errors.images : undefined}
          />
        </section>

        {/* CARD 4: Description */}
        <section
          aria-labelledby="card-desc-title"
          className="bg-white rounded-[14px] border border-[#e2e8f0] p-5 sm:p-6 shadow-xs"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] mb-4">
            <h2 id="card-desc-title" className="text-base font-bold text-[#01241a]">
              Description <span className="text-[#475569] font-normal text-xs">(Optional)</span>
            </h2>
            <span className="text-xs text-[#475569]">
              {description.length}/2000 characters
            </span>
          </div>

          <div>
            <textarea
              rows={4}
              value={description}
              maxLength={2000}
              onChange={(e) => {
                setIsDirty(true);
                setDescription(e.target.value);
              }}
              placeholder="Provide a detailed description of the product, its condition, accessories included, etc."
              className="w-full p-3.5 text-sm text-[#01241a] bg-white border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] transition resize-y"
            />
          </div>
        </section>

        {/* CARD 5: Specifications */}
        <section
          aria-labelledby="card-specs-title"
          className="bg-white rounded-[14px] border border-[#e2e8f0] p-5 sm:p-6 shadow-xs"
        >
          <h2
            id="card-specs-title"
            className="text-base font-bold text-[#01241a] pb-3 border-b border-[#e2e8f0] mb-4"
          >
            Specifications
          </h2>

          <SpecsEditor
            specs={specifications}
            onChange={(newSpecs) => {
              setIsDirty(true);
              setSpecifications(newSpecs);
            }}
          />
        </section>

        {/* Edit Only: Delete Action at the bottom */}
        {isEdit && (
          <div className="pt-6 border-t border-[#e2e8f0] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#01241a]">Delete this product</p>
              <p className="text-xs text-[#475569]">
                Permanently remove this item and its photos from the catalogue.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-xs font-semibold text-[#b91c1c] hover:bg-rose-50 transition border border-transparent hover:border-rose-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete product</span>
            </button>
          </div>
        )}

        {/* LAPTOP DESKTOP FOOTER */}
        <div className="hidden md:flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={isSaving}
            className="min-h-[44px] px-5 py-2.5 rounded-[10px] border border-[#e2e8f0] bg-white text-sm font-semibold text-[#01241a] hover:bg-slate-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="min-h-[44px] px-6 py-2.5 rounded-[10px] bg-[#047857] hover:bg-[#064e3b] text-white text-sm font-semibold transition cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 disabled:opacity-70 inline-flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save product</span>
            )}
          </button>
        </div>

        {/* MOBILE STICKY BOTTOM BAR */}
        <div className="fixed md:hidden bottom-0 inset-x-0 bg-white border-t border-[#e2e8f0] p-3 shadow-lg z-30 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={isSaving}
            className="flex-1 min-h-[48px] px-4 py-2.5 rounded-[10px] border border-[#e2e8f0] bg-white text-sm font-semibold text-[#01241a] hover:bg-slate-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex-2 min-h-[48px] px-4 py-2.5 rounded-[10px] bg-[#047857] hover:bg-[#064e3b] text-white text-sm font-semibold transition cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 disabled:opacity-70 inline-flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save product</span>
            )}
          </button>
        </div>
      </form>

      {/* Unsaved Changes Confirmation Dialog */}
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onKeepEditing={() => setShowUnsavedDialog(false)}
        onDiscard={() => {
          setShowUnsavedDialog(false);
          navigate('/admin/products');
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ProductDeleteDialog
        isOpen={showDeleteDialog}
        productName={initialData?.productName}
        isLoading={isDeleting}
        onConfirmDelete={() => {
          setShowDeleteDialog(false);
          onDelete?.();
        }}
        onMarkOutOfStock={() => {
          setShowDeleteDialog(false);
        }}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
