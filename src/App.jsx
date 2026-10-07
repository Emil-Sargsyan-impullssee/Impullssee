import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Skills from './components/Skills';
import Process from './components/Process';
import PricingOptions from './components/PricingOptions';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './admin/AuthContext';
import { useAdminAuth } from './admin/auth';
import AdminLayout from './admin/AdminLayout';
import { AdminDashboard, AdminLogin, AdminMessages, AdminProjects, AdminServices, AdminSettings } from './admin/AdminPages';
import IntroAnimation from './components/IntroAnimation';
import './admin/Admin.css';

// Mapping from pricing service titles to Contact form project types
const serviceToProjectType = {
  'Responsive Design': 'Landing Page',
  'UI/UX Design': 'Web Application',
  'SEO Optimization': 'Business Website',
  'Modern Animations': 'Web Application',
  'Performance Optimization': 'Web Application',
  'Contact Form': 'Landing Page',
  'API Integration': 'Full-Stack Project',
  'Accessibility': 'Business Website',
  'Advanced Search': 'Web Application',
};

function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [contactProjectType, setContactProjectType] = useState('Landing Page');
  const [contactSelectionRevision, setContactSelectionRevision] = useState(0);
  const contactSectionRef = useRef(null);

  const handleGetStarted = (serviceTitle) => {
    const projectType = serviceToProjectType[serviceTitle] || 'Landing Page';
    setContactProjectType(projectType);
    setContactSelectionRevision((revision) => revision + 1);
    
    // Smooth scroll to contact section
    setTimeout(() => {
      contactSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    const hiddenElements = document.querySelectorAll('.reveal-block');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="portfolio-container">
        <Navbar activeSection={activeSection} />
        <main>
          <Hero />
          <Marquee text="Where design creates the first impression, code brings the idea to life, and every detail has a reason to exist." />
          <About />
          <Marquee
            className="statement-marquee-reverse"
            text="We live in a digital world where attention is earned, not given. I create experiences designed to earn it."
          />
          <Skills />
          <Marquee
            className="statement-marquee-process"
            text="Good design gets attention. Good development earns trust. Great digital experiences bring the two together."
          />
          <Process />
          <Marquee
            className="statement-marquee-contact"
            text="Great work starts with a conversation, grows through collaboration, and ends with something worth being proud of."
          />
          <PricingOptions onGetStarted={handleGetStarted} />
          <Contact ref={contactSectionRef} initialProjectType={contactProjectType} selectionRevision={contactSelectionRevision} />
        </main>
    </div>
  );
}

function RequireAdmin() {
  const { admin, loading } = useAdminAuth();
  if (loading) return <div className="admin-login-page"><p className="admin-muted">Checking your session…</p></div>;
  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <IntroAnimation />
      </AuthProvider>
    </Router>
  );
}
