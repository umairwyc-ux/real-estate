import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Building, 
  ShieldCheck, 
  Clock, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle, 
  Send,
  Home as HomeIcon,
  BadgePercent,
  Check
} from 'lucide-react';
import { Property, SiteSettings, Testimonial } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { normalizeImageUrl, DEFAULT_HERO_IMAGE } from '../utils/formatters';

interface HomePageProps {
  properties: Property[];
  settings?: SiteSettings;
  testimonials?: Testimonial[];
  onNavigate: (path: string, params?: Record<string, any>) => void;
  onSelectProperty: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  settings,
  testimonials = [],
  onNavigate,
  onSelectProperty
}) => {
  // Search state
  const [purpose, setPurpose] = useState<'sale' | 'rent'>('sale');
  const [city, setCity] = useState('all');
  const [type, setType] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('all');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, any> = {
      purpose,
      city: city !== 'all' ? city : undefined,
      type: type !== 'all' ? type : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms !== 'all' ? Number(bedrooms) : undefined,
    };
    onNavigate('/properties', params);
  };

  // Filtered collections from real data
  const featuredProperties = properties.filter(p => p.featured).slice(0, 4);
  const newlyBuiltHouses = properties.filter(p => (p.type === 'house' || p.type === 'villa') && p.condition === 'brand-new' && p.purpose === 'sale').slice(0, 4);
  const usedHouses = properties.filter(p => (p.type === 'house' || p.type === 'villa') && p.condition === 'used' && p.purpose === 'sale').slice(0, 4);
  const rentalHouses = properties.filter(p => (p.type === 'house' || p.type === 'villa') && p.purpose === 'rent').slice(0, 4);
  const apartments = properties.filter(p => p.type === 'apartment').slice(0, 4);
  const plotsAndCommercial = properties.filter(p => ['plot-residential', 'plot-commercial', 'shop', 'office'].includes(p.type)).slice(0, 4);

  const cities = [
    { name: 'Lahore', count: properties.filter(p => p.city === 'Lahore').length, tagline: 'DHA, Bahria Town, Gulberg' },
    { name: 'Islamabad', count: properties.filter(p => p.city === 'Islamabad').length, tagline: 'Sectors F-11, F-7, G-13' },
    { name: 'Karachi', count: properties.filter(p => p.city === 'Karachi').length, tagline: 'Clifton, DHA Phase 8' },
    { name: 'Rawalpindi', count: properties.filter(p => p.city === 'Rawalpindi').length, tagline: 'Chaklala, Bahria Phase 8' },
    { name: 'Peshawar', count: properties.filter(p => p.city === 'Peshawar').length, tagline: 'Hayatabad, University Town' },
  ];

  const faqs = [
    {
      q: 'How does ZameenVista verify property dimensions in Marla and Kanal?',
      a: 'In Pakistan, standard residential land sizing typically follows the modern 225 sq. ft. per Marla benchmark (especially in DHA, Bahria Town, and modern housing authorities), while older municipal sectors may measure 272 sq. ft. per Marla. We record exact square footage alongside local Marla units on every listing.'
    },
    {
      q: 'How do I schedule an on-site property inspection or viewing?',
      a: 'Every property card and detail page provides an instant WhatsApp Inquiry button and a direct inquiry form. Simply click the WhatsApp link to chat directly with our listing coordinator with the property ID pre-filled.'
    },
    {
      q: 'Are token money and property advance payments handled online?',
      a: 'No. ZameenVista does not solicit online earnest or token money. All monetary settlements occur in person through verified bank pay orders upon title deed inspection and biometric verification with the relevant development authority.'
    },
    {
      q: 'Can overseas Pakistanis list or purchase properties on ZameenVista?',
      a: 'Yes. A substantial portion of our users are overseas Pakistanis in the UAE, UK, North America, and Saudi Arabia. We provide direct digital consultations, verified video tours, and power-of-attorney legal guidance.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-slate-950 text-white min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Vignette Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={normalizeImageUrl(settings?.heroImageUrl) || DEFAULT_HERO_IMAGE}
            alt="Luxury Property in Pakistan"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />
        </div>

        {/* Hero Content & Search Box */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pakistan’s Trusted Property Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight font-display text-balance">
            {settings?.heroHeadline || 'Find Your Perfect Property with ZameenVista'}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            {settings?.heroSubtitle || 'Discover homes, plots, apartments and commercial properties across Pakistan.'}
          </p>

          {/* Search Box Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-900 max-w-4xl mx-auto border border-white/20">
            {/* Purpose Switch: Buy vs Rent */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPurpose('sale')}
                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  purpose === 'sale'
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Buy Property
              </button>
              <button
                type="button"
                onClick={() => setPurpose('rent')}
                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  purpose === 'rent'
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Rent Property
              </button>
            </div>

            {/* Filter Fields Form */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {/* City */}
              <div className="text-left">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Cities (Pakistan)</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Peshawar">Peshawar</option>
                </select>
              </div>

              {/* Property Category */}
              <div className="text-left">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Property Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-11 px-3 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Categories</option>
                  <option value="house">Houses</option>
                  <option value="villa">Luxury Villas</option>
                  <option value="apartment">Apartments & Flats</option>
                  <option value="plot-residential">Residential Plots</option>
                  <option value="plot-commercial">Commercial Plots</option>
                  <option value="shop">Commercial Shops</option>
                  <option value="office">Corporate Offices</option>
                  <option value="agriculture">Agricultural Land</option>
                </select>
              </div>

              {/* Min Price */}
              <div className="text-left">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Min Price (PKR)</label>
                <select
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full h-11 px-3 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Any Min</option>
                  {purpose === 'sale' ? (
                    <>
                      <option value="10000000">1 Crore</option>
                      <option value="20000000">2 Crore</option>
                      <option value="30000000">3 Crore</option>
                      <option value="50000000">5 Crore</option>
                    </>
                  ) : (
                    <>
                      <option value="30000">30,000</option>
                      <option value="50000">50,000</option>
                      <option value="100000">1 Lakh</option>
                      <option value="200000">2 Lakh</option>
                    </>
                  )}
                </select>
              </div>

              {/* Max Price */}
              <div className="text-left">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Max Price (PKR)</label>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-11 px-3 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Any Max</option>
                  {purpose === 'sale' ? (
                    <>
                      <option value="25000000">2.5 Crore</option>
                      <option value="50000000">5 Crore</option>
                      <option value="80000000">8 Crore</option>
                      <option value="150000000">15 Crore+</option>
                    </>
                  ) : (
                    <>
                      <option value="80000">80,000</option>
                      <option value="150000">1.5 Lakh</option>
                      <option value="300000">3 Lakh</option>
                      <option value="500000">5 Lakh+</option>
                    </>
                  )}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="text-left">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full h-11 px-3 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">Any Beds</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                  <option value="4">4+ Beds</option>
                  <option value="5">5+ Beds</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="text-left flex items-end">
                <button
                  type="submit"
                  className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Property</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PROPERTIES ================= */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-700 font-bold mb-1">Handpicked Portfolio</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">Featured Properties</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Exclusive high-demand properties verified by the ZameenVista desk.</p>
          </div>

          <button
            onClick={() => onNavigate('/properties', { featured: 'true' })}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>View All Featured</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={onSelectProperty}
              whatsappNumber={settings?.whatsappNumber}
            />
          ))}
        </div>
      </section>

      {/* ================= POPULAR CITIES IN PAKISTAN ================= */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-display">Prime Pakistani Locations</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Browse residential and commercial real estate across Pakistan’s most sought-after metropolitan hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {cities.map((c) => (
              <button
                key={c.name}
                onClick={() => onNavigate('/properties', { city: c.name })}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-xl p-5 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                    {c.name}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    {c.count} listings
                  </span>
                </div>
                <p className="text-xs text-slate-400">{c.tagline}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore listings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEWLY BUILT HOUSES ================= */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-700 font-bold mb-1">Direct from Builders</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">Brand New Houses</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Newly completed residential homes with modern architecture and imported fittings.</p>
          </div>

          <button
            onClick={() => onNavigate('/new-houses')}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>Explore New Houses</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newlyBuiltHouses.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={onSelectProperty}
              whatsappNumber={settings?.whatsappNumber}
            />
          ))}
        </div>
      </section>

      {/* ================= PRE-OWNED / USED HOUSES ================= */}
      <section className="py-14 sm:py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-700 font-bold mb-1">Established Enclaves</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">Pre-Owned / Used Houses</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Well-maintained family homes in mature sectors with verified registries and full utilities.</p>
            </div>

            <button
              onClick={() => onNavigate('/used-houses')}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Explore Used Houses</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usedHouses.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
                whatsappNumber={settings?.whatsappNumber}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOUSES FOR RENT ================= */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-700 font-bold mb-1">Rental Living</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">Houses for Rent</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Furnished and unfurnished homes ready for executive and family occupancy.</p>
          </div>

          <button
            onClick={() => onNavigate('/rent', { type: 'house' })}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>View Rental Houses</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rentalHouses.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={onSelectProperty}
              whatsappNumber={settings?.whatsappNumber}
            />
          ))}
        </div>
      </section>

      {/* ================= APARTMENTS SECTION ================= */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">Urban Living</div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-display">Apartments & Flats</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">High-rise luxury apartments, penthouses, and studio suites in Gulberg, Clifton, and Islamabad.</p>
            </div>

            <button
              onClick={() => onNavigate('/properties', { type: 'apartment' })}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Browse All Apartments</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {apartments.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
                whatsappNumber={settings?.whatsappNumber}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= RESIDENTIAL PLOTS & COMMERCIAL ================= */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-700 font-bold mb-1">High-Yield Assets</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">Plots & Commercial Plazas</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Prime residential plots, retail showrooms, and grade-A corporate offices across Pakistan.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/plots')}
              className="text-xs font-bold text-slate-700 hover:text-amber-700 uppercase tracking-wider cursor-pointer"
            >
              Plots
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => onNavigate('/commercial')}
              className="text-xs font-bold text-slate-700 hover:text-amber-700 uppercase tracking-wider cursor-pointer"
            >
              Commercial
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plotsAndCommercial.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={onSelectProperty}
              whatsappNumber={settings?.whatsappNumber}
            />
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE ZAMEENVISTA ================= */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-amber-700 font-bold">The ZameenVista Standard</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display mt-1">Why Choose ZameenVista?</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Designed specifically for the Pakistani property ecosystem to eliminate ambiguity and facilitate transparent transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">Strict Verification Standard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every property submission undergoes admin screening for realistic dimensions (Marla/Kanal) and current market price parity before being published.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <BadgePercent className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">Accurate PKR Currency Discipline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict separation between sale prices in Crores/Lakhs and monthly rental yields. Zero deceptive listings or inflated hidden charges.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">Instant WhatsApp Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with property managers via one-tap WhatsApp inquiries pre-filled with property ID, eliminating email delay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider text-amber-700 font-bold">Simplified Process</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display mt-1">How It Works</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Three simple steps to acquiring or leasing property through ZameenVista.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-6 rounded-xl bg-white border border-slate-200 text-center relative">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center mx-auto mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Search & Filter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse houses, plots, and apartments by Pakistani city, sector, Marla size, condition, and budget.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 text-center relative">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center mx-auto mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">WhatsApp / Inquiry</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reach our property desk via WhatsApp with the property ID automatically prefilled for immediate reply.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 text-center relative">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center mx-auto mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Inspect & Secure</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Schedule physical inspection, conduct biometric/registry verification, and finalize deed transfer.
            </p>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Client Perspectives</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-display mt-1">What Buyers Say</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Feedback from buyers, tenants, and overseas investors (Demo illustrative reviews).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((test) => (
                <div key={test.id} className="p-6 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(test.rating)].map((_, i) => (
                        <span key={i} className="text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                      "{test.content}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-750 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{test.name}</div>
                      <div className="text-slate-400 text-[11px]">{test.role} · {test.city}</div>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Demo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-wider text-amber-700 font-bold">Clear Guidance</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Key insights into Pakistani real estate purchases, rentals, and transfers.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:text-amber-700 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${openFaq === idx ? 'rotate-90 text-amber-600' : 'text-slate-400'}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section className="py-14 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 font-display">
            Have a Property to Sell or Lease in Pakistan?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
            Submit your residential house, plot, apartment, or commercial plaza to reach genuine buyers across Pakistan and overseas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/submit')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              Submit Property (Free Listing)
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Talk with Property Advisor
            </button>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER & INQUIRY SUBSCRIPTION ================= */}
      <section className="py-10 bg-slate-100 border-t border-slate-200">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h3 className="text-base font-bold text-slate-900 mb-1">Get Weekly Property Market Alerts</h3>
          <p className="text-xs text-slate-500 mb-4">Receive newly listed properties in DHA, Bahria, and Gulberg directly in your inbox.</p>

          {newsletterSubscribed ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Thank you! You are subscribed to ZameenVista property updates.</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) setNewsletterSubscribed(true);
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg uppercase tracking-wider cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
