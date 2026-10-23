import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  Search, 
  SlidersHorizontal, 
  X,
  ChevronDown,
  Building2,
  Sparkles
} from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { PropertyCard } from '../components/PropertyCard';

interface PropertiesPageProps {
  properties: Property[];
  settings?: SiteSettings;
  initialFilters?: {
    purpose?: string;
    type?: string;
    condition?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    featured?: string;
  };
  pageTitle?: string;
  pageSubtitle?: string;
  onSelectProperty: (id: string) => void;
  onNavigate: (path: string, params?: Record<string, any>) => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  properties,
  settings,
  initialFilters = {},
  pageTitle = 'All Property Listings in Pakistan',
  pageSubtitle = 'Explore verified houses, plots, apartments, and commercial projects.',
  onSelectProperty,
  onNavigate
}) => {
  // Filter states
  const [keyword, setKeyword] = useState('');
  const [purpose, setPurpose] = useState<string>(initialFilters.purpose || 'all');
  const [city, setCity] = useState<string>(initialFilters.city || 'all');
  const [type, setType] = useState<string>(initialFilters.type || 'all');
  const [condition, setCondition] = useState<string>(initialFilters.condition || 'all');
  const [minPrice, setMinPrice] = useState<string>(initialFilters.minPrice ? String(initialFilters.minPrice) : '');
  const [maxPrice, setMaxPrice] = useState<string>(initialFilters.maxPrice ? String(initialFilters.maxPrice) : '');
  const [bedrooms, setBedrooms] = useState<string>(initialFilters.bedrooms ? String(initialFilters.bedrooms) : 'all');
  const [bathrooms, setBathrooms] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(12);

  const resetFilters = () => {
    setKeyword('');
    setPurpose('all');
    setCity('all');
    setType('all');
    setCondition('all');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('all');
    setBathrooms('all');
    setSortBy('newest');
    setVisibleCount(12);
  };

  // Filter & sort logic
  const filtered = useMemo(() => {
    return properties.filter((prop) => {
      // Keyword
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        const matchTitle = prop.title.toLowerCase().includes(q);
        const matchLoc = prop.locality.toLowerCase().includes(q);
        const matchCity = prop.city.toLowerCase().includes(q);
        const matchDesc = prop.description.toLowerCase().includes(q);
        const matchId = prop.id.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchCity && !matchDesc && !matchId) {
          return false;
        }
      }

      // Purpose
      if (purpose !== 'all' && prop.purpose !== purpose) return false;

      // City
      if (city !== 'all' && prop.city.toLowerCase() !== city.toLowerCase()) return false;

      // Type
      if (type !== 'all' && prop.type !== type) return false;

      // Condition
      if (condition !== 'all' && prop.condition !== condition) return false;

      // Min Price
      if (minPrice && Number(minPrice) > 0 && prop.price < Number(minPrice)) return false;

      // Max Price
      if (maxPrice && Number(maxPrice) > 0 && prop.price > Number(maxPrice)) return false;

      // Bedrooms
      if (bedrooms !== 'all' && prop.bedrooms < Number(bedrooms)) return false;

      // Bathrooms
      if (bathrooms !== 'all' && prop.bathrooms < Number(bathrooms)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [properties, keyword, purpose, city, type, condition, minPrice, maxPrice, bedrooms, bathrooms, sortBy]);

  const displayed = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Title & Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <button onClick={() => onNavigate('/')} className="hover:text-amber-700 cursor-pointer">Home</button>
            <span>/</span>
            <span className="text-slate-800 font-medium">Properties Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">{pageTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{pageSubtitle}</p>
        </div>

        {/* Top Controls Bar: Search Keyword + View Modes + Sort */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by society, DHA phase, title, or ID (e.g. ZV-1001)..."
              className="w-full h-10 pl-9 pr-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 px-3 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Grid / List View Toggles */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Property Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <span>Filter Listings</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Purpose</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPurpose('all')}
                    className={`py-1.5 rounded-md cursor-pointer ${purpose === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose('sale')}
                    className={`py-1.5 rounded-md cursor-pointer ${purpose === 'sale' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose('rent')}
                    className={`py-1.5 rounded-md cursor-pointer ${purpose === 'rent' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
                  >
                    Rent
                  </button>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">All Pakistani Cities</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Peshawar">Peshawar</option>
                </select>
              </div>

              {/* Property Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Property Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="house">Houses</option>
                  <option value="villa">Luxury Villas</option>
                  <option value="apartment">Apartments & Flats</option>
                  <option value="plot-residential">Residential Plots</option>
                  <option value="plot-commercial">Commercial Plots</option>
                  <option value="shop">Shops</option>
                  <option value="office">Offices</option>
                  <option value="agriculture">Agricultural Land</option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">Any Condition</option>
                  <option value="brand-new">Brand New</option>
                  <option value="under-construction">Under Construction</option>
                  <option value="used">Pre-Owned / Used</option>
                </select>
              </div>

              {/* Min & Max Price */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Price Range (PKR)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full h-9 px-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full h-9 px-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">Any Bedrooms</option>
                  <option value="1">1+ Bedroom</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Bathrooms</label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">Any Bathrooms</option>
                  <option value="1">1+ Bathroom</option>
                  <option value="2">2+ Bathrooms</option>
                  <option value="3">3+ Bathrooms</option>
                  <option value="4">4+ Bathrooms</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Listings Grid / List Column */}
          <main className="lg:col-span-3">
            {/* Results count banner */}
            <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
              <span>
                Showing <strong className="text-slate-900">{displayed.length}</strong> of <strong className="text-slate-900">{filtered.length}</strong> properties
              </span>
              {(purpose !== 'all' || city !== 'all' || type !== 'all' || condition !== 'all' || keyword) && (
                <button
                  onClick={resetFilters}
                  className="text-amber-700 hover:underline font-semibold cursor-pointer"
                >
                  Clear active filters
                </button>
              )}
            </div>

            {/* List or Grid render */}
            {displayed.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {displayed.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onSelect={onSelectProperty}
                    whatsappNumber={settings?.whatsappNumber}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 font-display">No Properties Match Your Search</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                  We couldn't find any listings matching your specific criteria. Try loosening your price filters or searching for another city like Lahore or Islamabad.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Load More Button */}
            {visibleCount < filtered.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Load More Properties ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-base">Filter Properties</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300"
              >
                <option value="all">All</option>
                <option value="sale">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300"
              >
                <option value="all">All Cities</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Karachi">Karachi</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Peshawar">Peshawar</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300"
              >
                <option value="all">All Types</option>
                <option value="house">Houses</option>
                <option value="villa">Villas</option>
                <option value="apartment">Apartments</option>
                <option value="plot-residential">Plots</option>
                <option value="shop">Shops</option>
                <option value="office">Offices</option>
              </select>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
