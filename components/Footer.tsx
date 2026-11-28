import React, { useEffect, useState } from 'react';
import { Linkedin, Youtube, Instagram } from 'lucide-react';
import { ViewState } from '../types';
import { getSiteConfig, SITE_CONFIG_EVENT } from '../data/portal';

interface FooterProps {
  onNavigate?: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [siteConfig, setSiteConfig] = useState(() => getSiteConfig());

  useEffect(() => {
    const syncConfig = () => setSiteConfig(getSiteConfig());
    window.addEventListener(SITE_CONFIG_EVENT, syncConfig);
    return () => window.removeEventListener(SITE_CONFIG_EVENT, syncConfig);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, view: ViewState) => {
    e.preventDefault();
    if (onNavigate) onNavigate(view);
  };

  return (
    <footer className="relative z-10 bg-brand-dark pt-16 md:pt-20 pb-8 md:pb-10 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <a
              href="/"
              onClick={(e) => handleNav(e, 'landing')}
              className="text-2xl font-bold tracking-tight text-white mb-4 block"
            >
              AtoZenius<span className="text-brand-accent">.</span>
            </a>
            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-xs mb-6">
              Learn from industry mentors, build a career in tech.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href={siteConfig.linkedinUrl || 'https://www.linkedin.com/showcase/atozenius/'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-accent transition-colors flex items-center justify-center text-white/70 hover:text-white"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={siteConfig.youtubeUrl || 'https://www.youtube.com/@AtoZenius'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-accent transition-colors flex items-center justify-center text-white/70 hover:text-white"
              >
                <Youtube size={16} />
              </a>
              <a
                href={siteConfig.instagramUrl || 'https://www.instagram.com/atozenius'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-accent transition-colors flex items-center justify-center text-white/70 hover:text-white"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-accent transition-colors flex items-center justify-center text-white/70 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-white/50 font-medium">
              <li><a href="/about" onClick={(e) => handleNav(e, 'about')} className="hover:text-white transition-colors">About</a></li>
              <li><a href="/blog" onClick={(e) => handleNav(e, 'blog')} className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" onClick={(e) => handleNav(e, 'contact')} className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/company-careers" onClick={(e) => handleNav(e, 'company-careers')} className="hover:text-white transition-colors">Careers at AtoZenius</a></li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6">Learn</h4>
            <ul className="space-y-3 text-sm text-white/50 font-medium">
              <li><a href="/courses" onClick={(e) => handleNav(e, 'courses')} className="hover:text-white transition-colors">All Courses</a></li>
              <li><a href="/certifications" onClick={(e) => handleNav(e, 'certifications')} className="hover:text-white transition-colors">Certifications</a></li>
              <li><a href="/mentors" onClick={(e) => handleNav(e, 'mentors')} className="hover:text-white transition-colors">Mentors</a></li>
              <li><a href="/placements" onClick={(e) => handleNav(e, 'placements')} className="hover:text-white transition-colors">Placements / Success Stories</a></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-white/50 font-medium">
              <li><a href="/faqs" onClick={(e) => handleNav(e, 'faqs')} className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="/help-center" onClick={(e) => handleNav(e, 'help-center')} className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/refund-policy" onClick={(e) => handleNav(e, 'refund-policy')} className="hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="/get-started" onClick={(e) => handleNav(e, 'auth')} className="hover:text-white transition-colors">Login</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white/40 font-medium gap-4">
          <p>© 2026 AtoZenius. All rights reserved.</p>
          <div className="flex items-center space-x-3">
            <a href="/privacy-policy" onClick={(e) => handleNav(e, 'privacy-policy')} className="hover:text-white/80 transition-colors">
              Privacy Policy
            </a>
            <span className="text-white/20">|</span>
            <a href="/terms" onClick={(e) => handleNav(e, 'terms')} className="hover:text-white/80 transition-colors">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
