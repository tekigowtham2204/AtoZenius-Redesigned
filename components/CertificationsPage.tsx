import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, ShieldCheck, ArrowRight, Search, FileCheck2 } from 'lucide-react';
import { ViewState } from '../types';

interface CertificationsPageProps {
  onNavigate: (view: ViewState) => void;
  onOpenAuth: () => void;
}

const criteria = [
  {
    title: '3 Minor Projects Completed',
    desc: 'Hands-on mini deliverables validating core concepts and foundational implementation.',
  },
  {
    title: '2 Major Capstones Reviewed',
    desc: 'End-to-end production or clinical projects evaluated by an AtoZenius faculty mentor.',
  },
  {
    title: 'Internship Assessment Passed',
    desc: 'Eligible learners receive both Course Completion and Internship Completion certificates.',
  },
];

const CertificationsPage: React.FC<CertificationsPageProps> = ({ onNavigate, onOpenAuth }) => {
  const [certId, setCertId] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'sample' | 'not-found'>('idle');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = certId.trim().toUpperCase();
    if (cleaned === 'ATZ-2026-8492') {
      setVerifyStatus('sample');
    } else if (cleaned.length > 0) {
      setVerifyStatus('not-found');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <section className="px-6 mb-14 md:mb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">
              Verified Credentials
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[1.05] mb-6">
              Certificates Backed by <span className="text-brand-accent">Real Work.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/65 font-medium leading-relaxed">
              Every AtoZenius graduate earns Course Completion and Internship Completion credentials tied directly to minor and major project evaluations—never empty attendance badges.
            </p>
          </div>
        </div>
      </section>

      {/* Certificate Preview & Qualification */}
      <section className="px-6 mb-16">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Sample Certificate Card */}
          <div className="lg:col-span-7 bg-brand-dark text-white rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-accent/20 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-6 mb-8">
                <div>
                  <span className="text-2xl font-bold tracking-tight">
                    AtoZenius<span className="text-brand-accent">.</span>
                  </span>
                  <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
                    AtoZenius Private Limited
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent">
                  <Award size={24} />
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
                Certificate of Completion &amp; Internship
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Sample Learner Name
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                Has successfully completed all required coursework, 3 minor projects, and 2 mentor-reviewed major capstone projects in{' '}
                <strong className="text-white">AI Full-Stack Development</strong>.
              </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-white/60">
              <div>
                <div className="uppercase tracking-widest text-white/40">Credential ID</div>
                <div className="font-mono font-bold text-white mt-0.5">ATZ-2026-8492</div>
              </div>
              <div className="inline-flex items-center gap-2 text-green-400 font-bold">
                <ShieldCheck size={16} /> Verified Project-Backed Credential
              </div>
            </div>
          </div>

          {/* Qualification Criteria */}
          <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 md:p-10 border border-brand-dark/5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-brand-dark tracking-tight mb-3">
                How You Earn Dual Certificates
              </h3>
              <p className="text-sm text-brand-dark/65 mb-7 leading-relaxed">
                Employers respect credentials only when they represent verified execution. Here is what every learner completes to graduate:
              </p>

              <div className="space-y-5">
                {criteria.map((item) => (
                  <div key={item.title} className="flex items-start gap-3.5">
                    <CheckCircle2 size={20} className="text-brand-accent shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-brand-dark text-sm">{item.title}</h4>
                      <p className="text-xs text-brand-dark/65 leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-brand-dark/5 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('courses')}
                className="flex-1 px-6 py-3.5 bg-brand-dark text-white rounded-full text-sm font-bold hover:bg-brand-accent transition-colors inline-flex items-center justify-center gap-2"
              >
                Explore Programs <ArrowRight size={16} />
              </button>
              <button
                onClick={onOpenAuth}
                className="px-6 py-3.5 border border-brand-dark/15 text-brand-dark rounded-full text-sm font-bold hover:border-brand-dark/40 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Verify Credential Box */}
      <section className="px-6">
        <div className="container mx-auto max-w-6xl bg-white rounded-[2rem] p-8 md:p-10 border border-brand-dark/5 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">
                <FileCheck2 size={15} /> Employer Verification
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-brand-dark tracking-tight mb-2">
                Verify an AtoZenius Certificate
              </h3>
              <p className="text-sm text-brand-dark/65">
                Enter a credential ID to preview verification status (try <code className="px-1.5 py-0.5 bg-brand-cream rounded font-mono text-xs">ATZ-2026-8492</code>).
              </p>
            </div>

            <div className="lg:col-span-6">
              <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" />
                  <input
                    type="text"
                    value={certId}
                    onChange={(e) => {
                      setCertId(e.target.value);
                      if (verifyStatus !== 'idle') setVerifyStatus('idle');
                    }}
                    placeholder="Enter Credential ID (e.g. ATZ-2026-8492)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-full bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-brand-dark text-white rounded-full text-sm font-bold hover:bg-brand-accent transition-colors shrink-0"
                >
                  Verify ID
                </button>
              </form>

              {verifyStatus === 'sample' && (
                <p className="mt-3 text-xs font-semibold text-green-700">
                  Verified sample credential: ATZ-2026-8492 — AI Full-Stack Development (3 Minor + 2 Major Projects).
                </p>
              )}
              {verifyStatus === 'not-found' && (
                <p className="mt-3 text-xs font-semibold text-brand-dark/65">
                  No local sample match for "{certId}". For official employer verification, reach us on{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="text-brand-accent underline font-bold"
                  >
                    Contact
                  </button>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default CertificationsPage;
