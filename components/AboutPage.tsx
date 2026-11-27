import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Users,
  Layers,
  Award,
  Briefcase,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { ViewState } from '../types';

interface AboutPageProps {
  onNavigate: (view: ViewState) => void;
  onOpenAuth: () => void;
}

const learningSteps = [
  {
    step: '01',
    phase: 'Enroll',
    title: 'Choose Your Course',
    desc: 'Pick a structured track across IT, Pharma & Healthcare, Non-IT & Management, or Agriculture.',
    icon: BookOpen,
  },
  {
    step: '02',
    phase: 'Mentorship',
    title: 'Learn from Experts',
    desc: 'Train live with industry mentors who bring practical production experience to every session.',
    icon: Users,
  },
  {
    step: '03',
    phase: 'Execution',
    title: 'Practice with Projects',
    desc: 'Apply concepts immediately through 3 minor projects and 2 real-world major capstones.',
    icon: Layers,
  },
  {
    step: '04',
    phase: 'Credentials',
    title: 'Get Certified',
    desc: 'Earn Course Completion and Internship Completion certificates backed by verifiable project work.',
    icon: Award,
  },
  {
    step: '05',
    phase: 'Experience',
    title: 'Complete Internships',
    desc: 'Gain practical exposure through guided internship workflows and mentor reviews.',
    icon: Target,
  },
  {
    step: '06',
    phase: 'Outcome',
    title: 'Build Your Career',
    desc: 'Unlock placement support, mock interviews, and direct introductions to hiring teams.',
    icon: Briefcase,
  },
];

const pillars = [
  'Practical project-first training instead of passive video playlists',
  'Domain breadth across Software, AI, Data, Pharma/Medical Coding, Management & AgriTech',
  '1-on-1 mentor feedback, doubt resolution, and structured interview prep',
  'Dual recognition with Course Completion & Internship Completion credentials',
];

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      {/* Hero */}
      <section className="px-6 mb-16 md:mb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-4xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">
              AtoZenius Private Limited
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[1.05] mb-6">
              Learn Better. <span className="text-brand-accent">Achieve Faster.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/65 font-medium leading-relaxed max-w-3xl">
              AtoZenius is a career-focused EdTech ecosystem helping students and early-career professionals master industry-ready skills through live training, real-world projects, internships, and dedicated mentor support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Pillars */}
      <section className="px-6 mb-16 md:mb-24">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-12 border border-brand-dark/5 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-brand-dark tracking-tight mb-5">
                Closing the gap between college theory and real hiring expectations.
              </h2>
              <p className="text-brand-dark/70 leading-relaxed mb-5">
                Traditional learning leaves graduates with scattered notes and no real portfolio proof. Employers want people who have shipped projects, resolved edge cases, and worked under realistic mentorship.
              </p>
              <p className="text-brand-dark/70 leading-relaxed">
                Whether a learner is stepping into <strong>AI Full-Stack Development</strong>, <strong>Data Science</strong>, <strong>Cyber Security</strong>, <strong>Medical Coding</strong>, <strong>Digital Marketing</strong>, or <strong>AgriTech</strong>, AtoZenius connects structured training directly to career readiness.
              </p>
            </div>
            <div className="pt-8 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('courses')}
                className="px-8 py-3.5 bg-brand-dark text-white rounded-full font-bold text-sm hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
              >
                Explore Courses <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('mentors')}
                className="px-8 py-3.5 bg-transparent border border-brand-dark/15 text-brand-dark rounded-full font-bold text-sm hover:border-brand-dark/40 transition-colors"
              >
                Meet Our Mentors
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-brand-dark text-white rounded-[2rem] p-8 md:p-10 shadow-xl flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">
                Why AtoZenius
              </p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                Everything needed to move from learner to hire.
              </h3>
              <ul className="space-y-4">
                {pillars.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/80 leading-relaxed">
                    <CheckCircle2 size={18} className="text-brand-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-xs text-white/50">Domains</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-accent">3+2</div>
                <div className="text-xs text-white/50">Minor &amp; Major Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">1-on-1</div>
                <div className="text-xs text-white/50">Mentor Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Learning Journey */}
      <section className="px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 md:mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-3">
              The Learning Journey
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-brand-dark tracking-tight">
              Six steps from enrollment to your next role.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningSteps.map((item, idx) => {
              const Icon = item.icon;
              const isFinalStep = idx === learningSteps.length - 1;
              const progressWidth = `${Math.round(((idx + 1) / learningSteps.length) * 100)}%`;

              return (
                <article
                  key={item.step}
                  className={`group rounded-[1.75rem] border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                    isFinalStep
                      ? 'bg-[#0A0B0E] text-white border-[#0A0B0E] shadow-xl'
                      : 'bg-white text-brand-dark border-brand-dark/10 hover:shadow-[0_20px_40px_-16px_rgba(5,5,5,0.1)]'
                  }`}
                >
                  {/* Top Numeral Plate */}
                  <div
                    className={`px-7 pt-6 pb-5 border-b flex items-start justify-between gap-4 ${
                      isFinalStep
                        ? 'border-white/10 bg-white/[0.03]'
                        : 'border-brand-dark/10 bg-[#F7F4EE]'
                    }`}
                  >
                    <span
                      className={`text-4xl font-extrabold tracking-tighter leading-none ${
                        isFinalStep ? 'text-brand-accent' : 'text-brand-dark'
                      }`}
                    >
                      {item.step}
                    </span>

                    <div
                      className={`inline-flex items-center gap-2 text-xs font-mono ${
                        isFinalStep ? 'text-white/60' : 'text-brand-dark/55'
                      }`}
                    >
                      <span>{item.phase}</span>
                      <Icon
                        size={16}
                        className={isFinalStep ? 'text-brand-accent' : 'text-brand-dark/70'}
                      />
                    </div>
                  </div>

                  {/* Body Copy */}
                  <div className="px-7 pt-6 pb-7 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className={`text-xl font-bold tracking-tight mb-2.5 ${
                          isFinalStep ? 'text-white' : 'text-brand-dark'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-[14px] leading-relaxed ${
                          isFinalStep ? 'text-white/70' : 'text-brand-dark/70'
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>

                    {/* Architectural Progress Hairline */}
                    <div className="mt-7 pt-4">
                      <div
                        className={`h-[2px] w-full rounded-full overflow-hidden ${
                          isFinalStep ? 'bg-white/15' : 'bg-brand-dark/10'
                        }`}
                      >
                        <div
                          className="h-full bg-brand-accent transition-all duration-500"
                          style={{ width: progressWidth }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-14 bg-white rounded-[2rem] p-8 md:p-12 border border-brand-dark/5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-brand-dark tracking-tight mb-2">
                Ready to start your track?
              </h3>
              <p className="text-brand-dark/65 text-sm md:text-base">
                Speak with a counselor or create your learner account to pick the right cohort.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button
                onClick={onOpenAuth}
                className="flex-1 md:flex-none px-7 py-3.5 bg-brand-dark text-white rounded-full text-sm font-bold hover:bg-brand-accent transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="flex-1 md:flex-none px-7 py-3.5 border border-brand-dark/15 text-brand-dark rounded-full text-sm font-bold hover:border-brand-dark/40 transition-colors"
              >
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;
