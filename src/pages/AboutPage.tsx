import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Compass, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutPageProps {
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>About ZameenVista</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display mb-4">
            Shaping Modern Property Transactions Across Pakistan
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            ZameenVista is a dedicated real estate platform concept built to bring institutional-grade transparency, clear Pakistani Rupee (PKR) valuations, and direct coordination to buyers, tenants, and developers in Pakistan.
          </p>
        </div>

        {/* Core Pillars Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 font-display">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To eliminate misrepresentation and deceptive pricing in the Pakistani property market by delivering verified dimensional records (Marla/Kanal) and direct owner/advisor links.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 font-display">Our Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To serve as the preferred digital real estate gateway for domestic citizens and overseas Pakistanis seeking high-yield residential sanctuaries and commercial developments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 font-display">Market Transparency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accurate categorization of sale demands versus monthly rental yields, ensuring buyers never encounter hidden commissions or inflated transfer estimations.
            </p>
          </div>
        </div>

        {/* Services Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-xs mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900 font-display">What We Do</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              End-to-end real estate navigation designed specifically for the Pakistani regulatory and land registry landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                01
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Residential House Sales</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connecting buyers with brand new and pre-owned designer homes in premier societies like DHA Lahore, Bahria Town, and CDA sectors in Islamabad.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                02
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Executive & Family Rentals</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Curated furnished and unfurnished residences, high-rise apartments, and corporate accommodation with documented lease contracts.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                03
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Plot Land Acquisitions</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Assistance with possession-ready 5 Marla, 10 Marla, and 1 Kanal residential plots and commercial strips with verified development authority balloting.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                04
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Commercial Real Estate Advisory</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Corporate office floors, high-footfall retail shops in Liberty and Blue Area, and high-yield commercial plaza investments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Concept Clarification Notice */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-12">
          <h4 className="font-bold text-amber-950 mb-1 text-sm">Platform Concept & Demonstration Notice</h4>
          <p className="leading-relaxed">
            ZameenVista is developed as a showcase real estate portal architecture. All property data, sample agent profiles, customer reviews, and pricing metrics are demonstration assets. Prior to real-world commercial launch, legal entities, verified corporate registrations, and localized brokerage licensing may be configured through the administrative control panel.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Get in Touch with our Advisory Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
