import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, ArrowRight, CheckCircle2, Building2, Award } from 'lucide-react';

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
    trackRequirement: 'AI Full-Stack or Python/Java Track',
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[1.05] mb-6">
              Internships &amp; Careers Built on <span className="text-brand-accent">Proof.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/60 font-medium leading-relaxed">
              Move directly from mentor-reviewed minor and major projects into guaranteed internship pathways, mock interview prep, and hiring partner openings across IT, Healthcare, Management, and AgriTech.
            </p>
          </motion.div>

          {/* Job Type Filter */}
          <div className="flex flex-wrap gap-3 mt-10">
            {jobTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'bg-white text-brand-dark/70 border border-brand-dark/10 hover:border-brand-dark/30 hover:text-brand-dark'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Roles List */}
      <section className="px-6">
        <div className="container mx-auto max-w-6xl space-y-5">
          {filteredRoles.map((role, idx) => {
            const isApplied = appliedIds.includes(role.id);

            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="bg-white rounded-[2rem] p-6 md:p-8 border border-brand-dark/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark bg-brand-secondary px-3 py-1 rounded-full">
                      <Building2 size={13} /> {role.domain}
                    </span>
                    <span className="text-xs font-bold text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
                      {role.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-dark/60 bg-brand-cream px-3 py-1 rounded-full border border-brand-dark/5">
                      <Award size={12} /> {role.trackRequirement}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-brand-dark mb-2 tracking-tight">
                    {role.title}
                  </h2>
                  <p className="text-brand-dark/65 text-sm leading-relaxed mb-4 max-w-2xl">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-brand-dark/55">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {role.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={14} /> Project-Backed Screening
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {role.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 bg-brand-secondary/50 text-brand-dark/70 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:w-auto flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApply(role.id)}
                    className={`w-full lg:w-auto px-8 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      isApplied
                        ? 'bg-green-600 text-white'
                        : 'bg-brand-dark text-white hover:bg-brand-accent shadow-md'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 size={16} /> Interest Submitted
                      </>
                    ) : (
                      <>
                        Apply via Track <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
};

export default CareersPage;
