import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, ArrowRight, MessageSquare, Award, CheckCircle2, Linkedin } from 'lucide-react';
import { mentorsData, mentorSpecialties, MentorSpecialty } from '../data/mentors';

interface MentorsPageProps {
  onOpenAuth: () => void;
}

const MentorsPage: React.FC<MentorsPageProps> = ({ onOpenAuth }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<MentorSpecialty>('All');
  const [bookedIds, setBookedIds] = useState<string[]>([]);

  const filteredMentors =
    selectedSpecialty === 'All'
      ? mentorsData
      : mentorsData.filter((m) => m.specialty === selectedSpecialty);

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
      <section className="px-6 mb-14 md:mb-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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

          {/* Specialty Filter */}
          <div className="flex flex-wrap gap-3 mt-10">
            {mentorSpecialties.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedSpecialty === spec
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'bg-white text-brand-dark/70 border border-brand-dark/10 hover:border-brand-dark/30 hover:text-brand-dark'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredMentors.map((mentor, idx) => {
              const isBooked = bookedIds.includes(mentor.id);

              return (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="bg-white rounded-[2rem] p-8 border border-brand-dark/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-bold text-lg tracking-tight shrink-0">
                          {mentor.initials}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-brand-dark tracking-tight">{mentor.name}</h2>
                          <p className="text-xs font-semibold text-brand-dark/60">{mentor.role}</p>
                          <p className="text-xs font-bold text-brand-accent">{mentor.organization}</p>
                        </div>
                      </div>
                      {mentor.linkedinUrl && (
                        <a
                          href={mentor.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${mentor.name} LinkedIn`}
                          className="w-9 h-9 rounded-full bg-brand-cream border border-brand-dark/10 flex items-center justify-center text-brand-dark/60 hover:text-brand-accent hover:border-brand-accent transition-colors shrink-0"
                        >
                          <Linkedin size={15} />
                        </a>
                      )}
                    </div>

                    <p className="text-brand-dark/65 text-sm leading-relaxed mb-6">
                      {mentor.bio}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {mentor.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-brand-secondary/50 text-brand-dark/70 text-xs font-semibold rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-dark/5">
                    <div className="flex items-center justify-between text-xs font-semibold text-brand-dark/60 mb-5">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500 fill-amber-500" /> {mentor.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} /> {mentor.sessions} sessions
                      </span>
                      <span className="flex items-center gap-1">
                        <Award size={14} /> {mentor.experience}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBook(mentor.id)}
                      className={`w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                        isBooked
                          ? 'bg-green-600 text-white'
                          : 'bg-brand-dark text-white hover:bg-brand-accent'
                      }`}
                    >
                      {isBooked ? (
                        <>
                          <CheckCircle2 size={16} /> Session Requested
                        </>
                      ) : (
                        <>
                          <Calendar size={16} /> Book Session <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default MentorsPage;
