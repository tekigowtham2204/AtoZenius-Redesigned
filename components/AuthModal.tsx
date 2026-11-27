import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, Check, CheckCircle2, MessageCircle } from 'lucide-react';
import { ViewState } from '../types';

interface AuthModalProps {
  onNavigate?: (view: ViewState) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setStatusMessage(null);
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

    setStatusMessage(
      isLogin
        ? `Welcome back (${email}). Connect with your cohort advisor on WhatsApp if you need portal reset assistance.`
        : `Account request received for ${fullName} (${email}). Our admissions team will send your onboarding details shortly.`
    );
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col md:flex-row bg-brand-cream w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {/* Left Panel - Brand/Art Section */}
      <div className="hidden md:flex w-[45%] lg:w-[40%] bg-brand-dark flex-col justify-between p-12 text-white relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-accent/20 rounded-full blur-3xl -ml-20 -mb-20" />

        <motion.div
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
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
        </motion.div>

        <motion.div
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-md"
        >
          <h2 className="text-4xl lg:text-5xl font-serif leading-tight mb-6 text-white/95">
            {isLogin ? 'Learn Better. Achieve Faster.' : 'Begin your mentored career track.'}
          </h2>
          <p className="text-white/55 text-lg leading-relaxed">
            Access practical courses, minor &amp; major capstone reviews, internship certifications, and placement prep in one ecosystem.
          </p>
        </motion.div>

        <motion.div
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-brand-secondary/45 text-xs uppercase tracking-widest font-bold"
        >
          © 2026 AtoZenius Private Limited
        </motion.div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="flex-1 flex flex-col relative bg-brand-cream min-h-screen overflow-y-auto">
        <div className="md:hidden flex justify-between items-center p-6 shrink-0 z-20">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('landing');
            }}
            className="font-bold text-xl text-brand-dark"
          >
            AtoZenius<span className="text-brand-accent">.</span>
          </a>
        </div>

        <div className="flex-1 px-6 py-8 md:py-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-md">
            <motion.div
              key={isLogin ? 'login-header' : 'signup-header'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-8 text-center md:text-left"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2 tracking-tight">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-brand-dark/55 text-sm md:text-base">
                {isLogin
                  ? 'Enter your credentials to access your learner portal.'
                  : 'Fill in your details to enroll in an AtoZenius track.'}
              </p>
            </motion.div>

            {statusMessage ? (
              <div className="bg-white rounded-[1.75rem] p-7 border border-brand-dark/10 shadow-sm text-center space-y-4">
                <CheckCircle2 size={40} className="text-green-600 mx-auto" />
                <p className="text-sm text-brand-dark/75 leading-relaxed">{statusMessage}</p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="https://api.whatsapp.com/send?phone=919502886626&text=Hi%2C%20I%20just%20submitted%20my%20AtoZenius%20enrollment%20details."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-5 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle size={15} /> Connect on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setStatusMessage(null)}
                    className="py-3 px-5 border border-brand-dark/15 text-brand-dark rounded-full text-xs font-bold hover:border-brand-dark/40 transition-colors"
                  >
                    Back to Form
                  </button>
                </div>
              </div>
            ) : (
              <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="relative group">
                        <label className="block text-xs font-bold text-brand-dark/45 uppercase tracking-wider mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-0 top-3.5 text-brand-dark/30 group-focus-within:text-brand-accent transition-colors"
                            size={20}
                          />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-brand-dark/20 focus:border-brand-accent outline-none text-brand-dark transition-all focus:bg-brand-secondary/20 rounded-t-lg"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group">
                  <label className="block text-xs font-bold text-brand-dark/45 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-0 top-3.5 text-brand-dark/30 group-focus-within:text-brand-accent transition-colors"
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-brand-dark/20 focus:border-brand-accent outline-none text-brand-dark transition-all focus:bg-brand-secondary/20 rounded-t-lg"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-xs font-bold text-brand-dark/45 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-0 top-3.5 text-brand-dark/30 group-focus-within:text-brand-accent transition-colors"
                      size={20}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-brand-dark/20 focus:border-brand-accent outline-none text-brand-dark transition-all focus:bg-brand-secondary/20 rounded-t-lg"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Terms Checkbox for Signup */}
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="flex items-start gap-3 mt-4 cursor-pointer group">
                        <div className="relative w-5 h-5 rounded border border-brand-dark/30 group-hover:border-brand-accent flex items-center justify-center transition-colors shrink-0 bg-transparent">
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
                        <span className="text-xs text-brand-dark/65 leading-tight pt-0.5 select-none">
                          I agree to the{' '}
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

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 md:py-5 bg-brand-dark text-brand-cream rounded-xl font-bold tracking-wide shadow-lg hover:shadow-xl hover:bg-brand-accent transition-all flex items-center justify-center gap-3 mt-6"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </motion.button>
              </form>
            )}

            {/* Quick Counselor Fallback */}
            <div className="mt-6 text-center">
              <a
                href="https://api.whatsapp.com/send?phone=919502886626&text=Hi%2C%20I%20need%20help%20getting%20started%20with%20AtoZenius."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark/60 hover:text-brand-accent transition-colors"
              >
                <MessageCircle size={14} /> Need quick enrollment help? Chat on WhatsApp (+91 9502886626)
              </a>
            </div>

            {/* Switcher */}
            <div className="mt-6 md:mt-8 text-center pb-4">
              <p className="text-brand-dark/60 text-sm">
                {isLogin ? 'New to AtoZenius?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-bold text-brand-accent hover:text-brand-dark hover:underline underline-offset-4 transition-colors ml-1"
                >
                  {isLogin ? 'Create account' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthModal;
