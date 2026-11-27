import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  X,
  MessageCircle,
  BookOpen,
} from 'lucide-react';
import { courseCategories, coursesData, CourseCategory, CourseItem } from '../data/courses';

interface CoursesPageProps {
  onOpenAuth: () => void;
}

const categoryThemes: Record<
  CourseCategory,
  {
    headerBg: string;
    darkHeader?: boolean;
    accentText: string;
    dotColor: string;
    patternStroke: string;
  }
> = {
  'Advanced Courses': {
    headerBg: 'bg-[#0A0B0E]',
    darkHeader: true,
    accentText: 'text-[#60A5FA]',
    dotColor: 'bg-[#60A5FA]',
    patternStroke: 'rgba(255,255,255,0.08)',
  },
  IT: {
    headerBg: 'bg-[#EEF3FF]',
    accentText: 'text-brand-accent',
    dotColor: 'bg-brand-accent',
    patternStroke: 'rgba(37,99,235,0.12)',
  },
  Pharma: {
    headerBg: 'bg-[#ECF7F2]',
    accentText: 'text-emerald-700',
    dotColor: 'bg-emerald-600',
    patternStroke: 'rgba(5,150,105,0.12)',
  },
  'Non IT & Management': {
    headerBg: 'bg-[#FAF2E6]',
    accentText: 'text-amber-800',
    dotColor: 'bg-amber-600',
    patternStroke: 'rgba(217,119,6,0.12)',
  },
  Agriculture: {
    headerBg: 'bg-[#F0F6EB]',
    accentText: 'text-lime-800',
    dotColor: 'bg-lime-700',
    patternStroke: 'rgba(77,124,15,0.12)',
  },
};

