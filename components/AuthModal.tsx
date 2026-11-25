import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, Github, Command, Check } from 'lucide-react';
import { ViewState } from '../types';

interface AuthModalProps {
  onNavigate?: (view: ViewState) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col md:flex-row bg-brand-cream w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {/* Left Panel - Brand/Art Section (Hidden on Mobile) */}
      <div className="hidden md:flex w-[45%] lg:w-[40%] bg-brand-dark flex-col justify-between p-12 text-white relative overflow-hidden shrink-0">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-accent/20 rounded-full blur-3xl -ml-20 -mb-20" />

        {/* Logo */}
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

        {/* Quote / Main Text */}
        <motion.div 
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-md"
        >
          <h2 className="text-4xl lg:text-5xl font-serif leading-tight mb-6 text-white/95">
            {isLogin ? "Welcome back to the future of work." : "Begin your journey to excellence."}
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Join thousands of professionals redefining their career path through our intelligent ecosystem.
          </p>
        </motion.div>

        {/* Footer Text */}
        <motion.div 
           variants={fadeVariants}
           initial="hidden"
           animate="visible"
           className="relative z-10 text-brand-secondary/40 text-xs uppercase tracking-widest font-bold"
        >
          © 2024 AtoZenius Ecosystem
        </motion.div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="flex-1 flex flex-col relative bg-brand-cream min-h-screen overflow-y-auto">
        {/* Mobile Logo Header */}
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

        {/* Scrollable Container - Improved for Mobile Layout */}
        <div className="flex-1 px-6 py-8 md:py-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-md">
                  <motion.div
                     key={isLogin ? "login-header" : "signup-header"}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.4 }}
                     className="mb-8 text-center md:text-left"
                  >
                    <h3 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2 tracking-tight">
                      {isLogin ? "Sign In" : "Create Account"}
                    </h3>
                    <p className="text-brand-dark/50 text-sm md:text-base">
                      {isLogin ? "Enter your credentials to access your dashboard." : "Fill in your details to start your free trial."}
                    </p>
                  </motion.div>

                  {/* Form */}
                  <form className="space-y-4 md:space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <AnimatePresence mode="popLayout">
                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="relative group">
                            <label className="block text-xs font-bold text-brand-dark/40 uppercase tracking-wider mb-2">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-0 top-3.5 text-brand-dark/30 group-focus-within:text-brand-accent transition-colors" size={20} />
                              <input 
                                type="text" 
                                className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-brand-dark/20 focus:border-brand-accent outline-none text-brand-dark transition-all placeholder-transparent focus:bg-brand-secondary/20 rounded-t-lg"
                                placeholder="John Doe"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="relative group">
                      <label className="block text-xs font-bold text-brand-dark/40 uppercase tracking-wider mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-0 top-3.5 text-brand-dark/30 group-focus-within:text-brand-accent transition-colors" size={20} />
                        <input 
                          type="email" 
                          className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-brand-dark/20 focus:border-brand-accent outline-none text-brand-dark transition-all placeholder-transparent focus:bg-brand-secondary/20 rounded-t-lg"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-xs font-bold text-brand-dark/40 uppercase tracking-wider mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-0 top-3.5 text-brand-dark/30 group-focus-within:text-brand-accent transition-colors" size={20} />
                        <input 
                          type="password" 
                          className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-brand-dark/20 focus:border-brand-accent outline-none text-brand-dark transition-all placeholder-transparent focus:bg-brand-secondary/20 rounded-t-lg"
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
                                <input type="checkbox" className="peer opacity-0 absolute inset-0 cursor-pointer" />
                                <Check size={12} className="text-brand-accent opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                              </div>
                              <span className="text-xs text-brand-dark/60 leading-tight pt-0.5 select-none">
                                I agree to the <span className="font-bold text-brand-dark underline decoration-brand-accent/50">Terms</span> and <span className="font-bold text-brand-dark underline decoration-brand-accent/50">Policy</span>.
                              </span>
                           </label>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-4 md:py-5 bg-brand-dark text-brand-cream rounded-xl font-bold tracking-wide shadow-lg hover:shadow-xl hover:bg-brand-accent transition-all flex items-center justify-center gap-3 mt-6"
                    >
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight size={18} />
                    </motion.button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6 md:my-8">
                    <div className="h-px bg-brand-dark/10 flex-1" />
                    <span className="text-xs font-bold text-brand-dark/30 uppercase tracking-widest">Or continue with</span>
                    <div className="h-px bg-brand-dark/10 flex-1" />
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 py-3 md:py-4 border border-brand-dark/10 rounded-xl hover:bg-white hover:border-brand-dark/30 hover:shadow-md transition-all text-sm font-bold text-brand-dark/70 bg-white/50">
                      <Github size={18} />
                      <span className="hidden xs:inline">GitHub</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 md:py-4 border border-brand-dark/10 rounded-xl hover:bg-white hover:border-brand-dark/30 hover:shadow-md transition-all text-sm font-bold text-brand-dark/70 bg-white/50">
                      <Command size={18} />
                      <span className="hidden xs:inline">Apple</span>
                    </button>
                  </div>
                  
                  {/* Switcher */}
                  <div className="mt-6 md:mt-8 text-center pb-4">
                     <p className="text-brand-dark/60 text-sm">
                       {isLogin ? "New to AtoZenius?" : "Already have an account?"}{" "}
                       <button 
                         onClick={toggleMode}
                         className="font-bold text-brand-accent hover:text-brand-dark hover:underline underline-offset-4 transition-colors ml-1"
                       >
                         {isLogin ? "Create account" : "Sign in"}
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