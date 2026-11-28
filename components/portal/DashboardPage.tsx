import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Bookmark,
} from 'lucide-react';
import {
  getResolvedTrackData,
  PortalSession,
  ProjectReviewOverride,
  ProjectSubmissionRecord,
  readStorage,
  STORAGE_KEYS,
} from '../../data/portal';
import { ViewState } from '../../types';

interface DashboardPageProps {
  session: PortalSession;
  onNavigate: (view: ViewState) => void;
  onOpenLecture: (lectureId: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  session,
  onNavigate,
  onOpenLecture,
}) => {
  const track = getResolvedTrackData(session.trackId);
  const bookmarksMap = readStorage<Record<string, boolean>>(STORAGE_KEYS.bookmarks, {});
  const revisedMap = readStorage<Record<string, boolean>>(STORAGE_KEYS.revised, {});
  const submissionsMap = readStorage<Record<string, ProjectSubmissionRecord>>(
    STORAGE_KEYS.submissions,
    {}
  );
  const reviewsMap = readStorage<Record<string, ProjectReviewOverride>>(
    STORAGE_KEYS.projectReviews,
    {}
  );

  const revisedCount = track.lectures.filter((l) => revisedMap[l.id]).length;
  const bookmarkedLectures = track.lectures.filter((l) => bookmarksMap[l.id]);
  const completedProjects = track.projects.filter((p) => {
    const rev = reviewsMap[p.id];
    const effective = rev?.status || (submissionsMap[p.id] ? 'Submitted' : p.defaultStatus);
    return effective !== 'Not Started';
  }).length;
  const pinnedThread = track.threads.find((t) => t.pinned) || track.threads[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-8 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-brand-accent font-semibold mb-2">
              {track.courseTitle} · {track.batchCode}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Welcome back, {session.name.split(' ')[0]}.
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-brand-dark/65">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-brand-accent" /> {track.branchLocation}
            </span>
          </div>
        </div>

        {/* Hero Brief: Today's Offline Class + Prep Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-7 bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-brand-accent/20 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="inline-flex items-center gap-2 text-xs font-mono text-[#60A5FA]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA]" />
                  Next Offline Class
                </span>
                <span className="text-xs font-mono text-white/60 inline-flex items-center gap-1.5">
                  <Calendar size={13} /> {track.nextSessionTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-4">
                {track.nextSessionTopic}
              </h2>
              <p className="text-sm text-white/65 mb-8">
                Mentor: <strong className="text-white">{track.mentorName}</strong> · {track.mentorRole}
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => onOpenLecture(track.nextLectureId)}
                className="px-6 py-3 bg-brand-accent text-white rounded-full text-xs font-bold hover:bg-white hover:text-brand-dark transition-colors inline-flex items-center gap-2"
              >
                Open today’s notes <ArrowRight size={14} />
              </button>
              <a
                href={track.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-white/20 text-white rounded-full text-xs font-bold hover:border-white/50 transition-colors inline-flex items-center gap-1.5"
              >
                <MessageCircle size={14} /> Batch WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 mb-2">
                Before You Walk In
              </p>
              <h3 className="text-xl font-bold text-brand-dark tracking-tight mb-5">
                Offline Class Prep Checklist
              </h3>
              <ul className="space-y-3.5">
                {track.prepChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-brand-dark/75 leading-relaxed">
                    <CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-dark/10 flex items-center justify-between text-xs">
              <span className="text-brand-dark/55 font-medium">Need past lecture guides?</span>
              <button
                type="button"
                onClick={() => onNavigate('notes')}
                className="font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1"
              >
                All study notes <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Architectural Progress Ledger */}
        <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-dark/10 mb-10">
          <div className="p-6 sm:p-7">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 block mb-2">
              Notes Revised
            </span>
            <div className="text-3xl font-extrabold text-brand-dark tracking-tight">
              {revisedCount} <span className="text-lg font-semibold text-brand-dark/40">/ {track.lectures.length}</span>
            </div>
            <p className="text-xs text-brand-dark/60 mt-1">Offline lecture guides marked revised</p>
          </div>
          <div className="p-6 sm:p-7">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 block mb-2">
              Project Progress
            </span>
            <div className="text-3xl font-extrabold text-brand-dark tracking-tight">
              {completedProjects} <span className="text-lg font-semibold text-brand-dark/40">/ {track.projects.length}</span>
            </div>
            <p className="text-xs text-brand-dark/60 mt-1">3 Minor + 2 Major capstone milestones</p>
          </div>
          <div className="p-6 sm:p-7">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 block mb-2">
              Bookmarked Guides
            </span>
            <div className="text-3xl font-extrabold text-brand-accent tracking-tight">
              {bookmarkedLectures.length}
            </div>
            <p className="text-xs text-brand-dark/60 mt-1">Saved topics queued for revision</p>
          </div>
        </div>

        {/* Bottom Workspace Strip: Recent Notes + Batch Pinned Update */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-[1.75rem] border border-brand-dark/10 p-7">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-dark/60">
                <BookOpen size={15} className="text-brand-accent" />
                <span>{bookmarkedLectures.length > 0 ? 'Bookmarked Notes' : 'Recent Class Notes'}</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('notes')}
                className="text-xs font-bold text-brand-accent hover:underline"
              >
                Open library
              </button>
            </div>

            <div className="divide-y divide-brand-dark/10">
              {(bookmarkedLectures.length > 0 ? bookmarkedLectures : track.lectures.slice(0, 3)).map((lec) => (
                <button
                  key={lec.id}
                  type="button"
                  onClick={() => onOpenLecture(lec.id)}
                  className="w-full py-3.5 text-left flex items-center justify-between gap-4 group hover:bg-brand-cream/60 px-2 -mx-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-brand-dark/45">
                      Lecture {lec.lectureNumber} · {lec.taughtDate}
                    </div>
                    <div className="text-sm font-bold text-brand-dark truncate group-hover:text-brand-accent transition-colors">
                      {lec.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {bookmarksMap[lec.id] && <Bookmark size={14} className="text-brand-accent fill-brand-accent" />}
                    <ArrowRight size={15} className="text-brand-dark/40 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#F7F4EE] rounded-[1.75rem] border border-brand-dark/10 p-7 flex flex-col justify-between">
            {pinnedThread ? (
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono text-brand-accent font-semibold">
                    Mentor Pinned · {track.batchCode}
                  </span>
                  <span className="text-xs font-mono text-brand-dark/45">{pinnedThread.timeAgo}</span>
                </div>
                <h3 className="text-xl font-bold text-brand-dark tracking-tight mb-2">
                  {pinnedThread.title}
                </h3>
                <p className="text-sm text-brand-dark/70 leading-relaxed mb-6">
                  {pinnedThread.body}
                </p>
              </div>
            ) : null}

            <div className="pt-5 border-t border-brand-dark/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onNavigate('community')}
                className="px-5 py-2.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
              >
                Open batch community <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="text-xs font-bold text-brand-dark/70 hover:text-brand-accent transition-colors"
              >
                Track projects →
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
