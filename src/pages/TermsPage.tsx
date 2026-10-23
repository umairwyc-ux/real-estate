import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
            <FileText className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl font-bold text-slate-900 font-display">Terms and Conditions</h1>
          </div>

          <p className="text-slate-500 italic">Effective: October 2026 · ZameenVista Real Estate Portal</p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display">1. Property Listings & Accuracy</h2>
            <p>
              ZameenVista acts as an informational real estate showcase and lead exchange. While our administration conducts reviews of submitted properties, users are solely responsible for conducting physical on-site inspections, verifying ownership registries with relevant land revenue authorities (such as Patwari, LDA, CDA, KDA, or DHA), and verifying no-objection certificates (NOC).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display">2. No Guarantee of Transaction or Token Security</h2>
            <p>
              ZameenVista does not hold escrow, collect earnest token deposits, or guarantee property deed transfers. All sales and lease negotiations are concluded directly between legal owners, prospective buyers, and authorized licensed agents.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display">3. Submission Standards & Verification</h2>
            <p>
              Users submitting properties warrant that they have legal authority to advertise the specified property. The administration reserves the sole right to decline, modify, or remove any submission containing inaccurate pricing or invalid contact information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display">4. Intellectual Property & Brand Rights</h2>
            <p>
              The ZameenVista wordmark, layout, logos, visual assets, and application software are the proprietary property of the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
