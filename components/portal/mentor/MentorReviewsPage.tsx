import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import {
  getActiveTrackIds,
  getResolvedTrackData,
  PortalSession,
  PortalTrackId,
  ProjectReviewOverride,
  ProjectSubmissionRecord,
  readStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../../../data/portal';

interface MentorReviewsPageProps {
  session: PortalSession;
  onSelectTrack: (trackId: PortalTrackId) => void;
}

const MentorReviewsPage: React.FC<MentorReviewsPageProps> = ({ session, onSelectTrack }) => {
  const track = getResolvedTrackData(session.trackId || 'ai-full-stack');
  const submissions = readStorage<Record<string, ProjectSubmissionRecord>>(
    STORAGE_KEYS.submissions,
    {}
  );
  const [reviews, setReviews] = useState<Record<string, ProjectReviewOverride>>(() =>
    readStorage<Record<string, ProjectReviewOverride>>(STORAGE_KEYS.projectReviews, {})
  );
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});

  const saveReview = (
    projectId: string,
    status: 'Reviewed' | 'Submitted',
    fallbackFeedback: string
  ) => {
    const feedback = (feedbackDrafts[projectId] || fallbackFeedback).trim();
    const next: Record<string, ProjectReviewOverride> = {
      ...reviews,
      [projectId]: {
        status,
        feedback: feedback || `Reviewed by ${session.name}.`,
        reviewedBy: session.name,
      },
    };
    setReviews(next);
    writeStorage(STORAGE_KEYS.projectReviews, next);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono text-brand-accent font-semibold mb-2">
              Project Review Queue · Live Sync with Student Portal
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Capstone Reviews.
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {getActiveTrackIds().map((id) => {
              const t = getResolvedTrackData(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectTrack(id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    id === session.trackId
                      ? 'bg-brand-dark text-white'
                      : 'bg-white border border-brand-dark/10 text-brand-dark/70'
                  }`}
                >
                  {t.batchCode}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          {track.projects.map((proj) => {
            const sub = submissions[proj.id];
            const rev = reviews[proj.id];
            const effectiveStatus = rev?.status || (sub ? 'Submitted' : proj.defaultStatus);
            const effectiveFeedback = rev?.feedback || proj.defaultFeedback || '';

            return (
              <article
                key={proj.id}
                className="bg-white rounded-[1.75rem] border border-brand-dark/10 overflow-hidden flex flex-col lg:flex-row items-stretch"
              >
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-semibold text-brand-accent">
                        {proj.number} · {proj.kind} Project
                      </span>
                      <span className="text-xs font-mono text-brand-dark/55">
                        Status: {effectiveStatus}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mb-2">
                      {proj.title}
                    </h2>
                    <p className="text-sm text-brand-dark/70 leading-relaxed mb-4">
                      {proj.brief}
                    </p>

                    {sub && (
                      <div className="p-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-xs flex items-center justify-between gap-3">
                        <span className="truncate font-mono text-brand-accent">
                          Student Submission: {sub.url}
                        </span>
                        <ExternalLink size={14} className="text-brand-dark/50 shrink-0" />
                      </div>
                    )}

                    {effectiveFeedback && (
                      <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                        <strong>Current Feedback:</strong> {effectiveFeedback}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Mentor Review Action Panel */}
                <div className="lg:w-80 shrink-0 bg-[#F7F4EE]/80 border-t lg:border-t-0 lg:border-l border-brand-dark/10 p-6 sm:p-7 space-y-3 flex flex-col justify-center">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55">
                    Mentor Review Note
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackDrafts[proj.id] ?? effectiveFeedback}
                    onChange={(e) =>
                      setFeedbackDrafts((prev) => ({ ...prev, [proj.id]: e.target.value }))
                    }
                    placeholder="Write feedback or approval note..."
                    className="w-full p-3 rounded-xl bg-white border border-brand-dark/15 text-xs focus:outline-none focus:border-brand-accent"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        saveReview(
                          proj.id,
                          'Reviewed',
                          `Approved by ${session.name}. Great work on ${proj.number}.`
                        )
                      }
                      className="flex-1 py-2.5 px-4 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        saveReview(
                          proj.id,
                          'Submitted',
                          'Please revise edge cases and resubmit.'
                        )
                      }
                      className="py-2.5 px-4 border border-brand-dark/15 bg-white text-brand-dark rounded-full text-xs font-bold hover:border-brand-dark/40 transition-colors"
                    >
                      Request Fix
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MentorReviewsPage;
