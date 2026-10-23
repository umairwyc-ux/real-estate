import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Mail, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Search, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Upload, 
  Eye, 
  RotateCw,
  Lock,
  MessageSquareQuote
} from 'lucide-react';
import { 
  Property, 
  PropertySubmission, 
  Inquiry, 
  SiteSettings, 
  DashboardStats, 
  Testimonial 
} from '../types';
import { formatPKR, formatNumberPK, getCategoryBadge, getConditionBadge } from '../utils/formatters';
import { api } from '../services/api';

interface AdminDashboardPageProps {
  token: string;
  admin: any;
  onLogout: () => void;
  onNavigate: (path: string, params?: Record<string, any>) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  token,
  admin,
  onLogout,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'submissions' | 'inquiries' | 'settings' | 'testimonials' | 'security'>('overview');

  // Live state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [submissions, setSubmissions] = useState<PropertySubmission[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Property modal state
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propForm, setPropForm] = useState<Partial<Property>>({
    title: '',
    purpose: 'sale',
    type: 'house',
    condition: 'brand-new',
    price: 25000000,
    city: 'Lahore',
    locality: 'DHA Phase 6',
    area: '10 Marla',
    areaSqFt: 2250,
    bedrooms: 4,
    bathrooms: 4,
    description: '',
    features: ['Modern Kitchen', 'Car Parking', '24/7 Security'],
    images: ['/images/house_dha_contemporary.jpg'],
    featured: false,
    status: 'available',
    furnishing: 'unfurnished',
    contactPhone: '+92 42 3578 9000',
    contactWhatsapp: '923001234567',
    contactEmail: 'listings@zameenvista.com'
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);

  // Security password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Property filter
  const [propSearch, setPropSearch] = useState('');
  const [propStatusFilter, setPropStatusFilter] = useState('all');

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, propsRes, subsRes, inqsRes, settsRes, testsRes] = await Promise.all([
        api.getStats(token),
        api.getProperties({ limit: 100 }),
        api.getSubmissions(token),
        api.getInquiries(token),
        api.getSettings(),
        api.getTestimonials()
      ]);

      setStats(statsRes.data);
      setProperties(propsRes.data);
      setSubmissions(subsRes.data);
      setInquiries(inqsRes.data);
      setSettings(settsRes.data);
      setSettingsForm(settsRes.data);
      setTestimonials(testsRes.data);
    } catch (err: any) {
      showFeedback('error', 'Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [token]);

  // Handle Property Save (Create / Update)
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPropertyId) {
        await api.updateProperty(editingPropertyId, propForm, token);
        showFeedback('success', `Property ${editingPropertyId} updated successfully.`);
      } else {
        await api.createProperty(propForm, token);
        showFeedback('success', 'New property listed successfully.');
      }
      setPropertyModalOpen(false);
      setEditingPropertyId(null);
      loadAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to save property.');
    }
  };

  const handleEditProperty = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setPropForm({ ...prop });
    setPropertyModalOpen(true);
  };

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete property ${id}? This cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteProperty(id, token);
      showFeedback('success', `Property ${id} deleted.`);
      loadAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to delete property.');
    }
  };

  const handleTogglePropertyStatus = async (prop: Property, newStatus: any) => {
    try {
      await api.updateProperty(prop.id, { status: newStatus }, token);
      showFeedback('success', `Status updated to ${newStatus}.`);
      loadAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update status.');
    }
  };

  const handleToggleFeatured = async (prop: Property) => {
    try {
      await api.updateProperty(prop.id, { featured: !prop.featured }, token);
      showFeedback('success', `Featured state updated.`);
      loadAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update featured flag.');
    }
  };

  // Submissions Actions
  const handleApproveSubmission = async (id: string) => {
    try {
      await api.approveSubmission(id, token);
      showFeedback('success', 'Submission approved and published to live website.');
      loadAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to approve submission.');
    }
  };

  const handleRejectSubmission = async (id: string) => {
    const reason = window.prompt('Reason for rejection (e.g. Unverified pricing or invalid location):');
    if (reason === null) return;
    try {
      await api.rejectSubmission(id, reason || 'Incomplete details', token);
      showFeedback('success', 'Submission marked as rejected.');
      loadAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to reject submission.');
    }
  };

  // Inquiries Actions
  const handleUpdateInquiryStatus = async (id: string, status: 'new' | 'contacted' | 'resolved') => {
    try {
      await api.updateInquiryStatus(id, status, token);
      showFeedback('success', `Inquiry status changed to ${status}.`);
      loadAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update inquiry.');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.deleteInquiry(id, token);
      showFeedback('success', 'Inquiry deleted.');
      loadAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to delete inquiry.');
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      await api.updateSettings(settingsForm, token);
      showFeedback('success', 'Website settings persisted to database.');
      loadAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update settings.');
    }
  };

  // Security password update
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showFeedback('error', 'New passwords do not match.');
      return;
    }
    if (newPass.length < 8) {
      showFeedback('error', 'New password must be at least 8 characters long.');
      return;
    }
    try {
      await api.changePassword(currentPass, newPass, token);
      showFeedback('success', 'Administrator password updated successfully.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to change password.');
    }
  };

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    if (propStatusFilter !== 'all' && p.status !== propStatusFilter) return false;
    if (propSearch.trim()) {
      const q = propSearch.toLowerCase().trim();
      return p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.locality.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="font-bold text-sm text-white font-display">ZameenVista Control Center</span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400/20 text-amber-300">
              {admin?.role || 'Super Admin'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={loadAllData}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh Database Data"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Shell */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <aside className="lg:w-64 shrink-0 bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap text-left ${
              activeTab === 'overview' ? 'bg-slate-900 text-amber-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap text-left ${
              activeTab === 'properties' ? 'bg-slate-900 text-amber-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4" />
              <span>Properties</span>
            </div>
            <span className="text-[11px] font-mono opacity-80">{properties.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap text-left ${
              activeTab === 'submissions' ? 'bg-slate-900 text-amber-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>Submissions</span>
            </div>
            {stats && stats.pendingSubmissions > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {stats.pendingSubmissions}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap text-left ${
              activeTab === 'inquiries' ? 'bg-slate-900 text-amber-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4" />
              <span>Inquiries</span>
            </div>
            {stats && stats.newInquiries > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {stats.newInquiries}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap text-left ${
              activeTab === 'testimonials' ? 'bg-slate-900 text-amber-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Testimonials</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap text-left ${
              activeTab === 'settings' ? 'bg-slate-900 text-amber-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Portal Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap text-left ${
              activeTab === 'security' ? 'bg-slate-900 text-amber-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Admin Password</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          
          {/* Toast / Feedback Notice */}
          {feedbackMsg && (
            <div className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-sm animate-in fade-in ${
              feedbackMsg.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}>
              <div className="flex items-center gap-2">
                {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{feedbackMsg.text}</span>
              </div>
              <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Live Database Statistics</h1>
                  <p className="text-xs text-slate-500">Real-time counts queried directly from persistent storage.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingPropertyId(null);
                    setPropForm({
                      title: '',
                      purpose: 'sale',
                      type: 'house',
                      condition: 'brand-new',
                      price: 25000000,
                      city: 'Lahore',
                      locality: 'DHA Phase 6',
                      area: '10 Marla',
                      areaSqFt: 2250,
                      bedrooms: 4,
                      bathrooms: 4,
                      description: '',
                      features: ['Modern Kitchen', 'Car Parking', '24/7 Security'],
                      images: ['/images/house_dha_contemporary.jpg'],
                      featured: false,
                      status: 'available',
                      furnishing: 'unfurnished',
                      contactPhone: '+92 42 3578 9000',
                      contactWhatsapp: '923001234567',
                      contactEmail: 'listings@zameenvista.com'
                    });
                    setPropertyModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Property</span>
                </button>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Total Properties</span>
                  <div className="text-3xl font-extrabold text-slate-900 font-display">
                    {stats?.totalProperties ?? properties.length}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">In database</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-emerald-600 block mb-1">Available for Sale/Rent</span>
                  <div className="text-3xl font-extrabold text-emerald-700 font-display">
                    {stats?.availableProperties ?? 0}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Active on public site</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-blue-600 block mb-1">Sold Properties</span>
                  <div className="text-3xl font-extrabold text-blue-700 font-display">
                    {stats?.soldProperties ?? 0}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Closed transactions</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-indigo-600 block mb-1">Rented Properties</span>
                  <div className="text-3xl font-extrabold text-indigo-700 font-display">
                    {stats?.rentedProperties ?? 0}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Leases finalized</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-amber-600 block mb-1">Pending Submissions</span>
                  <div className="text-3xl font-extrabold text-amber-600 font-display">
                    {stats?.pendingSubmissions ?? 0}
                  </div>
                  <button 
                    onClick={() => setActiveTab('submissions')}
                    className="text-[11px] text-amber-700 hover:underline font-semibold mt-1 block cursor-pointer"
                  >
                    Review submissions →
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-rose-600 block mb-1">New Inquiries</span>
                  <div className="text-3xl font-extrabold text-rose-600 font-display">
                    {stats?.newInquiries ?? 0}
                  </div>
                  <button 
                    onClick={() => setActiveTab('inquiries')}
                    className="text-[11px] text-rose-700 hover:underline font-semibold mt-1 block cursor-pointer"
                  >
                    View inquiries →
                  </button>
                </div>
              </div>

              {/* Recent Activity Snapshot */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 font-display mb-4">Quick Property Catalog</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-3">ID</th>
                        <th className="pb-3">Title</th>
                        <th className="pb-3">Location</th>
                        <th className="pb-3">Price (PKR)</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {properties.slice(0, 5).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-3 font-mono font-bold text-slate-900">{p.id}</td>
                          <td className="py-3 font-medium max-w-xs truncate">{p.title}</td>
                          <td className="py-3 text-slate-500">{p.locality}, {p.city}</td>
                          <td className="py-3 font-bold text-slate-900">{formatPKR(p.price, p.purpose)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleEditProperty(p)}
                              className="text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PROPERTY MANAGEMENT ================= */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Property Management</h1>
                  <p className="text-xs text-slate-500">Add, edit, delete, and control public listing statuses.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingPropertyId(null);
                    setPropForm({
                      title: '',
                      purpose: 'sale',
                      type: 'house',
                      condition: 'brand-new',
                      price: 25000000,
                      city: 'Lahore',
                      locality: 'DHA Phase 6',
                      area: '10 Marla',
                      areaSqFt: 2250,
                      bedrooms: 4,
                      bathrooms: 4,
                      description: '',
                      features: ['Modern Kitchen', 'Car Parking', '24/7 Security'],
                      images: ['/images/house_dha_contemporary.jpg'],
                      featured: false,
                      status: 'available',
                      furnishing: 'unfurnished',
                      contactPhone: '+92 42 3578 9000',
                      contactWhatsapp: '923001234567',
                      contactEmail: 'listings@zameenvista.com'
                    });
                    setPropertyModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Property Listing</span>
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by title, ID, or locality..."
                    value={propSearch}
                    onChange={(e) => setPropSearch(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <select
                  value={propStatusFilter}
                  onChange={(e) => setPropStatusFilter(e.target.value)}
                  className="h-9 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Table of Listings */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Property</th>
                        <th className="py-3 px-4">Price (PKR)</th>
                        <th className="py-3 px-4">Type / Specs</th>
                        <th className="py-3 px-4">Featured</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredProperties.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-mono text-[10px] text-slate-400">{p.id}</div>
                            <div className="font-bold text-slate-900 max-w-xs truncate" title={p.title}>{p.title}</div>
                            <div className="text-[11px] text-slate-500">{p.locality}, {p.city}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{formatPKR(p.price, p.purpose)}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{p.purpose}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div>{getCategoryBadge(p.type)}</div>
                            <div className="text-[11px] text-slate-400">{p.area} {p.bedrooms > 0 ? `· ${p.bedrooms}B` : ''}</div>
                          </td>

                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                                p.featured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400 hover:text-slate-700'
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{p.featured ? 'Yes' : 'No'}</span>
                            </button>
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={p.status}
                              onChange={(e) => handleTogglePropertyStatus(p, e.target.value)}
                              className="text-xs px-2 py-1 rounded border border-slate-300 bg-white"
                            >
                              <option value="available">Available</option>
                              <option value="sold">Sold</option>
                              <option value="rented">Rented</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => onNavigate(`/property/${p.id}`)}
                              className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer inline-flex"
                              title="View Public Page"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditProperty(p)}
                              className="p-1.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 cursor-pointer inline-flex"
                              title="Edit Listing"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(p.id)}
                              className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 cursor-pointer inline-flex"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: SUBMISSIONS ================= */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-display">User Property Submissions</h1>
                <p className="text-xs text-slate-500">Public submissions requiring administrative review before going live.</p>
              </div>

              {submissions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  No property submissions have been made yet. Submissions from the public "Submit a Property" page will appear here.
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-slate-400">{sub.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              sub.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              sub.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {sub.status}
                            </span>
                            <span className="text-slate-400 text-xs">· Submitted {new Date(sub.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900">{sub.title}</h3>
                          <div className="text-xs text-slate-500">{sub.locality}, {sub.city} · {sub.area} · Demand: <strong>{formatPKR(sub.price, sub.purpose)}</strong></div>
                        </div>

                        {sub.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveSubmission(sub.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve & Publish</span>
                            </button>
                            <button
                              onClick={() => handleRejectSubmission(sub.id)}
                              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                        <div>
                          <strong className="text-slate-800 block mb-1">Owner Contact Info:</strong>
                          <div>Name: {sub.ownerName}</div>
                          <div>Phone: <a href={`tel:${sub.phone}`} className="text-amber-700 font-semibold">{sub.phone}</a></div>
                          <div>Email: {sub.email}</div>
                        </div>

                        <div>
                          <strong className="text-slate-800 block mb-1">Details & Description:</strong>
                          <p className="line-clamp-3 text-slate-500">{sub.description || 'No description provided.'}</p>
                          {sub.rejectionReason && (
                            <div className="mt-2 text-rose-700 font-medium">Rejection Note: {sub.rejectionReason}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 4: INQUIRIES ================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-display">Inquiries & Leads</h1>
                <p className="text-xs text-slate-500">Inbound inquiries submitted through property cards and contact forms.</p>
              </div>

              {inquiries.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  No inquiries recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => {
                    const waLink = `https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, this is ZameenVista responding to your property inquiry.`)}`;
                    return (
                      <div key={inq.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-slate-400">{inq.id}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                inq.status === 'new' ? 'bg-rose-100 text-rose-800' :
                                inq.status === 'contacted' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {inq.status}
                              </span>
                              <span className="text-slate-400 text-xs">· {new Date(inq.createdAt).toLocaleString()}</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">{inq.name}</h3>
                            {inq.propertyTitle && (
                              <div className="text-xs text-amber-700 font-medium">
                                Regarding: {inq.propertyTitle} ({inq.propertyId})
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                            >
                              <option value="new">Mark as New</option>
                              <option value="contacted">Mark as Contacted</option>
                              <option value="resolved">Mark as Resolved</option>
                            </select>

                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-800"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 mb-4 whitespace-pre-line leading-relaxed">
                          "{inq.message}"
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-4 text-slate-600">
                            <div>Phone: <strong className="text-slate-900">{inq.phone}</strong></div>
                            <div>Email: <strong className="text-slate-900">{inq.email}</strong></div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Reply on WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${inq.phone}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Inquirer</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: PORTAL SETTINGS ================= */}
          {activeTab === 'settings' && settingsForm && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-display">Website Settings</h1>
                <p className="text-xs text-slate-500">Configure brand credentials, direct WhatsApp number, hero copy and footer.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  
                  {/* Brand & Contacts */}
                  <div className="pb-6 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                      Brand & Contact Configuration
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.brandName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.tagline}
                          onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.contactPhone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Business Number (digits only)</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          placeholder="e.g. 923001234567"
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">Formatted without '+' sign for wa.me links</span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                        <input
                          type="email"
                          required
                          value={settingsForm.contactEmail}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Business Head Office Address</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.businessAddress}
                          onChange={(e) => setSettingsForm({ ...settingsForm, businessAddress: e.target.value })}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Copy */}
                  <div className="pb-6 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                      Homepage Hero Section Copy
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Headline</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.heroHeadline}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Subtitle</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.heroSubtitle}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Background Image URL</label>
                        <input
                          type="text"
                          value={settingsForm.heroImageUrl}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                          className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Content */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Footer About Synopsis</label>
                    <textarea
                      rows={3}
                      value={settingsForm.footerAbout}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerAbout: e.target.value })}
                      className="w-full p-3 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Save All Settings to Database
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 6: TESTIMONIALS ================= */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Client Testimonials</h1>
                  <p className="text-xs text-slate-500">Manage client reviews (clearly marked with demo tags).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {t.city}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 italic mb-3">"{t.content}"</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-400">{t.role}</span>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete testimonial?')) return;
                          await api.deleteTestimonial(t.id, token);
                          showFeedback('success', 'Testimonial removed.');
                          loadAllData();
                        }}
                        className="text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 7: SECURITY ================= */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-display">Administrator Security</h1>
                <p className="text-xs text-slate-500">Change your administrative account password.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-lg shadow-xs">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password *</label>
                    <input
                      type="password"
                      required
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (min 8 chars) *</label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Update Admin Password
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Property Add/Edit Modal */}
      {propertyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <h2 className="text-lg font-bold text-slate-900 font-display">
                {editingPropertyId ? `Edit Property (${editingPropertyId})` : 'Add New Property Listing'}
              </h2>
              <button onClick={() => setPropertyModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={propForm.title || ''}
                  onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                  className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose *</label>
                  <select
                    value={propForm.purpose || 'sale'}
                    onChange={(e) => setPropForm({ ...propForm, purpose: e.target.value as any })}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="lease">For Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type *</label>
                  <select
                    value={propForm.type || 'house'}
                    onChange={(e) => setPropForm({ ...propForm, type: e.target.value as any })}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="house">House</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="apartment">Apartment</option>
                    <option value="plot-residential">Residential Plot</option>
                    <option value="plot-commercial">Commercial Plot</option>
                    <option value="shop">Shop</option>
                    <option value="office">Office</option>
                    <option value="agriculture">Agricultural Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Condition *</label>
                  <select
                    value={propForm.condition || 'brand-new'}
                    onChange={(e) => setPropForm({ ...propForm, condition: e.target.value as any })}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="brand-new">Brand New</option>
                    <option value="under-construction">Under Construction</option>
                    <option value="used">Used / Pre-Owned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price in PKR {propForm.purpose === 'rent' ? '(Monthly)' : '(Sale Demand)'} *
                  </label>
                  <input
                    type="number"
                    required
                    value={propForm.price || ''}
                    onChange={(e) => setPropForm({ ...propForm, price: Number(e.target.value) })}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                  <select
                    value={propForm.city || 'Lahore'}
                    onChange={(e) => setPropForm({ ...propForm, city: e.target.value })}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Peshawar">Peshawar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Locality *</label>
                  <input
                    type="text"
                    required
                    value={propForm.locality || ''}
                    onChange={(e) => setPropForm({ ...propForm, locality: e.target.value })}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area Unit *</label>
                  <input
                    type="text"
                    value={propForm.area || '10 Marla'}
                    onChange={(e) => setPropForm({ ...propForm, area: e.target.value })}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area (Sq. Ft.)</label>
                  <input
                    type="number"
                    value={propForm.areaSqFt || 2250}
                    onChange={(e) => setPropForm({ ...propForm, areaSqFt: Number(e.target.value) })}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={propForm.bedrooms || 0}
                    onChange={(e) => setPropForm({ ...propForm, bedrooms: Number(e.target.value) })}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={propForm.bathrooms || 0}
                    onChange={(e) => setPropForm({ ...propForm, bathrooms: Number(e.target.value) })}
                    className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={propForm.description || ''}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  className="w-full p-3 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={(propForm.images && propForm.images[0]) || ''}
                  onChange={(e) => setPropForm({ ...propForm, images: [e.target.value] })}
                  className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={propForm.featured || false}
                    onChange={(e) => setPropForm({ ...propForm, featured: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Mark as Featured Listing</span>
                </label>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span>Status:</span>
                  <select
                    value={propForm.status || 'available'}
                    onChange={(e) => setPropForm({ ...propForm, status: e.target.value as any })}
                    className="px-2 py-1 rounded border border-slate-300 bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPropertyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
