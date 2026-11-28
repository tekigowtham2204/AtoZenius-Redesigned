import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { mentorSpecialties, MentorItem, MentorSpecialty } from '../data/mentors';
import { getResolvedMentors } from '../data/portal';

interface MentorsPageProps {
  onOpenAuth: () => void;
}

const specialtyDotColor: Record<MentorItem['specialty'], string> = {
  'Pharma & Healthcare': 'bg-emerald-600',
  'IT & Engineering': 'bg-brand-accent',
  'AI & Data': 'bg-[#050505]',
  'Management & Growth': 'bg-amber-600',
  AgriTech: 'bg-lime-700',
};

const MentorsPage: React.FC<MentorsPageProps> = ({ onOpenAuth }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<MentorSpecialty>('All');
  const [bookedIds, setBookedIds] = useState<string[]>([]);

  const resolvedMentors = getResolvedMentors();

  const filteredMentors =
    selectedSpecialty === 'All'
      ? resolvedMentors
      : resolvedMentors.filter((m) => m.specialty === selectedSpecialty);

  const handleBook = (id: string) => {
    if (!bookedIds.includes(id)) {
      setBookedIds((prev) => [...prev, id]);
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
              Learn Directly from <span className="text-brand-accent">Industry Mentors.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/60 font-medium leading-relaxed">
              Get 1-on-1 guidance, project reviews, doubt resolution, and mock interviews with practitioners across IT, AI &amp; Data, Pharma &amp; Medical Coding, Management, and AgriTech.
            </p>
          </motion.div>

          {/* Editorial Tab Filter */}
          <div className="flex flex-wrap items-center gap-2 mt-10 pb-4 border-b border-brand-dark/10">
            {mentorSpecialties.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/5'
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial Mentor Dossier Grid */}
      <section className="px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredMentors.map((mentor, idx) => {
              const isBooked = bookedIds.includes(mentor.id);
              const dotClass = specialtyDotColor[mentor.specialty];

              return (
                <motion.article
                  key={mentor.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="group bg-white rounded-[1.75rem] border border-brand-dark/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(5,5,5,0.12)]"
                >
                  <div>
                    {/* Top Dossier Plate */}
                    <div className="relative px-7 pt-6 pb-7 bg-[#F7F4EE] border-b border-brand-dark/10 overflow-hidden">
                      {/* Oversized Architectural Monogram Watermark */}
                      <span
                        aria-hidden="true"
                        className="absolute -right-2 -bottom-4 text-[5.5rem] font-extrabold tracking-tighter leading-none text-brand-dark/[0.045] select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
                      >
                        {mentor.initials}
                      </span>

                      {/* Metadata Strip */}
                      <div className="relative z-10 flex items-center justify-between gap-3 mb-7">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-tight text-brand-dark/80">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                          {mentor.specialty}
                        </span>
                        <span className="text-xs font-mono text-brand-dark/50">
                          {mentor.experience} exp
                        </span>
                      </div>

                      {/* Full-Width Mentor Identity */}
                      <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-brand-dark tracking-[-0.025em] leading-[1.15] mb-1.5">
                          {mentor.name}
                        </h2>
                        <p className="text-xs font-semibold text-brand-dark/65 leading-snug">
                          {mentor.role}
                        </p>
                        <p className="text-xs font-semibold text-brand-accent mt-0.5">
                          {mentor.organization}
                        </p>
                      </div>
                    </div>

                    {/* Bio & Spec Ledger */}
                    <div className="px-7 pt-6 pb-5">
                      <p className="text-[14px] text-brand-dark/70 leading-relaxed mb-6 line-clamp-3">
                        {mentor.bio}
                      </p>

                      <div className="border-t border-brand-dark/10 divide-y divide-brand-dark/10">
                        <div className="py-3 flex items-baseline justify-between gap-4">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 shrink-0">
                            Focus
                          </span>
                          <span className="text-xs font-medium text-brand-dark/80 text-right leading-snug">
                            {mentor.tags.join(' · ')}
                          </span>
                        </div>
                        <div className="py-3 flex items-baseline justify-between gap-4">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 shrink-0">
                            Mentored
                          </span>
                          <span className="text-xs font-semibold text-brand-dark text-right">
                            {mentor.sessions}+ sessions · {mentor.rating}/5 rating
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Action Strip */}
                  <div className="px-7 pb-6 pt-2 flex items-center justify-between gap-4">
                    {mentor.linkedinUrl ? (
                      <a
                        href={mentor.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand-dark/65 hover:text-brand-accent transition-colors inline-flex items-center gap-1 group/link"
                      >
                        <span>LinkedIn</span>
                        <ArrowUpRight
                          size={14}
                          className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        />
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-brand-dark/45">
                        1-on-1 faculty
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleBook(mentor.id)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                        isBooked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-dark text-white group-hover:bg-brand-accent'
                      }`}
                    >
                      {isBooked ? (
                        <>
                          <CheckCircle2 size={14} /> Requested
                        </>
                      ) : (
                        <>
                          Book session
                          <ArrowRight
                            size={14}
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
        </div>
      </section>
    </motion.div>
  );
};

export default MentorsPage;
