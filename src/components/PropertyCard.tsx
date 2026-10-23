import React, { useState } from 'react';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  MessageCircle, 
  Eye, 
  Sparkles,
  Building2,
  Calendar
} from 'lucide-react';
import { Property } from '../types';
import { 
  formatPKR, 
  generateWhatsAppLink, 
  getCategoryBadge, 
  getConditionBadge, 
  normalizeImageUrl, 
  getCategoryFallback,
  DEFAULT_FALLBACK_IMAGE 
} from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  whatsappNumber?: string;
  viewMode?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  whatsappNumber = '923001234567',
  viewMode = 'grid'
}) => {
  const initialImage = (property.images && property.images.length > 0)
    ? normalizeImageUrl(property.images[0], property.type)
    : normalizeImageUrl('', property.type);

  const [imgSrc, setImgSrc] = useState(initialImage);
  const [errorCount, setErrorCount] = useState(0);

  React.useEffect(() => {
    const updated = (property.images && property.images.length > 0)
      ? normalizeImageUrl(property.images[0], property.type)
      : normalizeImageUrl('', property.type);
    setImgSrc(updated);
    setErrorCount(0);
  }, [property.id, property.images, property.type]);

  const handleImageError = () => {
    if (errorCount === 0) {
      // First fallback: High quality category CDN photo
      setErrorCount(1);
      setImgSrc(getCategoryFallback(property.type));
    } else if (errorCount === 1) {
      // Second fallback: 100% fail-safe inline SVG (never fails)
      setErrorCount(2);
      setImgSrc(DEFAULT_FALLBACK_IMAGE);
    }
  };

  const waLink = generateWhatsAppLink(
    property.contactWhatsapp || whatsappNumber,
    property.title,
    property.id
  );

  const isResidential = ['house', 'apartment', 'villa'].includes(property.type);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col md:flex-row group">
        {/* Left image column */}
        <div className="relative md:w-72 lg:w-80 h-56 md:h-auto shrink-0 bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onSelect(property.id)}>
          <img
            src={imgSrc}
            alt={property.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className={`px-2.5 py-1 text-xs font-bold rounded uppercase tracking-wider ${
              property.purpose === 'sale' 
                ? 'bg-amber-500 text-slate-950' 
                : property.purpose === 'rent'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white'
            }`}>
              {property.purpose === 'sale' ? 'For Sale' : property.purpose === 'rent' ? 'For Rent' : 'For Lease'}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-900/80 backdrop-blur-xs text-white">
              {getConditionBadge(property.condition)}
            </span>
          </div>

          {property.featured && (
            <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span>Featured</span>
            </div>
          )}

          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
            {property.id}
          </div>
        </div>

        {/* Content column */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-slate-500">
              <span className="font-semibold text-amber-700">{getCategoryBadge(property.type)}</span>
              <span className="text-slate-400">ID: {property.id}</span>
            </div>

            <h3 
              onClick={() => onSelect(property.id)}
              className="text-lg font-bold text-slate-900 hover:text-amber-700 transition-colors cursor-pointer mb-2 line-clamp-1"
            >
              {property.title}
            </h3>

            <div className="flex items-center gap-1.5 text-slate-600 text-xs mb-3">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{property.locality}, {property.city}</span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
              {property.description}
            </p>

            {/* Spec chips */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1 font-medium">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.area}</span>
              </div>
              {isResidential && property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}
              {isResidential && property.bathrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & action row */}
          <div className="mt-4 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                {property.purpose === 'rent' ? 'Monthly Rent' : 'Demand Price'}
              </span>
              <span className="text-xl font-extrabold text-slate-900 font-display">
                {formatPKR(property.price, property.purpose)}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                title="Inquire on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => onSelect(property.id)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View (Default)
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group h-full">
      {/* Property Image Container */}
      <div 
        className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden cursor-pointer"
        onClick={() => onSelect(property.id)}
      >
        <img
          src={imgSrc}
          alt={property.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className={`px-2.5 py-1 text-xs font-bold rounded uppercase tracking-wider shadow-sm ${
            property.purpose === 'sale' 
              ? 'bg-amber-500 text-slate-950 font-bold' 
              : property.purpose === 'rent'
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white'
          }`}>
            {property.purpose === 'sale' ? 'For Sale' : property.purpose === 'rent' ? 'For Rent' : 'For Lease'}
          </span>
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-900/80 backdrop-blur-xs text-white">
            {getConditionBadge(property.condition)}
          </span>
        </div>

        {property.featured && (
          <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 fill-slate-950" />
            <span>Featured</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
          {property.id}
        </div>

        {property.isDemo && (
          <div className="absolute bottom-3 right-3 bg-amber-400/90 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-semibold">
            Demo Listing
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & City */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-amber-700">{getCategoryBadge(property.type)}</span>
            <span className="text-slate-400 font-mono text-[11px]">{property.locality}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property.id)}
            className="text-base font-bold text-slate-900 hover:text-amber-700 transition-colors cursor-pointer mb-1.5 line-clamp-1"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Locality & City */}
          <div className="flex items-center gap-1.5 text-slate-600 text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </div>

          {/* Features spec bar */}
          <div className="flex items-center gap-3 text-xs text-slate-600 py-2.5 border-y border-slate-100 mb-3">
            <div className="flex items-center gap-1 font-medium">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.area}</span>
            </div>
            {isResidential && property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bedrooms} Bed</span>
              </div>
            )}
            {isResidential && property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Price & Action Buttons */}
        <div>
          <div className="mb-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              {property.purpose === 'rent' ? 'Monthly Rent' : 'Sale Demand'}
            </span>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
              {formatPKR(property.price, property.purpose)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => onSelect(property.id)}
              className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
