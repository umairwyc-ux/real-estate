import React from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ShieldCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  onNavigate: (path: string, params?: Record<string, any>) => void;
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  const currentYear = new Date().getFullYear();

  const handleNav = (path: string, params?: Record<string, any>) => {
    onNavigate(path, params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Overview (Spans 2 on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white font-display">Zameen<span className="text-amber-400">Vista</span></span>
                <p className="text-[11px] tracking-wider uppercase text-amber-400/90 font-medium">Your Property. Your Future.</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {settings?.footerAbout || 
                'Pakistan’s modern real estate platform connecting buyers, investors, and tenants with verified high-yield residential and commercial opportunities across Lahore, Islamabad, Karachi, Rawalpindi, and Peshawar.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a 
                href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=${encodeURIComponent('Hello ZameenVista! I need assistance with a property.')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Advisor</span>
              </a>

              <button
                onClick={() => handleNav('/contact')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Direct Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 2: Quick Property Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Property Portfolios</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => handleNav('/buy')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Properties for Sale
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/rent')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Rental Properties
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/new-houses')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Brand New Houses
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/used-houses')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Pre-Owned Houses
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/plots')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Residential & Commercial Plots
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/commercial')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Commercial Plazas & Shops
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Prime Pakistani Cities */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Prime Cities</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => handleNav('/properties', { city: 'Lahore' })} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-between w-full">
                  <span>Lahore</span>
                  <span className="text-xs text-slate-500">DHA, Bahria</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/properties', { city: 'Islamabad' })} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-between w-full">
                  <span>Islamabad</span>
                  <span className="text-xs text-slate-500">F-11, F-7, DHA</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/properties', { city: 'Karachi' })} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-between w-full">
                  <span>Karachi</span>
                  <span className="text-xs text-slate-500">Clifton, DHA</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/properties', { city: 'Rawalpindi' })} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-between w-full">
                  <span>Rawalpindi</span>
                  <span className="text-xs text-slate-500">Bahria Ph 8</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/properties', { city: 'Peshawar' })} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-between w-full">
                  <span>Peshawar</span>
                  <span className="text-xs text-slate-500">Hayatabad</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Contact & Office</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  {settings?.businessAddress || 'Floor 4, Vista Commercial Tower, MM Alam Road, Gulberg III, Lahore, Pakistan'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings?.contactPhone || '+924235789000'}`} className="hover:text-white transition-colors text-xs">
                  {settings?.contactPhone || '+92 42 3578 9000'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings?.contactEmail || 'info@zameenvista.com'}`} className="hover:text-white transition-colors text-xs">
                  {settings?.contactEmail || 'info@zameenvista.com'}
                </a>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => handleNav('/submit')}
                  className="w-full text-center py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Advertise Your Property
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Demo Notice Banner */}
        <div className="mt-12 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Demonstration Platform
            </span>
            <span>All property listings, specifications, and prices are demonstration records designed for evaluation.</span>
          </div>
          <button 
            onClick={() => handleNav('/about')}
            className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Learn about platform concept</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} ZameenVista Real Estate Portal. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => handleNav('/privacy')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('/terms')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Terms & Conditions
            </button>
            <button onClick={() => handleNav('/about')} className="hover:text-slate-300 transition-colors cursor-pointer">
              About Us
            </button>
            <button onClick={() => handleNav('/contact')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Contact
            </button>
            <button 
              onClick={() => handleNav('/admin/login')} 
              className="hover:text-amber-400 transition-colors cursor-pointer inline-flex items-center gap-1 text-slate-400"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
