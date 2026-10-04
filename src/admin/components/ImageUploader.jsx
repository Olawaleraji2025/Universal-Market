import React, { useRef, useState } from 'react';
import { UploadCloud, X, Star, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import {
  MAX_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
  ACCEPTED_IMAGE_TYPES,
} from '../lib/productConstants';
import { validateImageFile } from '../lib/imageUtils';

export default function ImageUploader({
  images = [],
  onChange,
  error,
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const processFiles = (files) => {
    setUploadError(null);
    const fileList = Array.from(files);

    if (images.length + fileList.length > MAX_IMAGES) {
      setUploadError(`You can add up to ${MAX_IMAGES} photos.`);
      return;
    }

    const newImages = [...images];

    for (const file of fileList) {
      const valError = validateImageFile(file);
      if (valError) {
        setUploadError(valError);
        return;
      }

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const previewUrl = URL.createObjectURL(file);

      newImages.push({
        id: tempId,
        fileName: file.name,
        url: previewUrl,
        file,
        isNew: true,
        isCover: newImages.length === 0,
        progress: 100, // Client preview is instant
        error: null,
      });
    }

    // Ensure the first item has isCover set
    if (newImages.length > 0 && !newImages.some((img) => img.isCover)) {
      newImages[0].isCover = true;
    }

    onChange(newImages);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    // If the removed image was cover, make the new first image cover
    if (updated.length > 0) {
      updated[0].isCover = true;
      for (let i = 1; i < updated.length; i++) {
        updated[i].isCover = false;
      }
    }
    onChange(updated);
  };

  const handleMakeCover = (indexToCover) => {
    const updated = [...images];
    const [target] = updated.splice(indexToCover, 1);
    target.isCover = true;
    updated.forEach((img) => {
      img.isCover = false;
    });
    updated.unshift(target);
    onChange(updated);
  };

  const handleRetry = (index) => {
    const updated = [...images];
    updated[index].error = null;
    updated[index].progress = 100;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            processFiles(e.target.files);
            e.target.value = '';
          }
        }}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            processFiles(e.target.files);
            e.target.value = '';
          }
        }}
      />

      {/* Drop Zone */}
      {images.length < MAX_IMAGES && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-[12px] p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#047857] bg-[#ecfdf5]/80 scale-[1.01]'
              : 'border-[#cbd5e1] hover:border-[#047857] hover:bg-slate-50'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload product photos"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#ecfdf5] text-[#047857] flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#01241a]">
                <span className="text-[#047857] underline underline-offset-2">
                  Browse photos
                </span>{' '}
                or drag & drop here
              </p>
              <p className="text-xs text-[#475569] mt-1">
                Up to {MAX_IMAGES} photos, JPG, PNG or WebP, 5 MB each.
              </p>
            </div>

            {/* Mobile Camera Option Button */}
            <div className="mt-2 sm:hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#01241a] transition"
              >
                <Camera className="w-4 h-4 text-[#047857]" />
                <span>Take Photo with Camera</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation or upload error messages */}
      {(uploadError || error) && (
        <div
          role="alert"
          className="flex items-center gap-2 text-xs font-semibold text-[#b91c1c] bg-rose-50 border border-rose-200 rounded-[8px] p-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError || error}</span>
        </div>
      )}

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {images.map((img, index) => {
            const isCover = index === 0;
            const hasFailed = Boolean(img.error);
            const isUploading = img.progress !== undefined && img.progress < 100;

            return (
              <div
                key={img.id || index}
                className={`relative group rounded-[10px] overflow-hidden border bg-[#f8fafc] aspect-square flex items-center justify-center transition-all ${
                  hasFailed
                    ? 'border-2 border-[#b91c1c]'
                    : isCover
                    ? 'border-2 border-[#047857] ring-2 ring-[#047857]/20 shadow-xs'
                    : 'border-[#e2e8f0]'
                }`}
              >
                {/* Image element */}
                <img
                  src={img.url}
                  alt={`Product photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover badge */}
                {isCover && (
                  <div className="absolute top-1.5 left-1.5 bg-[#064e3b] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Cover</span>
                  </div>
                )}

                {/* Make Cover Button (if not cover and not failed) */}
                {!isCover && !hasFailed && !isUploading && (
                  <button
                    type="button"
                    onClick={() => handleMakeCover(index)}
                    aria-label={`Make photo ${index + 1} cover photo`}
                    className="absolute bottom-1.5 inset-x-1.5 py-1 px-1.5 bg-black/75 hover:bg-black text-white text-[10px] font-semibold rounded-[6px] transition opacity-0 group-hover:opacity-100 focus:opacity-100 text-center truncate"
                  >
                    Make cover
                  </button>
                )}

                {/* Remove (x) Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-[#b91c1c] text-white flex items-center justify-center transition focus:outline-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Uploading progress overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-2 text-white">
                    <span className="text-[11px] font-bold">{img.progress}%</span>
                    <div className="w-full bg-white/30 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="bg-[#10b981] h-full transition-all duration-150"
                        style={{ width: `${img.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Failed error overlay */}
                {hasFailed && (
                  <div className="absolute inset-0 bg-rose-950/80 flex flex-col items-center justify-center p-2 text-white text-center">
                    <AlertCircle className="w-5 h-5 text-rose-300 mb-1" />
                    <span className="text-[10px] font-medium text-rose-200">
                      Upload failed
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRetry(index)}
                      className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-[#b91c1c] text-[10px] font-bold"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      Retry
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
