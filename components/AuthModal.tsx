import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  MessageCircle,
} from 'lucide-react';
import { ViewState } from '../types';
import {
  addAdmissionsLead,
  computeInitials,
  detectRoleFromEmail,
  PortalSession,
  portalTracks,
  PortalTrackId,
} from '../data/portal';

interface AuthModalProps {
  onNavigate?: (view: ViewState) => void;
  onLogin: (session: PortalSession) => void;
}

const trackOptions: { id: PortalTrackId; code: string; shortLabel: string }[] = [
  { id: 'ai-full-stack', code: 'FS-08', shortLabel: 'AI Full-Stack' },
  { id: 'advanced-medical-coding', code: 'MC-14', shortLabel: 'Medical Coding' },
  { id: 'data-science-analytics', code: 'DS-11', shortLabel: 'Data Science' },
];

const AuthModal: React.FC<AuthModalProps> = ({ onNavigate, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<PortalTrackId>('ai-full-stack');
  const [agreed, setAgreed] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const switchMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isLogin && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your email address and password.');
      return;
    }
    if (!isLogin && !agreed) {
      setErrorMessage('Please accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    const detected = detectRoleFromEmail(email, selectedTrack);
    const resolvedName = fullName.trim() || detected.suggestedName;

    if (!isLogin && detected.role === 'student') {
      addAdmissionsLead({
        name: resolvedName,
        email: email.trim(),
        phone: '+91 9502886626',
        program: portalTracks[detected.trackId].courseTitle,
        source: 'Portal Signup',
        notes: `Self-registered for ${portalTracks[detected.trackId].batchCode}`,
      });
    }

    onLogin({
      name: resolvedName,
      email: email.trim(),
      initials: computeInitials(resolvedName),
      role: detected.role,
      trackId: detected.trackId,
    });
  };

  const handleQuickDemo = (trackId: PortalTrackId) => {
    const demoNames: Record<PortalTrackId, string> = {
      'ai-full-stack': 'Kalyan Karadi',
      'advanced-medical-coding': 'Mukul Chowdary',
      'data-science-analytics': 'Siva Yarra',
    };
    const name = demoNames[trackId];
    onLogin({
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@atozenius.in`,
      initials: computeInitials(name),
      role: 'student',
      trackId,
    });
  };

  const handleAutofillRoleEmail = (sampleEmail: string) => {
    setIsLogin(true);
    setEmail(sampleEmail);
    setPassword('atozenius-demo');
    setErrorMessage(null);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col lg:flex-row bg-brand-cream w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {/* Left Architectural Showcase Panel */}
      <div className="hidden lg:flex w-[44%] bg-[#0A0B0E] flex-col justify-between p-12 xl:p-14 text-white relative overflow-hidden shrink-0">
        {/* Hairline Radial Geometry */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="absolute -right-24 -top-24 w-[420px] h-[420px] pointer-events-none opacity-30"
        >
          <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <circle
            cx="200"
            cy="200"
            r="125"
            fill="none"
            stroke="rgba(37,99,235,0.45)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <line x1="20" y1="200" x2="380" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </svg>

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('landing');
            }}
            className="text-3xl font-bold tracking-tighter inline-block hover:opacity-80 transition-opacity"
          >
            AtoZenius<span className="text-brand-accent">.</span>
          </a>
          <span className="text-[11px] font-mono text-white/45 tracking-wider">
            OFFLINE + DIGITAL COMPANION
          </span>
        </div>

        {/* Center Thesis + Tactile Workspace Preview Card */}
        <div className="relative z-10 space-y-8 my-auto py-8 max-w-md">
          <div>
            <h2 className="text-4xl xl:text-[2.75rem] font-bold tracking-[-0.03em] leading-[1.1] mb-4 text-white">
              Learn Better.
              <br />
              <span className="text-[#60A5FA]">Achieve Faster.</span>
            </h2>
            <p className="text-white/55 text-base leading-relaxed">
              Your classroom study guides, capstone reviews, and batch community in one quiet workspace.
            </p>
          </div>

          {/* Editorial Specimen Mini-Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between text-[11px] font-mono">
              <span className="inline-flex items-center gap-2 text-[#60A5FA]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA]" />
                Next Offline Session
              </span>
              <span className="text-white/45">10:00 AM · Room 204</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="text-sm font-semibold text-white leading-snug">
                Personalized Lecture Guides, Capstone Milestones &amp; Mentor Feedback
              </div>
              <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-3 text-[11px] font-mono text-white/55">
                <div>
                  <span className="block text-white/35">TRACKS</span>
                  <span className="text-white/85">IT · Pharma</span>
                </div>
                <div>
                  <span className="block text-white/35">PROJECTS</span>
                  <span className="text-white/85">3 Minor · 2 Major</span>
                </div>
                <div>
                  <span className="block text-white/35">COMMUNITY</span>
                  <span className="text-white/85">Web + WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-white/35">
          <span>© 2026 AtoZenius Private Limited</span>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('landing');
            }}
            className="text-white/55 hover:text-white inline-flex items-center gap-1 transition-colors"
          >
            Back to site <ArrowUpRight size={12} />
          </a>
        </div>
      </div>

      {/* Right Precision Form Panel */}
      <div className="flex-1 flex flex-col bg-brand-cream min-h-screen overflow-y-auto no-scrollbar">
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center px-6 pt-6 pb-2 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('landing');
            }}
            className="font-bold text-xl tracking-tighter text-brand-dark"
          >
            AtoZenius<span className="text-brand-accent">.</span>
          </a>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('landing')}
            className="text-xs font-semibold text-brand-dark/60 hover:text-brand-dark"
          >
            Back to home
          </button>
        </div>

        <div className="flex-1 px-6 py-8 md:py-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-[430px]">
            {/* Top Segmented Mode Switcher */}
            <div className="inline-flex p-1 rounded-full bg-brand-dark/[0.05] border border-brand-dark/10 mb-7">
              <button
                type="button"
                onClick={() => switchMode(true)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  isLogin
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'text-brand-dark/60 hover:text-brand-dark'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode(false)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  !isLogin
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'text-brand-dark/60 hover:text-brand-dark'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Clean Display Header */}
            <motion.div
              key={isLogin ? 'login-header' : 'signup-header'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-7"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-[-0.03em] mb-2">
                {isLogin ? 'Welcome back.' : 'Join your cohort.'}
              </h1>
              <p className="text-brand-dark/60 text-sm leading-relaxed">
                {isLogin
                  ? 'Sign in with your AtoZenius email to open your workspace.'
                  : 'Create your account to access offline class notes and batch updates.'}
              </p>
            </motion.div>

            {/* Unified Tactile Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label
                      htmlFor="auth-fullname"
                      className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1.5"
                    >
                      Full name
                    </label>
                    <input
                      id="auth-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Kalyan Karadi"
                      className="w-full px-4 py-3.5 rounded-2xl bg-white border border-brand-dark/12 text-sm text-brand-dark placeholder:text-brand-dark/35 focus:outline-none focus:border-brand-dark focus:ring-4 focus:ring-brand-dark/5 transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border border-brand-dark/12 text-sm text-brand-dark placeholder:text-brand-dark/35 focus:outline-none focus:border-brand-dark focus:ring-4 focus:ring-brand-dark/5 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-white border border-brand-dark/12 text-sm text-brand-dark placeholder:text-brand-dark/35 focus:outline-none focus:border-brand-dark focus:ring-4 focus:ring-brand-dark/5 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-dark/40 hover:text-brand-dark transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Cohort Selector only when creating a student account */}
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 pt-1"
                  >
                    <div>
                      <span className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                        Select enrolled track
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {trackOptions.map((opt) => {
                          const isSelected = selectedTrack === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedTrack(opt.id)}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-brand-dark text-white border-brand-dark'
                                  : 'bg-white text-brand-dark border-brand-dark/12 hover:border-brand-dark/35'
                              }`}
                            >
                              <div
                                className={`text-[10px] font-mono ${
                                  isSelected ? 'text-[#60A5FA]' : 'text-brand-accent'
                                }`}
                              >
                                {opt.code}
                              </div>
                              <div className="text-[11px] font-bold leading-tight mt-0.5">
                                {opt.shortLabel}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group pt-1">
                      <div className="relative w-5 h-5 rounded-md border border-brand-dark/25 group-hover:border-brand-accent flex items-center justify-center transition-colors shrink-0 bg-white">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="peer opacity-0 absolute inset-0 cursor-pointer"
                        />
                        <Check
                          size={12}
                          className="text-brand-accent opacity-0 peer-checked:opacity-100 transition-opacity"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-xs text-brand-dark/65 leading-snug select-none">
                        I accept the{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (onNavigate) onNavigate('terms');
                          }}
                          className="font-bold text-brand-dark underline decoration-brand-accent/50 hover:text-brand-accent"
                        >
                          Terms &amp; Conditions
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (onNavigate) onNavigate('privacy-policy');
                          }}
                          className="font-bold text-brand-dark underline decoration-brand-accent/50 hover:text-brand-accent"
                        >
                          Privacy Policy
                        </button>
                        .
                      </span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {errorMessage && (
                <p className="text-xs font-semibold text-red-600">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="w-full py-4 px-6 bg-brand-dark text-white rounded-full text-sm font-bold hover:bg-brand-accent transition-colors duration-300 shadow-[0_12px_30px_-10px_rgba(5,5,5,0.35)] flex items-center justify-center gap-2.5 mt-2"
              >
                <span>{isLogin ? 'Continue to workspace' : 'Create account'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Clean Architectural Preview Dock */}
            <div className="mt-8 pt-6 border-t border-brand-dark/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45">
                  Instant learner preview
                </span>
                <span className="text-[11px] font-mono text-brand-dark/40">1-click demo</span>
              </div>

              <div className="grid grid-cols-3 bg-white border border-brand-dark/10 rounded-2xl divide-x divide-brand-dark/10 overflow-hidden">
                {trackOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleQuickDemo(opt.id)}
                    className="p-3 text-left hover:bg-[#F7F4EE] transition-colors group"
                  >
                    <div className="text-[10px] font-mono text-brand-accent font-semibold flex items-center justify-between">
                      <span>{opt.code}</span>
                      <ArrowUpRight
                        size={11}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="text-xs font-bold text-brand-dark leading-tight mt-0.5">
                      {opt.shortLabel}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-brand-dark/50">
                <span>
                  Faculty / Staff:{' '}
                  <button
                    type="button"
                    onClick={() => handleAutofillRoleEmail('mentor@atozenius.in')}
                    className="font-mono text-brand-dark/75 hover:text-brand-accent underline decoration-brand-dark/20"
                  >
                    mentor@atozenius.in
                  </button>{' '}
                  ·{' '}
                  <button
                    type="button"
                    onClick={() => handleAutofillRoleEmail('staff@atozenius.com')}
                    className="font-mono text-brand-dark/75 hover:text-brand-accent underline decoration-brand-dark/20"
                  >
                    staff@atozenius.com
                  </button>
                </span>
              </div>
            </div>

            {/* Enrollment Help */}
            <div className="mt-6 text-center">
              <a
                href="https://api.whatsapp.com/send?phone=919502886626&text=Hi%2C%20I%20need%20help%20getting%20started%20with%20AtoZenius."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-dark/55 hover:text-brand-accent transition-colors"
              >
                <MessageCircle size={13} /> Need enrollment help? WhatsApp +91 9502886626
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthModal;
