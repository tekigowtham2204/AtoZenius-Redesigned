import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Code2,
  Lock,
  MessageCircle,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Users,
  X,
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
  const [mobilePane, setMobilePane] = useState<'list' | 'chat'>(() =>
    !isMentorSide && initialLectureRef ? 'chat' : 'list'
  );
  const [mobileAttachOpen, setMobileAttachOpen] = useState(false);
  const [draftBody, setDraftBody] = useState('');
  const [attachLectureRef, setAttachLectureRef] = useState(initialLectureRef || '');
  const [lectureMenuOpen, setLectureMenuOpen] = useState(false);
  const [showSnippetBox, setShowSnippetBox] = useState(false);
  const [draftSnippet, setDraftSnippet] = useState('');

  const feedBottomRef = useRef<HTMLDivElement>(null);
  const lectureMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (lectureMenuRef.current && !lectureMenuRef.current.contains(e.target as Node)) {
        setLectureMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

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
      setMobilePane('chat');
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
    setMobilePane('chat');
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
    setMobileAttachOpen(false);
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
      className={`min-h-screen bg-brand-cream ${
        mobilePane === 'chat' ? 'pt-20 pb-0 lg:pt-36 lg:pb-20' : 'pt-24 sm:pt-28 md:pt-36 pb-20'
      }`}
    >
      <div
        className={`container mx-auto max-w-6xl ${
          mobilePane === 'chat' ? 'px-0 lg:px-6' : 'px-4 sm:px-6'
        }`}
      >
        {/* Header */}
        <div
          className={`${
            mobilePane === 'chat' ? 'hidden lg:flex' : 'flex'
          } flex-col md:flex-row md:items-end justify-between gap-4 mb-6 lg:mb-8 pb-5 lg:pb-6 border-b border-brand-dark/10`}
        >
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
            <div className="flex flex-nowrap lg:flex-wrap gap-1.5 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1 lg:mx-0 lg:px-0">
              <button
                type="button"
                onClick={() => setBatchFilter('all')}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
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
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
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
        <div
          className={`bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm ${
            mobilePane === 'chat'
              ? 'h-[calc(100dvh-5rem)] lg:h-auto lg:min-h-[600px] lg:rounded-[1.75rem] lg:border lg:border-brand-dark/10'
              : 'rounded-[1.5rem] lg:rounded-[1.75rem] border border-brand-dark/10 lg:min-h-[600px]'
          }`}
        >
          {/* Left Thread List */}
          <aside
            className={`${
              mobilePane === 'chat' ? 'hidden lg:flex' : 'flex'
            } lg:col-span-4 border-b lg:border-b-0 lg:border-r border-brand-dark/10 flex-col bg-[#F7F4EE]/45`}
          >
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

              <div className="flex flex-nowrap lg:flex-wrap gap-1.5 overflow-x-auto pb-0.5 lg:pb-0">
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
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
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

            <div className="flex-1 overflow-y-auto divide-y divide-brand-dark/10 lg:max-h-[560px]">
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
                  const initials = title
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() || '')
                    .join('');

                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => {
                        setActiveConvId(conv.id);
                        setMobilePane('chat');
                      }}
                      className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                        isActive ? 'bg-white lg:border-l-4 lg:border-l-brand-accent' : 'hover:bg-white/70'
                      }`}
                    >
                      <span
                        className={`lg:hidden w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                          conv.kind === 'batch-channel'
                            ? 'bg-[#EEF3FF] text-brand-accent'
                            : 'bg-brand-dark text-white'
                        }`}
                      >
                        {conv.kind === 'batch-channel' ? <Users size={15} /> : initials}
                      </span>

                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-accent font-bold inline-flex items-center gap-1">
                            {conv.kind === 'batch-channel' ? (
                              <Users size={11} className="hidden lg:inline" />
                            ) : (
                              <MessageCircle size={11} className="hidden lg:inline" />
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
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right Chat Thread */}
          <div
            className={`${
              mobilePane === 'list' ? 'hidden lg:flex' : 'flex'
            } lg:col-span-8 flex-col justify-between bg-white h-full lg:h-auto min-h-0`}
          >
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <div className="px-4 py-3.5 lg:px-6 lg:py-5 border-b border-brand-dark/10 flex items-center justify-between gap-2.5 bg-[#FDFBF7] shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobilePane('list')}
                      aria-label="Back to conversations"
                      className="lg:hidden w-9 h-9 rounded-full bg-white border border-brand-dark/10 flex items-center justify-center text-brand-dark shrink-0 hover:border-brand-dark/30"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 lg:gap-2">
                        <h2 className="text-base lg:text-lg font-bold text-brand-dark truncate">
                          {activeConversation.kind === 'batch-channel'
                            ? `${activeConversation.batchCode} Classroom Channel`
                            : isMentorSide
                            ? activeConversation.studentName
                            : activeConversation.mentorName}
                        </h2>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#EEF3FF] text-brand-accent font-bold inline-flex items-center gap-1 shrink-0">
                          <ShieldCheck size={10} />
                          {activeConversation.kind === 'batch-channel'
                            ? 'Official Batch'
                            : isMentorSide
                            ? activeConversation.batchCode
                            : 'Verified Mentor'}
                        </span>
                        {activeConversation.status === 'resolved' && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
                            Resolved
                          </span>
                        )}
                      </div>
                      {activeConversation.lectureRef && (
                        <div className="text-[11px] lg:text-xs font-mono text-brand-dark/55 mt-0.5 lg:mt-1 flex items-center gap-1.5 truncate">
                          <BookOpen size={11} className="text-brand-accent shrink-0" />
                          <span className="truncate">Topic: {activeConversation.lectureRef}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isMentorSide && activeConversation.kind === 'direct' && (
                    <button
                      type="button"
                      onClick={() => {
                        toggleConversationStatus(activeConversation.id);
                        setRefreshTick((n) => n + 1);
                      }}
                      className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-[11px] lg:text-xs font-bold border transition-colors inline-flex items-center gap-1.5 shrink-0 ${
                        activeConversation.status === 'resolved'
                          ? 'bg-white border-brand-dark/15 text-brand-dark/70 hover:border-brand-dark/40'
                          : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {activeConversation.status === 'resolved' ? (
                        <>
                          <RotateCcw size={12} /> <span className="hidden sm:inline">Reopen Thread</span><span className="sm:hidden">Reopen</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} /> <span className="hidden sm:inline">Mark Resolved</span><span className="sm:hidden">Resolve</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 lg:p-6 space-y-3.5 lg:space-y-4 overflow-y-auto min-h-0 lg:max-h-[420px]">
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
                                className={`mt-3 p-3 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre sm:whitespace-pre-wrap ${
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
                  className="p-3 sm:p-4 lg:p-5 border-t border-brand-dark/10 bg-[#FDFBF7] space-y-2.5 lg:space-y-3 shrink-0"
                >
                  {/* Desktop Attachment Row (unchanged on lg+) */}
                  <div className="hidden lg:flex flex-wrap items-center gap-2">
                    {/* Custom Minimal Lecture Topic Popover */}
                    <div className="relative" ref={lectureMenuRef}>
                      <div className="inline-flex items-center">
                        <button
                          type="button"
                          onClick={() => setLectureMenuOpen((prev) => !prev)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-2 transition-all max-w-[280px] ${
                            attachLectureRef
                              ? 'bg-[#EEF3FF] border-brand-accent/30 text-brand-accent'
                              : 'bg-white border-brand-dark/12 text-brand-dark/70 hover:border-brand-dark/30 hover:text-brand-dark'
                          }`}
                        >
                          <BookOpen size={12} className="shrink-0" />
                          <span className="truncate">
                            {attachLectureRef || 'Link lecture'}
                          </span>
                          <ChevronDown
                            size={12}
                            className={`shrink-0 transition-transform ${
                              lectureMenuOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {attachLectureRef && (
                          <button
                            type="button"
                            onClick={() => setAttachLectureRef('')}
                            aria-label="Clear linked lecture"
                            className="ml-1 p-1 rounded-full text-brand-dark/45 hover:text-brand-dark hover:bg-brand-dark/5 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      {lectureMenuOpen && (
                        <div className="absolute left-0 bottom-full mb-2 w-80 sm:w-96 rounded-2xl bg-white border border-brand-dark/10 shadow-[0_20px_48px_-12px_rgba(5,5,5,0.16)] overflow-hidden z-30">
                          <div className="px-4 py-2.5 border-b border-brand-dark/5 flex items-center justify-between bg-brand-cream/60">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-dark/50">
                              Link to lecture
                            </span>
                            {attachLectureRef && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAttachLectureRef('');
                                  setLectureMenuOpen(false);
                                }}
                                className="text-[11px] font-semibold text-brand-dark/55 hover:text-brand-dark"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          <div className="max-h-60 overflow-y-auto divide-y divide-brand-dark/5">
                            {activeTrackData.lectures.map((lec) => {
                              const label = `Lecture ${lec.lectureNumber} · ${lec.title}`;
                              const isSelected = attachLectureRef === label;
                              return (
                                <button
                                  key={lec.id}
                                  type="button"
                                  onClick={() => {
                                    setAttachLectureRef(isSelected ? '' : label);
                                    setLectureMenuOpen(false);
                                  }}
                                  className={`w-full px-4 py-3 text-left flex items-start justify-between gap-3 transition-colors ${
                                    isSelected
                                      ? 'bg-brand-cream text-brand-dark'
                                      : 'hover:bg-brand-cream/50 text-brand-dark/80'
                                  }`}
                                >
                                  <div className="flex items-baseline gap-2.5 min-w-0">
                                    <span className="text-[11px] font-mono text-brand-accent font-bold shrink-0">
                                      {lec.lectureNumber}
                                    </span>
                                    <span className="text-xs font-medium leading-snug">
                                      {lec.title}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <Check size={13} className="text-brand-accent shrink-0 mt-0.5" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowSnippetBox((prev) => !prev)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors ${
                        showSnippetBox
                          ? 'bg-brand-dark text-white border-brand-dark'
                          : 'bg-white text-brand-dark/70 border-brand-dark/12 hover:border-brand-dark/30 hover:text-brand-dark'
                      }`}
                    >
                      <Code2 size={13} /> {showSnippetBox ? 'Hide snippet' : 'Code / notes'}
                    </button>
                  </div>

                  {/* Mobile Attachment Tray (opened via + button) */}
                  {mobileAttachOpen && (
                    <div className="lg:hidden rounded-2xl bg-white border border-brand-dark/10 p-3 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-dark/50">
                          Attach to message
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSnippetBox((prev) => !prev)}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1.5 ${
                            showSnippetBox
                              ? 'bg-brand-dark text-white border-brand-dark'
                              : 'bg-brand-cream text-brand-dark/75 border-brand-dark/10'
                          }`}
                        >
                          <Code2 size={12} /> {showSnippetBox ? 'Hide snippet' : 'Code / notes'}
                        </button>
                      </div>
                      <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-0.5">
                        {activeTrackData.lectures.map((lec) => {
                          const label = `Lecture ${lec.lectureNumber} · ${lec.title}`;
                          const isSelected = attachLectureRef === label;
                          return (
                            <button
                              key={lec.id}
                              type="button"
                              onClick={() => {
                                setAttachLectureRef(isSelected ? '' : label);
                                setMobileAttachOpen(false);
                              }}
                              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
                                isSelected
                                  ? 'bg-[#EEF3FF] border-brand-accent/35 text-brand-accent font-bold'
                                  : 'bg-brand-cream/70 border-brand-dark/10 text-brand-dark/75'
                              }`}
                            >
                              Lec {lec.lectureNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Mobile Active Lecture Chip */}
                  {attachLectureRef && (
                    <div className="lg:hidden flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF3FF] border border-brand-accent/25 text-[11px] font-medium text-brand-accent max-w-full truncate">
                        <BookOpen size={11} className="shrink-0" />
                        <span className="truncate">{attachLectureRef}</span>
                        <button
                          type="button"
                          onClick={() => setAttachLectureRef('')}
                          aria-label="Remove lecture tag"
                          className="ml-0.5 text-brand-accent/70 hover:text-brand-accent"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    </div>
                  )}

                  {showSnippetBox && (
                    <textarea
                      rows={3}
                      value={draftSnippet}
                      onChange={(e) => setDraftSnippet(e.target.value)}
                      placeholder="Paste code, SQL query, or medical chart snippet..."
                      className="w-full p-3 rounded-xl bg-[#0A0B0E] text-white font-mono text-xs placeholder:text-white/40 focus:outline-none"
                    />
                  )}

                  {/* Desktop Composer Row (unchanged) */}
                  <div className="hidden lg:flex gap-2.5 items-end">
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

                  {/* Mobile Single-Row Pill Composer */}
                  <div className="flex lg:hidden items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileAttachOpen((prev) => !prev)}
                      aria-label="Attach lecture or code snippet"
                      className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        mobileAttachOpen || attachLectureRef || showSnippetBox
                          ? 'bg-brand-dark text-white border-brand-dark'
                          : 'bg-white text-brand-dark/70 border-brand-dark/15'
                      }`}
                    >
                      <Plus
                        size={17}
                        className={`transition-transform duration-150 ${
                          mobileAttachOpen ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                    <textarea
                      rows={1}
                      value={draftBody}
                      onChange={(e) => setDraftBody(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        activeConversation.kind === 'batch-channel'
                          ? `Message ${activeConversation.batchCode}...`
                          : `Message ${
                              isMentorSide
                                ? activeConversation.studentName.split(' ')[0]
                                : activeConversation.mentorName.split(' ')[0]
                            }...`
                      }
                      className="flex-1 px-4 py-2.5 rounded-full bg-white border border-brand-dark/15 text-sm text-brand-dark focus:outline-none focus:border-brand-accent resize-none leading-snug"
                    />
                    <button
                      type="submit"
                      disabled={!draftBody.trim()}
                      aria-label="Send message"
                      className="w-10 h-10 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-accent disabled:opacity-35 transition-colors shrink-0"
                    >
                      <Send size={15} />
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
