import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Layers,
  ArrowRight,
  CheckCircle2,
  X,
  MessageCircle,
  BookOpen,
} from 'lucide-react';
import { courseCategories, coursesData, CourseItem } from '../data/courses';

interface CoursesPageProps {
  onOpenAuth: () => void;
}

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
      <section className="px-6 mb-14 md:mb-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mt-10">
            {courseCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'bg-white text-brand-dark/70 border border-brand-dark/10 hover:border-brand-dark/30 hover:text-brand-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredCourses.map((course, idx) => {
              const Icon = course.icon;
              const isEnrolled = enrolledIds.includes(course.id);

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="bg-white rounded-[2rem] p-8 border border-brand-dark/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-brand-secondary flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-colors duration-300">
                        <Icon size={22} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-cream text-brand-dark/60 border border-brand-dark/5">
                        {course.tag}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-brand-dark mb-3 tracking-tight">
                      {course.title}
                    </h2>
                    <p className="text-brand-dark/65 text-sm leading-relaxed mb-6">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {course.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 bg-brand-secondary/50 text-brand-dark/70 text-xs font-semibold rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-dark/5">
                    <div className="flex items-center justify-between text-xs font-semibold text-brand-dark/55 mb-5">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layers size={14} /> {course.minorProjects} Minor • {course.majorProjects} Major
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveCourse(course)}
                        className="px-4 py-3.5 rounded-full text-xs font-bold border border-brand-dark/15 text-brand-dark hover:border-brand-dark/40 transition-colors shrink-0"
                      >
                        Curriculum
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEnroll(course.id)}
                        className={`flex-1 py-3.5 px-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                          isEnrolled
                            ? 'bg-green-600 text-white'
                            : 'bg-brand-dark text-white hover:bg-brand-accent'
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <CheckCircle2 size={16} /> Enrolled
                          </>
                        ) : (
                          <>
                            Start Course <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
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
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">
                    {activeCourse.category} • {activeCourse.duration}
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
                  <BookOpen size={14} className="text-brand-accent" /> Program Curriculum
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
