import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from './server/db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support JSON payloads up to 25MB for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Admin authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const admin = db.validateSession(token);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized: Session invalid or expired' });
  }

  (req as any).admin = admin;
  (req as any).token = token;
  next();
}

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const result = db.authenticateAdmin(email, password);
  if (!result) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    success: true,
    token: result.token,
    admin: result.admin
  });
});

app.get('/api/auth/me', requireAdmin, (req: Request, res: Response) => {
  res.json({
    authenticated: true,
    admin: (req as any).admin
  });
});

app.post('/api/auth/logout', requireAdmin, (req: Request, res: Response) => {
  const token = (req as any).token;
  db.invalidateSession(token);
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  const adminId = (req as any).admin.id;
  const success = db.updateAdminPassword(adminId, currentPassword, newPassword);
  if (!success) {
    return res.status(400).json({ error: 'Current password incorrect' });
  }

  res.json({ success: true, message: 'Password updated successfully' });
});

// ==================== PROPERTIES ROUTES ====================
app.get('/api/properties', (req: Request, res: Response) => {
  const {
    purpose,
    type,
    condition,
    city,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    featured,
    query,
    status,
    sort,
    page = '1',
    limit = '50'
  } = req.query;

  let properties = db.getProperties({
    purpose: purpose as string,
    type: type as string,
    condition: condition as string,
    city: city as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
    bathrooms: bathrooms ? Number(bathrooms) : undefined,
    featured: featured !== undefined ? featured === 'true' : undefined,
    query: query as string,
    status: status as string
  });

  // Sorting
  if (sort === 'price-asc') {
    properties.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    properties.sort((a, b) => b.price - a.price);
  } else {
    // default newest
    properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 50;
  const total = properties.length;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = properties.slice(startIndex, startIndex + limitNum);

  res.json({
    data: paginated,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum)
  });
});

app.get('/api/properties/:id', (req: Request, res: Response) => {
  const property = db.getPropertyById(req.params.id);
  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  // Also find similar properties in same city or same category
  const allInCity = db.getProperties({ city: property.city });
  const similar = allInCity
    .filter(p => p.id !== property.id)
    .slice(0, 3);

  res.json({
    data: property,
    similar
  });
});

app.post('/api/properties', requireAdmin, (req: Request, res: Response) => {
  const {
    title,
    purpose,
    type,
    condition,
    price,
    city,
    locality,
    address,
    area,
    areaSqFt,
    bedrooms,
    bathrooms,
    description,
    features,
    images,
    featured,
    status,
    furnishing,
    builtYear,
    contactPhone,
    contactWhatsapp,
    contactEmail
  } = req.body;

  if (!title || !purpose || !type || !price || !city || !locality) {
    return res.status(400).json({ error: 'Missing mandatory property details' });
  }

  const created = db.addProperty({
    title,
    purpose,
    type,
    condition: condition || 'brand-new',
    price: Number(price),
    city,
    locality,
    address,
    area: area || '10 Marla',
    areaSqFt: Number(areaSqFt) || 2250,
    bedrooms: Number(bedrooms) || 0,
    bathrooms: Number(bathrooms) || 0,
    description: description || '',
    features: Array.isArray(features) ? features : [],
    images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/house_dha_contemporary_1792767492366.jpg'],
    featured: Boolean(featured),
    status: status || 'available',
    furnishing: furnishing || 'unfurnished',
    builtYear: builtYear ? Number(builtYear) : new Date().getFullYear(),
    contactPhone: contactPhone || '+92 42 3578 9000',
    contactWhatsapp: contactWhatsapp || '923001234567',
    contactEmail: contactEmail || 'info@zameenvista.com',
    isDemo: false
  });

  res.status(201).json({ success: true, data: created });
});

app.put('/api/properties/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateProperty(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Property not found' });
  }
  res.json({ success: true, data: updated });
});

app.delete('/api/properties/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteProperty(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Property not found' });
  }
  res.json({ success: true, message: 'Property deleted successfully' });
});

// ==================== SUBMISSIONS ROUTES ====================
app.get('/api/submissions', requireAdmin, (req: Request, res: Response) => {
  const list = db.getSubmissions();
  res.json({ data: list });
});

