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
    title: 'Choose Your Course',
    desc: 'Pick a structured track across IT, Pharma & Healthcare, Non-IT & Management, or Agriculture.',
    icon: BookOpen,
  },
  {
    step: '02',
    title: 'Learn from Experts',
    desc: 'Train live with industry mentors who bring practical production experience to every session.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Practice with Projects',
    desc: 'Apply concepts immediately through 3 minor projects and 2 real-world major capstones.',
    icon: Layers,
  },
  {
    step: '04',
    title: 'Get Certified',
    desc: 'Earn Course Completion and Internship Completion certificates backed by verifiable project work.',
    icon: Award,
  },
  {
    step: '05',
    title: 'Complete Internships',
    desc: 'Gain practical exposure through guided internship workflows and mentor reviews.',
    icon: Target,
  },
  {
    step: '06',
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
            {learningSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-white rounded-[2rem] p-7 border border-brand-dark/5 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-2xl bg-brand-secondary flex items-center justify-center text-brand-dark">
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-mono font-bold text-brand-dark/35">
                      STEP {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-dark/65 leading-relaxed">{item.desc}</p>
                </div>
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
