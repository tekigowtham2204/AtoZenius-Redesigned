import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, ChevronDown, MapPin } from 'lucide-react';
import { ViewState } from '../types';

interface CompanyCareersPageProps {
  onNavigate: (view: ViewState) => void;
}

interface InternalOpening {
  id: string;
  role: string;
  team: string;
  mode: string;
  summary: string;
  responsibilities: string[];
}

const openings: InternalOpening[] = [
  {
    id: 'ai-fullstack-trainer',
    role: 'Full-Stack & Applied AI Trainer',
    team: 'Engineering Faculty',
    mode: 'Remote / Hybrid',
    summary:
      'Lead live evening/weekend sessions, review student capstone repositories, and run mock technical interviews.',
    responsibilities: [
      'Deliver practical walkthroughs across React, Python/Node, and SQL',
      'Mentor learners through 3 minor and 2 major capstone projects',
      'Provide actionable code reviews and interview readiness feedback',
    ],
  },
  {
    id: 'medical-coding-faculty',
    role: 'Medical Coding & Pharma Subject Matter Expert (CPC)',
    team: 'Pharma & Healthcare',
    mode: 'Remote / Hybrid',
    summary:
      'Teach ICD-10-CM, CPT, and HCPCS frameworks and prepare pharmacy/life-science students for CPC certification.',
    responsibilities: [
      'Conduct structured clinical coding sessions and chart audit practice',
      'Coach learners on CPC exam pacing and compliance standards',
      'Evaluate internship coding submissions and mock assessments',
    ],
  },
  {
    id: 'academic-counselor',
    role: 'Admissions & Career Counselor',
    team: 'Student Success',
    mode: 'Full-Time',
    summary:
      'Guide incoming students in selecting the right upskilling track based on their academic background and goals.',
    responsibilities: [
      'Consult with students across IT, Pharma, Management, and Agriculture backgrounds',
      'Coordinate batch onboarding, mentor schedules, and placement check-ins',
      'Maintain high learner satisfaction throughout cohort lifecycles',
    ],
  },
];

const CompanyCareersPage: React.FC<CompanyCareersPageProps> = ({ onNavigate }) => {
  const [expandedId, setExpandedId] = useState<string | null>(openings[0].id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">
            Work With AtoZenius
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[1.05] mb-6">
            Careers at <span className="text-brand-accent">AtoZenius.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-dark/65 font-medium leading-relaxed">
            Join AtoZenius Private Limited as a mentor, technical trainer, curriculum builder, or student success advisor.
          </p>
        </div>

        <div className="space-y-4">
          {openings.map((job) => {
            const isExpanded = expandedId === job.id;
            return (
              <div
                key={job.id}
                className="bg-white rounded-[2rem] p-6 md:p-8 border border-brand-dark/5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 size={14} /> {job.team}
                      </span>
                      <span className="text-brand-dark/25">•</span>
                      <span className="text-brand-dark/55 inline-flex items-center gap-1">
                        <MapPin size={13} /> {job.mode}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-brand-dark">{job.role}</h2>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : job.id)}
                      className="px-4 py-2.5 rounded-full border border-brand-dark/10 text-xs font-bold text-brand-dark/70 hover:border-brand-dark/30 inline-flex items-center gap-1.5"
                    >
                      Details
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('contact')}
                      className="px-6 py-2.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-1.5"
                    >
                      Apply <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-brand-dark/5 space-y-3">
                    <p className="text-sm text-brand-dark/70 leading-relaxed">{job.summary}</p>
                    <ul className="space-y-2 text-sm text-brand-dark/75">
                      {job.responsibilities.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-brand-accent font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyCareersPage;
