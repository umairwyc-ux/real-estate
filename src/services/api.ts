import { Property, PropertySubmission, Inquiry, SiteSettings, Testimonial, DashboardStats } from '../types';

const API_BASE = '';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Failed request`);
  }
  return data;
}

export const api = {
  // Properties
  async getProperties(params?: Record<string, any>): Promise<{ data: Property[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    return fetchJson(`${API_BASE}/api/properties?${query.toString()}`);
  },

  async getProperty(id: string): Promise<{ data: Property; similar: Property[] }> {
    return fetchJson(`${API_BASE}/api/properties/${encodeURIComponent(id)}`);
  },

  async createProperty(property: Partial<Property>, token: string): Promise<{ success: boolean; data: Property }> {
    return fetchJson(`${API_BASE}/api/properties`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(property)
    });
  },

  async updateProperty(id: string, property: Partial<Property>, token: string): Promise<{ success: boolean; data: Property }> {
    return fetchJson(`${API_BASE}/api/properties/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(property)
    });
  },

  async deleteProperty(id: string, token: string): Promise<{ success: boolean; message: string }> {
    return fetchJson(`${API_BASE}/api/properties/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Submissions
  async submitProperty(submission: Partial<PropertySubmission>): Promise<{ success: boolean; message: string; data: PropertySubmission }> {
    return fetchJson(`${API_BASE}/api/submissions`, {
      method: 'POST',
      body: JSON.stringify(submission)
    });
  },

  async getSubmissions(token: string): Promise<{ data: PropertySubmission[] }> {
    return fetchJson(`${API_BASE}/api/submissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async approveSubmission(id: string, token: string): Promise<{ success: boolean; message: string; data: PropertySubmission }> {
    return fetchJson(`${API_BASE}/api/submissions/${encodeURIComponent(id)}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async rejectSubmission(id: string, reason: string, token: string): Promise<{ success: boolean; message: string; data: PropertySubmission }> {
    return fetchJson(`${API_BASE}/api/submissions/${encodeURIComponent(id)}/reject`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason })
    });
  },

  // Inquiries
  async submitInquiry(inquiry: Partial<Inquiry>): Promise<{ success: boolean; message: string; data: Inquiry }> {
    return fetchJson(`${API_BASE}/api/inquiries`, {
      method: 'POST',
      body: JSON.stringify(inquiry)
    });
  },

  async getInquiries(token: string): Promise<{ data: Inquiry[] }> {
    return fetchJson(`${API_BASE}/api/inquiries`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'resolved', token: string): Promise<{ success: boolean; data: Inquiry }> {
    return fetchJson(`${API_BASE}/api/inquiries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
  },

  async deleteInquiry(id: string, token: string): Promise<{ success: boolean; message: string }> {
    return fetchJson(`${API_BASE}/api/inquiries/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Settings
  async getSettings(): Promise<{ data: SiteSettings }> {
    return fetchJson(`${API_BASE}/api/settings`);
  },

  async updateSettings(settings: Partial<SiteSettings>, token: string): Promise<{ success: boolean; data: SiteSettings }> {
    return fetchJson(`${API_BASE}/api/settings`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(settings)
    });
  },

  // Testimonials
  async getTestimonials(): Promise<{ data: Testimonial[] }> {
    return fetchJson(`${API_BASE}/api/testimonials`);
  },

  async createTestimonial(testimonial: Partial<Testimonial>, token: string): Promise<{ success: boolean; data: Testimonial }> {
    return fetchJson(`${API_BASE}/api/testimonials`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(testimonial)
    });
  },

  async deleteTestimonial(id: string, token: string): Promise<{ success: boolean; message: string }> {
    return fetchJson(`${API_BASE}/api/testimonials/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Dashboard Stats
  async getStats(token: string): Promise<{ data: DashboardStats }> {
    return fetchJson(`${API_BASE}/api/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; token: string; admin: any }> {
    return fetchJson(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async checkAuth(token: string): Promise<{ authenticated: boolean; admin: any }> {
    return fetchJson(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async logout(token: string): Promise<{ success: boolean }> {
    return fetchJson(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async changePassword(currentPassword: string, newPassword: string, token: string): Promise<{ success: boolean; message: string }> {
    return fetchJson(`${API_BASE}/api/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  // Upload image
  async uploadImage(imageBase64: string, filename: string, token: string): Promise<{ success: boolean; url: string }> {
    return fetchJson(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageBase64, filename })
    });
  }
};
