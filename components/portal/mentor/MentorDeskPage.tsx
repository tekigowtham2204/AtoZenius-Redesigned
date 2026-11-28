import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, ClipboardCheck, MessageSquare, BookOpen } from 'lucide-react';
import {
  getActiveTrackIds,
  getResolvedTrackData,
  PortalSession,
  PortalTrackId,
  ProjectReviewOverride,
  ProjectSubmissionRecord,
  readStorage,
  STORAGE_KEYS,
} from '../../../data/portal';
import { ViewState } from '../../../types';

interface MentorDeskPageProps {
  session: PortalSession;
  onSelectTrack: (trackId: PortalTrackId) => void;
  onNavigate: (view: ViewState) => void;
}

const MentorDeskPage: React.FC<MentorDeskPageProps> = ({
  session,
  onSelectTrack,
  onNavigate,
}) => {
  const activeTrackId = session.trackId || 'ai-full-stack';
  const track = getResolvedTrackData(activeTrackId);
  const submissions = readStorage<Record<string, ProjectSubmissionRecord>>(
    STORAGE_KEYS.submissions,
    {}
  );
  const reviews = readStorage<Record<string, ProjectReviewOverride>>(
    STORAGE_KEYS.projectReviews,
    {}
  );

  const pendingReviewsCount = track.projects.filter((p) => {
    const rev = reviews[p.id];
    const effective = rev?.status || (submissions[p.id] ? 'Submitted' : p.defaultStatus);
    return effective === 'Submitted';
  }).length;

  const unansweredDoubtsCount = track.threads.filter(
    (t) => t.category === 'Course Doubts' && !t.replies.some((r) => r.role === 'Mentor')
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-8 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-brand-accent font-semibold mb-2">
              Faculty &amp; Mentor Workspace
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Mentor Desk — {session.name.split(' ')[0]}.
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {getActiveTrackIds().map((id) => {
              const t = getResolvedTrackData(id);
              const isSelected = id === session.trackId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectTrack(id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-brand-dark text-white'
                      : 'bg-white border border-brand-dark/10 text-brand-dark/70 hover:border-brand-dark/30'
                  }`}
                >
                  {t.batchCode}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assigned Offline Session Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-7 bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="inline-flex items-center gap-2 text-xs font-mono text-[#60A5FA]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA]" />
                  {track.courseTitle} · {track.batchCode}
                </span>
                <span className="text-xs font-mono text-white/60 inline-flex items-center gap-1.5">
                  <Calendar size={13} /> {track.nextSessionTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-4">
                {track.nextSessionTopic}
              </h2>
              <p className="text-sm text-white/65 inline-flex items-center gap-2 mb-8">
                <MapPin size={14} className="text-[#60A5FA]" /> {track.branchLocation}
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('mentor-notes')}
                className="px-6 py-3 bg-brand-accent text-white rounded-full text-xs font-bold hover:bg-white hover:text-brand-dark transition-colors inline-flex items-center gap-2"
              >
                Open Notes Studio <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('mentor-doubts')}
                className="px-5 py-3 border border-white/20 text-white rounded-full text-xs font-bold hover:border-white/50 transition-colors"
              >
                Pin Batch Announcement
              </button>
              <button
                type="button"
                onClick={() => onNavigate('mentor-messages')}
                className="px-5 py-3 border border-white/20 text-white rounded-full text-xs font-bold hover:border-white/50 transition-colors"
              >
                Open Student Messages
              </button>
            </div>
          </div>

          {/* Action Queues */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-5">
            <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 block mb-1">
                    Project Submissions
                  </span>
                  <div className="text-3xl font-extrabold text-brand-dark">
                    {pendingReviewsCount} pending
                  </div>
                  <p className="text-xs text-brand-dark/60 mt-1">
                    Minor &amp; Major deliverables waiting for mentor sign-off
                  </p>
                </div>
                <ClipboardCheck size={22} className="text-brand-accent shrink-0" />
              </div>
              <button
                type="button"
                onClick={() => onNavigate('mentor-reviews')}
                className="mt-5 text-xs font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1.5"
              >
                Review submissions <ArrowRight size={14} />
              </button>
            </div>

            <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 block mb-1">
                    Student Doubt Queue
                  </span>
                  <div className="text-3xl font-extrabold text-brand-dark">
                    {unansweredDoubtsCount} open
                  </div>
                  <p className="text-xs text-brand-dark/60 mt-1">
                    Questions waiting for a Verified Mentor response
                  </p>
                </div>
                <MessageSquare size={22} className="text-brand-accent shrink-0" />
              </div>
              <button
                type="button"
                onClick={() => onNavigate('mentor-doubts')}
                className="mt-5 text-xs font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1.5"
              >
                Answer batch doubts <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Published Guides Strip */}
        <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BookOpen size={22} className="text-brand-accent shrink-0" />
            <div>
              <div className="text-sm font-bold text-brand-dark">
                {track.lectures.length} Lecture Study Guides live for {track.batchCode}
              </div>
              <p className="text-xs text-brand-dark/60">
                Any edits in Notes Studio appear immediately in student study guides.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('mentor-notes')}
            className="px-6 py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors shrink-0"
          >
            Manage Study Notes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MentorDeskPage;
