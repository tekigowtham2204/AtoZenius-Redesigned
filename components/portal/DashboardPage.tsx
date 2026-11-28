import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  KeyRound,
  Lock,
  MapPin,
  MessageCircle,
  Bookmark,
} from 'lucide-react';
import {
  allTrackIds,
  claimBatchByCode,
  getResolvedTrackData,
  getSiteConfig,
  getWhatsappDigits,
  PortalSession,
  PortalTrackId,
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
  onSelectTrack?: (trackId: PortalTrackId) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  session,
  onNavigate,
  onOpenLecture,
  onSelectTrack,
}) => {
  const [batchCodeInput, setBatchCodeInput] = useState('');
  const [claimError, setClaimError] = useState<string | null>(null);
  const siteConfig = getSiteConfig();

  // Onboarding / Batch Claim Screen when trackId === null
  if (!session.trackId) {
    const handleClaimSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setClaimError(null);
      const matchedTrackId = claimBatchByCode(batchCodeInput);
      if (!matchedTrackId) {
        setClaimError(
          'Batch or access code not recognized. Try FS-08, MC-14, DS-11, or your ATZ-XXXX code.'
        );
        return;
      }
      if (onSelectTrack) {
        onSelectTrack(matchedTrackId);
      }
    };

    const whatsappUrl = `https://wa.me/${getWhatsappDigits(siteConfig)}?text=${encodeURIComponent(
      `Hi AtoZenius Admissions, I signed up with ${session.email} and would like to activate my offline batch.`
    )}`;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
      >
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="pb-8 mb-10 border-b border-brand-dark/10">
            <p className="text-xs font-mono uppercase tracking-widest text-brand-accent font-semibold mb-2">
              Cohort Activation · {session.email}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Welcome, {session.name.split(' ')[0]}.
            </h1>
            <p className="text-sm sm:text-base text-brand-dark/65 mt-2 max-w-2xl">
              {siteConfig.allowSelfSignupExplore
                ? 'Claim your offline batch code below or select a program track to explore lecture study guides.'
                : 'Enroll at your center or via WhatsApp to activate your batch, then enter your Batch Access Code below.'}
            </p>
          </div>

          {/* Batch Access Code Claim Card */}
          <form
            onSubmit={handleClaimSubmit}
            className="bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 sm:p-10 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#60A5FA] mb-2">
                <KeyRound size={14} /> ACTIVATE OFFLINE COHORT
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                Have a Batch Code or Staff Access Code?
              </h2>
              <p className="text-xs text-white/65 leading-relaxed">
                Enter your classroom batch code (e.g., <span className="font-mono text-white">FS-08</span>,{' '}
                <span className="font-mono text-white">MC-14</span>,{' '}
                <span className="font-mono text-white">DS-11</span>) or your staff-issued{' '}
                <span className="font-mono text-white">ATZ-XXXX</span> code.
              </p>
              {claimError && (
                <p className="text-xs font-semibold text-red-400 mt-3">{claimError}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[360px]">
              <input
                type="text"
                value={batchCodeInput}
                onChange={(e) => setBatchCodeInput(e.target.value)}
                placeholder="Enter code (e.g. FS-08)"
                className="flex-1 px-4 py-3.5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-brand-accent text-white rounded-full text-xs font-bold hover:bg-white hover:text-brand-dark transition-colors shrink-0 inline-flex items-center justify-center gap-1.5"
              >
                Activate Batch <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {/* Conditional Track Exploration vs Strict Offline Mode */}
          {siteConfig.allowSelfSignupExplore ? (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-brand-dark tracking-tight">
                  Or Explore a Learning Track
                </h3>
                <span className="text-xs font-mono text-brand-dark/50">
                  Switchable anytime
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allTrackIds.map((id) => {
                  const t = getResolvedTrackData(id);
                  return (
                    <div
                      key={id}
                      className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-xs font-mono text-brand-accent font-semibold">
                          {t.batchCode}
                        </span>
                        <h4 className="text-xl font-bold text-brand-dark mt-1 mb-2">
                          {t.courseTitle}
                        </h4>
                        <p className="text-xs text-brand-dark/60 leading-relaxed mb-5">
                          Mentor: {t.mentorName} · {t.branchLocation}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectTrack && onSelectTrack(id)}
                        className="w-full py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center justify-center gap-2"
                      >
                        Open Study Workspace <ArrowRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-cream border border-brand-dark/10 flex items-center justify-center shrink-0">
                  <Lock size={20} className="text-brand-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-1">
                    Enroll at Center or via WhatsApp to Activate Your Batch
                  </h3>
                  <p className="text-sm text-brand-dark/65 max-w-xl">
                    Self-signup track browsing is currently restricted to enrolled offline cohorts. Contact our academic counselors to receive your Batch Access Code.
                  </p>
                </div>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2 shrink-0"
              >
                <MessageCircle size={15} /> Activate on WhatsApp
              </a>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

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
