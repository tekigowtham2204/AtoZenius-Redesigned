import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Megaphone } from 'lucide-react';
import { ViewState } from '../types';
import { getSiteConfig, SITE_CONFIG_EVENT } from '../data/portal';

interface HeroProps {
  onOpenAuth: () => void;
  onNavigate?: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAuth, onNavigate }) => {
  const [siteConfig, setSiteConfig] = useState(() => getSiteConfig());
  const smoothEase = [0.25, 0.1, 0.25, 1.0];

  useEffect(() => {
    const syncConfig = () => setSiteConfig(getSiteConfig());
    window.addEventListener(SITE_CONFIG_EVENT, syncConfig);
    return () => window.removeEventListener(SITE_CONFIG_EVENT, syncConfig);
  }, []);

  const scrollToContent = () => {
    const element = document.getElementById('insights');
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center pt-24 md:pt-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-center z-10 flex flex-col items-center">
        {siteConfig.announcementText.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: smoothEase }}
            className="mb-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0A0B0E] text-white text-xs font-semibold shadow-sm"
          >
            <Megaphone size={13} className="text-[#60A5FA] shrink-0" />
            <span>{siteConfig.announcementText}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: smoothEase }}
          className="w-full"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold text-brand-dark leading-[1.1] md:leading-[1.05] mb-6 md:mb-8 tracking-tighter">
            AtoZenius<span className="text-brand-accent">.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: smoothEase }}
          className="text-base sm:text-lg md:text-xl text-brand-dark/70 max-w-xl md:max-w-2xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed px-2"
        >
          <span className="font-bold text-brand-dark">{siteConfig.heroTaglinePrefix}</span>{' '}
          {siteConfig.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: smoothEase }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0"
        >
          <button 
            onClick={() => onNavigate && onNavigate('courses')}
            className="w-full sm:w-auto group px-8 md:px-10 py-4 md:py-5 bg-brand-dark text-brand-cream rounded-full font-bold text-sm tracking-wide hover:bg-brand-accent transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.3)]"
          >
            Explore Courses
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-transparent border-2 border-brand-dark/10 text-brand-dark rounded-full font-bold text-sm tracking-wide hover:border-brand-dark/30 transition-all duration-300"
          >
            Get Started
          </button>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-6 md:bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 1, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
        onClick={scrollToContent}
      >
        <ChevronDown className="text-brand-dark/30" size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;