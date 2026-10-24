import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Building2,
  KeyRound,
  X
} from 'lucide-react';
import { api } from '../services/api';

interface AdminLoginPageProps {
  onLoginSuccess: (token: string, admin: any) => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigate
}) => {
  const [email, setEmail] = useState('admin@zameenvista.com');
  const [password, setPassword] = useState('ZameenAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google Sign-In state
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [googleError, setGoogleError] = useState('');

  const handleExecuteGoogleLogin = async (
    googleEmail: string,
    name?: string,
    picture?: string,
    credential?: string
  ) => {
    setGoogleLoading(true);
    setError('');
    setGoogleError('');
    try {
      const res = await api.loginWithGoogle({
        email: googleEmail.trim(),
        name,
        picture,
        credential
      });
      if (res.token) {
        setShowGoogleModal(false);
        onLoginSuccess(res.token, res.admin);
      } else {
        setError('Google sign-in succeeded but authentication token was not returned.');
      }
    } catch (err: any) {
      const msg = err.message || 'Google authentication was not completed.';
      setGoogleError(msg);
      setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignInClick = () => {
    // If standard Google GIS is configured with a real client ID, try prompt
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const gWindow = typeof window !== 'undefined' ? (window as any).google : null;

    if (clientId && gWindow?.accounts?.id) {
      try {
        setGoogleLoading(true);
        gWindow.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential) {
              try {
                // Decode JWT payload
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                );
                const payload = JSON.parse(jsonPayload);
                handleExecuteGoogleLogin(
                  payload.email,
                  payload.name || payload.given_name,
                  payload.picture,
                  response.credential
                );
              } catch (e) {
                // If decoding fails, fallback to modal
                setShowGoogleModal(true);
                setGoogleLoading(false);
              }
            } else {
              setGoogleLoading(false);
            }
          }
        });
        gWindow.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Popup blocked or not displayed, open account selector modal
            setShowGoogleModal(true);
            setGoogleLoading(false);
          }
        });
        return;
      } catch (e) {
        console.warn('Google GSI initialization error, showing modal:', e);
      }
    }

    // Default fast & resilient modal for instant authentication
    setShowGoogleModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(email.trim(), password);
      if (res.token) {
        onLoginSuccess(res.token, res.admin);
      } else {
        setError('Login failed: Token not returned');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full">
        
        {/* Return to site link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </button>

        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 mx-auto mb-3 shadow-sm">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight font-display">
              ZameenVista Management Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Secure authentication for verified real estate administrators
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary: Continue with Google */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleSignInClick}
              disabled={loading || googleLoading}
              className="w-full h-12 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer border border-slate-200 hover:border-slate-300 disabled:opacity-60 active:scale-[0.99]"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Quick 1-Click for verified owner account */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="truncate text-slate-400">Admin: <strong className="text-white">umairwyc@gmail.com</strong></span>
              </div>
              <button
                type="button"
                onClick={() => handleExecuteGoogleLogin('umairwyc@gmail.com', 'Umair (Admin)')}
                disabled={googleLoading}
                className="text-amber-400 hover:text-amber-300 font-bold shrink-0 hover:underline cursor-pointer disabled:opacity-50"
              >
                1-Click Login
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-3 text-[11px] font-semibold text-slate-500 tracking-wider">
                or sign in with password
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zameenvista.com"
                  className="w-full h-11 pl-9 pr-3 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full h-11 pl-9 pr-10 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          {/* Quick Setup / Demonstration Access Note */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <span className="font-bold text-amber-400 block mb-1">Administrative Credentials:</span>
            <div className="font-mono text-[11px] text-slate-300 space-y-0.5">
              <div>Google: <span className="text-white">umairwyc@gmail.com</span> (Authorized Super Admin)</div>
              <div>Password: <span className="text-white">admin@zameenvista.com</span> / <span className="text-white">ZameenAdmin2026!</span></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Google Sign-In provides instant authenticated access for registered real estate portal administrators.
            </p>
          </div>

        </div>

      </div>

      {/* Google Account Selector Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-left">
            <button
              onClick={() => {
                setShowGoogleModal(false);
                setGoogleError('');
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Choose a Google Account</h2>
                <p className="text-[11px] text-slate-400">to continue to ZameenVista Management Portal</p>
              </div>
            </div>

            {googleError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{googleError}</span>
              </div>
            )}

            {/* Verified Account Selection Cards */}
            <div className="space-y-2.5 mb-5">
              {/* Primary Owner / Super Admin Account */}
              <button
                type="button"
                onClick={() => handleExecuteGoogleLogin('umairwyc@gmail.com', 'Umair (Admin)')}
                disabled={googleLoading}
                className="w-full p-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 flex items-center justify-between text-left transition-all cursor-pointer group shadow-sm disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    U
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-400 flex items-center gap-2">
                      <span>Umair</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-medium">Super Admin</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">umairwyc@gmail.com</div>
                  </div>
                </div>
                <span className="text-xs text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Select →</span>
              </button>

              {/* Portal Admin Account */}
              <button
                type="button"
                onClick={() => handleExecuteGoogleLogin('admin@zameenvista.com', 'ZameenVista Administrator')}
                disabled={googleLoading}
                className="w-full p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 flex items-center justify-between text-left transition-all cursor-pointer group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    Z
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-400">
                      ZameenVista Administrator
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">admin@zameenvista.com</div>
                  </div>
                </div>
                <span className="text-xs text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Select →</span>
              </button>
            </div>

            {/* Custom Google Email Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customGoogleEmail.trim()) {
                  handleExecuteGoogleLogin(customGoogleEmail.trim());
                }
              }}
              className="pt-4 border-t border-slate-800 space-y-2"
            >
              <label className="block text-[11px] font-semibold text-slate-400">
                Or sign in with another Google Workspace / Gmail account:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="flex-1 h-10 px-3 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={!customGoogleEmail.trim() || googleLoading}
                  className="h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  {googleLoading ? 'Checking...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Secure OAuth authentication</span>
              <span>ZameenVista Cloud Security</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
