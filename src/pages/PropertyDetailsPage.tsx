import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Share2, 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ExternalLink,
  Images,
  Home,
  AlertCircle
} from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { 
  formatPKR, 
  generateWhatsAppLink, 
  getCategoryBadge, 
  getConditionBadge, 
  normalizeImageUrl, 
  getCategoryFallback,
  DEFAULT_HOUSE_IMAGE, 
  DEFAULT_FALLBACK_IMAGE 
} from '../utils/formatters';
import { PropertyCard } from '../components/PropertyCard';
import { ImageLightbox } from '../components/ImageLightbox';
import { api } from '../services/api';

interface PropertyDetailsPageProps {
  propertyId: string;
  settings?: SiteSettings;
  onNavigate: (path: string, params?: Record<string, any>) => void;
  onSelectProperty: (id: string) => void;
}

export const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({
  propertyId,
  settings,
  onNavigate,
  onSelectProperty
}) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery & Lightbox
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Inquiry Form
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Share link copy
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.getProperty(propertyId)
      .then((res) => {
        if (!isMounted) return;
        setProperty(res.data);
        setSimilar(res.similar || []);
        setActiveImageIndex(0);
        setInquiryMessage(`I am interested in this property "${res.data.title}" (ID: ${res.data.id}). Please contact me regarding scheduling a viewing.`);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Property not found');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [propertyId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setInquirySubmitting(true);
    setInquiryError('');

    try {
      await api.submitInquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        inquiryType: property.purpose === 'rent' ? 'rent' : 'buy',
        message: inquiryMessage
      });
      setInquirySuccess(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
    } catch (err: any) {
      setInquiryError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setInquirySubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center shadow-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2 font-display">Property Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">{error || 'This listing may have been removed or sold.'}</p>
          <button
            onClick={() => onNavigate('/properties')}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Back to All Properties
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = property.images && property.images.length > 0
    ? property.images.map(img => normalizeImageUrl(img, property.type))
    : [normalizeImageUrl('', property.type)];

  const waLink = generateWhatsAppLink(
    property.contactWhatsapp || settings?.whatsappNumber || '923001234567',
    property.title,
    property.id
  );

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.locality}, ${property.city}, Pakistan`)}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => onNavigate('/properties')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-700 uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Property Listings</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{copied ? 'Link Copied!' : 'Share Listing'}</span>
            </button>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

        {/* Property Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded uppercase tracking-wider ${
                  property.purpose === 'sale'
                    ? 'bg-amber-500 text-slate-950'
                    : property.purpose === 'rent'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 text-white'
                }`}>
                  {property.purpose === 'sale' ? 'For Sale' : property.purpose === 'rent' ? 'For Rent' : 'For Lease'}
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-900 text-white">
                  {getConditionBadge(property.condition)}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium rounded bg-slate-100 text-slate-700">
                  {getCategoryBadge(property.type)}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono text-slate-500 bg-slate-100 rounded">
                  ID: {property.id}
                </span>
                {property.isDemo && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 rounded">
                    Demo Property Record
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
                {property.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{property.locality}, {property.city}, Pakistan</span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-700 hover:underline font-semibold"
                >
                  <span>Open on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Price Box */}
            <div className="lg:text-right w-full lg:w-auto p-4 lg:p-0 bg-slate-50 lg:bg-transparent rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {property.purpose === 'rent' ? 'Monthly Rental Demand' : 'Sale Demand Price'}
              </span>
              <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
                {formatPKR(property.price, property.purpose)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {property.area} · {property.areaSqFt ? `${property.areaSqFt} Sq. Ft.` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Featured Photo */}
            <div 
              className="lg:col-span-2 relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group shadow-sm"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={galleryImages[activeImageIndex]}
                alt={property.title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallback = getCategoryFallback(property.type);
                  if (target.src !== fallback) {
                    target.src = fallback;
                  } else {
                    target.src = DEFAULT_FALLBACK_IMAGE;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                  <Images className="w-4 h-4 text-amber-400" />
                  Click to open full photo lightbox ({galleryImages.length} images)
                </span>
              </div>
            </div>

            {/* Side Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-1 min-w-[120px] lg:min-w-0 aspect-16/10 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    idx === activeImageIndex ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt="thumbnail" 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = DEFAULT_FALLBACK_IMAGE;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications, Description & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Specs Grid */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Property Specifications
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <span className="text-slate-400 text-xs block mb-1">Land / Floor Area</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                    <Maximize2 className="w-4 h-4 text-amber-600" />
                    <span>{property.area}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{property.areaSqFt} Sq. Ft.</span>
                </div>

                {['house', 'apartment', 'villa'].includes(property.type) && (
                  <>
                    <div>
                      <span className="text-slate-400 text-xs block mb-1">Bedrooms</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                        <Bed className="w-4 h-4 text-amber-600" />
                        <span>{property.bedrooms || 'Studio'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-xs block mb-1">Bathrooms</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                        <Bath className="w-4 h-4 text-amber-600" />
                        <span>{property.bathrooms || 'N/A'}</span>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <span className="text-slate-400 text-xs block mb-1">Furnishing</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm capitalize">
                    <Home className="w-4 h-4 text-amber-600" />
                    <span>{property.furnishing.replace('-', ' ')}</span>
                  </div>
                </div>

                {property.builtYear && (
                  <div>
                    <span className="text-slate-400 text-xs block mb-1">Year Built</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>{property.builtYear}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 tracking-tight font-display mb-3">
                Property Overview
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features & Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h2 className="text-base font-bold text-slate-900 tracking-tight font-display mb-4">
                  Features & Amenities
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Demo Notice Callout */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">ZameenVista Demo Property Record</strong>
                This listing (ID: {property.id}) is a fictional demonstration property intended to illustrate real estate layout, pricing structures, and specifications for the Pakistani market. Real listings can be added and managed via the Admin Dashboard.
              </div>
            </div>

          </div>

          {/* Right Sidebar: Contact & WhatsApp Form */}
          <div className="space-y-6">
            
            {/* Direct Contact Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md sticky top-24">
              <h3 className="text-base font-bold text-slate-900 tracking-tight font-display mb-1">
                Direct Property Advisor
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Connect directly regarding viewing schedules, token protocol, and verification documents.
              </p>

              {/* Direct WhatsApp Button */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm mb-3"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat via WhatsApp</span>
              </a>

              {/* Direct Call Button */}
              <a
                href={`tel:${property.contactPhone || settings?.contactPhone || '+924235789000'}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs transition-colors mb-6"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>{property.contactPhone || settings?.contactPhone || '+92 42 3578 9000'}</span>
              </a>

              {/* Inquiry Form */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-3">Send Official Inquiry</h4>

                {inquirySuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    <p className="font-bold mb-1">Inquiry Sent Successfully!</p>
                    <p>Our dedicated advisor will reach you via phone/WhatsApp within 2 hours.</p>
                    <button
                      onClick={() => setInquirySuccess(false)}
                      className="mt-3 text-emerald-900 font-semibold underline"
                    >
                      Send another note
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    {inquiryError && (
                      <div className="p-2 rounded bg-rose-50 text-rose-700 text-[11px]">
                        {inquiryError}
                      </div>
                    )}

                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name *"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email Address *"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone / WhatsApp Number *"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>

                    <div>
                      <textarea
                        required
                        rows={3}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={inquirySubmitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {inquirySubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Similar Properties Section */}
        {similar.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                  Similar Properties in {property.city}
                </h3>
                <p className="text-xs text-slate-500">Other recommended listings in proximity.</p>
              </div>

              <button
                onClick={() => onNavigate('/properties', { city: property.city })}
                className="text-xs font-bold text-amber-700 hover:underline uppercase tracking-wider cursor-pointer"
              >
                View all in {property.city}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((sim) => (
                <PropertyCard
                  key={sim.id}
                  property={sim}
                  onSelect={onSelectProperty}
                  whatsappNumber={settings?.whatsappNumber}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        images={galleryImages}
        initialIndex={activeImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={property.title}
      />
    </div>
  );
};
