import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pin, Send, ShieldCheck } from 'lucide-react';
import {
  computeInitials,
  getActiveTrackIds,
  getResolvedTrackData,
  PortalSession,
  PortalTrackId,
  postBatchReply,
  postBatchThread,
} from '../../../data/portal';

interface MentorDoubtsPageProps {
  session: PortalSession;
  onSelectTrack: (trackId: PortalTrackId) => void;
}

const MentorDoubtsPage: React.FC<MentorDoubtsPageProps> = ({ session, onSelectTrack }) => {
  const [, setRefreshTick] = useState(0);
  const activeTrackId = session.trackId || 'ai-full-stack';
  const track = getResolvedTrackData(activeTrackId);

  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceBody, setAnnounceBody] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceTitle.trim() || !announceBody.trim()) return;

    postBatchThread(activeTrackId, {
      id: `mentor-pin-${Date.now()}`,
      category: 'Mentor Pinned',
      author: session.name,
      authorInitials: computeInitials(session.name),
      timeAgo: 'Just now',
      pinned: true,
      title: announceTitle.trim(),
      body: announceBody.trim(),
      replies: [],
    });

    setAnnounceTitle('');
    setAnnounceBody('');
    setRefreshTick((t) => t + 1);
  };

  const handleMentorReply = (threadId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (replyDrafts[threadId] || '').trim();
    if (!text) return;

    postBatchReply(threadId, {
      id: `mentor-reply-${Date.now()}`,
      author: session.name,
      role: 'Mentor',
      timeAgo: 'Just now',
      body: text,
    });

    setReplyDrafts((prev) => ({ ...prev, [threadId]: '' }));
    setRefreshTick((t) => t + 1);
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
              Batch Doubts &amp; Pinned Updates · {track.batchCode}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Verify &amp; Answer Doubts.
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Post Pinned Batch Announcement */}
          <form
            onSubmit={handlePublishAnnouncement}
            className="lg:col-span-4 bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-[#60A5FA]">
              <Pin size={14} /> Pin Batch Announcement
            </div>
            <p className="text-xs text-white/65 leading-relaxed">
              Pinned announcements appear on top of {track.batchCode} students’ Dashboard and Community feed.
            </p>
            <input
              type="text"
              required
              value={announceTitle}
              onChange={(e) => setAnnounceTitle(e.target.value)}
              placeholder="Announcement title..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
            />
            <textarea
              rows={3}
              required
              value={announceBody}
              onChange={(e) => setAnnounceBody(e.target.value)}
              placeholder="Pre-read instructions, lab files, or schedule update..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
            />
            <button
              type="submit"
              className="w-full py-3 bg-brand-accent text-white rounded-full text-xs font-bold hover:bg-white hover:text-brand-dark transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Send size={13} /> Pin to {track.batchCode}
            </button>
          </form>

          {/* Student Questions Feed */}
          <div className="lg:col-span-8 space-y-4">
            {track.threads.map((thread) => (
              <article
                key={thread.id}
                className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-6 sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-mono text-brand-accent font-semibold">
                    {thread.category} {thread.lectureRef ? `· ${thread.lectureRef}` : ''}
                  </span>
                  <span className="text-xs font-mono text-brand-dark/45">
                    {thread.author} · {thread.timeAgo}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-brand-dark mb-2">{thread.title}</h2>
                <p className="text-sm text-brand-dark/70 leading-relaxed mb-4">{thread.body}</p>

                {thread.replies.length > 0 && (
                  <div className="space-y-2.5 pt-4 border-t border-brand-dark/10 mb-4">
                    {thread.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-3.5 rounded-xl text-xs ${
                          reply.role === 'Mentor'
                            ? 'bg-[#EEF3FF] border border-brand-accent/20'
                            : 'bg-brand-cream'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-brand-dark inline-flex items-center gap-1">
                            {reply.author}
                            {reply.role === 'Mentor' && (
                              <ShieldCheck size={13} className="text-brand-accent" />
                            )}
                          </span>
                          <span className="font-mono text-brand-dark/45">{reply.timeAgo}</span>
                        </div>
                        <p className="text-brand-dark/80 leading-relaxed">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={(e) => handleMentorReply(thread.id, e)}
                  className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-brand-dark/5"
                >
                  <input
                    type="text"
                    value={replyDrafts[thread.id] || ''}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({ ...prev, [thread.id]: e.target.value }))
                    }
                    placeholder="Post a Verified Mentor reply..."
                    className="w-full sm:flex-1 min-w-0 px-4 py-2.5 rounded-full bg-brand-cream border border-brand-dark/10 text-xs focus:outline-none focus:border-brand-accent"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto shrink-0 px-5 py-2.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors"
                  >
                    Post Answer
                  </button>
                </form>
              </article>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MentorDoubtsPage;
