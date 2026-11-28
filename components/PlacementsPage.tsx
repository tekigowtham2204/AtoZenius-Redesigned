import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Quote } from 'lucide-react';
import { storyTracks, StoryTrack } from '../data/stories';
import { getResolvedStories } from '../data/portal';
import { ViewState } from '../types';

interface PlacementsPageProps {
  onNavigate: (view: ViewState) => void;
  onOpenAuth: () => void;
}

const PlacementsPage: React.FC<PlacementsPageProps> = ({ onNavigate, onOpenAuth }) => {
  const [selectedTrack, setSelectedTrack] = useState<StoryTrack>('All');
  const resolvedStories = getResolvedStories();

  const filteredStories =
    selectedTrack === 'All'
      ? resolvedStories
      : resolvedStories.filter((s) => s.track === selectedTrack);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">
            Placements &amp; Reviews
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[1.05] mb-6">
            Real Learners. <span className="text-brand-accent">Real Outcomes.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-dark/65 font-medium leading-relaxed">
            Hear directly from AtoZenius students across Medical Coding, Python Full Stack, and Java Full Stack cohorts who turned practical training and internships into career offers.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-[1.75rem] p-7 border border-brand-dark/5 shadow-sm">
            <div className="flex items-center gap-1.5 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-500" />
              ))}
            </div>
            <div className="text-2xl font-bold text-brand-dark mb-1">5.0 Google Rating</div>
            <p className="text-sm text-brand-dark/60">Consistently rated by graduates for approachable mentors and clear teaching.</p>
          </div>
          <div className="bg-white rounded-[1.75rem] p-7 border border-brand-dark/5 shadow-sm">
            <div className="text-3xl font-bold text-brand-accent mb-1">Dual Certificates</div>
            <p className="text-sm font-semibold text-brand-dark/70 mb-1">Course + Internship Completion</p>
            <p className="text-xs text-brand-dark/55">Proof of practical projects and clinical/engineering assignments.</p>
          </div>
          <div className="bg-white rounded-[1.75rem] p-7 border border-brand-dark/5 shadow-sm">
            <div className="text-3xl font-bold text-brand-dark mb-1">1-on-1 Prep</div>
            <p className="text-sm font-semibold text-brand-dark/70 mb-1">Resume &amp; Interview Training</p>
            <p className="text-xs text-brand-dark/55">Structured placement readiness across IT, Pharma, and Non-IT hiring.</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {storyTracks.map((track) => (
            <button
              key={track}
              type="button"
              onClick={() => setSelectedTrack(track)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                selectedTrack === track
                  ? 'bg-brand-dark text-white shadow-sm'
                  : 'bg-white text-brand-dark/70 border border-brand-dark/10 hover:border-brand-dark/30'
              }`}
            >
              {track}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-[2rem] p-8 border border-brand-dark/5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">
                    {story.track}
                  </span>
                  <Quote size={18} className="text-brand-dark/15" />
                </div>
                <p className="text-brand-dark/75 text-sm md:text-base leading-relaxed mb-6">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-5 border-t border-brand-dark/5 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {story.initials}
                </div>
                <div>
                  <div className="font-bold text-brand-dark text-sm">{story.name}</div>
                  <div className="text-xs text-brand-dark/55 font-medium">{story.outcome}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-brand-dark text-white rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Build your own placement story.
            </h2>
            <p className="text-white/65 text-sm md:text-base">
              Pick a mentored program with real minor and major projects today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="px-7 py-3.5 bg-brand-accent text-white rounded-full text-sm font-bold hover:bg-white hover:text-brand-dark transition-colors inline-flex items-center gap-2"
            >
              Browse Courses <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-7 py-3.5 border border-white/20 text-white rounded-full text-sm font-bold hover:border-white/50 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlacementsPage;
