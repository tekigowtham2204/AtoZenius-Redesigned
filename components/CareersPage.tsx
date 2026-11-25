import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, ArrowRight, Zap, CheckCircle2, Building2 } from 'lucide-react';

interface CareersPageProps {
  onOpenAuth: () => void;
}

interface JobRole {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-Time' | 'Internship' | 'Contract';
  compensation: string;
  matchScore: string;
  skills: string[];
  description: string;
}

const rolesData: JobRole[] = [
  {
    id: 'stripe-be',
    title: 'Senior Backend Engineer',
    company: 'Stripe',
    location: 'Remote / San Francisco',
    type: 'Full-Time',
    compensation: '$210k - $275k',
    matchScore: '98% Match',
    skills: ['Go', 'Distributed Systems', 'PostgreSQL'],
    description: 'Architect low-latency ledger and payment orchestration APIs serving global enterprise merchants.',
  },
  {
    id: 'vercel-fe',
    title: 'Staff Frontend Engineer',
    company: 'Vercel',
    location: 'Remote',
    type: 'Full-Time',
    compensation: '$195k - $250k',
    matchScore: '96% Match',
    skills: ['Next.js', 'TypeScript', 'React'],
    description: 'Shape developer experience and build real-time deployment dashboards for millions of developers.',
  },
  {
    id: 'anthropic-ai',
    title: 'Applied AI Engineer',
    company: 'Anthropic',
    location: 'San Francisco / Hybrid',
    type: 'Full-Time',
    compensation: '$240k - $320k',
    matchScore: '95% Match',
    skills: ['Python', 'PyTorch', 'Evaluation'],
    description: 'Design agentic evaluation harnesses and scale reliable tool-use workflows for frontier models.',
  },
  {
    id: 'linear-intern',
    title: 'Product Engineering Intern',
    company: 'Linear',
    location: 'Remote',
    type: 'Internship',
    compensation: '$65 / hr',
    matchScore: '94% Match',
    skills: ['TypeScript', 'GraphQL', 'UI Motion'],
    description: 'Work alongside staff engineers shipping high-craft sync engine features and keyboard-first UI.',
  },
  {
    id: 'figma-sys',
    title: 'Systems Infrastructure Contractor',
    company: 'Figma',
    location: 'Remote',
    type: 'Contract',
    compensation: '$140 / hr',
    matchScore: '92% Match',
    skills: ['Rust', 'WebAssembly', 'Kubernetes'],
    description: 'Optimize real-time multiplayer state synchronization and container cold-start latency.',
  },
  {
    id: 'raycast-mac',
    title: 'Full-Stack Developer',
    company: 'Raycast',
    location: 'Remote (EU/US)',
    type: 'Full-Time',
    compensation: '$170k - $210k',
    matchScore: '93% Match',
    skills: ['React', 'Node.js', 'APIs'],
    description: 'Build cloud sync, team collaboration extensions, and AI command integrations.',
  },
];

const jobTypes = ['All', 'Full-Time', 'Internship', 'Contract'] as const;

const CareersPage: React.FC<CareersPageProps> = ({ onOpenAuth }) => {
  const [selectedType, setSelectedType] = useState<(typeof jobTypes)[number]>('All');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const filteredRoles = selectedType === 'All'
    ? rolesData
    : rolesData.filter((r) => r.type === selectedType);

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
      <section className="px-6 mb-14 md:mb-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[1.05] mb-6">
              Careers Matched to <span className="text-brand-accent">Proof.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/60 font-medium leading-relaxed">
              Skip the resume black hole. Apply directly to vetted engineering, AI, and product roles where your verified Skill DNA gets you fast-tracked to hiring teams.
            </p>
          </motion.div>

          {/* Job Type Filter */}
          <div className="flex flex-wrap gap-3 mt-10">
            {jobTypes.map((type) => (
              <button
                key={type}
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white rounded-[2rem] p-6 md:p-8 border border-brand-dark/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark bg-brand-secondary px-3 py-1 rounded-full">
                      <Building2 size={13} /> {role.company}
                    </span>
                    <span className="text-xs font-bold text-brand-dark/60 bg-brand-cream px-3 py-1 rounded-full border border-brand-dark/5">
                      {role.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                      <Zap size={12} /> {role.matchScore}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-brand-dark mb-2 tracking-tight">
                    {role.title}
                  </h3>
                  <p className="text-brand-dark/65 text-sm leading-relaxed mb-4 max-w-2xl">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-brand-dark/50">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {role.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign size={14} /> {role.compensation}
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
                    onClick={() => handleApply(role.id)}
                    className={`w-full lg:w-auto px-8 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      isApplied
                        ? 'bg-green-600 text-white'
                        : 'bg-brand-dark text-white hover:bg-brand-accent shadow-md'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 size={16} /> Applied
                      </>
                    ) : (
                      <>
                        Apply Now <ArrowRight size={16} />
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
