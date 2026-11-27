import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CareersPageProps {
  onOpenAuth: () => void;
}

interface CareerOpportunity {
  id: string;
  title: string;
  domain: string;
  location: string;
  type: 'Internship' | 'Full-Time' | 'Placement Track';
  trackRequirement: string;
  skills: string[];
  description: string;
}

const rolesData: CareerOpportunity[] = [
  {
    id: 'ai-fullstack-dev',
    title: 'AI Full-Stack Developer',
    domain: 'IT & Software Partners',
    location: 'Bengaluru / Hyderabad / Remote',
    type: 'Full-Time',
    trackRequirement: 'AI Full-Stack or Python / Java Track',
    skills: ['React', 'TypeScript', 'Python / Node.js', 'SQL'],
    description:
      'Build responsive web products and API integrations alongside engineering teams using skills proven in major capstone builds.',
  },
  {
    id: 'medical-coder-trainee',
    title: 'Certified Medical Coder (Trainee / Junior)',
    domain: 'Healthcare & RCM Partners',
    location: 'Hyderabad / Chennai / Remote',
    type: 'Full-Time',
    trackRequirement: 'Advanced Medical Coding Track',
    skills: ['ICD-10-CM', 'CPT', 'HCPCS', 'Clinical Audits'],
    description:
      'Review diagnostic and procedural patient documentation accurately for healthcare revenue-cycle and clinical operations teams.',
  },
  {
    id: 'python-intern',
    title: 'Python Full-Stack Software Intern',
    domain: 'Product Engineering Partners',
    location: 'Remote / Hybrid',
    type: 'Internship',
    trackRequirement: 'Python Full Stack & Internship Track',
    skills: ['Python', 'Django', 'REST APIs', 'Frontend UI'],
    description:
      'Collaborate with engineering mentors on live feature tickets, API endpoints, and automated testing workflows.',
  },
  {
    id: 'data-analyst-associate',
    title: 'Junior Data & Business Analyst',
    domain: 'Analytics & Consulting Partners',
    location: 'Bengaluru / Pune / Remote',
    type: 'Placement Track',
    trackRequirement: 'Data Science & Analytics Mastery',
    skills: ['SQL', 'Python', 'Power BI', 'Excel'],
    description:
      'Clean operational datasets, create stakeholder KPI dashboards, and surface actionable growth insights.',
  },
  {
    id: 'soc-cyber-intern',
    title: 'Cyber Security & SOC Intern',
    domain: 'Enterprise Security Partners',
    location: 'Hyderabad / Remote',
    type: 'Internship',
    trackRequirement: 'Cyber Security Essentials',
    skills: ['Linux', 'SIEM', 'Network Defense', 'VAPT'],
    description:
      'Assist security analysts with log triage, vulnerability scans, and endpoint hardening checklists.',
  },
  {
    id: 'growth-marketing-exec',
    title: 'Performance & Digital Marketing Associate',
    domain: 'D2C & Growth Partners',
    location: 'Remote / Hybrid',
    type: 'Placement Track',
    trackRequirement: 'Digital Marketing Pro',
    skills: ['SEO', 'Google Ads', 'Meta Ads', 'GA4'],
    description:
      'Manage paid campaign funnels, keyword research, and conversion analytics for scaling digital brands.',
  },
];

const jobTypes = ['All', 'Internship', 'Full-Time', 'Placement Track'] as const;

const typeDotColor: Record<CareerOpportunity['type'], string> = {
  'Full-Time': 'bg-brand-accent',
  Internship: 'bg-emerald-600',
  'Placement Track': 'bg-amber-600',
};

const CareersPage: React.FC<CareersPageProps> = ({ onOpenAuth }) => {
  const [selectedType, setSelectedType] = useState<(typeof jobTypes)[number]>('All');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const filteredRoles =
    selectedType === 'All' ? rolesData : rolesData.filter((r) => r.type === selectedType);

  const handleApply = (id: string) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds((prev) => [...prev, id]);
    }
    onOpenAuth();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <section className="px-6 mb-14 md:mb-16">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[1.05] mb-6">
              Internships &amp; Careers Built on <span className="text-brand-accent">Proof.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/60 font-medium leading-relaxed">
              Move directly from mentor-reviewed minor and major projects into guaranteed internship pathways, mock interview prep, and vetted openings with hiring partners.
            </p>
          </motion.div>

          {/* Editorial Tab Filter */}
          <div className="flex flex-wrap items-center gap-2 mt-10 pb-4 border-b border-brand-dark/10">
            {jobTypes.map((type) => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/5'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial Opportunity Index */}
      <section className="px-6">
        <div className="container mx-auto max-w-6xl space-y-5">
          {filteredRoles.map((role, idx) => {
            const isApplied = appliedIds.includes(role.id);
            const dotClass = typeDotColor[role.type];

            return (
              <motion.article
                key={role.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="group bg-white rounded-[1.75rem] border border-brand-dark/10 overflow-hidden flex flex-col lg:flex-row items-stretch transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-16px_rgba(5,5,5,0.1)]"
              >
                {/* Left Role Dossier Body */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    {/* Clean Hairline Metadata Strip (Zero Pill Spam) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-brand-dark/80">
                        <span className="inline-flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                          {role.type}
                        </span>
                        <span className="text-brand-dark/25">/</span>
                        <span className="text-brand-dark/60">{role.domain}</span>
                      </div>
                      <span className="text-xs font-mono text-brand-dark/50">
                        {role.location}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-[1.75rem] font-bold text-brand-dark tracking-[-0.025em] leading-tight mb-2.5">
                      {role.title}
                    </h2>
                    <p className="text-[14px] text-brand-dark/70 leading-relaxed max-w-2xl mb-6">
                      {role.description}
                    </p>
                  </div>

                  {/* Typographic Spec Strip */}
                  <div className="pt-4 border-t border-brand-dark/10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45">
                        Qualifying Track
                      </span>
                      <span className="text-xs font-semibold text-brand-dark">
                        {role.trackRequirement}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45">
                        Core Skills
                      </span>
                      <span className="text-xs font-medium text-brand-dark/75">
                        {role.skills.join(' · ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Bay */}
                <div className="lg:w-64 shrink-0 bg-[#F7F4EE]/75 border-t lg:border-t-0 lg:border-l border-brand-dark/10 p-6 sm:p-8 flex flex-row lg:flex-col items-center lg:items-start justify-between gap-4">
                  <div className="hidden sm:block">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 block mb-1">
                      Screening
                    </span>
                    <span className="text-xs font-semibold text-brand-dark/80">
                      Project-backed review
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApply(role.id)}
                    className={`w-full sm:w-auto lg:w-full py-3.5 px-6 rounded-full text-xs font-bold inline-flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                      isApplied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-brand-dark text-white group-hover:bg-brand-accent'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 size={15} /> Applied
                      </>
                    ) : (
                      <>
                        Apply via track
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
};

export default CareersPage;
