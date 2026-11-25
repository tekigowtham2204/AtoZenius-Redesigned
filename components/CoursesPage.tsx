import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Layers, Sparkles, ArrowRight, CheckCircle2, Code2, Cpu, Globe, Terminal } from 'lucide-react';

interface CoursesPageProps {
  onOpenAuth: () => void;
}

interface Course {
  id: string;
  title: string;
  category: 'Engineering' | 'AI & Data' | 'Product';
  level: string;
  duration: string;
  modules: number;
  description: string;
  skills: string[];
  icon: React.ElementType;
}

const coursesData: Course[] = [
  {
    id: 'dist-sys',
    title: 'Distributed Systems Architecture',
    category: 'Engineering',
    level: 'Advanced',
    duration: '8 Weeks',
    modules: 12,
    description: 'Design fault-tolerant, high-throughput backend systems from first principles using consensus algorithms, replication, and event streaming.',
    skills: ['Rust', 'Kubernetes', 'gRPC', 'Kafka'],
    icon: Terminal,
  },
  {
    id: 'ai-eng',
    title: 'Applied AI & LLM Engineering',
    category: 'AI & Data',
    level: 'Intermediate',
    duration: '6 Weeks',
    modules: 10,
    description: 'Build production-ready AI applications with RAG pipelines, vector databases, fine-tuning, and low-latency model serving.',
    skills: ['Python', 'PyTorch', 'Vector DBs', 'Agents'],
    icon: Cpu,
  },
  {
    id: 'prod-eng',
    title: 'Full-Stack Product Engineering',
    category: 'Product',
    level: 'Intermediate',
    duration: '6 Weeks',
    modules: 14,
    description: 'Ship end-to-end web applications with modern React architectures, edge functions, type-safe APIs, and Postgres.',
    skills: ['TypeScript', 'React', 'Next.js', 'PostgreSQL'],
    icon: Code2,
  },
  {
    id: 'cloud-infra',
    title: 'Cloud Native & DevOps Mastery',
    category: 'Engineering',
    level: 'Intermediate',
    duration: '5 Weeks',
    modules: 9,
    description: 'Automate infrastructure, CI/CD pipelines, observability, and zero-downtime deployments across multi-region clusters.',
    skills: ['Docker', 'Terraform', 'AWS', 'Prometheus'],
    icon: Globe,
  },
  {
    id: 'ml-systems',
    title: 'ML Systems & Data Pipelines',
    category: 'AI & Data',
    level: 'Advanced',
    duration: '7 Weeks',
    modules: 11,
    description: 'Architect scalable data ingestion, feature stores, and distributed training workflows for real-time inference.',
    skills: ['Spark', 'CUDA', 'MLflow', 'Airflow'],
    icon: Layers,
  },
  {
    id: 'design-sys',
    title: 'Design Systems & UI Motion',
    category: 'Product',
    level: 'Beginner',
    duration: '4 Weeks',
    modules: 8,
    description: 'Craft accessible, token-driven component libraries and fluid micro-interactions for modern web products.',
    skills: ['Tailwind', 'Framer Motion', 'Figma', 'Accessibility'],
    icon: Sparkles,
  },
];

const categories = ['All', 'Engineering', 'AI & Data', 'Product'] as const;

const CoursesPage: React.FC<CoursesPageProps> = ({ onOpenAuth }) => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('All');
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);

  const filteredCourses = selectedCategory === 'All'
    ? coursesData
    : coursesData.filter((c) => c.category === selectedCategory);

  const handleEnroll = (id: string) => {
    if (!enrolledIds.includes(id)) {
      setEnrolledIds((prev) => [...prev, id]);
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
              Courses Built for <span className="text-brand-accent">Production.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/60 font-medium leading-relaxed">
              Industry-calibrated tracks updated every 24 hours from live engineering requirements. Learn by building real systems, not watching passive lectures.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mt-10">
            {categories.map((cat) => (
              <button
                key={cat}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white rounded-[2rem] p-8 border border-brand-dark/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-brand-secondary flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-colors duration-300">
                        <Icon size={22} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-cream text-brand-dark/60 border border-brand-dark/5">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-brand-dark mb-3 tracking-tight">
                      {course.title}
                    </h3>
                    <p className="text-brand-dark/60 text-sm leading-relaxed mb-6">
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
                    <div className="flex items-center justify-between text-xs font-semibold text-brand-dark/50 mb-5">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layers size={14} /> {course.modules} Modules
                      </span>
                    </div>

                    <button
                      onClick={() => handleEnroll(course.id)}
                      className={`w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
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
                          Start Course <ArrowRight size={16} />
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

export default CoursesPage;
