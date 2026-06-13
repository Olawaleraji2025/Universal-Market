import { useMemo, useState } from "react";

import Button from "../ui/button";
import { Input } from "../ui/input";

const CATEGORY_OPTIONS = ["Phones", "Laptops", "TVs", "Gaming", "Appliances"];
const CONDITION_OPTIONS = ["Excellent", "Good", "Refurbished"];

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-900">{title}</h3>
          {description ? <p className="text-sm text-gray-600">{description}</p> : null}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function PreviewGrid({ images }) {
  if (!images?.length) {
    return (
      <div className="text-sm text-gray-500">No images selected.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {images.map((img, idx) => (
        <div
          key={img.id ?? idx}
          className="rounded-lg overflow-hidden bg-gray-100 border border-gray-100"
        >
          <img
            src={img.url}
            alt={img.name || `Image ${idx + 1}`}
            className="w-full h-28 object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function toggleClass(on) {
  return on ? "bg-emerald-600" : "bg-gray-300";
}

export default function AddProduct({
  onCancel,
  onSaved,
  initialValues,
}) {
  const mergedInitial = useMemo(() => {
    return {
      productName: "",
      category: "Phones",
      price: "",
      condition: "Excellent",
      description: "",
      specifications: "",
      available: true,
      primaryImage: null,
      galleryImages: [],
      ...(initialValues || {}),
    };
  }, [initialValues]);

  const [productName, setProductName] = useState(mergedInitial.productName);
  const [category, setCategory] = useState(mergedInitial.category);
  const [price, setPrice] = useState(mergedInitial.price);
  const [condition, setCondition] = useState(mergedInitial.condition);
  const [description, setDescription] = useState(mergedInitial.description);
  const [specifications, setSpecifications] = useState(
    mergedInitial.specifications
  );
  const [available, setAvailable] = useState(mergedInitial.available);

  const [primaryImage, setPrimaryImage] = useState(mergedInitial.primaryImage);
  const [galleryImages, setGalleryImages] = useState(
    mergedInitial.galleryImages
  );

  const [isSaving, setIsSaving] = useState(false);

  const normalizedPrice = useMemo(() => {
    // keep digits only for mock validation
    const digitsOnly = String(price || "").replace(/[^0-9]/g, "");
    return digitsOnly;
  }, [price]);

  const isValid = useMemo(() => {
    return (
      productName.trim().length > 0 &&
      category.trim().length > 0 &&
      normalizedPrice.length > 0 &&
      condition.trim().length > 0 &&
      description.trim().length > 0 &&
      specifications.trim().length > 0 &&
      !!primaryImage
    );
  }, [
    productName,
    category,
    normalizedPrice,
    condition,
    description,
    specifications,
    primaryImage,
  ]);

  function revokeObjectUrl(img) {
    if (!img?.url) return;
    if (img.url.startsWith("blob:")) URL.revokeObjectURL(img.url);
  }

  function handlePrimaryImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPrimaryImage((prev) => {
      // revoke previous preview
      revokeObjectUrl(prev);
      return {
        id: prev?.id ?? `primary_${Date.now()}`,
        file,
        name: file.name,
        url: URL.createObjectURL(file),
      };
    });
  }

  function handleGalleryImagesChange(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // replace gallery; revoke old ones
    setGalleryImages((prev) => {
      prev?.forEach(revokeObjectUrl);
      return files.map((file) => ({
        id: `g_${Date.now()}_${file.name}`,
        file,
        name: file.name,
        url: URL.createObjectURL(file),
      }));
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!isValid || isSaving) return;

    setIsSaving(true);
    try {
      // mock submit delay
      await new Promise((r) => setTimeout(r, 600));

      alert("Product saved (mock)");
      onSaved?.({
        productName,
        category,
        price: normalizedPrice,
        condition,
        description,
        specifications,
        available,
        primaryImage,
        galleryImages,
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    // revoke previews to avoid leaks
    revokeObjectUrl(primaryImage);
    galleryImages?.forEach(revokeObjectUrl);
    onCancel?.();
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              Add Product
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Create a new product listing.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="text-gray-500 hover:text-gray-900 px-2"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard
            title="Product details"
            description="Basic identity, pricing and status."
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Product Name
                </label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. iPhone 13 Pro 256GB"
                  className="bg-white border-gray-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Price
                  </label>
                  <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 485000"
                    className="bg-white border-gray-200"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                >
                  {CONDITION_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Availability
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Toggle whether the product is available.
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle availability"
                    onClick={() => setAvailable((v) => !v)}
                    className={
                      "relative inline-flex h-7 w-14 items-center rounded-full px-1 transition-colors " +
                      toggleClass(available)
                    }
                  >
                    <span
                      className={
                        "inline-block h-5 w-5 transform rounded-full bg-white transition " +
                        (available ? "translate-x-6" : "translate-x-1")
                      }
                    />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600">
                    Status:
                  </span>
                  <span
                    className={
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold " +
                      (available
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-gray-100 text-gray-800 border-gray-200")
                    }
                  >
                    {available ? "Available" : "Sold"}
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Content"
            description="Describe the product and add key specs."
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="Write a clear product description..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Specifications
                </label>
                <textarea
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="List key specs (e.g. RAM, storage, size, etc.)"
                />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard
            title="Images"
            description="Add one primary image and a gallery of extra images."
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Image Upload (Primary)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePrimaryImageChange}
                    className="block w-full text-sm text-gray-700"
                  />
                  {primaryImage ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                      <img
                        src={primaryImage.url}
                        alt={primaryImage.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No primary image.</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Multiple Image Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                  className="block w-full text-sm text-gray-700"
                />

                <div className="mt-4">
                  <PreviewGrid
                    images={galleryImages.map((img) => ({
                      id: img.id,
                      url: img.url,
                      name: img.name,
                    }))}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Image preview"
            description="A quick overview of what will be saved."
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Primary image
                </p>
                {primaryImage ? (
                  <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    <img
                      src={primaryImage.url}
                      alt={primaryImage.name}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No primary image selected.</div>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Gallery images
                </p>
                <PreviewGrid
                  images={galleryImages.map((img) => ({
                    id: img.id,
                    url: img.url,
                    name: img.name,
                  }))}
                />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="min-w-[120px]"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={!isValid || isSaving}
            className="bg-[#064e3b] text-white hover:bg-emerald-900 transition min-w-[160px]"
          >
            {isSaving ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

