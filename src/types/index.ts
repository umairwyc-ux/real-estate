export type PropertyPurpose = 'sale' | 'rent' | 'lease';

export type PropertyType = 
  | 'house' 
  | 'apartment' 
  | 'plot-residential' 
  | 'plot-commercial' 
  | 'shop' 
  | 'office' 
  | 'villa' 
  | 'agriculture';

export type PropertyCondition = 'brand-new' | 'under-construction' | 'used';

export type PropertyStatus = 'available' | 'sold' | 'rented' | 'inactive';

export type FurnishingStatus = 'unfurnished' | 'semi-furnished' | 'fully-furnished';

export interface Property {
  id: string;
  title: string;
  slug: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  condition: PropertyCondition;
  price: number; // in PKR
  priceFormatted?: string;
  city: string;
  locality: string;
  address?: string;
  area: string; // e.g. "10 Marla", "1 Kanal", "5 Marla"
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  status: PropertyStatus;
  furnishing: FurnishingStatus;
  builtYear?: number;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertySubmission {
  id: string;
  ownerName: string;
  phone: string;
  email: string;
  title: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  condition: PropertyCondition;
  city: string;
  locality: string;
  price: number;
  area: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: 'buy' | 'rent' | 'general' | 'viewing' | 'valuation';
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  logoUrl: string;
  contactPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  businessAddress: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroImageUrl: string;
  socials: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  footerAbout: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  content: string;
  propertyBought: string;
  isDemo: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'editor';
}

export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  rentedProperties: number;
  pendingSubmissions: number;
  newInquiries: number;
}
