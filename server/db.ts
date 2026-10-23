import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Property, PropertySubmission, Inquiry, SiteSettings, Testimonial } from '../src/types/index.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface AdminRecord {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'editor';
  salt: string;
  hash: string;
}

export interface SessionRecord {
  token: string;
  adminId: string;
  createdAt: number;
  expiresAt: number;
}

export interface DatabaseSchema {
  properties: Property[];
  submissions: PropertySubmission[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  admins: AdminRecord[];
  sessions: SessionRecord[];
}

export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { salt: actualSalt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'ZameenVista',
  tagline: 'Your Property. Your Future.',
  logoUrl: '',
  contactPhone: '+92 42 3578 9000',
  whatsappNumber: '923001234567',
  contactEmail: 'info@zameenvista.com',
  businessAddress: 'Floor 4, Vista Commercial Tower, MM Alam Road, Gulberg III, Lahore, Pakistan',
  heroHeadline: 'Find Your Perfect Property with ZameenVista',
  heroSubtitle: 'Discover homes, plots, apartments and commercial properties across Pakistan.',
  heroImageUrl: '/src/assets/images/hero_luxury_villa_1792767491841.jpg',
  socials: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
  footerAbout: 'ZameenVista is Pakistan’s modern real estate platform connecting buyers, investors, and tenants with verified high-yield residential and commercial opportunities across Lahore, Islamabad, Karachi, Rawalpindi, and Peshawar.'
};

const SEED_PROPERTIES: Property[] = [
  {
    id: 'ZV-1001',
    title: 'Luxury 10 Marla Modern Designer House',
    slug: 'luxury-10-marla-modern-designer-house-dha-phase-6-lahore',
    purpose: 'sale',
    type: 'house',
    condition: 'brand-new',
    price: 45000000,
    priceFormatted: 'PKR 4.5 Crore',
    city: 'Lahore',
    locality: 'DHA Phase 6',
    address: 'Sector K, DHA Phase 6, Lahore',
    area: '10 Marla',
    areaSqFt: 2250,
    bedrooms: 5,
    bathrooms: 6,
    description: 'An architectural masterpiece in DHA Phase 6 Lahore featuring double-height ceiling lobby, Italian marble flooring, imported Spanish bathroom sanitary fittings, two custom designer kitchens with German hardware, servant quarter, and landscaped terrace.',
    features: ['Double Height Ceiling', 'Imported Kitchens', 'Lush Lawn', 'Servant Quarter', '24/7 DHA Security', 'Underground Utilities', 'Solar Ready'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg',
      '/src/assets/images/hero_luxury_villa_1792767491841.jpg'
    ],
    featured: true,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2026,
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'listings@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-15T10:00:00.000Z',
    updatedAt: '2026-10-15T10:00:00.000Z'
  },
  {
    id: 'ZV-1002',
    title: 'Modern 5 Marla Triple-Storey House',
    slug: 'modern-5-marla-triple-storey-house-bahria-town-lahore',
    purpose: 'sale',
    type: 'house',
    condition: 'brand-new',
    price: 21000000,
    priceFormatted: 'PKR 2.1 Crore',
    city: 'Lahore',
    locality: 'Bahria Town',
    address: 'Sector C, Bahria Town, Lahore',
    area: '5 Marla',
    areaSqFt: 1125,
    bedrooms: 3,
    bathrooms: 4,
    description: 'Compact luxury family home in Sector C, Bahria Town Lahore. Features contemporary glass facade, 3 master en-suite bedrooms, rooftop BBQ pergola, and proximity to Eiffel Tower park and international schools.',
    features: ['Gated Sector Security', 'Rooftop Pergola', 'Turkish Tiles', 'LED Ambient Lighting', 'Near Commercial Hub'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: true,
    status: 'available',
    furnishing: 'unfurnished',
    builtYear: 2026,
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'listings@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-16T11:00:00.000Z',
    updatedAt: '2026-10-16T11:00:00.000Z'
  },
  {
    id: 'ZV-1003',
    title: 'Solid Double-Storey Family House',
    slug: 'solid-double-storey-family-house-johar-town-lahore',
    purpose: 'sale',
    type: 'house',
    condition: 'used',
    price: 28000000,
    priceFormatted: 'PKR 2.8 Crore',
    city: 'Lahore',
    locality: 'Johar Town',
    address: 'Block G-3, Johar Town, Lahore',
    area: '10 Marla',
    areaSqFt: 2250,
    bedrooms: 4,
    bathrooms: 4,
    description: 'Well-maintained solid brick construction house situated on a 40-foot wide road near Shaukat Khanum Hospital and Emporium Mall. Ideal for multi-generational families with dual electrical meters and wide car porch.',
    features: ['Dual Gas & Electric Meters', 'Solid Teak Woodwork', 'Car Porch for 2 Cars', 'Storage Room', 'Walk to Mosque'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2020,
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'listings@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-17T09:00:00.000Z',
    updatedAt: '2026-10-17T09:00:00.000Z'
  },
  {
    id: 'ZV-1004',
    title: 'Peaceful Family House in Faisal Town',
    slug: 'peaceful-family-house-faisal-town-lahore',
    purpose: 'sale',
    type: 'house',
    condition: 'used',
    price: 16500000,
    priceFormatted: 'PKR 1.65 Crore',
    city: 'Lahore',
    locality: 'Faisal Town',
    address: 'Block B, Faisal Town, Lahore',
    area: '5 Marla',
    areaSqFt: 1125,
    bedrooms: 3,
    bathrooms: 3,
    description: 'A cozy 5 Marla house located in the heart of Faisal Town, minutes from Model Town park and Fast University. Excellent rental yield and solid construction with verified registry.',
    features: ['Verified Registry', 'Sui Gas Installed', 'Near Model Town Park', 'Paved Street'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    builtYear: 2018,
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'listings@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-17T12:00:00.000Z',
    updatedAt: '2026-10-17T12:00:00.000Z'
  },
  {
    id: 'ZV-1005',
    title: 'Fully Furnished Luxury Residence',
    slug: 'fully-furnished-luxury-residence-dha-phase-5-lahore',
    purpose: 'rent',
    type: 'house',
    condition: 'used',
    price: 180000,
    priceFormatted: 'PKR 180,000/month',
    city: 'Lahore',
    locality: 'DHA Phase 5',
    address: 'Sector C, DHA Phase 5, Lahore',
    area: '10 Marla',
    areaSqFt: 2250,
    bedrooms: 4,
    bathrooms: 5,
    description: 'Tastefully furnished executive house available for immediate lease in prestigious DHA Phase 5 Lahore. Includes inverter air conditioners, high-speed fiber internet wiring, contemporary sofa sets, and backup power inverter.',
    features: ['Fully Furnished', 'Inverter ACs in all rooms', 'UPS Inverter Backup', 'Lawn Area', 'Servant Room with Bath'],
    images: [
      '/src/assets/images/hero_luxury_villa_1792767491841.jpg'
    ],
    featured: true,
    status: 'available',
    furnishing: 'fully-furnished',
    builtYear: 2022,
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'rentals@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-18T08:00:00.000Z',
    updatedAt: '2026-10-18T08:00:00.000Z'
  },
  {
    id: 'ZV-1006',
    title: 'Comfortable Family House for Rent',
    slug: 'comfortable-family-house-rent-bahria-town-lahore',
    purpose: 'rent',
    type: 'house',
    condition: 'used',
    price: 75000,
    priceFormatted: 'PKR 75,000/month',
    city: 'Lahore',
    locality: 'Bahria Town',
    address: 'Sector D, Bahria Town, Lahore',
    area: '5 Marla',
    areaSqFt: 1125,
    bedrooms: 3,
    bathrooms: 3,
    description: 'Spacious and bright 5 Marla house for rent in Sector D Bahria Town. Clean neighborhood, uninterrupted utilities, 24/7 security, and close proximity to Bahria Hospital.',
    features: ['Uninterrupted Power', 'Gated Community', 'Car Parking', 'Near Hospital & Supermarket'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2023,
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'rentals@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-10-18T10:00:00.000Z'
  },
  {
    id: 'ZV-1007',
    title: 'Modern High-End Apartment in Gulberg',
    slug: 'modern-high-end-apartment-gulberg-lahore',
    purpose: 'sale',
    type: 'apartment',
    condition: 'brand-new',
    price: 15000000,
    priceFormatted: 'PKR 1.5 Crore',
    city: 'Lahore',
    locality: 'Gulberg',
    address: 'MM Alam Extension, Gulberg III, Lahore',
    area: '1,250 Sq. Ft.',
    areaSqFt: 1250,
    bedrooms: 2,
    bathrooms: 2,
    description: 'High-floor 2-bedroom luxury apartment with panoramic views over the Lahore skyline. Features high-speed passenger elevators, dedicated basement parking, rooftop pool, and gymnasium.',
    features: ['Rooftop Swimming Pool', 'Modern Fitness Center', 'Basement Reserved Parking', '24/7 Reception Concierge', 'Backup Generator'],
    images: [
      '/src/assets/images/apartment_luxury_tower_1792767492630.jpg'
    ],
    featured: true,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2025,
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'listings@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-19T09:30:00.000Z',
    updatedAt: '2026-10-19T09:30:00.000Z'
  },
  {
    id: 'ZV-1008',
    title: 'Executive Apartment in Sector F-11',
    slug: 'executive-apartment-sector-f-11-islamabad',
    purpose: 'rent',
    type: 'apartment',
    condition: 'used',
    price: 85000,
    priceFormatted: 'PKR 85,000/month',
    city: 'Islamabad',
    locality: 'Sector F-11',
    address: 'F-11 Markaz Enclave, Islamabad',
    area: '1,400 Sq. Ft.',
    areaSqFt: 1400,
    bedrooms: 2,
    bathrooms: 2,
    description: 'Spacious and sunlit apartment in prime F-11 Islamabad with stunning Margalla Hills views. Within walking distance to F-11 Markaz dining, organic grocery stores, and fitness studios.',
    features: ['Margalla Hills View', 'Elevator Access', 'Walking Distance to Markaz', 'Secure Building Access', 'Covered Parking'],
    images: [
      '/src/assets/images/apartment_luxury_tower_1792767492630.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2022,
    contactPhone: '+92 51 2890 000',
    contactWhatsapp: '923001234567',
    contactEmail: 'rentals@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-19T11:00:00.000Z',
    updatedAt: '2026-10-19T11:00:00.000Z'
  },
  {
    id: 'ZV-1009',
    title: 'Prime 5 Marla Residential Plot in DHA',
    slug: 'prime-5-marla-residential-plot-dha-lahore',
    purpose: 'sale',
    type: 'plot-residential',
    condition: 'brand-new',
    price: 12000000,
    priceFormatted: 'PKR 1.2 Crore',
    city: 'Lahore',
    locality: 'DHA Phase 7',
    address: 'Block U, DHA Phase 7, Lahore',
    area: '5 Marla',
    areaSqFt: 1125,
    bedrooms: 0,
    bathrooms: 0,
    description: 'Fully developed, possession-ready 5 Marla residential plot on a 50-foot wide boulevard in DHA Phase 7 Lahore. Ideal for immediate house construction or high capital gain investment.',
    features: ['Possession Ready', 'Wide 50ft Boulevard', 'Underground Electricity', 'Park Facing Option', 'Clear DHA Allocation'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: true,
    status: 'available',
    furnishing: 'unfurnished',
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'plots@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z'
  },
  {
    id: 'ZV-1010',
    title: 'High-Footfall Commercial Plot',
    slug: 'high-footfall-commercial-plot-bahria-town-lahore',
    purpose: 'sale',
    type: 'plot-commercial',
    condition: 'brand-new',
    price: 35000000,
    priceFormatted: 'PKR 3.5 Crore',
    city: 'Lahore',
    locality: 'Bahria Town',
    address: 'Civic Commercial Zone, Bahria Town, Lahore',
    area: '4 Marla',
    areaSqFt: 900,
    bedrooms: 0,
    bathrooms: 0,
    description: 'Prime 4 Marla commercial plot with permission for Ground + 5 floors commercial plaza. Located in high-footfall business boulevard with parking plaza right in front.',
    features: ['Ground + 5 Floor Approval', 'Plaza Front Parking', 'High Footfall Zone', 'Prime Retail Hub'],
    images: [
      '/src/assets/images/commercial_plaza_modern_1792767492726.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'commercial@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-20T14:00:00.000Z',
    updatedAt: '2026-10-20T14:00:00.000Z'
  },
  {
    id: 'ZV-1011',
    title: 'Luxury 1 Kanal Contemporary Villa',
    slug: 'luxury-1-kanal-contemporary-villa-dha-islamabad',
    purpose: 'sale',
    type: 'villa',
    condition: 'brand-new',
    price: 80000000,
    priceFormatted: 'PKR 8.0 Crore',
    city: 'Islamabad',
    locality: 'DHA Phase 2',
    address: 'Sector B, DHA Phase 2, Islamabad',
    area: '1 Kanal',
    areaSqFt: 4500,
    bedrooms: 5,
    bathrooms: 6,
    description: 'Palatial 1 Kanal villa in DHA Phase 2 Islamabad with landscaped Spanish courtyard, heated indoor plunge pool, private cinema theatre, smart home automation, and 4-car porch.',
    features: ['Smart Home Automation', 'Private Mini Cinema', 'Courtyard & Plunge Pool', 'German Kitchens', '4 Car Parking Garage'],
    images: [
      '/src/assets/images/hero_luxury_villa_1792767491841.jpg',
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: true,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2026,
    contactPhone: '+92 51 2890 000',
    contactWhatsapp: '923001234567',
    contactEmail: 'villas@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-21T08:00:00.000Z',
    updatedAt: '2026-10-21T08:00:00.000Z'
  },
  {
    id: 'ZV-1012',
    title: 'Architectural Family House in Hayatabad',
    slug: 'architectural-family-house-hayatabad-peshawar',
    purpose: 'sale',
    type: 'house',
    condition: 'brand-new',
    price: 25000000,
    priceFormatted: 'PKR 2.5 Crore',
    city: 'Peshawar',
    locality: 'Hayatabad',
    address: 'Phase 5, Hayatabad, Peshawar',
    area: '10 Marla',
    areaSqFt: 2250,
    bedrooms: 4,
    bathrooms: 5,
    description: 'Magnificent newly built house in Hayatabad Phase 5 Peshawar featuring traditional front stonework, modern interior spaces, imported tiles, wide guest reception, and landscaped lawn.',
    features: ['Separate Hujra / Guest Drawing', 'Imported Granite Kitchen', 'Wide Front Lawn', 'Corner Plot Advantage'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    builtYear: 2025,
    contactPhone: '+92 91 5820 000',
    contactWhatsapp: '923001234567',
    contactEmail: 'listings@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-21T10:00:00.000Z',
    updatedAt: '2026-10-21T10:00:00.000Z'
  },
  {
    id: 'ZV-1013',
    title: 'Executive 10 Marla House in Sector G-13',
    slug: 'executive-10-marla-house-sector-g-13-islamabad',
    purpose: 'sale',
    type: 'house',
    condition: 'brand-new',
    price: 32000000,
    priceFormatted: 'PKR 3.2 Crore',
    city: 'Islamabad',
    locality: 'Sector G-13',
    address: 'Street 42, Sector G-13/4, Islamabad',
    area: '10 Marla',
    areaSqFt: 2250,
    bedrooms: 5,
    bathrooms: 5,
    description: 'Solidly constructed brand-new home directly accessible from Kashmir Highway / Srinagar Highway. Features 2 complete independent living units, perfect for high rental returns or large families.',
    features: ['Direct Highway Connectivity', 'Dual Living Units', 'Sui Gas Verified', 'Modern Fall Ceilings'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: true,
    status: 'available',
    furnishing: 'unfurnished',
    builtYear: 2026,
    contactPhone: '+92 51 2890 000',
    contactWhatsapp: '923001234567',
    contactEmail: 'listings@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-21T12:00:00.000Z',
    updatedAt: '2026-10-21T12:00:00.000Z'
  },
  {
    id: 'ZV-1014',
    title: 'Well-Appointed Family House for Rent',
    slug: 'well-appointed-family-house-rent-rawalpindi',
    purpose: 'rent',
    type: 'house',
    condition: 'used',
    price: 55000,
    priceFormatted: 'PKR 55,000/month',
    city: 'Rawalpindi',
    locality: 'Chaklala Scheme 3',
    address: 'Scheme 3 Commercial Road, Rawalpindi',
    area: '5 Marla',
    areaSqFt: 1125,
    bedrooms: 3,
    bathrooms: 3,
    description: 'Clean, secure, and easily accessible family house available for long-term rent in Chaklala Scheme 3. Close to schools, metro bus feed route, and shopping plazas.',
    features: ['Secure Locality', 'Water Boring & Supply', 'Car Porch', 'Near Metro Link'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    builtYear: 2021,
    contactPhone: '+92 51 5560 000',
    contactWhatsapp: '923001234567',
    contactEmail: 'rentals@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T08:00:00.000Z',
    updatedAt: '2026-10-22T08:00:00.000Z'
  },
  {
    id: 'ZV-1015',
    title: 'Prime Commercial Retail Shop',
    slug: 'prime-commercial-retail-shop-gulberg-lahore',
    purpose: 'rent',
    type: 'shop',
    condition: 'brand-new',
    price: 90000,
    priceFormatted: 'PKR 90,000/month',
    city: 'Lahore',
    locality: 'Gulberg',
    address: 'Ground Floor, Liberty Commercial Hub, Gulberg, Lahore',
    area: '380 Sq. Ft.',
    areaSqFt: 380,
    bedrooms: 0,
    bathrooms: 1,
    description: 'Ground floor retail glass-front shop in premium Gulberg commercial strip with massive footfall. Ideal for fashion boutiques, tech retailers, cosmetics, or artisanal cafes.',
    features: ['Glass Frontage', '24/7 Security & CCTV', 'Backup Generator', 'High Footfall Traffic'],
    images: [
      '/src/assets/images/commercial_plaza_modern_1792767492726.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'commercial@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T09:00:00.000Z',
    updatedAt: '2026-10-22T09:00:00.000Z'
  },
  {
    id: 'ZV-1016',
    title: 'Executive Penthouse in Clifton Block 4',
    slug: 'executive-penthouse-clifton-block-4-karachi',
    purpose: 'sale',
    type: 'apartment',
    condition: 'brand-new',
    price: 52000000,
    priceFormatted: 'PKR 5.2 Crore',
    city: 'Karachi',
    locality: 'Clifton',
    address: 'Sea View Road, Block 4 Clifton, Karachi',
    area: '3,200 Sq. Ft.',
    areaSqFt: 3200,
    bedrooms: 4,
    bathrooms: 5,
    description: 'Ultra-exclusive duplex penthouse overlooking the Arabian Sea in Clifton Karachi. Boasts a private infinity terrace, smart temperature control, Italian marble kitchen, and private elevator landing.',
    features: ['Panoramic Sea View', 'Private Elevator Landing', 'Infinity Terrace', 'Smart Climate Control', 'Multi-layer Security'],
    images: [
      '/src/assets/images/apartment_luxury_tower_1792767492630.jpg'
    ],
    featured: true,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2026,
    contactPhone: '+92 21 3589 0000',
    contactWhatsapp: '923001234567',
    contactEmail: 'karachi@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T10:00:00.000Z',
    updatedAt: '2026-10-22T10:00:00.000Z'
  },
  {
    id: 'ZV-1017',
    title: 'Corporate Office Suite in Blue Area',
    slug: 'corporate-office-suite-blue-area-islamabad',
    purpose: 'rent',
    type: 'office',
    condition: 'brand-new',
    price: 220000,
    priceFormatted: 'PKR 220,000/month',
    city: 'Islamabad',
    locality: 'Blue Area',
    address: '7th Floor, Jinnah Avenue Plaza, Blue Area, Islamabad',
    area: '2,400 Sq. Ft.',
    areaSqFt: 2400,
    bedrooms: 0,
    bathrooms: 2,
    description: 'Grade-A corporate office ready for multinational or tech company occupancy on Jinnah Avenue. High-speed elevators, conference room setup, fiber optics, and dedicated car park slots.',
    features: ['Grade-A Building', 'Jinnah Avenue Facing', 'Dedicated Fiber Ducting', '4 Reserved Parking Bays'],
    images: [
      '/src/assets/images/commercial_plaza_modern_1792767492726.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2025,
    contactPhone: '+92 51 2890 000',
    contactWhatsapp: '923001234567',
    contactEmail: 'commercial@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T11:00:00.000Z',
    updatedAt: '2026-10-22T11:00:00.000Z'
  },
  {
    id: 'ZV-1018',
    title: 'Corner 10 Marla Residential Plot in Bahria',
    slug: 'corner-10-marla-residential-plot-bahria-town-rawalpindi',
    purpose: 'sale',
    type: 'plot-residential',
    condition: 'brand-new',
    price: 9500000,
    priceFormatted: 'PKR 95 Lakh',
    city: 'Rawalpindi',
    locality: 'Bahria Town Phase 8',
    address: 'Sector J, Bahria Town Phase 8, Rawalpindi',
    area: '10 Marla',
    areaSqFt: 2250,
    bedrooms: 0,
    bathrooms: 0,
    description: 'Premium corner plot on 60ft boulevard near modern civic amenities and grand mosque in Bahria Phase 8. High investment potential and ready for construction.',
    features: ['Corner Plot', '60ft Boulevard', 'Immediate Construction', 'Sewerage & Gas Ready'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    contactPhone: '+92 51 5560 000',
    contactWhatsapp: '923001234567',
    contactEmail: 'plots@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T13:00:00.000Z',
    updatedAt: '2026-10-22T13:00:00.000Z'
  },
  {
    id: 'ZV-1019',
    title: 'Luxury 1 Kanal Bungalow in DHA Phase 8',
    slug: 'luxury-1-kanal-bungalow-dha-phase-8-lahore',
    purpose: 'sale',
    type: 'villa',
    condition: 'brand-new',
    price: 89000000,
    priceFormatted: 'PKR 8.9 Crore',
    city: 'Lahore',
    locality: 'DHA Phase 8',
    address: 'Air Avenue, DHA Phase 8, Lahore',
    area: '1 Kanal',
    areaSqFt: 4500,
    bedrooms: 6,
    bathrooms: 7,
    description: 'Opulent custom-designed 1 Kanal house featuring Turkish marble flooring, solid ashwood woodwork, double master suites, rooftop entertainment patio, and manicured private courtyard.',
    features: ['Turkish Marble', 'Solid Ashwood Work', 'Double Master Bedrooms', 'Rooftop Patio', 'Lawn & Water Fountain'],
    images: [
      '/src/assets/images/hero_luxury_villa_1792767491841.jpg',
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: true,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2026,
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'villas@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T14:30:00.000Z',
    updatedAt: '2026-10-22T14:30:00.000Z'
  },
  {
    id: 'ZV-1020',
    title: 'Sea-Facing 3-Bed Apartment in DHA',
    slug: 'sea-facing-3-bed-apartment-dha-phase-8-karachi',
    purpose: 'rent',
    type: 'apartment',
    condition: 'used',
    price: 150000,
    priceFormatted: 'PKR 150,000/month',
    city: 'Karachi',
    locality: 'DHA Phase 8',
    address: 'Creek Vista, DHA Phase 8, Karachi',
    area: '2,100 Sq. Ft.',
    areaSqFt: 2100,
    bedrooms: 3,
    bathrooms: 3,
    description: 'Charming sea-view apartment in Creek Vista DHA Phase 8 Karachi. Airy cross-ventilation, expansive sea-breeze balconies, dedicated security and standby generators.',
    features: ['Creek & Sea Breeze View', 'Standby 24/7 Generator', 'Community Clubhouse', 'Swimming Pool & Tennis'],
    images: [
      '/src/assets/images/apartment_luxury_tower_1792767492630.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2021,
    contactPhone: '+92 21 3589 0000',
    contactWhatsapp: '923001234567',
    contactEmail: 'rentals@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T15:00:00.000Z',
    updatedAt: '2026-10-22T15:00:00.000Z'
  },
  {
    id: 'ZV-1021',
    title: '2 Kanal Agricultural Farmhouse Land',
    slug: '2-kanal-agricultural-farmhouse-land-bedian-road-lahore',
    purpose: 'sale',
    type: 'agriculture',
    condition: 'brand-new',
    price: 38000000,
    priceFormatted: 'PKR 3.8 Crore',
    city: 'Lahore',
    locality: 'Bedian Road',
    address: 'Near Elite Farmhouses, Bedian Road, Lahore',
    area: '2 Kanal',
    areaSqFt: 9000,
    bedrooms: 0,
    bathrooms: 0,
    description: 'Picturesque 2 Kanal agricultural parcel ideal for private luxury weekend retreat, equestrian stable, or organic orchard. Features perimeter boundary wall and sweet tube-well water.',
    features: ['Perimeter Wall Completed', 'Sweet Tube-Well Water', 'Gated Farm Community', 'Electricity Line Available'],
    images: [
      '/src/assets/images/hero_luxury_villa_1792767491841.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'plots@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T16:00:00.000Z',
    updatedAt: '2026-10-22T16:00:00.000Z'
  },
  {
    id: 'ZV-1022',
    title: 'Boutique Commercial Shop in Saddar',
    slug: 'boutique-commercial-shop-saddar-rawalpindi',
    purpose: 'sale',
    type: 'shop',
    condition: 'used',
    price: 18500000,
    priceFormatted: 'PKR 1.85 Crore',
    city: 'Rawalpindi',
    locality: 'Saddar',
    address: 'Bank Road Commercial Arcade, Saddar, Rawalpindi',
    area: '450 Sq. Ft.',
    areaSqFt: 450,
    bedrooms: 0,
    bathrooms: 1,
    description: 'Established retail store on high-yield Bank Road Saddar. Currently tenanted to a reputable retail brand offering 7.2% annual rental ROI. Ideal passive income asset.',
    features: ['Immediate Rental Income', 'Bank Road Footfall', 'Verified Ownership Title', 'Central Air Ducting'],
    images: [
      '/src/assets/images/commercial_plaza_modern_1792767492726.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    contactPhone: '+92 51 5560 000',
    contactWhatsapp: '923001234567',
    contactEmail: 'commercial@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T17:00:00.000Z',
    updatedAt: '2026-10-22T17:00:00.000Z'
  },
  {
    id: 'ZV-1023',
    title: 'Magnificent 1 Kanal Villa in Sector F-7/2',
    slug: 'magnificent-1-kanal-villa-sector-f-7-2-islamabad',
    purpose: 'sale',
    type: 'villa',
    condition: 'brand-new',
    price: 145000000,
    priceFormatted: 'PKR 14.5 Crore',
    city: 'Islamabad',
    locality: 'Sector F-7',
    address: 'Street 18, Sector F-7/2, Islamabad',
    area: '1 Kanal',
    areaSqFt: 4500,
    bedrooms: 5,
    bathrooms: 6,
    description: 'An architectural crown jewel in Islamabad’s premier Sector F-7/2 with direct views of the Margallas. Features geothermal heating, smart glass skylights, basement home lounge, and private diplomatic-grade security system.',
    features: ['Margalla Ridge Views', 'Diplomatic Security Gate', 'Smart Glass Skylight', 'Sub-Zero Kitchen Appliances', 'Basement Media Lounge'],
    images: [
      '/src/assets/images/hero_luxury_villa_1792767491841.jpg',
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: true,
    status: 'available',
    furnishing: 'semi-furnished',
    builtYear: 2026,
    contactPhone: '+92 51 2890 000',
    contactWhatsapp: '923001234567',
    contactEmail: 'villas@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T18:00:00.000Z',
    updatedAt: '2026-10-22T18:00:00.000Z'
  },
  {
    id: 'ZV-1024',
    title: 'Affordable 3 Marla Starter House',
    slug: 'affordable-3-marla-starter-house-university-town-peshawar',
    purpose: 'sale',
    type: 'house',
    condition: 'used',
    price: 9000000,
    priceFormatted: 'PKR 90 Lakh',
    city: 'Peshawar',
    locality: 'University Town',
    address: 'Near Old Jamrud Road, University Town, Peshawar',
    area: '3 Marla',
    areaSqFt: 675,
    bedrooms: 2,
    bathrooms: 2,
    description: 'Sensibly priced 2-bedroom home in tranquil University Town Peshawar. Perfect starter home for young professionals or university faculty members.',
    features: ['Accessible Location', 'Sui Gas & Electric Meter', 'Near University Campus', 'Safe Family Enclave'],
    images: [
      '/src/assets/images/house_dha_contemporary_1792767492366.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    builtYear: 2022,
    contactPhone: '+92 91 5820 000',
    contactWhatsapp: '923001234567',
    contactEmail: 'listings@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T19:00:00.000Z',
    updatedAt: '2026-10-22T19:00:00.000Z'
  },
  {
    id: 'ZV-1025',
    title: 'Corporate Commercial Floor on I.I. Chundrigar',
    slug: 'corporate-commercial-floor-ii-chundrigar-karachi',
    purpose: 'rent',
    type: 'office',
    condition: 'brand-new',
    price: 450000,
    priceFormatted: 'PKR 450,000/month',
    city: 'Karachi',
    locality: 'I.I. Chundrigar Road',
    address: 'Floor 12, Financial Executive Tower, I.I. Chundrigar Road, Karachi',
    area: '5,000 Sq. Ft.',
    areaSqFt: 5000,
    bedrooms: 0,
    bathrooms: 4,
    description: 'Whole-floor corporate office shell in Pakistan’s financial district on I.I. Chundrigar Road. 6 high-speed Otis elevators, triple redundant power backups, and panoramic harbor views.',
    features: ['Pakistan Financial District Hub', 'Triple Redundant Power', 'Harbor & City Views', '6 High-speed Elevators', 'Turnstile Access Control'],
    images: [
      '/src/assets/images/commercial_plaza_modern_1792767492726.jpg'
    ],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    builtYear: 2025,
    contactPhone: '+92 21 3589 0000',
    contactWhatsapp: '923001234567',
    contactEmail: 'commercial@zameenvista.com',
    isDemo: true,
    createdAt: '2026-10-22T20:00:00.000Z',
    updatedAt: '2026-10-22T20:00:00.000Z'
  }
];

const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: 'TEST-1',
    name: 'Taimur Khan',
    role: 'Overseas Pakistani Investor',
    city: 'Lahore',
    rating: 5,
    content: 'Purchasing a 10 Marla property in DHA Phase 6 while based in London was completely seamless through ZameenVista. Transparent specs, direct WhatsApp responses, and zero hidden surprises.',
    propertyBought: '10 Marla Luxury House, DHA Phase 6',
    isDemo: true,
    createdAt: '2026-09-10T10:00:00.000Z'
  },
  {
    id: 'TEST-2',
    name: 'Dr. Ayesha Siddiqui',
    role: 'Consultant Surgeon',
    city: 'Islamabad',
    rating: 5,
    content: 'Found our dream apartment in F-11 Islamabad within 48 hours of browsing. The filter accuracy and verified floor sizes saved us weeks of futile site visits.',
    propertyBought: '2-Bed Apartment, F-11 Islamabad',
    isDemo: true,
    createdAt: '2026-09-24T14:30:00.000Z'
  },
  {
    id: 'TEST-3',
    name: 'Kamran Farooq',
    role: 'Fintech Executive',
    city: 'Karachi',
    rating: 5,
    content: 'The clarity in commercial listings on ZameenVista is unmatched. Rented our regional corporate headquarters on I.I. Chundrigar Road with verified documentation.',
    propertyBought: 'Corporate Office, I.I. Chundrigar Road',
    isDemo: true,
    createdAt: '2026-10-02T16:00:00.000Z'
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure defaults if any missing
        return {
          properties: parsed.properties || SEED_PROPERTIES,
          submissions: parsed.submissions || [],
          inquiries: parsed.inquiries || [],
          testimonials: parsed.testimonials || SEED_TESTIMONIALS,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          admins: parsed.admins || this.createDefaultAdmin(),
          sessions: parsed.sessions || []
        };
      }
    } catch (err) {
      console.error('Error loading database, initializing fresh seed:', err);
    }

    const initial: DatabaseSchema = {
      properties: SEED_PROPERTIES,
      submissions: [],
      inquiries: [],
      testimonials: SEED_TESTIMONIALS,
      settings: DEFAULT_SETTINGS,
      admins: this.createDefaultAdmin(),
      sessions: []
    };
    this.save(initial);
    return initial;
  }

  private createDefaultAdmin(): AdminRecord[] {
    // Initial secure administrator (demo password: ZameenAdmin2026!)
    // Note: Can be changed in Admin Dashboard or overridden via process.env.ADMIN_PASSWORD
    const initialPass = process.env.ADMIN_PASSWORD || 'ZameenAdmin2026!';
    const { salt, hash } = hashPassword(initialPass);
    return [
      {
        id: 'admin_1',
        email: 'admin@zameenvista.com',
        name: 'ZameenVista Administrator',
        role: 'super-admin',
        salt,
        hash
      }
    ];
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to disk:', err);
    }
  }

  // Properties CRUD
  public getProperties(filters?: {
    purpose?: string;
    type?: string;
    condition?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    featured?: boolean;
    query?: string;
    status?: string;
  }): Property[] {
    let list = this.data.properties;

    if (filters) {
      if (filters.purpose && filters.purpose !== 'all') {
        list = list.filter(p => p.purpose === filters.purpose);
      }
      if (filters.type && filters.type !== 'all') {
        list = list.filter(p => p.type === filters.type);
      }
      if (filters.condition && filters.condition !== 'all') {
        list = list.filter(p => p.condition === filters.condition);
      }
      if (filters.city && filters.city !== 'all') {
        list = list.filter(p => p.city.toLowerCase() === filters.city!.toLowerCase());
      }
      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        list = list.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        list = list.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.bedrooms !== undefined && filters.bedrooms > 0) {
        list = list.filter(p => p.bedrooms >= filters.bedrooms!);
      }
      if (filters.bathrooms !== undefined && filters.bathrooms > 0) {
        list = list.filter(p => p.bathrooms >= filters.bathrooms!);
      }
      if (filters.featured !== undefined) {
        list = list.filter(p => p.featured === filters.featured);
      }
      if (filters.status && filters.status !== 'all') {
        list = list.filter(p => p.status === filters.status);
      } else if (!filters.status) {
        // default to available properties for public
        list = list.filter(p => p.status === 'available' || p.status === 'sold' || p.status === 'rented');
      }
      if (filters.query && filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        list = list.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
        );
      }
    }

    return list;
  }

  public getPropertyById(id: string): Property | undefined {
    return this.data.properties.find(p => p.id === id || p.slug === id);
  }

  public addProperty(item: Omit<Property, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Property {
    const nextNumber = this.data.properties.length + 1001;
    const id = `ZV-${nextNumber}`;
    const slug = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${id.toLowerCase()}`;
    const now = new Date().toISOString();

    const newProperty: Property = {
      ...item,
      id,
      slug,
      createdAt: now,
      updatedAt: now
    };

    this.data.properties.unshift(newProperty);
    this.save();
    return newProperty;
  }

  public updateProperty(id: string, updates: Partial<Property>): Property | null {
    const index = this.data.properties.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = this.data.properties[index];
    const updated: Property = {
      ...existing,
      ...updates,
      id: existing.id, // prevent ID override
      updatedAt: new Date().toISOString()
    };

    this.data.properties[index] = updated;
    this.save();
    return updated;
  }

  public deleteProperty(id: string): boolean {
    const before = this.data.properties.length;
    this.data.properties = this.data.properties.filter(p => p.id !== id);
    if (this.data.properties.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Submissions
  public getSubmissions(): PropertySubmission[] {
    return this.data.submissions;
  }

  public addSubmission(item: Omit<PropertySubmission, 'id' | 'status' | 'createdAt'>): PropertySubmission {
    const id = `SUB-${Date.now().toString().slice(-6)}`;
    const submission: PropertySubmission = {
      ...item,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.data.submissions.unshift(submission);
    this.save();
    return submission;
  }

  public updateSubmissionStatus(id: string, status: 'approved' | 'rejected', reason?: string): PropertySubmission | null {
    const sub = this.data.submissions.find(s => s.id === id);
    if (!sub) return null;

    sub.status = status;
    if (reason) sub.rejectionReason = reason;

    if (status === 'approved') {
      // automatically publish to properties as an available listing
      this.addProperty({
        title: sub.title,
        purpose: sub.purpose,
        type: sub.type,
        condition: sub.condition,
        price: sub.price,
        city: sub.city,
        locality: sub.locality,
        area: sub.area,
        areaSqFt: 1000,
        bedrooms: sub.bedrooms || 0,
        bathrooms: sub.bathrooms || 0,
        description: sub.description,
        features: ['Community Living', 'Verified Submission'],
        images: sub.images.length > 0 ? sub.images : ['/src/assets/images/house_dha_contemporary_1792767492366.jpg'],
        featured: false,
        status: 'available',
        furnishing: 'unfurnished',
        contactPhone: sub.phone,
        contactWhatsapp: sub.phone.replace(/[^0-9]/g, ''),
        contactEmail: sub.email,
        isDemo: false
      });
    }

    this.save();
    return sub;
  }

  // Inquiries
  public getInquiries(): Inquiry[] {
    return this.data.inquiries;
  }

  public addInquiry(item: Omit<Inquiry, 'id' | 'status' | 'createdAt'>): Inquiry {
    const id = `INQ-${Date.now().toString().slice(-6)}`;
    const inquiry: Inquiry = {
      ...item,
      id,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    this.data.inquiries.unshift(inquiry);
    this.save();
    return inquiry;
  }

  public updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'resolved'): Inquiry | null {
    const inq = this.data.inquiries.find(i => i.id === id);
    if (!inq) return null;
    inq.status = status;
    this.save();
    return inq;
  }

  public deleteInquiry(id: string): boolean {
    const before = this.data.inquiries.length;
    this.data.inquiries = this.data.inquiries.filter(i => i.id !== id);
    if (this.data.inquiries.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Settings
  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.save();
    return this.data.settings;
  }

  // Testimonials
  public getTestimonials(): Testimonial[] {
    return this.data.testimonials;
  }

  public addTestimonial(item: Omit<Testimonial, 'id' | 'createdAt'>): Testimonial {
    const id = `TEST-${Date.now().toString().slice(-6)}`;
    const testimonial: Testimonial = {
      ...item,
      id,
      createdAt: new Date().toISOString()
    };
    this.data.testimonials.unshift(testimonial);
    this.save();
    return testimonial;
  }

  public updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
    const idx = this.data.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.testimonials[idx] = { ...this.data.testimonials[idx], ...updates };
    this.save();
    return this.data.testimonials[idx];
  }

  public deleteTestimonial(id: string): boolean {
    const before = this.data.testimonials.length;
    this.data.testimonials = this.data.testimonials.filter(t => t.id !== id);
    if (this.data.testimonials.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Dashboard Stats
  public getStats() {
    const totalProperties = this.data.properties.length;
    const availableProperties = this.data.properties.filter(p => p.status === 'available').length;
    const soldProperties = this.data.properties.filter(p => p.status === 'sold').length;
    const rentedProperties = this.data.properties.filter(p => p.status === 'rented').length;
    const pendingSubmissions = this.data.submissions.filter(s => s.status === 'pending').length;
    const newInquiries = this.data.inquiries.filter(i => i.status === 'new').length;

    return {
      totalProperties,
      availableProperties,
      soldProperties,
      rentedProperties,
      pendingSubmissions,
      newInquiries
    };
  }

  // Authentication & Sessions
  public authenticateAdmin(email: string, pass: string): { token: string; admin: { id: string; email: string; name: string; role: string } } | null {
    const admin = this.data.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!admin) return null;

    const isValid = verifyPassword(pass, admin.salt, admin.hash);
    if (!isValid) return null;

    const token = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    this.data.sessions.push({
      token,
      adminId: admin.id,
      createdAt: now,
      expiresAt
    });

    // Clean expired sessions
    this.data.sessions = this.data.sessions.filter(s => s.expiresAt > now);
    this.save();

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };
  }

  public validateSession(token: string): { id: string; email: string; name: string; role: string } | null {
    const session = this.data.sessions.find(s => s.token === token && s.expiresAt > Date.now());
    if (!session) return null;

    const admin = this.data.admins.find(a => a.id === session.adminId);
    if (!admin) return null;

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    };
  }

  public invalidateSession(token: string) {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  public updateAdminPassword(adminId: string, oldPass: string, newPass: string): boolean {
    const admin = this.data.admins.find(a => a.id === adminId);
    if (!admin) return false;

    if (!verifyPassword(oldPass, admin.salt, admin.hash)) {
      return false;
    }

    const { salt, hash } = hashPassword(newPass);
    admin.salt = salt;
    admin.hash = hash;
    this.save();
    return true;
  }
}

export const db = new Database();