const CoursesPage: React.FC<CoursesPageProps> = ({ onOpenAuth }) => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof courseCategories)[number]>('All');
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);

  const filteredCourses =
    selectedCategory === 'All'
      ? coursesData
      : coursesData.filter((c) => c.category === selectedCategory);

  const handleEnroll = (id: string) => {
    if (!enrolledIds.includes(id)) {
      setEnrolledIds((prev) => [...prev, id]);
    }
    setActiveCourse(null);
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
              Courses Built for <span className="text-brand-accent">Real Careers.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/60 font-medium leading-relaxed">
              Choose your learning path across IT, Pharma, Management, and Agriculture. Every flagship program pairs live mentor guidance with 3 minor projects and 2 major capstones.
            </p>
          </motion.div>

          {/* Editorial Tab Filter */}
          <div className="flex flex-wrap items-center gap-2 mt-10 pb-4 border-b border-brand-dark/10">
            {courseCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial Specimen Cards Grid */}
      <section className="px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredCourses.map((course, idx) => {
              const theme = categoryThemes[course.category];
              const isDark = Boolean(theme.darkHeader);
              const isEnrolled = enrolledIds.includes(course.id);

              return (
                <motion.article
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="group bg-white rounded-[1.75rem] border border-brand-dark/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(5,5,5,0.12)]"
                >
                  {/* Top Editorial Specimen Plate */}
                  <div>
                    <div
                      className={`relative px-7 pt-6 pb-7 border-b border-brand-dark/10 overflow-hidden ${theme.headerBg}`}
                    >
                      {/* Architectural Hairline Ring Motif */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 180 180"
                        className="absolute -right-10 -bottom-10 w-40 h-40 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                      >
                        <circle
                          cx="90"
                          cy="90"
                          r="74"
                          fill="none"
                          stroke={theme.patternStroke}
                          strokeWidth="1.25"
                        />
                        <circle
                          cx="90"
                          cy="90"
                          r="48"
                          fill="none"
                          stroke={theme.patternStroke}
                          strokeWidth="1.25"
                          strokeDasharray="4 4"
                        />
                        <line
                          x1="16"
                          y1="90"
                          x2="164"
                          y2="90"
                          stroke={theme.patternStroke}
                          strokeWidth="1"
                        />
                      </svg>

                      {/* Clean Metadata Bar (No Badge Pills) */}
                      <div className="relative z-10 flex items-center justify-between gap-3 mb-7">
                        <span
                          className={`inline-flex items-center gap-2 text-xs font-semibold tracking-tight ${
                            isDark ? 'text-white/85' : 'text-brand-dark/80'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
                          {course.tag}
                        </span>
                        <span
                          className={`text-xs font-mono ${
                            isDark ? 'text-white/55' : 'text-brand-dark/50'
                          }`}
                        >
                          {course.duration}
                        </span>
                      </div>

                      {/* Display Title */}
                      <h2
                        className={`relative z-10 text-2xl font-bold tracking-[-0.025em] leading-[1.18] min-h-[3.5rem] ${
                          isDark ? 'text-white' : 'text-brand-dark'
                        }`}
                      >
                        {course.title}
                      </h2>
                    </div>

                    {/* Lower Spec Sheet Body */}
                    <div className="px-7 pt-6 pb-5">
                      <p className="text-[14px] text-brand-dark/70 leading-relaxed mb-6 line-clamp-3">
                        {course.description}
                      </p>

                      {/* Typographic Hairline Ledger (Replaces Chip Clutter) */}
                      <div className="border-t border-brand-dark/10 divide-y divide-brand-dark/10">
                        <div className="py-3 flex items-baseline justify-between gap-4">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 shrink-0">
                            Projects
                          </span>
                          <span className="text-xs font-semibold text-brand-dark text-right">
                            {course.minorProjects} Minor · {course.majorProjects} Major
                          </span>
                        </div>
                        <div className="py-3 flex items-baseline justify-between gap-4">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 shrink-0">
                            Focus
                          </span>
                          <span className="text-xs font-medium text-brand-dark/75 text-right leading-snug">
                            {course.skills.slice(0, 4).join(' · ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Action Bar */}
                  <div className="px-7 pb-6 pt-2 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveCourse(course)}
                      className="text-xs font-semibold text-brand-dark/65 hover:text-brand-accent transition-colors inline-flex items-center gap-1 group/link focus:outline-none focus-visible:underline"
                    >
                      <span>View syllabus</span>
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEnroll(course.id)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                        isEnrolled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-dark text-white group-hover:bg-brand-accent'
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <CheckCircle2 size={14} /> Enrolled
                        </>
                      ) : (
                        <>
                          Start track
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

      {/* Curriculum Modal */}
      <AnimatePresence>
        {activeCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCourse(null)}
            className="fixed inset-0 z-50 bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-cream rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl border border-brand-dark/10"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-mono text-brand-accent font-semibold">
                    {activeCourse.category} · {activeCourse.duration}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight mt-1">
                    {activeCourse.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCourse(null)}
                  aria-label="Close curriculum"
                  className="p-2 rounded-full bg-white border border-brand-dark/10 text-brand-dark hover:bg-brand-dark hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-brand-dark/70 leading-relaxed mb-6">
                {activeCourse.description}
              </p>

              <div className="bg-white rounded-2xl p-6 border border-brand-dark/5 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-4">
                  <BookOpen size={14} className="text-brand-accent" /> Program Syllabus
                </div>
                <ol className="space-y-3">
                  {activeCourse.curriculum.map((mod, idx) => (
                    <li key={mod} className="flex items-start gap-3 text-sm text-brand-dark/80 font-medium">
                      <span className="w-6 h-6 rounded-full bg-brand-cream border border-brand-dark/10 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{mod}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-brand-dark/5 mb-8">
                <div className="text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-3">
                  Projects &amp; Outcomes ({activeCourse.minorProjects} Minor + {activeCourse.majorProjects} Major)
                </div>
                <ul className="space-y-2.5">
                  {activeCourse.outcomes.map((out) => (
                    <li key={out} className="flex items-start gap-2.5 text-sm text-brand-dark/75">
                      <CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleEnroll(activeCourse.id)}
                  className="flex-1 py-3.5 px-6 bg-brand-dark text-white rounded-full text-sm font-bold hover:bg-brand-accent transition-colors inline-flex items-center justify-center gap-2"
                >
                  Enroll in Program <ArrowRight size={15} />
                </button>
                <a
                  href={`https://wa.me/919502886626?text=${encodeURIComponent(
                    `Hi, Can we Connect to get more details about ${activeCourse.whatsappQuery}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} /> Ask on WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CoursesPage;
