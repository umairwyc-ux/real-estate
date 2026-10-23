import React, { useState, useEffect } from 'react';
import { Property, SiteSettings, Testimonial } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { SubmitPropertyPage } from './pages/SubmitPropertyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  // Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [routeParams, setRouteParams] = useState<Record<string, any>>({});

  // Global data
  const [properties, setProperties] = useState<Property[]>([]);
  const [settings, setSettings] = useState<SiteSettings | undefined>(undefined);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin auth
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('zv_admin_token');
  });
  const [adminUser, setAdminUser] = useState<any>(null);

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getProperties({ limit: 100 }),
      api.getSettings(),
      api.getTestimonials()
    ])
      .then(([propsRes, settsRes, testsRes]) => {
        if (!isMounted) return;
        setProperties(propsRes.data);
        setSettings(settsRes.data);
        setTestimonials(testsRes.data);
      })
      .catch((err) => {
        console.error('Failed to load initial site data:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Verify stored admin token
  useEffect(() => {
    if (adminToken) {
      api.checkAuth(adminToken)
        .then((res) => {
          if (res.authenticated) {
            setAdminUser(res.admin);
          } else {
            localStorage.removeItem('zv_admin_token');
            setAdminToken(null);
            setAdminUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('zv_admin_token');
          setAdminToken(null);
          setAdminUser(null);
        });
    }
  }, [adminToken]);

  const handleNavigate = (path: string, params: Record<string, any> = {}) => {
    setCurrentPath(path);
    setRouteParams(params);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (id: string) => {
    handleNavigate(`/property/${id}`);
  };

  const handleLoginSuccess = (token: string, admin: any) => {
    localStorage.setItem('zv_admin_token', token);
    setAdminToken(token);
    setAdminUser(admin);
    handleNavigate('/admin/dashboard');
  };

  const handleLogout = () => {
    if (adminToken) {
      api.logout(adminToken).catch(() => {});
    }
    localStorage.removeItem('zv_admin_token');
    setAdminToken(null);
    setAdminUser(null);
    handleNavigate('/');
  };

  // Route matching
  const renderCurrentPage = () => {
    // 1. Property Details: /property/:id
    if (currentPath.startsWith('/property/')) {
      const id = currentPath.replace('/property/', '');
      return (
        <PropertyDetailsPage
          propertyId={id}
          settings={settings}
          onNavigate={handleNavigate}
          onSelectProperty={handleSelectProperty}
        />
      );
    }

    // 2. Admin Dashboard
    if (currentPath === '/admin/dashboard') {
      if (!adminToken) {
        return (
          <AdminLoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
          />
        );
      }
      return (
        <AdminDashboardPage
          token={adminToken}
          admin={adminUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    }

    // 3. Admin Login
    if (currentPath === '/admin/login' || currentPath === '/admin') {
      if (adminToken) {
        return (
          <AdminDashboardPage
            token={adminToken}
            admin={adminUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      }
      return (
        <AdminLoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigate={handleNavigate}
        />
      );
    }

    // 4. Submit Property
    if (currentPath === '/submit' || currentPath === '/submit-property') {
      return <SubmitPropertyPage onNavigate={handleNavigate} />;
    }

    // 5. About
    if (currentPath === '/about' || currentPath === '/about-us') {
      return <AboutPage settings={settings} onNavigate={handleNavigate} />;
    }

    // 6. Contact
    if (currentPath === '/contact' || currentPath === '/contact-us') {
      return <ContactPage settings={settings} onNavigate={handleNavigate} />;
    }

    // 7. Privacy
    if (currentPath === '/privacy' || currentPath === '/privacy-policy') {
      return <PrivacyPage onNavigate={handleNavigate} />;
    }

    // 8. Terms
    if (currentPath === '/terms' || currentPath === '/terms-and-conditions') {
      return <TermsPage onNavigate={handleNavigate} />;
    }

    // 9. Buy Properties Page
    if (currentPath === '/buy' || currentPath === '/for-sale') {
      return (
        <PropertiesPage
          properties={properties}
          settings={settings}
          initialFilters={{ purpose: 'sale', ...routeParams }}
          pageTitle="Properties for Sale in Pakistan"
          pageSubtitle="Browse houses, residential plots, apartments, and commercial projects available for purchase."
          onSelectProperty={handleSelectProperty}
          onNavigate={handleNavigate}
        />
      );
    }

    // 10. Rent Properties Page
    if (currentPath === '/rent' || currentPath === '/for-rent') {
      return (
        <PropertiesPage
          properties={properties}
          settings={settings}
          initialFilters={{ purpose: 'rent', ...routeParams }}
          pageTitle="Rental Properties Across Pakistan"
          pageSubtitle="Explore furnished and unfurnished houses, luxury flats, and office spaces for rent."
          onSelectProperty={handleSelectProperty}
          onNavigate={handleNavigate}
        />
      );
    }

    // 11. New Houses
    if (currentPath === '/new-houses') {
      return (
        <PropertiesPage
          properties={properties}
          settings={settings}
          initialFilters={{ type: 'house', condition: 'brand-new', purpose: 'sale', ...routeParams }}
          pageTitle="Brand New Houses for Sale"
          pageSubtitle="Direct from builders: Modern luxury designer houses in DHA, Bahria, and CDA sectors."
          onSelectProperty={handleSelectProperty}
          onNavigate={handleNavigate}
        />
      );
    }

    // 12. Used Houses
    if (currentPath === '/used-houses') {
      return (
        <PropertiesPage
          properties={properties}
          settings={settings}
          initialFilters={{ type: 'house', condition: 'used', purpose: 'sale', ...routeParams }}
          pageTitle="Pre-Owned & Used Houses for Sale"
          pageSubtitle="Established family homes with complete gas, electric, and registry documentation."
          onSelectProperty={handleSelectProperty}
          onNavigate={handleNavigate}
        />
      );
    }

    // 13. Apartments and Flats
    if (currentPath === '/apartments') {
      return (
        <PropertiesPage
          properties={properties}
          settings={settings}
          initialFilters={{ type: 'apartment', ...routeParams }}
          pageTitle="Apartments & Flats in Pakistan"
          pageSubtitle="Luxury high-rises, penthouses, and executive apartments in Gulberg, Clifton, and Islamabad."
          onSelectProperty={handleSelectProperty}
          onNavigate={handleNavigate}
        />
      );
    }

    // 14. Residential Plots
    if (currentPath === '/plots') {
      return (
        <PropertiesPage
          properties={properties}
          settings={settings}
          initialFilters={{ type: 'plot-residential', ...routeParams }}
          pageTitle="Residential & Commercial Plots"
          pageSubtitle="Possession-ready 5 Marla, 10 Marla, and 1 Kanal plots in DHA, Bahria, and CDA developments."
          onSelectProperty={handleSelectProperty}
          onNavigate={handleNavigate}
        />
      );
    }

    // 15. Commercial Properties
    if (currentPath === '/commercial') {
      return (
        <PropertiesPage
          properties={properties}
          settings={settings}
          initialFilters={{ type: 'shop', ...routeParams }}
          pageTitle="Commercial Real Estate"
          pageSubtitle="Retail showrooms, corporate office floors, and commercial plots in prime commercial hubs."
          onSelectProperty={handleSelectProperty}
          onNavigate={handleNavigate}
        />
      );
    }

    // 16. All Properties Directory
    if (currentPath === '/properties') {
      return (
        <PropertiesPage
          properties={properties}
          settings={settings}
          initialFilters={routeParams}
          pageTitle="Complete Property Directory"
          pageSubtitle="Filter by city, purpose, category, price, and dimensions across Pakistan."
          onSelectProperty={handleSelectProperty}
          onNavigate={handleNavigate}
        />
      );
    }

    // 17. Homepage
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          properties={properties}
          settings={settings}
          testimonials={testimonials}
          onNavigate={handleNavigate}
          onSelectProperty={handleSelectProperty}
        />
      );
    }

    // 18. Custom 404
    return <NotFoundPage onNavigate={handleNavigate} />;
  };

  const isFullAdminView = currentPath.startsWith('/admin') && adminToken;

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50 antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Show public Navbar unless on dedicated admin control panel */}
      {!isFullAdminView && (
        <Navbar
          currentPath={currentPath}
          onNavigate={handleNavigate}
          settings={settings}
          isAdminLoggedIn={Boolean(adminToken)}
        />
      )}

      {/* Main Page Body */}
      <div className="flex-1">
        {renderCurrentPage()}
      </div>

      {/* Show public Footer unless on dedicated admin control panel */}
      {!isFullAdminView && (
        <Footer
          onNavigate={handleNavigate}
          settings={settings}
        />
      )}
    </div>
  );
}
