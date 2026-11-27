import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  onOpenAuth: () => void;
  currentView?: ViewState;
  onNavigate?: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, currentView = 'landing', onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { name: string; href: string; view: ViewState }[] = [
    { name: 'Courses', href: '/courses', view: 'courses' },
    { name: 'Mentors', href: '/mentors', view: 'mentors' },
    { name: 'Careers', href: '/careers', view: 'careers' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-brand-cream/80 backdrop-blur-xl border-b border-brand-dark/5 py-4' 
            : 'bg-transparent border-transparent py-6 md:py-8'
        }`}
      >
        <div className="container mx-auto px-6 md:px-8 flex justify-between items-center">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('landing'); }} 
            className="text-xl md:text-2xl font-bold tracking-tighter text-brand-dark relative group"
          >
            AtoZenius<span className="text-brand-accent">.</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate(item.view);
                }}
                className={`text-sm font-medium transition-colors duration-300 ${
                  currentView === item.view
                  ? 'text-brand-accent font-bold' 
                  : 'text-brand-dark/70 hover:text-brand-dark'
                }`}
              >
                {item.name}
              </a>
            ))}
            <button 
              onClick={onOpenAuth}
              className="px-8 py-3 text-sm font-bold text-white bg-brand-dark rounded-full hover:bg-brand-accent transition-colors duration-300 shadow-lg"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-brand-dark p-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "tween", ease: "circOut", duration: 0.5 }}
            className="fixed inset-0 z-50 bg-brand-cream flex flex-col justify-center items-center space-y-10"
          >
            <button 
              className="absolute top-6 right-6 text-brand-dark p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            
            {navLinks.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                className="text-3xl md:text-4xl font-bold text-brand-dark hover:text-brand-accent transition-colors tracking-tight"
                onClick={(e) => {
                   e.preventDefault();
                   setIsMobileMenuOpen(false);
                   if (onNavigate) onNavigate(item.view);
                }}
              >
                {item.name}
              </a>
            ))}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="px-12 py-4 text-lg font-bold text-white bg-brand-dark rounded-full shadow-xl"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;