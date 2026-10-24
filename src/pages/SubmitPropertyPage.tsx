import React, { useState } from 'react';
import { 
  PlusCircle, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Upload, 
  AlertCircle 
} from 'lucide-react';
import { PropertyPurpose, PropertyType, PropertyCondition } from '../types';
import { api } from '../services/api';
import { ImageGalleryUploader } from '../components/ImageGalleryUploader';

interface SubmitPropertyPageProps {
  onNavigate: (path: string) => void;
}

export const SubmitPropertyPage: React.FC<SubmitPropertyPageProps> = ({ onNavigate }) => {
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [type, setType] = useState<PropertyType>('house');
  const [condition, setCondition] = useState<PropertyCondition>('brand-new');
  const [city, setCity] = useState('Lahore');
  const [locality, setLocality] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('10 Marla');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('Please agree to the submission terms.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.submitProperty({
        ownerName,
        phone,
        email,
        title,
        purpose,
        type,
        condition,
        city,
        locality,
        price: Number(price),
        area,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        description,
        images: images.length > 0 ? images : []
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please check the fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 max-w-lg text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">Property Submitted for Review!</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            Thank you, <strong>{ownerName}</strong>. Your listing has been securely recorded in our database under <strong>Pending Review</strong> status. Our verification desk will review your listing before public publishing.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1 mb-6">
            <div><strong className="text-slate-800">Property:</strong> {title}</div>
            <div><strong className="text-slate-800">Location:</strong> {locality}, {city}</div>
            <div><strong className="text-slate-800">Status:</strong> Pending Admin Verification</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setSuccess(false);
                setTitle('');
                setPrice('');
                setLocality('');
                setDescription('');
                setImages([]);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Submit Another Property
            </button>
            <button
              onClick={() => onNavigate('/properties')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              Browse Public Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold mb-3">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Free Property Submission</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            List Your Property on ZameenVista
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2">
            Reach thousands of serious buyers, investors, and tenants across Pakistan and overseas. Submissions are reviewed by our team before going live.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Owner Details */}
            <div className="pb-6 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                1. Advertiser / Owner Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Property Overview */}
            <div className="pb-6 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                2. Property Specifications
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brand New 10 Marla Luxury Designer House"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose *</label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value as any)}
                      className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                      <option value="lease">For Lease</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="house">House</option>
                      <option value="villa">Luxury Villa</option>
                      <option value="apartment">Apartment / Flat</option>
                      <option value="plot-residential">Residential Plot</option>
                      <option value="plot-commercial">Commercial Plot</option>
                      <option value="shop">Commercial Shop</option>
                      <option value="office">Corporate Office</option>
                      <option value="agriculture">Agricultural Land</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Condition *</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="brand-new">Brand New</option>
                      <option value="under-construction">Under Construction</option>
                      <option value="used">Used / Pre-Owned</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Peshawar">Peshawar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Locality / Sector / Society *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DHA Phase 6, Sector K"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {purpose === 'rent' ? 'Monthly Rent (PKR) *' : 'Demand Price (PKR) *'}
                    </label>
                    <input
                      type="number"
                      required
                      placeholder={purpose === 'rent' ? 'e.g. 85000' : 'e.g. 25000000'}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {price && Number(price) >= 10000000 ? `~ ${(Number(price) / 10000000).toFixed(2)} Crore PKR` : ''}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Land / Floor Area *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5 Marla, 10 Marla, 1 Kanal"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  {['house', 'apartment', 'villa'].includes(type) && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                        <input
                          type="number"
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                        <input
                          type="number"
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe key features, flooring, layout, nearby amenities..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div>
                  <ImageGalleryUploader
                    images={images}
                    onChange={setImages}
                    multiple={true}
                    maxImages={8}
                    label="Property Photos (From Gallery / Photos)"
                    description="Upload high-quality photos from your device gallery. The first photo will be used as the cover showcase."
                    propertyType={type}
                  />
                </div>

              </div>
            </div>

            {/* Terms Consent */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                />
                <span>
                  I confirm that I am the authorized owner or agent of this property and the provided details (price, dimensions, and location) are accurate to the best of my knowledge. I understand that listings require admin verification before publication.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              {loading ? 'Submitting Property Details...' : 'Submit Property for Verification'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};
