import { PropertyPurpose } from '../types';

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
