import React, { useRef, useState } from 'react';
import { Image as ImageIcon, UploadCloud, Trash2, Star, Plus, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { normalizeImageUrl } from '../utils/formatters';

interface ImageGalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
  label?: string;
  description?: string;
  token?: string;
  propertyType?: string;
}

/**
 * Resizes and compresses image on client side using offscreen canvas
 * Prevents massive 15MB phone camera shots from slowing down performance
 */
async function compressImageFile(file: File, maxDim = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        resolve('');
        return;
      }

      // If svg or small gif, skip canvas recompression
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };

      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export const ImageGalleryUploader: React.FC<ImageGalleryUploaderProps> = ({
  images,
  onChange,
  multiple = true,
  maxImages = 12,
  label = 'Property Photos (From Gallery)',
  description = 'Select photos directly from your device gallery or camera. No URLs required.',
  token,
  propertyType
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsProcessing(true);

    try {
      const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
      if (fileArray.length === 0) {
        setUploadError('Please select valid image files (JPG, PNG, WEBP).');
        setIsProcessing(false);
        return;
      }

      const remainingSlots = multiple ? maxImages - images.length : 1;
      const targetFiles = fileArray.slice(0, Math.max(1, remainingSlots));

      const processedUrls: string[] = [];

      for (const file of targetFiles) {
        const base64 = await compressImageFile(file);
        if (!base64) continue;

        // Attempt server upload or fallback to base64
        const result = await api.uploadImage(base64, file.name, token);
        if (result && result.url) {
          processedUrls.push(result.url);
        } else {
          processedUrls.push(base64);
        }
      }

      if (processedUrls.length > 0) {
        if (multiple) {
          onChange([...images, ...processedUrls]);
        } else {
          onChange(processedUrls.slice(0, 1));
        }
      }
    } catch (err: any) {
      console.error('Gallery image processing failed:', err);
      setUploadError('Failed to process image from gallery. Please try again.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const makeCover = (indexToCover: number) => {
    if (indexToCover === 0) return;
    const selected = images[indexToCover];
    const rest = images.filter((_, idx) => idx !== indexToCover);
    onChange([selected, ...rest]);
  };

  return (
    <div className="space-y-3">
      {/* Label and Hint */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
        <div>
          <label className="block text-xs font-semibold text-slate-800">
            {label}
            {multiple && (
              <span className="ml-1.5 text-[11px] font-normal text-slate-500">
                ({images.length} of {maxImages} selected)
              </span>
            )}
          </label>
          <p className="text-[11px] text-slate-500">
            {description}
          </p>
        </div>
        <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium inline-block self-start">
          گیلری سے تصاویر منتخب کریں
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple={multiple}
        className="hidden"
      />

      {/* When no images exist yet */}
      {images.length === 0 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-500 bg-amber-50/50'
              : 'border-slate-300 hover:border-amber-500 bg-slate-50/60 hover:bg-amber-50/20'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-amber-600">
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">
                {isProcessing ? 'Processing gallery photos...' : 'Click to Browse Device Gallery'}
              </p>
              <p className="text-[11px] text-slate-500">
                JPG, PNG, WEBP (Supports multiple photo selection)
              </p>
            </div>
            <button
              type="button"
              disabled={isProcessing}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Select from Gallery / Photos</span>
            </button>
          </div>
        </div>
      )}

      {/* Image Previews Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgUrl, index) => {
              const displaySrc = normalizeImageUrl(imgUrl, propertyType);
              const isCover = index === 0;

              return (
                <div
                  key={`${imgUrl}-${index}`}
                  className={`group relative rounded-xl overflow-hidden border bg-slate-100 aspect-4/3 shadow-xs ${
                    isCover ? 'border-amber-500 ring-2 ring-amber-400/40' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={displaySrc}
                    alt={`Selected gallery photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/house_dha_contemporary.jpg';
                    }}
                  />

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Main Cover</span>
                    </div>
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        title="Remove photo"
                        className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!isCover && multiple && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          makeCover(index);
                        }}
                        className="w-full py-1 rounded bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Set as Cover</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add More button card */}
            {multiple && images.length < maxImages && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="aspect-4/3 rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/80 hover:bg-amber-50/30 flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-amber-700 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                ) : (
                  <Plus className="w-6 h-6 text-amber-600" />
                )}
                <span className="text-[11px] font-bold">Add from Gallery</span>
                <span className="text-[9px] text-slate-400">فون / کمپیوٹر</span>
              </button>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {isProcessing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>{multiple ? 'Select More Photos from Gallery' : 'Change Photo from Gallery'}</span>
            </button>

            {images.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
              >
                Clear all photos
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
