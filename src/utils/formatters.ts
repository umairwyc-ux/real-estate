import { PropertyPurpose } from '../types';
import { 
  BUNDLED_IMAGES, 
  CDN_FALLBACK_IMAGES, 
  INLINE_PROPERTY_SVG 
} from '../assets/images';

export function formatPKR(price: number, purpose: PropertyPurpose = 'sale'): string {
  if (isNaN(price) || price === 0) return 'Price on Demand';

  if (purpose === 'rent' || purpose === 'lease') {
    if (price >= 10000000) {
      return `PKR ${(price / 10000000).toFixed(2).replace(/\.00$/, '')} Crore/mo`;
    }
    if (price >= 100000) {
      return `PKR ${(price / 100000).toFixed(2).replace(/\.00$/, '')} Lakh/mo`;
    }
    return `PKR ${price.toLocaleString('en-PK')}/mo`;
  }

  // Sale prices
  if (price >= 10000000) {
    const val = (price / 10000000).toFixed(2).replace(/\.00$/, '');
    return `PKR ${val} Crore`;
  }
  if (price >= 100000) {
    const val = (price / 100000).toFixed(2).replace(/\.00$/, '');
    return `PKR ${val} Lakh`;
  }

  return `PKR ${price.toLocaleString('en-PK')}`;
}

export function formatNumberPK(num: number): string {
  return num.toLocaleString('en-PK');
}

export function getCleanPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function generateWhatsAppLink(
  whatsappNumber: string,
  propertyTitle?: string,
  propertyId?: string
): string {
  const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
  let text = `Hello ZameenVista! I am interested in property listings.`;

  if (propertyTitle && propertyId) {
    text = `Hello ZameenVista! I am inquiring about property "${propertyTitle}" (ID: ${propertyId}). Please share more details and arrange a site inspection.`;
  } else if (propertyTitle) {
    text = `Hello ZameenVista! I am inquiring about "${propertyTitle}". Please share more details.`;
  }

  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
}

export function getCategoryBadge(type: string): string {
  switch (type) {
    case 'house': return 'House';
    case 'apartment': return 'Apartment';
    case 'plot-residential': return 'Residential Plot';
    case 'plot-commercial': return 'Commercial Plot';
    case 'shop': return 'Shop';
    case 'office': return 'Office';
    case 'villa': return 'Luxury Villa';
    case 'agriculture': return 'Agricultural Land';
    default: return type;
  }
}

export function getConditionBadge(cond: string): string {
  switch (cond) {
    case 'brand-new': return 'Brand New';
    case 'under-construction': return 'Under Construction';
    case 'used': return 'Pre-Owned';
    default: return cond;
  }
}

export const DEFAULT_FALLBACK_IMAGE = INLINE_PROPERTY_SVG;
export const DEFAULT_HOUSE_IMAGE = BUNDLED_IMAGES.house;
export const DEFAULT_HERO_IMAGE = BUNDLED_IMAGES.hero;

/**
 * Returns a high-reliability category fallback image
 */
export function getCategoryFallback(type?: string): string {
  if (!type) return CDN_FALLBACK_IMAGES.house;
  const key = type.toLowerCase();
  if (key.includes('villa')) return CDN_FALLBACK_IMAGES.villa;
  if (key.includes('apartment') || key.includes('flat')) return CDN_FALLBACK_IMAGES.apartment;
  if (key.includes('plot')) return CDN_FALLBACK_IMAGES.plot;
  if (key.includes('commercial')) return CDN_FALLBACK_IMAGES.commercial;
  if (key.includes('shop')) return CDN_FALLBACK_IMAGES.shop;
  if (key.includes('office')) return CDN_FALLBACK_IMAGES.office;
  return CDN_FALLBACK_IMAGES.house;
}

/**
 * Normalizes property image URLs:
 * - Maps local asset names to bundled Vite imports (ensuring assets are bundled into dist/assets with hashes)
 * - Retains valid external URLs (HTTPS)
 * - Returns category-aware fallback for missing or empty images
 */
export function normalizeImageUrl(url?: string, propertyType?: string | unknown): string {
  const typeStr = typeof propertyType === 'string' ? propertyType : undefined;

  if (!url || typeof url !== 'string' || !url.trim()) {
    if (typeStr) {
      const pt = typeStr.toLowerCase();
      if (pt.includes('villa')) return BUNDLED_IMAGES.hero;
      if (pt.includes('apartment')) return BUNDLED_IMAGES.apartment;
      if (pt.includes('commercial')) return BUNDLED_IMAGES.commercial;
      return BUNDLED_IMAGES.house;
    }
    return BUNDLED_IMAGES.house;
  }

  const trimmed = url.trim();

  // If already an external URL or data URI, return directly
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Map known image references to bundled Vite assets (hash-bundled into dist/assets)
  const lower = trimmed.toLowerCase();
  if (lower.includes('hero_luxury_villa')) {
    return BUNDLED_IMAGES.hero;
  }
  if (lower.includes('house_dha') || lower.includes('contemporary')) {
    return BUNDLED_IMAGES.house;
  }
  if (lower.includes('apartment_luxury_tower') || lower.includes('apartment')) {
    return BUNDLED_IMAGES.apartment;
  }
  if (lower.includes('commercial_plaza_modern') || lower.includes('commercial')) {
    return BUNDLED_IMAGES.commercial;
  }

  // Transform legacy src paths if present
  if (trimmed.startsWith('/src/assets/images/')) {
    return trimmed.replace('/src/assets/images/', '/images/');
  }
  if (trimmed.startsWith('src/assets/images/')) {
    return '/' + trimmed.replace('src/assets/images/', 'images/');
  }

  return trimmed;
}

