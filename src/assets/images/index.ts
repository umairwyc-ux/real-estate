import heroVilla from './hero_luxury_villa.jpg';
import houseDha from './house_dha_contemporary.jpg';
import apartmentTower from './apartment_luxury_tower.jpg';
import commercialPlaza from './commercial_plaza_modern.jpg';

export const BUNDLED_IMAGES = {
  hero: heroVilla,
  house: houseDha,
  apartment: apartmentTower,
  commercial: commercialPlaza,
};

// Curated high-availability public HTTPS CDN fallbacks for Pakistani property categories
export const CDN_FALLBACK_IMAGES = {
  house: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  plot: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  shop: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
};

// Inline SVG data URI that NEVER fails even with zero network or missing files
export const INLINE_PROPERTY_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <rect x="250" y="240" width="300" height="260" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
  <rect x="280" y="200" width="240" height="40" rx="4" fill="#334155"/>
  <rect x="280" y="270" width="60" height="70" rx="4" fill="#0f172a"/>
  <rect x="370" y="270" width="60" height="70" rx="4" fill="#0f172a"/>
  <rect x="460" y="270" width="60" height="70" rx="4" fill="#0f172a"/>
  <rect x="365" y="440" width="70" height="60" rx="2" fill="url(#gold)"/>
  <circle cx="400" cy="140" r="30" fill="#0f172a" stroke="url(#gold)" stroke-width="3"/>
  <path d="M386 150 L400 128 L414 150 Z" fill="url(#gold)"/>
  <text x="400" y="535" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#f8fafc" text-anchor="middle">ZAMEENVISTA</text>
  <text x="400" y="560" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="#94a3b8" text-anchor="middle">Verified Property Showcase</text>
</svg>
`)}`;
