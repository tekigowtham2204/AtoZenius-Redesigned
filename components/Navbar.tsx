import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LogOut, Award, BookOpen, Globe, LayoutDashboard, Users } from 'lucide-react';
import { ViewState } from '../types';
import {
  getActiveTrackIds,
  getResolvedTrackData,
  getSiteConfig,
  getTotalUnreadCount,
  hasTeamPermission,
  MESSENGER_UPDATED_EVENT,
  PortalRole,
  PortalSession,
  PortalTrackId,
  SITE_CONFIG_EVENT,
} from '../data/portal';

interface NavbarProps {
  onOpenAuth: () => void;
  currentView?: ViewState;
  onNavigate?: (view: ViewState) => void;
  session?: PortalSession | null;
  onSwitchTrack?: (trackId: PortalTrackId) => void;
  onLogout?: () => void;
}

const publicNavLinks: { name: string; href: string; view: ViewState }[] = [
  { name: 'Courses', href: '/courses', view: 'courses' },
  { name: 'Mentors', href: '/mentors', view: 'mentors' },
  { name: 'Careers', href: '/careers', view: 'careers' },
];

const roleNavLinks: Record<PortalRole, { name: string; href: string; view: ViewState }[]> = {
  student: [
    { name: 'Dashboard', href: '/dashboard', view: 'dashboard' },
    { name: 'My Notes', href: '/notes', view: 'notes' },
    { name: 'Projects', href: '/projects', view: 'projects' },
    { name: 'Community', href: '/community', view: 'community' },
    { name: 'Messages', href: '/messages', view: 'messages' },
  ],
  mentor: [
    { name: 'Mentor Desk', href: '/mentor', view: 'mentor-desk' },
    { name: 'Notes Studio', href: '/mentor/notes', view: 'mentor-notes' },
    { name: 'Reviews', href: '/mentor/reviews', view: 'mentor-reviews' },
    { name: 'Batch Doubts', href: '/mentor/doubts', view: 'mentor-doubts' },
    { name: 'Messages', href: '/mentor/messages', view: 'mentor-messages' },
  ],
  staff: [
    { name: 'Ops Hub', href: '/staff', view: 'staff-ops' },
    { name: 'Batches', href: '/staff/batches', view: 'staff-batches' },
    { name: 'Admissions', href: '/staff/admissions', view: 'staff-admissions' },
    { name: 'Placements', href: '/staff/placements', view: 'staff-placements' },
  ],
  manager: [
    { name: 'Overview', href: '/admin', view: 'admin-overview' },
    { name: 'Edit Website', href: '/admin/website', view: 'admin-website' },
    { name: 'Team & Access', href: '/admin/access', view: 'admin-access' },
    { name: 'Operations', href: '/admin/operations', view: 'admin-operations' },
  ],
  admin: [
    { name: 'Overview', href: '/admin', view: 'admin-overview' },
    { name: 'Edit Website', href: '/admin/website', view: 'admin-website' },
    { name: 'Team & Access', href: '/admin/access', view: 'admin-access' },
    { name: 'Operations', href: '/admin/operations', view: 'admin-operations' },
  ],
};

const roleHomeRoute: Record<PortalRole, ViewState> = {
  student: 'dashboard',
  mentor: 'mentor-desk',
  staff: 'staff-ops',
  manager: 'admin-overview',
  admin: 'admin-overview',
};

