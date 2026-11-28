import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Pin,
  Search,
  Send,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import {
  computeInitials,
  getResolvedTrackData,
  PortalSession,
  postBatchReply,
  postBatchThread,
} from '../../data/portal';

interface CommunityPageProps {
  session: PortalSession;
  prefillLecture?: string | null;
}

const filters = ['All', 'Course Doubts', 'Mentor Pinned', 'Placement Alerts'] as const;

const CommunityPage: React.FC<CommunityPageProps> = ({ session, prefillLecture }) => {
  const [, setRefreshTick] = useState(0);
  const track = getResolvedTrackData(session.trackId);
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newLectureRef, setNewLectureRef] = useState(prefillLecture || '');
  const [newBody, setNewBody] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prefillLecture) {
      setNewLectureRef(prefillLecture);
    }
  }, [prefillLecture]);

  const batchThreads = track.threads;

  const filteredThreads = batchThreads.filter((t) => {
    const matchesFilter = selectedFilter === 'All' || t.category === selectedFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.body.toLowerCase().includes(q) ||
      (t.lectureRef && t.lectureRef.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    postBatchThread(track.id, {
      id: `custom-${Date.now()}`,
      category: 'Course Doubts',
      lectureRef: newLectureRef.trim() || undefined,
      author: session.name,
      authorInitials: computeInitials(session.name),
      timeAgo: 'Just now',
      title: newTitle.trim(),
      body: newBody.trim(),
      replies: [],
    });

    setNewTitle('');
    setNewBody('');
    setNewLectureRef('');
    setRefreshTick((n) => n + 1);
  };

  const handlePostReply = (threadId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (replyDrafts[threadId] || '').trim();
    if (!text) return;

    postBatchReply(threadId, {
      id: `reply-${Date.now()}`,
      author: session.name,
      role: 'Student',
      timeAgo: 'Just now',
      body: text,
    });

    setReplyDrafts((prev) => ({ ...prev, [threadId]: '' }));
    setRefreshTick((n) => n + 1);
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
              Batch-Locked Forum · {track.batchCode} ({track.courseTitle})
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Batch Community &amp; Q&amp;A.
            </h1>
          </div>
          <p className="text-xs font-medium text-brand-dark/60 max-w-sm">
            Web Q&amp;A keeps lecture doubts searchable forever. WhatsApp handles real-time class updates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Thread Feed */}
          <div className="lg:col-span-8 space-y-6">
            {/* Ask a Doubt Composer */}
            <form
              onSubmit={handlePostDoubt}
              className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-6 sm:p-7 space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-brand-dark">
                  Ask a Doubt in {track.batchCode}
                </h2>
                <span className="text-[11px] font-mono text-brand-dark/45">
                  Visible to batch &amp; {track.mentorName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Short question headline..."
                  className="sm:col-span-2 px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                />
                <input
                  type="text"
                  value={newLectureRef}
                  onChange={(e) => setNewLectureRef(e.target.value)}
                  placeholder="Topic tag (optional)"
                  className="px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>

              <textarea
                rows={3}
                required
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Share what you tried or which concept from offline class needs clarification..."
                className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
                >
                  <Send size={13} /> Post to Batch
                </button>
              </div>
            </form>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {filters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFilter(f)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                      selectedFilter === f
                        ? 'bg-brand-dark text-white'
                        : 'text-brand-dark/65 hover:bg-brand-dark/5'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-56">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doubts..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-full bg-white border border-brand-dark/10 text-xs focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            {/* Threads */}
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <article
                  key={thread.id}
                  className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className="text-brand-accent font-mono">
                        {thread.pinned && <Pin size={12} className="inline mr-1" />}
                        {thread.category}
                      </span>
                      {thread.lectureRef && (
                        <>
                          <span className="text-brand-dark/25">/</span>
                          <span className="text-brand-dark/55">{thread.lectureRef}</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs font-mono text-brand-dark/45">
                      {thread.author} · {thread.timeAgo}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark tracking-tight mb-2">
                    {thread.title}
                  </h3>
                  <p className="text-sm text-brand-dark/75 leading-relaxed mb-5">
                    {thread.body}
                  </p>

                  {/* Replies */}
                  {thread.replies.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-brand-dark/10 mb-4">
                      {thread.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-4 rounded-xl text-sm ${
                            reply.role === 'Mentor'
                              ? 'bg-[#EEF3FF] border border-brand-accent/20'
                              : 'bg-brand-cream/80 border border-brand-dark/5'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                            <span className="font-bold text-brand-dark inline-flex items-center gap-1.5">
                              {reply.author}
                              {reply.role === 'Mentor' && (
                                <span className="text-brand-accent inline-flex items-center gap-1 font-semibold">
                                  <ShieldCheck size={13} /> Verified Mentor
                                </span>
                              )}
                            </span>
                            <span className="font-mono text-brand-dark/45">{reply.timeAgo}</span>
                          </div>
                          <p className="text-brand-dark/80 leading-relaxed">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Reply */}
                  <form
                    onSubmit={(e) => handlePostReply(thread.id, e)}
                    className="flex gap-2 pt-3 border-t border-brand-dark/5"
                  >
                    <input
                      type="text"
                      value={replyDrafts[thread.id] || ''}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({ ...prev, [thread.id]: e.target.value }))
                      }
                      placeholder="Write a helpful reply..."
                      className="flex-1 px-4 py-2 rounded-full bg-brand-cream border border-brand-dark/10 text-xs focus:outline-none focus:border-brand-accent"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors"
                    >
                      Reply
                    </button>
                  </form>
                </article>
              ))}
            </div>
          </div>

          {/* Right WhatsApp Bridge Panel */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="bg-[#0A0B0E] text-white rounded-[1.75rem] p-7">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-3">
                <MessageCircle size={15} /> WhatsApp Channels
              </div>
              <h2 className="text-xl font-bold tracking-tight mb-2">
                Instant Alerts &amp; Mentor Ping
              </h2>
              <p className="text-xs text-white/65 leading-relaxed mb-6">
                Use WhatsApp for classroom timing updates and urgent help, while keeping lecture notes &amp; solved doubts archived here.
              </p>

              <div className="space-y-3">
                <a
                  href={track.whatsappGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                    <span>{track.whatsappGroupLabel}</span>
                    <ArrowUpRight size={14} className="text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-white/55">Daily room updates &amp; cohort reminders</p>
                </a>

                <a
                  href={track.whatsappDoubtUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                    <span>Ping Mentor ({track.mentorName.split(' ')[0]})</span>
                    <ArrowUpRight size={14} className="text-[#60A5FA]" />
                  </div>
                  <p className="text-[11px] text-white/55">Fast 1-on-1 doubt check via +91 9502886626</p>
                </a>

                <a
                  href={track.whatsappPlacementUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                    <span>Placement Broadcast</span>
                    <ArrowUpRight size={14} className="text-amber-400" />
                  </div>
                  <p className="text-[11px] text-white/55">Hiring drives &amp; mock interview slots</p>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityPage;
