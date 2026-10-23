import React, { useState } from 'react';
import { 
  Building2, 
  Menu, 
  X, 
  PlusCircle, 
  ShieldCheck, 
  Phone, 
  MessageCircle,
  Home as HomeIcon,
  Search
} from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string, params?: Record<string, any>) => void;
  settings?: SiteSettings;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  settings,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Properties', path: '/properties' },
    { label: 'Buy', path: '/buy' },
    { label: 'Rent', path: '/rent' },
    { label: 'New Houses', path: '/new-houses' },
    { label: 'Used Houses', path: '/used-houses' },
    { label: 'Plots', path: '/plots' },
    { label: 'Commercial', path: '/commercial' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string, params?: Record<string, any>) => {
    onNavigate(path, params);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top micro bar for direct contact info */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 sm:px-6 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Pakistan’s Premier Property Marketplace
            </span>
            <span className="text-slate-400">PKR Currency</span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href={`tel:${settings?.contactPhone || '+924235789000'}`} 
              className="inline-flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{settings?.contactPhone || '+92 42 3578 9000'}</span>
            </a>
            <a 
              href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=${encodeURIComponent('Hello ZameenVista! I need assistance with a property.')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span className="hidden md:inline">WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Brand Wordmark & Icon */}
          <button 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-sm">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-400 transition-transform group-hover:scale-110" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold tracking-tight text-white font-display">Zameen</span>
                <span className="text-xl font-bold tracking-tight text-amber-400 font-display">Vista</span>
              </div>
              <p className="text-[10px] tracking-wider uppercase text-slate-400 font-medium">Your Property. Your Future.</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-200">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-xs font-semibold ${
                    isActive 
                      ? 'bg-slate-800 text-amber-400 font-bold' 
                      : 'hover:text-amber-300 hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleNavClick('/submit')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm shadow-amber-500/20 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit Property</span>
            </button>

            <button
              onClick={() => handleNavClick(isAdminLoggedIn ? '/admin/dashboard' : '/admin/login')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Admin Control Center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdminLoggedIn ? 'Dashboard' : 'Admin'}</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => handleNavClick('/submit')}
              className="sm:hidden px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 cursor-pointer"
            >
              Submit
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                  currentPath === link.path
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => handleNavClick('/submit')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Property (Free Listing)</span>
            </button>

            <button
              onClick={() => handleNavClick(isAdminLoggedIn ? '/admin/dashboard' : '/admin/login')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isAdminLoggedIn ? 'Go to Admin Dashboard' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
