import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ViewState } from '../types';

interface FeaturesProps {
  onNavigate?: (view: ViewState) => void;
}

interface JourneyStep {
  step: string;
  view: ViewState;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  icon: React.ElementType;
  highlights: string[];
  outcome: string;
}

const journeySteps: JourneyStep[] = [
  {
    step: '01',
    view: 'courses',
    title: 'Courses',
    subtitle: 'Build Real-World Skills',
    description:
      'Skip outdated lectures. Master AI & Machine Learning, Full-Stack Development, Data Science, Cyber Security, Medical Coding, Digital Marketing, or AgriTech through 3 minor projects and 2 major capstones.',
    ctaLabel: 'Explore Courses',
    icon: BookOpen,
    highlights: [
      'IT, Pharma, Management & Agriculture tracks',
      '3 minor projects + 2 major capstone builds',
      'Course & Internship Completion Certificates',
    ],
    outcome: 'You graduate with verified projects, not just passive notes.',
  },
  {
    step: '02',
    view: 'mentors',
    title: 'Mentors',
    subtitle: 'Sharpen With Practitioners',
    description:
      'Stop learning in the dark. Pair with domain mentors across software engineering, AI, medical coding (CPC), and management for live doubt clearing, project feedback, and realistic mock interviews.',
    ctaLabel: 'Meet Mentors',
    icon: Users,
    highlights: [
      'Live project & clinical audit reviews',
      'Targeted mock technical & CPC interviews',
      'Direct resume & career roadmap guidance',
    ],
    outcome: 'You gain practical judgment and interview confidence.',
  },
  {
    step: '03',
    view: 'careers',
    title: 'Careers',
    subtitle: 'Step Into Internships & Roles',
    description:
      'Move directly from completed projects and verified certifications into hands-on internships, placement preparation, and vetted openings with hiring partners.',
    ctaLabel: 'Browse Careers',
    icon: Briefcase,
    highlights: [
      'Guided internships & full-time placement tracks',
      'Resume workshops & interview readiness drills',
      'Introductions to 200+ hiring partner teams',
    ],
    outcome: 'You launch your career backed by verified skills and proof.',
  },
];

const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = journeySteps[activeIndex];
  const ActiveIcon = activeStep.icon;

  return (
    <section className="relative py-20 md:py-36 z-10" id="ecosystem">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Header */}
        <div className="mb-14 md:mb-20 md:text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold text-brand-accent uppercase tracking-[0.2em] mb-4"
          >
            Your 3-Step Path
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-brand-dark leading-tight tracking-tighter mb-4"
          >
            Courses to <span className="text-brand-dark/40">Careers.</span>
          </motion.h3>
          <p className="text-brand-dark/60 text-base md:text-lg font-medium">
            Select each stage below to see how every step builds toward your first offer.
          </p>
        </div>

        {/* 3-Step Interactive Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {journeySteps.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeIndex;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`text-left p-6 md:p-7 rounded-[1.75rem] border transition-all duration-300 flex items-start gap-4 relative overflow-hidden ${
                  isActive
                    ? 'bg-brand-dark text-white border-brand-dark shadow-xl -translate-y-1'
                    : 'bg-white text-brand-dark border-brand-dark/5 hover:border-brand-dark/20 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-brand-accent text-white'
                      : 'bg-brand-secondary text-brand-dark'
                  }`}
                >
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-mono font-bold uppercase tracking-widest ${
                        isActive ? 'text-brand-accent' : 'text-brand-dark/40'
                      }`}
                    >
                      Step {item.step}
                    </span>
                  </div>
                  <div className="text-xl font-bold tracking-tight mb-1">{item.title}</div>
                  <div
                    className={`text-xs font-medium ${
                      isActive ? 'text-white/70' : 'text-brand-dark/50'
                    }`}
                  >
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-14 border border-brand-dark/5 shadow-lg"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/10 text-brand-accent rounded-full text-xs font-bold uppercase tracking-widest mb-5">
                  <ActiveIcon size={14} />
                  <span>
                    Stage {activeStep.step} — {activeStep.title}
                  </span>
                </div>
                <h4 className="text-3xl md:text-5xl font-bold text-brand-dark tracking-tight mb-5">
                  {activeStep.subtitle}
                </h4>
                <p className="text-brand-dark/70 text-base md:text-lg leading-relaxed mb-8">
                  {activeStep.description}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate(activeStep.view)}
                    className="group px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-sm tracking-wide hover:bg-brand-accent transition-all duration-300 flex items-center gap-2.5 shadow-lg"
                  >
                    {activeStep.ctaLabel}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  {activeIndex < journeySteps.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveIndex(activeIndex + 1)}
                      className="px-6 py-4 text-sm font-bold text-brand-dark/60 hover:text-brand-dark transition-colors"
                    >
                      Next: {journeySteps[activeIndex + 1].title} →
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 bg-brand-cream/80 rounded-[2rem] p-6 md:p-8 border border-brand-dark/5">
                <div className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-5">
                  What You Unlock
                </div>
                <ul className="space-y-4 mb-6">
                  {activeStep.highlights.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm font-semibold text-brand-dark/80">
                      <CheckCircle2 size={18} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-5 border-t border-brand-dark/10">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-brand-dark/40 mb-1">
                    Stage Outcome
                  </div>
                  <p className="text-sm font-bold text-brand-dark">{activeStep.outcome}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Features;
