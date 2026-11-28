import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, ExternalLink, Send } from 'lucide-react';
import {
  getResolvedTrackData,
  PortalSession,
  ProjectReviewOverride,
  ProjectSubmissionRecord,
  readStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../../data/portal';

interface ProjectsPageProps {
  session: PortalSession;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ session }) => {
  const track = getResolvedTrackData(session.trackId || 'ai-full-stack');
  const [submissions, setSubmissions] = useState<
    Record<string, ProjectSubmissionRecord>
  >(() =>
    readStorage<Record<string, ProjectSubmissionRecord>>(STORAGE_KEYS.submissions, {})
  );
  const reviews = readStorage<Record<string, ProjectReviewOverride>>(
    STORAGE_KEYS.projectReviews,
    {}
  );
  const [draftUrls, setDraftUrls] = useState<Record<string, string>>({});
  const [activeEditId, setActiveEditId] = useState<string | null>(null);

  const handleSubmitProject = (projectId: string, e: React.FormEvent) => {
    e.preventDefault();
    const url = (draftUrls[projectId] || '').trim();
    if (!url) return;

    const next = {
      ...submissions,
      [projectId]: {
        url,
        submittedAt: 'Submitted today',
      },
    };
    setSubmissions(next);
    writeStorage(STORAGE_KEYS.submissions, next);
    setActiveEditId(null);
  };

  const reviewedOrSubmittedCount = track.projects.filter((p) => {
    const rev = reviews[p.id];
    const effective = rev?.status || (submissions[p.id] ? 'Submitted' : p.defaultStatus);
    return effective !== 'Not Started';
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-8 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono text-brand-accent font-semibold mb-2">
              {track.courseTitle} · {track.batchCode}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Projects &amp; Certificates.
            </h1>
          </div>
          <div className="text-sm font-semibold text-brand-dark/70">
            {reviewedOrSubmittedCount} / {track.projects.length} milestones completed
          </div>
        </div>

        {/* Project Editorial Ledger Cards */}
        <div className="space-y-5 mb-12">
          {track.projects.map((proj) => {
            const customSub = submissions[proj.id];
            const reviewOverride = reviews[proj.id];
            const effectiveStatus =
              reviewOverride?.status || (customSub ? 'Submitted' : proj.defaultStatus);
            const effectiveFeedback = reviewOverride?.feedback || proj.defaultFeedback;
            const isEditing = activeEditId === proj.id;

            const dotClass =
              effectiveStatus === 'Reviewed'
                ? 'bg-emerald-600'
                : effectiveStatus === 'Submitted'
                ? 'bg-brand-accent'
                : 'bg-brand-dark/25';

            return (
              <article
                key={proj.id}
                className="bg-white rounded-[1.75rem] border border-brand-dark/10 overflow-hidden flex flex-col lg:flex-row items-stretch"
              >
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-dark/80">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                        {proj.number} · {proj.kind} Project
                      </span>
                      <span className="text-xs font-mono text-brand-dark/55">
                        {effectiveStatus}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-brand-dark tracking-tight mb-2">
                      {proj.title}
                    </h2>
                    <p className="text-sm text-brand-dark/70 leading-relaxed mb-5">
                      {proj.brief}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-dark/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-mono uppercase tracking-wider text-brand-dark/45 mr-2">
                        Deliverables:
                      </span>
                      <span className="font-semibold text-brand-dark">
                        {proj.deliverables.join(' · ')}
                      </span>
                    </div>
                  </div>

                  {effectiveFeedback && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                      <strong>Mentor Review:</strong> {effectiveFeedback}
                    </div>
                  )}

                  {customSub && (
                    <div className="mt-4 p-4 rounded-xl bg-brand-cream border border-brand-dark/10 flex items-center justify-between gap-4 text-xs">
                      <div className="min-w-0 truncate">
                        <span className="font-bold text-brand-dark">Submitted Link: </span>
                        <span className="text-brand-accent font-mono">{customSub.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDraftUrls((prev) => ({ ...prev, [proj.id]: customSub.url }));
                          setActiveEditId(proj.id);
                        }}
                        className="font-bold text-brand-dark/65 hover:text-brand-accent shrink-0"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Submission Bay */}
                <div className="lg:w-72 shrink-0 bg-[#F7F4EE]/80 border-t lg:border-t-0 lg:border-l border-brand-dark/10 p-6 sm:p-8 flex flex-col justify-center">
                  {isEditing || (effectiveStatus === 'Not Started' && !customSub) ? (
                    <form
                      onSubmit={(e) => handleSubmitProject(proj.id, e)}
                      className="space-y-3"
                    >
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55">
                        GitHub / Drive URL
                      </label>
                      <input
                        type="text"
                        required
                        value={draftUrls[proj.id] || ''}
                        onChange={(e) =>
                          setDraftUrls((prev) => ({ ...prev, [proj.id]: e.target.value }))
                        }
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-brand-dark/15 text-xs focus:outline-none focus:border-brand-accent"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 px-4 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <Send size={12} /> Submit
                        </button>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => setActiveEditId(null)}
                            className="px-3 py-2.5 text-xs font-bold text-brand-dark/60"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  ) : effectiveStatus === 'Reviewed' ? (
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 size={18} /> Mentor Approved
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 text-brand-accent text-xs font-bold">
                        <ExternalLink size={15} /> Awaiting Mentor Review
                      </div>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => {
                            setDraftUrls((prev) => ({
                              ...prev,
                              [proj.id]: customSub?.url || '',
                            }));
                            setActiveEditId(proj.id);
                          }}
                          className="block text-xs font-semibold text-brand-dark/60 hover:text-brand-dark underline"
                        >
                          Edit submission link
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Certificate Unlock Plate */}
        <div className="bg-[#0A0B0E] text-white rounded-[1.75rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 text-[#60A5FA] flex items-center justify-center shrink-0">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs font-mono text-[#60A5FA] mb-1">Dual Credentials</p>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1">
                Course Completion + Internship Completion Certificates
              </h3>
              <p className="text-sm text-white/65">
                Complete all 3 Minor Projects and 2 Major Capstones with {track.mentorName} to unlock verified certificates.
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-white/80 shrink-0 px-4 py-2 rounded-full border border-white/15">
            {reviewedOrSubmittedCount} / {track.projects.length} completed
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectsPage;
