import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, ArrowRight, MessageSquare, Award, CheckCircle2 } from 'lucide-react';

interface MentorsPageProps {
  onOpenAuth: () => void;
}

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  specialty: 'Systems' | 'AI & ML' | 'Product & Design' | 'Leadership';
  experience: string;
  rating: string;
  sessions: number;
  bio: string;
  tags: string[];
  initials: string;
}

const mentorsData: Mentor[] = [
  {
    id: 'arjun-mehta',
    name: 'Arjun Mehta',
    role: 'Principal Systems Architect',
    company: 'Stripe',
    specialty: 'Systems',
    experience: '11+ yrs',
    rating: '4.98',
    sessions: 142,
    bio: 'Leads payment infrastructure scaling to millions of TPS. Helps engineers master distributed systems and staff-level design interviews.',
    tags: ['Distributed Systems', 'Go', 'Architecture'],
    initials: 'AM',
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Staff AI Research Engineer',
    company: 'Anthropic',
    specialty: 'AI & ML',
    experience: '8+ yrs',
    rating: '4.99',
    sessions: 98,
    bio: 'Specializes in LLM evaluation, inference optimization, and transitioning software engineers into applied AI roles.',
    tags: ['LLMs', 'PyTorch', 'Inference'],
    initials: 'ER',
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    role: 'VP of Engineering',
    company: 'Linear',
    specialty: 'Leadership',
    experience: '14+ yrs',
    rating: '4.95',
    sessions: 210,
    bio: 'Coaches senior engineers and tech leads on engineering management, product velocity, and career progression.',
    tags: ['Eng Management', 'Product Velocity', 'Hiring'],
    initials: 'MC',
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    role: 'Lead Design Engineer',
    company: 'Vercel',
    specialty: 'Product & Design',
    experience: '7+ yrs',
    rating: '4.97',
    sessions: 115,
    bio: 'Bridges design and frontend architecture. Guides developers on React internals, design systems, and portfolio craft.',
    tags: ['React', 'Design Systems', 'TypeScript'],
    initials: 'PN',
  },
  {
    id: 'david-okafor',
    name: 'David Okafor',
    role: 'Founding Engineer',
    company: 'Scale AI',
    specialty: 'AI & ML',
    experience: '9+ yrs',
    rating: '4.96',
    sessions: 84,
    bio: 'Built core data pipelines from seed to Series F. Mentors on high-growth startup engineering and technical ownership.',
    tags: ['Data Pipelines', 'Startups', 'Python'],
    initials: 'DO',
  },
  {
    id: 'sofia-lindqvist',
    name: 'Sofia Lindqvist',
    role: 'Staff Security & Cloud Eng',
    company: 'Cloudflare',
    specialty: 'Systems',
    experience: '10+ yrs',
    rating: '4.99',
    sessions: 76,
    bio: 'Focuses on edge computing, Rust networking, and zero-trust infrastructure. Helps candidates ace systems debugging.',
    tags: ['Rust', 'Edge', 'Networking'],
    initials: 'SL',
  },
];

const specialties = ['All', 'Systems', 'AI & ML', 'Product & Design', 'Leadership'] as const;

const MentorsPage: React.FC<MentorsPageProps> = ({ onOpenAuth }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<(typeof specialties)[number]>('All');
  const [bookedIds, setBookedIds] = useState<string[]>([]);

  const filteredMentors = selectedSpecialty === 'All'
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
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[1.05] mb-6">
              Learn Directly from <span className="text-brand-accent">Operators.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/60 font-medium leading-relaxed">
              Book code reviews, architecture deep-dives, and mock interviews with staff engineers, founders, and hiring managers from top tech companies.
            </p>
          </motion.div>

          {/* Specialty Filter */}
          <div className="flex flex-wrap gap-3 mt-10">
            {specialties.map((spec) => (
              <button
                key={spec}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white rounded-[2rem] p-8 border border-brand-dark/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-bold text-lg tracking-tight">
                          {mentor.initials}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-brand-dark tracking-tight">{mentor.name}</h3>
                          <p className="text-xs font-semibold text-brand-dark/60">{mentor.role}</p>
                          <p className="text-xs font-bold text-brand-accent">@ {mentor.company}</p>
                        </div>
                      </div>
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
