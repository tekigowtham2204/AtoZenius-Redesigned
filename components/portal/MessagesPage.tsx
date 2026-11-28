import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Lock,
  MessageCircle,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  getActiveTrackIds,
  getConversationsForSession,
  getMessengerMessages,
  getOrCreateDirectConversation,
  getResolvedTrackData,
  markConversationRead,
  MESSENGER_UPDATED_EVENT,
  MessengerConversation,
  PortalSession,
  PortalTrackId,
  sendMessengerMessage,
  toggleConversationStatus,
} from '../../data/portal';

interface MessagesPageProps {
  session: PortalSession;
  initialLectureRef?: string | null;
  onSelectTrack?: (trackId: PortalTrackId) => void;
}

type FilterTab = 'all' | 'direct' | 'channel' | 'unread';

const MessagesPage: React.FC<MessagesPageProps> = ({
  session,
  initialLectureRef,
  onSelectTrack,
}) => {
  const isMentorSide = session.role !== 'student';
  const activeTrackId = session.trackId || 'ai-full-stack';
  const [, setRefreshTick] = useState(0);

  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [draftBody, setDraftBody] = useState('');
  const [attachLectureRef, setAttachLectureRef] = useState(initialLectureRef || '');
  const [showSnippetBox, setShowSnippetBox] = useState(false);
  const [draftSnippet, setDraftSnippet] = useState('');

  const feedBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onUpdated = () => setRefreshTick((n) => n + 1);
    window.addEventListener(MESSENGER_UPDATED_EVENT, onUpdated);
    return () => window.removeEventListener(MESSENGER_UPDATED_EVENT, onUpdated);
  }, []);

  // Ensure direct thread opens automatically if navigated here with a lecture context
  useEffect(() => {
    if (!isMentorSide && initialLectureRef) {
      const conv = getOrCreateDirectConversation(session, activeTrackId, initialLectureRef);
      setActiveConvId(conv.id);
      setAttachLectureRef(initialLectureRef);
    }
  }, [initialLectureRef, activeTrackId]);

  const conversations = getConversationsForSession(session);

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return conversations.filter((c) => {
      if (filterTab === 'direct' && c.kind !== 'direct') return false;
      if (filterTab === 'channel' && c.kind !== 'batch-channel') return false;
      const unread = isMentorSide ? c.unreadByMentor : c.unreadByStudent;
      if (filterTab === 'unread' && unread === 0) return false;
      if (isMentorSide && batchFilter !== 'all' && c.trackId !== batchFilter) return false;
      if (!q) return true;
      return (
        c.studentName.toLowerCase().includes(q) ||
        c.mentorName.toLowerCase().includes(q) ||
        c.batchCode.toLowerCase().includes(q) ||
        c.lastMessagePreview.toLowerCase().includes(q) ||
        (c.lectureRef && c.lectureRef.toLowerCase().includes(q))
      );
    });
  }, [conversations, filterTab, batchFilter, searchQuery, isMentorSide]);

  useEffect(() => {
    if (!activeConvId && filteredConversations.length > 0) {
      setActiveConvId(filteredConversations[0].id);
    }
  }, [activeConvId, filteredConversations]);

  const activeConversation: MessengerConversation | undefined =
    conversations.find((c) => c.id === activeConvId) || filteredConversations[0];

  useEffect(() => {
    if (activeConversation) {
      markConversationRead(activeConversation.id, session.role);
    }
  }, [activeConversation?.id, session.role]);

  const messages = activeConversation ? getMessengerMessages(activeConversation.id) : [];

  useEffect(() => {
    feedBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages.length, activeConversation?.id]);

  const activeTrackData = getResolvedTrackData(
    activeConversation?.trackId || activeTrackId
  );

  const handleStartMentorChat = () => {
    const conv = getOrCreateDirectConversation(
      session,
      activeTrackId,
      attachLectureRef || undefined
    );
    setActiveConvId(conv.id);
    setFilterTab('all');
    setRefreshTick((n) => n + 1);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeConversation || !draftBody.trim()) return;

    sendMessengerMessage({
      conversationId: activeConversation.id,
      session,
      body: draftBody,
      codeSnippet: showSnippetBox ? draftSnippet : undefined,
      lectureRef: attachLectureRef || undefined,
    });

    setDraftBody('');
    setDraftSnippet('');
    setShowSnippetBox(false);
    setRefreshTick((n) => n + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeBatches = getActiveTrackIds();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-20 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono text-brand-accent font-semibold mb-2 inline-flex items-center gap-1.5">
              <Lock size={12} /> Private In-App Messaging · Zero Phone Numbers Shared
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              AtoZenius Messages.
            </h1>
          </div>

          {!isMentorSide ? (
            <button
              type="button"
              onClick={handleStartMentorChat}
              className="px-5 py-2.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2 self-start md:self-auto"
            >
              <Plus size={14} /> Message {activeTrackData.mentorName.split(' ')[0]} Privately
            </button>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setBatchFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  batchFilter === 'all'
                    ? 'bg-brand-dark text-white'
                    : 'bg-white border border-brand-dark/10 text-brand-dark/70'
                }`}
              >
                All Batches
              </button>
              {activeBatches.map((id) => {
                const t = getResolvedTrackData(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setBatchFilter(id);
                      if (onSelectTrack) onSelectTrack(id);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      batchFilter === id
                        ? 'bg-brand-dark text-white'
                        : 'bg-white border border-brand-dark/10 text-brand-dark/70'
                    }`}
                  >
                    {t.batchCode}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Split-Pane Messenger Container */}
        <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] shadow-sm">
          {/* Left Thread List */}
          <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-brand-dark/10 flex flex-col bg-[#F7F4EE]/45">
            <div className="p-4 border-b border-brand-dark/10 space-y-3">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark/40"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations or topics..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-full bg-white border border-brand-dark/10 text-xs focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'direct', label: 'Direct 1-on-1' },
                    { id: 'channel', label: 'Classroom' },
                    { id: 'unread', label: 'Unread' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
                      filterTab === tab.id
                        ? 'bg-brand-dark text-white'
                        : 'bg-white text-brand-dark/65 border border-brand-dark/10 hover:border-brand-dark/30'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-brand-dark/10 max-h-[420px] lg:max-h-[560px]">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-brand-dark/55">
                  No conversations match this filter.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = activeConversation?.id === conv.id;
                  const unread = isMentorSide ? conv.unreadByMentor : conv.unreadByStudent;
                  const title =
                    conv.kind === 'batch-channel'
                      ? `${conv.batchCode} Classroom`
                      : isMentorSide
                      ? conv.studentName
                      : conv.mentorName;

                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full text-left p-4 transition-colors flex flex-col gap-1.5 ${
                        isActive ? 'bg-white border-l-4 border-l-brand-accent' : 'hover:bg-white/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-accent font-bold inline-flex items-center gap-1">
                          {conv.kind === 'batch-channel' ? (
                            <Users size={11} />
                          ) : (
                            <MessageCircle size={11} />
                          )}
                          {conv.kind === 'batch-channel' ? 'Channel' : 'Direct'} · {conv.batchCode}
                        </span>
                        <span className="text-[10px] font-mono text-brand-dark/45">
                          {conv.lastMessageAt}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-brand-dark truncate">{title}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {conv.status === 'resolved' && (
                            <CheckCircle2 size={13} className="text-emerald-600" />
                          )}
                          {unread > 0 && (
                            <span className="w-5 h-5 rounded-full bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center">
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-brand-dark/60 line-clamp-1">
                        {conv.lastMessagePreview}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right Chat Thread */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-white">
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <div className="px-6 py-5 border-b border-brand-dark/10 flex flex-wrap items-center justify-between gap-3 bg-[#FDFBF7]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-brand-dark">
                        {activeConversation.kind === 'batch-channel'
                          ? `${activeConversation.batchCode} Classroom Channel`
                          : isMentorSide
                          ? activeConversation.studentName
                          : activeConversation.mentorName}
                      </h2>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#EEF3FF] text-brand-accent font-bold inline-flex items-center gap-1">
                        <ShieldCheck size={11} />
                        {activeConversation.kind === 'batch-channel'
                          ? 'Official Batch'
                          : isMentorSide
                          ? activeConversation.batchCode
                          : 'Verified Mentor'}
                      </span>
                      {activeConversation.status === 'resolved' && (
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          Resolved
                        </span>
                      )}
                    </div>
                    {activeConversation.lectureRef && (
                      <div className="text-xs font-mono text-brand-dark/55 mt-1 inline-flex items-center gap-1.5">
                        <BookOpen size={12} className="text-brand-accent" />
                        Topic: {activeConversation.lectureRef}
                      </div>
                    )}
                  </div>

                  {isMentorSide && activeConversation.kind === 'direct' && (
                    <button
                      type="button"
                      onClick={() => {
                        toggleConversationStatus(activeConversation.id);
                        setRefreshTick((n) => n + 1);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors inline-flex items-center gap-1.5 ${
                        activeConversation.status === 'resolved'
                          ? 'bg-white border-brand-dark/15 text-brand-dark/70 hover:border-brand-dark/40'
                          : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {activeConversation.status === 'resolved' ? (
                        <>
                          <RotateCcw size={12} /> Reopen Thread
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} /> Mark Resolved
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[420px]">
                  {messages.length === 0 ? (
                    <div className="py-12 text-center text-sm text-brand-dark/55">
                      Start the conversation below—your messages stay private inside AtoZenius.
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMine =
                        msg.senderEmail.toLowerCase() === session.email.toLowerCase() ||
                        (session.role === 'mentor' && msg.senderRole === 'mentor');
                      const isMentorMsg = msg.senderRole === 'mentor';

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                              isMine
                                ? 'bg-[#0A0B0E] text-white'
                                : isMentorMsg
                                ? 'bg-[#EEF3FF] border border-brand-accent/20 text-brand-dark'
                                : 'bg-brand-cream border border-brand-dark/10 text-brand-dark'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 text-[11px] mb-1.5">
                              <span className="font-bold inline-flex items-center gap-1">
                                {msg.senderName}
                                {isMentorMsg && (
                                  <ShieldCheck
                                    size={12}
                                    className={isMine ? 'text-[#60A5FA]' : 'text-brand-accent'}
                                  />
                                )}
                              </span>
                              <span
                                className={`font-mono ${
                                  isMine ? 'text-white/50' : 'text-brand-dark/45'
                                }`}
                              >
                                {msg.createdAt}
                              </span>
                            </div>

                            {msg.lectureRef && (
                              <div
                                className={`text-[11px] font-mono mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                                  isMine
                                    ? 'bg-white/10 text-[#60A5FA]'
                                    : 'bg-white border border-brand-dark/10 text-brand-accent'
                                }`}
                              >
                                <BookOpen size={10} /> {msg.lectureRef}
                              </div>
                            )}

                            <p className="leading-relaxed whitespace-pre-wrap">{msg.body}</p>

                            {msg.codeSnippet && (
                              <pre
                                className={`mt-3 p-3 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap ${
                                  isMine
                                    ? 'bg-white/10 text-white/95'
                                    : 'bg-[#0A0B0E] text-white/95'
                                }`}
                              >
                                {msg.codeSnippet}
                              </pre>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={feedBottomRef} />
                </div>

                {/* Message Composer */}
                <form
                  onSubmit={handleSend}
                  className="p-5 border-t border-brand-dark/10 bg-[#FDFBF7] space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={attachLectureRef}
                      onChange={(e) => setAttachLectureRef(e.target.value)}
                      className="px-3 py-1.5 rounded-full bg-white border border-brand-dark/15 text-xs font-semibold text-brand-dark max-w-[260px]"
                    >
                      <option value="">Attach lecture topic (optional)</option>
                      {activeTrackData.lectures.map((lec) => {
                        const label = `Lecture ${lec.lectureNumber} · ${lec.title}`;
                        return (
                          <option key={lec.id} value={label}>
                            {label}
                          </option>
                        );
                      })}
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowSnippetBox((prev) => !prev)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 transition-colors ${
                        showSnippetBox
                          ? 'bg-brand-dark text-white border-brand-dark'
                          : 'bg-white text-brand-dark/70 border-brand-dark/15 hover:border-brand-dark/35'
                      }`}
                    >
                      <Code2 size={13} /> {showSnippetBox ? 'Hide Snippet' : 'Attach Code / Notes'}
                    </button>
                  </div>

                  {showSnippetBox && (
                    <textarea
                      rows={3}
                      value={draftSnippet}
                      onChange={(e) => setDraftSnippet(e.target.value)}
                      placeholder="Paste code, SQL query, or medical chart snippet..."
                      className="w-full p-3 rounded-xl bg-[#0A0B0E] text-white font-mono text-xs placeholder:text-white/40 focus:outline-none"
                    />
                  )}

                  <div className="flex gap-2.5 items-end">
                    <textarea
                      rows={2}
                      value={draftBody}
                      onChange={(e) => setDraftBody(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        activeConversation.kind === 'batch-channel'
                          ? `Message ${activeConversation.batchCode} classroom...`
                          : `Write to ${
                              isMentorSide
                                ? activeConversation.studentName
                                : activeConversation.mentorName
                            }... (Enter to send)`
                      }
                      className="flex-1 px-4 py-3 rounded-2xl bg-white border border-brand-dark/15 text-sm text-brand-dark focus:outline-none focus:border-brand-accent resize-none"
                    />
                    <button
                      type="submit"
                      disabled={!draftBody.trim()}
                      className="px-6 py-3.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent disabled:opacity-40 transition-colors inline-flex items-center gap-1.5 shrink-0"
                    >
                      <Send size={13} /> Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-sm text-brand-dark/55">
                Select a conversation on the left to start messaging.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessagesPage;
