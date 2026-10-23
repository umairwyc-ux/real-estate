import React from 'react';
import { Home, Search, ArrowRight, Building2 } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 text-center shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="text-4xl font-extrabold text-slate-900 font-display mb-2">404</div>
        <h1 className="text-lg font-bold text-slate-800 mb-2">Page or Property Not Found</h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          The real estate page or property ID you requested might have been relocated, sold, or expired.
        </p>

        <div className="space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to ZameenVista Home</span>
          </button>

          <button
            onClick={() => onNavigate('/properties')}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-amber-600" />
            <span>Search All Properties</span>
          </button>
        </div>
      </div>
    </div>
  );
};