const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  currentView = 'landing',
  onNavigate,
  session = null,
  onSwitchTrack,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState(() => getSiteConfig());
  const [, setConfigTick] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncConfig = () => {
      setSiteConfig(getSiteConfig());
      setConfigTick((t) => t + 1);
    };
    window.addEventListener(SITE_CONFIG_EVENT, syncConfig);
    window.addEventListener(MESSENGER_UPDATED_EVENT, syncConfig);
    return () => {
      window.removeEventListener(SITE_CONFIG_EVENT, syncConfig);
      window.removeEventListener(MESSENGER_UPDATED_EVENT, syncConfig);
    };
  }, []);

  const trackSwitcherItems: { id: PortalTrackId; label: string }[] = getActiveTrackIds().map(
    (id) => {
      const t = getResolvedTrackData(id);
      const shortCode = t.batchCode.replace('Batch #', '');
      return { id, label: `${t.courseTitle} (${shortCode})` };
    }
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visiblePublicLinks = siteConfig.showCareersInHeader
    ? publicNavLinks
    : publicNavLinks.filter((item) => item.view !== 'careers');

  const getFilteredRoleLinks = () => {
    if (!session) return visiblePublicLinks;
    if (session.role === 'manager') {
      const links: { name: string; href: string; view: ViewState }[] = [];
      if (hasTeamPermission(session, 'view_overview')) {
        links.push({ name: 'Overview', href: '/admin', view: 'admin-overview' });
      }
      if (hasTeamPermission(session, 'edit_website')) {
        links.push({ name: 'Edit Website', href: '/admin/website', view: 'admin-website' });
      }
      if (hasTeamPermission(session, 'manage_team')) {
        links.push({ name: 'Team & Access', href: '/admin/access', view: 'admin-access' });
      }
      if (
        hasTeamPermission(session, 'manage_admissions') ||
        hasTeamPermission(session, 'manage_batches') ||
        hasTeamPermission(session, 'manage_placements')
      ) {
        links.push({ name: 'Operations', href: '/admin/operations', view: 'admin-operations' });
      }
      return links.length > 0 ? links : roleNavLinks.manager;
    }
    if (session.role === 'staff') {
      const links: { name: string; href: string; view: ViewState }[] = [
        { name: 'Ops Hub', href: '/staff', view: 'staff-ops' },
      ];
      if (hasTeamPermission(session, 'manage_batches')) {
        links.push({ name: 'Batches', href: '/staff/batches', view: 'staff-batches' });
      }
      if (hasTeamPermission(session, 'manage_admissions')) {
        links.push({ name: 'Admissions', href: '/staff/admissions', view: 'staff-admissions' });
      }
      if (hasTeamPermission(session, 'manage_placements')) {
        links.push({ name: 'Placements', href: '/staff/placements', view: 'staff-placements' });
      }
      if (hasTeamPermission(session, 'manage_team')) {
        links.push({ name: 'Team & Access', href: '/admin/access', view: 'admin-access' });
      }
      if (hasTeamPermission(session, 'edit_website')) {
        links.push({ name: 'Edit Website', href: '/admin/website', view: 'admin-website' });
      }
      return links;
    }
    return roleNavLinks[session.role];
  };

  const navLinks = getFilteredRoleLinks();
  const unreadMessages = getTotalUnreadCount(session);
  const activeTrack =
    session && session.trackId ? getResolvedTrackData(session.trackId) : null;
  const roleBadge = session
    ? session.role === 'admin'
      ? 'Admin'
      : session.role === 'manager'
      ? session.title || 'Manager'
      : session.role === 'staff'
      ? session.title || 'AtoZenius Staff'
      : session.role === 'mentor'
      ? 'Faculty'
      : activeTrack?.batchCode || 'Onboarding'
    : '';

  return (
    <>
      <nav
        className={`print:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-cream/85 backdrop-blur-xl border-b border-brand-dark/5 py-4'
            : 'bg-transparent border-transparent py-6 md:py-8'
        }`}
      >
        <div className="container mx-auto px-6 md:px-8 flex justify-between items-center">
          <a
            href={session ? `/${roleHomeRoute[session.role]}` : '/'}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate(session ? roleHomeRoute[session.role] : 'landing');
            }}
            className="text-xl md:text-2xl font-bold tracking-tighter text-brand-dark relative group"
          >
            AtoZenius<span className="text-brand-accent">.</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 lg:space-x-9 items-center">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate(item.view);
                }}
                className={`text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1.5 ${
                  currentView === item.view
                    ? 'text-brand-accent font-bold'
                    : 'text-brand-dark/70 hover:text-brand-dark'
                }`}
              >
                <span>{item.name}</span>
                {(item.view === 'messages' || item.view === 'mentor-messages') &&
                  unreadMessages > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
              </a>
            ))}

            {session ? (
              <div className="relative flex items-center gap-3" ref={dropdownRef}>
                <span className="hidden lg:inline-block text-xs font-mono text-brand-dark/55">
                  {roleBadge}
                </span>

                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white border border-brand-dark/10 hover:border-brand-dark/30 transition-colors shadow-sm"
                  aria-expanded={isProfileOpen}
                  aria-label="Open account menu"
                >
                  <span className="w-7 h-7 rounded-full bg-brand-dark text-white text-xs font-bold flex items-center justify-center">
                    {session.initials}
                  </span>
                  <span className="text-xs font-bold text-brand-dark max-w-[110px] truncate">
                    {session.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-brand-dark/50 transition-transform ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl border border-brand-dark/10 shadow-xl p-4 z-50"
                    >
                      <div className="pb-3 mb-3 border-b border-brand-dark/10">
                        <div className="text-sm font-bold text-brand-dark">{session.name}</div>
                        <div className="text-xs text-brand-dark/55 truncate">{session.email}</div>
                        <div className="text-[11px] font-mono text-brand-accent mt-1 uppercase">
                          {session.role === 'student' && activeTrack
                            ? `${activeTrack.courseTitle} · ${activeTrack.batchCode}`
                            : `${session.role} Workspace`}
                        </div>
                      </div>

                      {session.role === 'student' && onSwitchTrack && (
                        <div className="pb-3 mb-3 border-b border-brand-dark/10">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-brand-dark/45 mb-2">
                            Switch Offline Batch (Demo)
                          </div>
                          <div className="space-y-1">
                            {trackSwitcherItems.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  onSwitchTrack(item.id);
                                  setIsProfileOpen(false);
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                  session.trackId === item.id
                                    ? 'bg-brand-dark text-white'
                                    : 'text-brand-dark/70 hover:bg-brand-cream'
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        {session.role === 'admin' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setIsProfileOpen(false);
                                if (onNavigate) onNavigate('landing');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-brand-dark/75 hover:bg-brand-cream inline-flex items-center gap-2"
                            >
                              <Globe size={14} /> View Public Site
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsProfileOpen(false);
                                if (onNavigate) onNavigate('dashboard');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-brand-dark/75 hover:bg-brand-cream inline-flex items-center gap-2"
                            >
                              <LayoutDashboard size={14} /> View Student Portal
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsProfileOpen(false);
                                if (onNavigate) onNavigate('mentor-desk');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-brand-dark/75 hover:bg-brand-cream inline-flex items-center gap-2"
                            >
                              <Users size={14} /> View Mentor Desk
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            if (onNavigate) onNavigate('certifications');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-brand-dark/75 hover:bg-brand-cream inline-flex items-center gap-2"
                        >
                          <Award size={14} /> Certifications
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            if (onNavigate) onNavigate('courses');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-brand-dark/75 hover:bg-brand-cream inline-flex items-center gap-2"
                        >
                          <BookOpen size={14} /> Public Course Catalog
                        </button>
                        {onLogout && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileOpen(false);
                              onLogout();
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
                          >
                            <LogOut size={14} /> Sign Out
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-8 py-3 text-sm font-bold text-white bg-brand-dark rounded-full hover:bg-brand-accent transition-colors duration-300 shadow-lg"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
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
            transition={{ type: 'tween', ease: 'circOut', duration: 0.4 }}
            className="print:hidden fixed inset-0 z-50 bg-brand-cream flex flex-col justify-center items-center space-y-7 px-6"
          >
            <button
              type="button"
              className="absolute top-6 right-6 text-brand-dark p-2"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={32} />
            </button>

            {session && (
              <div className="text-center pb-2">
                <div className="text-xs font-mono text-brand-accent font-semibold uppercase">
                  {roleBadge}
                </div>
                <div className="text-sm font-bold text-brand-dark">{session.name}</div>
              </div>
            )}

            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-3xl font-bold transition-colors tracking-tight inline-flex items-center gap-3 ${
                  currentView === item.view
                    ? 'text-brand-accent'
                    : 'text-brand-dark hover:text-brand-accent'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  if (onNavigate) onNavigate(item.view);
                }}
              >
                <span>{item.name}</span>
                {(item.view === 'messages' || item.view === 'mentor-messages') &&
                  unreadMessages > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-accent text-white text-xs font-bold">
                      {unreadMessages}
                    </span>
                  )}
              </a>
            ))}

            {session ? (
              <div className="flex flex-col items-center gap-4 pt-4">
                {session.role === 'student' && onSwitchTrack && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {trackSwitcherItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSwitchTrack(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                          session.trackId === item.id
                            ? 'bg-brand-dark text-white border-brand-dark'
                            : 'bg-white text-brand-dark/70 border-brand-dark/15'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="px-8 py-3 text-sm font-bold text-red-600 border border-red-200 rounded-full bg-white"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="px-12 py-4 text-lg font-bold text-white bg-brand-dark rounded-full shadow-xl"
              >
                Get Started
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