app.post('/api/submissions', (req: Request, res: Response) => {
  const {
    ownerName,
    phone,
    email,
    title,
    purpose,
    type,
    condition,
    city,
    locality,
    price,
    area,
    bedrooms,
    bathrooms,
    description,
    images
  } = req.body;

  if (!ownerName || !phone || !email || !title || !price || !city || !locality) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  const submission = db.addSubmission({
    ownerName,
    phone,
    email,
    title,
    purpose: purpose || 'sale',
    type: type || 'house',
    condition: condition || 'brand-new',
    city,
    locality,
    price: Number(price),
    area: area || '10 Marla',
    bedrooms: Number(bedrooms) || 0,
    bathrooms: Number(bathrooms) || 0,
    description: description || '',
    images: Array.isArray(images) ? images : []
  });

  res.status(201).json({
    success: true,
    message: 'Your property has been submitted for review. Our verification team will contact you shortly.',
    data: submission
  });
});

app.patch('/api/submissions/:id/approve', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSubmissionStatus(req.params.id, 'approved');
  if (!updated) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  res.json({ success: true, message: 'Property approved and published to listings', data: updated });
});

app.patch('/api/submissions/:id/reject', requireAdmin, (req: Request, res: Response) => {
  const { reason } = req.body;
  const updated = db.updateSubmissionStatus(req.params.id, 'rejected', reason);
  if (!updated) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  res.json({ success: true, message: 'Submission marked as rejected', data: updated });
});

// ==================== INQUIRIES ROUTES ====================
app.get('/api/inquiries', requireAdmin, (req: Request, res: Response) => {
  const inquiries = db.getInquiries();
  res.json({ data: inquiries });
});

app.post('/api/inquiries', (req: Request, res: Response) => {
  const { name, email, phone, inquiryType, message, propertyId, propertyTitle } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Name, email, phone number, and message are required' });
  }

  const created = db.addInquiry({
    name,
    email,
    phone,
    inquiryType: inquiryType || 'general',
    message,
    propertyId,
    propertyTitle
  });

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been received. Our property specialist will contact you promptly.',
    data: created
  });
});

app.patch('/api/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['new', 'contacted', 'resolved'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const updated = db.updateInquiryStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  res.json({ success: true, data: updated });
});

app.delete('/api/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteInquiry(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  res.json({ success: true, message: 'Inquiry deleted' });
});

// ==================== SETTINGS & STATS ====================
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({ data: db.getSettings() });
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, data: updated });
});

app.get('/api/stats', requireAdmin, (req: Request, res: Response) => {
  res.json({ data: db.getStats() });
});

// ==================== TESTIMONIALS ====================
app.get('/api/testimonials', (req: Request, res: Response) => {
  res.json({ data: db.getTestimonials() });
});

app.post('/api/testimonials', requireAdmin, (req: Request, res: Response) => {
  const { name, role, city, rating, content, propertyBought } = req.body;
  if (!name || !content) {
    return res.status(400).json({ error: 'Name and content are required' });
  }
  const created = db.addTestimonial({
    name,
    role: role || 'Client',
    city: city || 'Lahore',
    rating: Number(rating) || 5,
    content,
    propertyBought: propertyBought || 'Property',
    isDemo: false
  });
  res.status(201).json({ success: true, data: created });
});

app.put('/api/testimonials/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateTestimonial(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Testimonial not found' });
  res.json({ success: true, data: updated });
});

app.delete('/api/testimonials/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteTestimonial(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Testimonial not found' });
  res.json({ success: true, message: 'Testimonial deleted' });
});

// ==================== IMAGE UPLOAD (PERSISTENT DISK STORAGE) ====================
app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
  const { imageBase64, filename } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  try {
    // Strip header e.g. "data:image/jpeg;base64,"
    const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9.+]+);base64,(.+)$/);
    let extension = 'jpg';
    let dataBuffer: Buffer;

    if (matches && matches.length === 3) {
      extension = matches[1].replace('jpeg', 'jpg');
      dataBuffer = Buffer.from(matches[2], 'base64');
    } else {
      dataBuffer = Buffer.from(imageBase64, 'base64');
    }

    const safeName = filename
      ? `${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      : `zv_img_${Date.now()}.${extension}`;

    const filePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(filePath, dataBuffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error('Image upload failed:', err);
    res.status(500).json({ error: 'Failed to save image: ' + err.message });
  }
});

// ==================== DEV SERVER & STATIC SERVING ====================
async function startServer() {
  if (!isProduction) {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built dist directory
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[ZameenVista] Full-stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
