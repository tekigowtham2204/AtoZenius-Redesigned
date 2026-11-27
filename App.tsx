import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ContentBlock from './components/ContentBlock';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CoursesPage from './components/CoursesPage';
import MentorsPage from './components/MentorsPage';
import CareersPage from './components/CareersPage';
import AboutPage from './components/AboutPage';
import CertificationsPage from './components/CertificationsPage';
import BlogPage from './components/BlogPage';
import ContactPage from './components/ContactPage';
import PlacementsPage from './components/PlacementsPage';
import CompanyCareersPage from './components/CompanyCareersPage';
import InfoPage, { InfoPageType } from './components/InfoPage';
import { ViewState } from './types';

const infoViews: InfoPageType[] = [
  'faqs',
  'help-center',
  'refund-policy',
  'privacy-policy',
  'terms',
];

const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

const pathToView = (path: string): ViewState => {
  const withoutBase = BASE_PATH && path.toLowerCase().startsWith(BASE_PATH.toLowerCase())
    ? path.slice(BASE_PATH.length)
    : path;
  const normalized = withoutBase.toLowerCase().replace(/\/+$/, '') || '/';
  if (normalized === '/courses') return 'courses';
  if (normalized === '/mentors') return 'mentors';
  if (normalized === '/careers') return 'careers';
  if (normalized === '/certifications') return 'certifications';
  if (normalized === '/placements') return 'placements';
  if (normalized === '/get-started' || normalized === '/auth') return 'auth';
  if (normalized === '/about') return 'about';
  if (normalized === '/blog') return 'blog';
  if (normalized === '/contact') return 'contact';
  if (normalized === '/company-careers') return 'company-careers';
  if (normalized === '/faqs') return 'faqs';
  if (normalized === '/help-center') return 'help-center';
  if (normalized === '/refund-policy') return 'refund-policy';
  if (normalized === '/privacy-policy') return 'privacy-policy';
  if (normalized === '/terms') return 'terms';
  return 'landing';
};

const viewToPath = (view: ViewState): string => {
  let route = '/';
  switch (view) {
    case 'courses': route = '/courses'; break;
    case 'mentors': route = '/mentors'; break;
    case 'careers': route = '/careers'; break;
    case 'certifications': route = '/certifications'; break;
    case 'placements': route = '/placements'; break;
    case 'auth': route = '/get-started'; break;
    case 'about': route = '/about'; break;
    case 'blog': route = '/blog'; break;
    case 'contact': route = '/contact'; break;
    case 'company-careers': route = '/company-careers'; break;
    case 'faqs': route = '/faqs'; break;
    case 'help-center': route = '/help-center'; break;
    case 'refund-policy': route = '/refund-policy'; break;
    case 'privacy-policy': route = '/privacy-policy'; break;
    case 'terms': route = '/terms'; break;
    case 'landing':
    default: route = '/'; break;
  }
  return BASE_PATH ? `${BASE_PATH}${route === '/' ? '/' : route}` : route;
};

const viewTitles: Record<ViewState, string> = {
  landing: 'AtoZenius - Career Ecosystem',
  courses: 'Courses - AtoZenius',
  mentors: 'Mentors - AtoZenius',
  careers: 'Careers - AtoZenius',
  certifications: 'Certifications - AtoZenius',
  placements: 'Placements & Success Stories - AtoZenius',
  auth: 'Get Started - AtoZenius',
  about: 'About - AtoZenius',
  blog: 'Blog - AtoZenius',
  contact: 'Contact - AtoZenius',
  'company-careers': 'Careers at AtoZenius',
  faqs: 'FAQs - AtoZenius',
  'help-center': 'Help Center - AtoZenius',
  'refund-policy': 'Refund Policy - AtoZenius',
  'privacy-policy': 'Privacy Policy - AtoZenius',
  terms: 'Terms & Conditions - AtoZenius',
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      return pathToView(window.location.pathname);
    }
    return 'landing';
  });

  // Update title and handle browser back/forward buttons (popstate)
  useEffect(() => {
    document.title = viewTitles[currentView];
  }, [currentView]);

  useEffect(() => {
    // Set initial history state if not already set
    const initialView = pathToView(window.location.pathname);
    window.history.replaceState({ view: initialView }, '', viewToPath(initialView));

    const handlePopState = (event: PopStateEvent) => {
      const nextView = event.state?.view || pathToView(window.location.pathname);
      setCurrentView(nextView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAuth = () => {
    navigateTo('auth');
  };

  const navigateTo = (view: ViewState) => {
    const targetPath = viewToPath(view);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view }, '', targetPath);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('landing');
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-brand-cream text-brand-dark relative font-sans selection:bg-brand-dark selection:text-brand-accent">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {currentView !== 'auth' && (
          <Navbar 
            onOpenAuth={handleOpenAuth} 
            currentView={currentView}
            onNavigate={navigateTo}
          />
        )}
        
        <main>
          <AnimatePresence mode="wait">
            {currentView === 'landing' && (
              <React.Fragment key="landing">
                <Hero onOpenAuth={handleOpenAuth} onNavigate={navigateTo} />
                <ContentBlock />
                <Features onNavigate={navigateTo} />
                
                {/* CTA Section */}
                <section className="py-24 md:py-40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-brand-accent/5" />
                  <div className="container mx-auto px-6 text-center relative z-10">
                      <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 text-brand-dark tracking-tighter">Ready to start <span className="text-brand-accent">your journey?</span></h2>
                      <p className="text-base md:text-xl font-medium text-brand-dark/60 mb-8 md:mb-12 max-w-2xl mx-auto">Master in-demand engineering skills, train alongside industry mentors, and step into careers built for your talent.</p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                          onClick={() => navigateTo('courses')}
                          className="px-10 md:px-12 py-4 md:py-5 bg-brand-dark text-brand-cream rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand-accent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                        >
                          Explore Courses
                        </button>
                        <button 
                          onClick={handleOpenAuth}
                          className="px-10 md:px-12 py-4 md:py-5 bg-transparent border-2 border-brand-dark/15 text-brand-dark rounded-full font-bold text-sm uppercase tracking-widest hover:border-brand-dark/40 transition-all duration-300 w-full sm:w-auto"
                        >
                          Get Started
                        </button>
                      </div>
                  </div>
                </section>
              </React.Fragment>
            )}
            
            {currentView === 'courses' && (
              <CoursesPage
                key="courses"
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'mentors' && (
              <MentorsPage
                key="mentors"
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'careers' && (
              <CareersPage
                key="careers"
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'about' && (
              <AboutPage
                key="about"
                onNavigate={navigateTo}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'certifications' && (
              <CertificationsPage
                key="certifications"
                onNavigate={navigateTo}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'blog' && (
              <BlogPage
                key="blog"
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'contact' && (
              <ContactPage key="contact" />
            )}

            {currentView === 'placements' && (
              <PlacementsPage
                key="placements"
                onNavigate={navigateTo}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'company-careers' && (
              <CompanyCareersPage
                key="company-careers"
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'auth' && (
              <AuthModal
                key="auth"
                onNavigate={navigateTo}
              />
            )}

            {infoViews.includes(currentView as InfoPageType) && (
              <InfoPage
                key={currentView}
                page={currentView as InfoPageType}
                onNavigate={navigateTo}
              />
            )}
          </AnimatePresence>
        </main>
        
        {currentView !== 'auth' && <Footer onNavigate={navigateTo} />}
      </div>
    </div>
  );
};

export default App;