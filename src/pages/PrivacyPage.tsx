import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-700 uppercase tracking-wider mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-xs space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl font-bold text-slate-900 font-display">Privacy Policy</h1>
          </div>

          <p className="text-slate-500 italic">Last updated: October 2026 · ZameenVista Real Estate Portal</p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display">1. Information We Collect</h2>
            <p>
              When you submit a property listing or submit an inquiry on ZameenVista, we collect information including your name, email address, telephone/WhatsApp number, and property details (city, area, price demands, and descriptions).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display">2. How We Use Collected Data</h2>
            <p>
              Your contact data is used solely to facilitate genuine real estate communications, respond to property viewing inquiries, and enable direct WhatsApp or telephone coordination with listing administrators or verified advisors. We do not sell your personal data to third-party telemarketers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display">3. WhatsApp Direct Communications</h2>
            <p>
              When choosing to initiate an inquiry through WhatsApp, you interact directly through WhatsApp's end-to-end encrypted messaging service governed by WhatsApp's privacy policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display">4. Demonstration Data Notice</h2>
            <p>
              Certain property records, customer reviews, and agency figures published on this demonstration instance are illustrative. Any user desiring removal or modification of submitted inquiries may request immediate database removal via our contact desk.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display">5. Security & Data Protection</h2>
            <p>
              Administrative endpoints are secured via token authorization and salted hashing algorithms. No user passwords or unauthenticated data modifications are permitted.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
