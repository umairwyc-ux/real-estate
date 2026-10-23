import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

interface ContactPageProps {
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<'buy' | 'rent' | 'general' | 'viewing' | 'valuation'>('general');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.submitInquiry({
        name,
        email,
        phone,
        inquiryType,
        message
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const waLink = `https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=${encodeURIComponent('Hello ZameenVista! I would like to inquire about real estate advisory.')}`;

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Connect with Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
            Contact ZameenVista Property Advisors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have a question about a property, schedule a site viewing, or explore listing your real estate asset with us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Information & Branches (1 col) */}
          <div className="space-y-6">
            
            {/* Direct Connect Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-white font-display mb-4">Direct Communication</h3>
              
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Phone Support</span>
                    <a href={`tel:${settings?.contactPhone || '+924235789000'}`} className="text-sm font-bold text-white hover:text-amber-300">
                      {settings?.contactPhone || '+92 42 3578 9000'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">WhatsApp Desk</span>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-emerald-400 hover:underline">
                      +{settings?.whatsappNumber || '92 300 1234567'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Official Email</span>
                    <a href={`mailto:${settings?.contactEmail || 'info@zameenvista.com'}`} className="text-sm font-semibold text-white hover:text-amber-300">
                      {settings?.contactEmail || 'info@zameenvista.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Operating Hours</span>
                    <span className="text-xs text-slate-300">Mon - Sat: 9:00 AM - 7:00 PM (PKT)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Conversation</span>
                </a>
              </div>
            </div>

            {/* Office Locations */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Pakistani Regional Offices
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div>
                  <strong className="text-slate-900 block font-semibold">Lahore Headquarters</strong>
                  <p className="text-slate-500">{settings?.businessAddress || 'Floor 4, Vista Commercial Tower, MM Alam Road, Gulberg III, Lahore'}</p>
                </div>
                <div>
                  <strong className="text-slate-900 block font-semibold">Islamabad Regional Office</strong>
                  <p className="text-slate-500">Floor 2, Beverly Centre, Jinnah Avenue, Blue Area, Islamabad</p>
                </div>
                <div>
                  <strong className="text-slate-900 block font-semibold">Karachi Liaison Desk</strong>
                  <p className="text-slate-500">Executive Tower, Ocean Mall, Block 9 Clifton, Karachi</p>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 font-display mb-1">Send a Message</h2>
              <p className="text-xs text-slate-500 mb-6">
                Fill in your requirements below and our property team will get in touch directly.
              </p>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold">Message Received Successfully!</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Your inquiry has been stored in our backend database. A representative will contact you via your preferred telephone or email.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Asad Ullah"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0300 9876543"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. asad@domain.pk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Type</label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value as any)}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="buy">Property Purchase</option>
                        <option value="rent">Rental Inquiry</option>
                        <option value="viewing">Site Inspection Scheduling</option>
                        <option value="valuation">Property Valuation Assessment</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Requirements *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please specify city preference, desired Marla size, society, or timeline..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>{loading ? 'Submitting to Database...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
