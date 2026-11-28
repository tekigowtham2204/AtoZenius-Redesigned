import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  CheckCircle2,
  Download,
  Printer,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  getResolvedTrackData,
  PortalSession,
  readStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../../data/portal';

interface NotesPageProps {
  session: PortalSession;
  initialLectureId?: string | null;
  onAskDoubt: (lectureLabel: string) => void;
  onMessageMentor?: (lectureLabel: string) => void;
}

const NotesPage: React.FC<NotesPageProps> = ({
  session,
  initialLectureId,
  onAskDoubt,
  onMessageMentor,
}) => {
  const track = getResolvedTrackData(session.trackId || 'ai-full-stack');
  const [selectedLectureId, setSelectedLectureId] = useState<string>(
    initialLectureId && track.lectures.some((l) => l.id === initialLectureId)
      ? initialLectureId
      : track.lectures[0].id
  );
  const [filterMode, setFilterMode] = useState<'all' | 'bookmarked'>('all');
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() =>
    readStorage<Record<string, boolean>>(STORAGE_KEYS.bookmarks, {})
  );
  const [revised, setRevised] = useState<Record<string, boolean>>(() =>
    readStorage<Record<string, boolean>>(STORAGE_KEYS.revised, {})
  );
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>(() =>
    readStorage<Record<string, string>>(STORAGE_KEYS.personalNotes, {})
  );
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync lecture selection when track or requested lecture changes
  useEffect(() => {
    if (initialLectureId && track.lectures.some((l) => l.id === initialLectureId)) {
      setSelectedLectureId(initialLectureId);
    } else if (!track.lectures.some((l) => l.id === selectedLectureId)) {
      setSelectedLectureId(track.lectures[0].id);
    }
  }, [session.trackId, initialLectureId]);

  const visibleLectures =
    filterMode === 'bookmarked'
      ? track.lectures.filter((l) => bookmarks[l.id])
      : track.lectures;

  const activeLecture =
    track.lectures.find((l) => l.id === selectedLectureId) || track.lectures[0];

  const toggleBookmark = (id: string) => {
    const next = { ...bookmarks, [id]: !bookmarks[id] };
    setBookmarks(next);
    writeStorage(STORAGE_KEYS.bookmarks, next);
  };

  const toggleRevised = (id: string) => {
    const next = { ...revised, [id]: !revised[id] };
    setRevised(next);
    writeStorage(STORAGE_KEYS.revised, next);
  };

  const handleNoteChange = (id: string, value: string) => {
    const next = { ...personalNotes, [id]: value };
    setPersonalNotes(next);
    writeStorage(STORAGE_KEYS.personalNotes, next);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1200);
  };

  const handleDownloadGuide = () => {
    const userNote = personalNotes[activeLecture.id]?.trim();
    const lines = [
      `ATOZENIUS STUDY GUIDE — ${track.courseTitle} (${track.batchCode})`,
      `Lecture ${activeLecture.lectureNumber}: ${activeLecture.title}`,
      `Date: ${activeLecture.taughtDate} | Mentor: ${track.mentorName}`,
      '',
      'SUMMARY',
      activeLecture.summary,
      '',
      'HIGHLIGHTED IN OFFLINE CLASS',
      activeLecture.classHighlight,
      '',
      'KEY CONCEPTS & CHEAT SHEET',
      ...activeLecture.keyPoints.map((kp) => `- ${kp.term}: ${kp.detail}`),
      '',
      activeLecture.referenceSnippetTitle.toUpperCase(),
      activeLecture.referenceSnippet,
      ...(userNote ? ['', 'MY PERSONAL CLASS NOTES', userNote] : []),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atozenius-lecture-${activeLecture.lectureNumber}-${activeLecture.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isBookmarked = Boolean(bookmarks[activeLecture.id]);
  const isRevised = Boolean(revised[activeLecture.id]);
  const writtenPersonalNote = (personalNotes[activeLecture.id] || '').trim();
  const lectureLabel = `Lecture ${activeLecture.lectureNumber} · ${activeLecture.title}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream print:pt-0 print:pb-0 print:min-h-0 print:bg-white"
    >
      <div className="container mx-auto px-6 max-w-6xl print:px-0 print:max-w-none">
        {/* Top Bar (Hidden when printing) */}
        <div className="print:hidden flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono text-brand-accent font-semibold mb-2">
              {track.courseTitle} · {track.batchCode}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Personalized Study Notes.
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                filterMode === 'all'
                  ? 'bg-brand-dark text-white'
                  : 'text-brand-dark/65 hover:bg-brand-dark/5'
              }`}
            >
              All Lectures ({track.lectures.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('bookmarked')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                filterMode === 'bookmarked'
                  ? 'bg-brand-dark text-white'
                  : 'text-brand-dark/65 hover:bg-brand-dark/5'
              }`}
            >
              Bookmarked ({track.lectures.filter((l) => bookmarks[l.id]).length})
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full text-xs font-bold border border-brand-dark/15 text-brand-dark hover:border-brand-dark/40 inline-flex items-center gap-1.5"
            >
              <Printer size={14} /> Print / PDF
            </button>
          </div>
        </div>

        {/* Dedicated Print-Only Document Letterhead */}
        <div className="hidden print:flex items-end justify-between pb-4 mb-5 border-b-2 border-neutral-900">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-neutral-900">
              AtoZenius<span className="text-brand-accent">.</span> Study Guide
            </div>
            <div className="text-xs font-semibold text-neutral-700 mt-0.5">
              {track.courseTitle} · {track.batchCode}
            </div>
          </div>
          <div className="text-right text-[11px] text-neutral-600 leading-snug">
            <div>
              Mentor: <strong className="text-neutral-900">{track.mentorName}</strong>
            </div>
            <div>
              Student: <strong className="text-neutral-900">{session.name}</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 print:block gap-8 items-start">
          {/* Left Module Index (Hidden when printing) */}
          <aside className="print:hidden lg:col-span-4 space-y-2.5">
            {visibleLectures.length === 0 ? (
              <div className="bg-white rounded-[1.5rem] p-6 border border-brand-dark/10 text-sm text-brand-dark/60">
                No bookmarked lectures yet. Click the bookmark icon on any guide to pin it here.
              </div>
            ) : (
              visibleLectures.map((lec) => {
                const isActive = lec.id === activeLecture.id;
                const lecBookmarked = Boolean(bookmarks[lec.id]);
                const lecRevised = Boolean(revised[lec.id]);

                return (
                  <button
                    key={lec.id}
                    type="button"
                    onClick={() => setSelectedLectureId(lec.id)}
                    className={`w-full text-left p-5 rounded-[1.5rem] border transition-all flex items-start justify-between gap-3 ${
                      isActive
                        ? 'bg-[#0A0B0E] text-white border-[#0A0B0E] shadow-lg'
                        : 'bg-white text-brand-dark border-brand-dark/10 hover:border-brand-dark/30'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono mb-1.5">
                        <span className={isActive ? 'text-[#60A5FA]' : 'text-brand-accent'}>
                          {lec.lectureNumber}
                        </span>
                        <span className={isActive ? 'text-white/50' : 'text-brand-dark/45'}>
                          · {lec.taughtDate}
                        </span>
                      </div>
                      <h2 className="text-sm font-bold leading-snug">{lec.title}</h2>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      {lecRevised && (
                        <CheckCircle2
                          size={15}
                          className={isActive ? 'text-emerald-400' : 'text-emerald-600'}
                        />
                      )}
                      {lecBookmarked && (
                        <Bookmark
                          size={14}
                          className={
                            isActive
                              ? 'text-[#60A5FA] fill-[#60A5FA]'
                              : 'text-brand-accent fill-brand-accent'
                          }
                        />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </aside>

          {/* Right Study Sheet Folio */}
          <article className="lg:col-span-8 print:w-full bg-white rounded-[1.75rem] border border-brand-dark/10 overflow-hidden shadow-sm print:rounded-none print:border-0 print:shadow-none print:overflow-visible">
            {/* Editorial Header Plate */}
            <div className="px-7 sm:px-10 pt-7 pb-8 bg-[#F7F4EE] border-b border-brand-dark/10 print:bg-transparent print:px-0 print:pt-0 print:pb-4 print:border-neutral-300">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 print:mb-2">
                <span className="text-xs font-mono font-semibold text-brand-accent print:text-neutral-700">
                  Lecture {activeLecture.lectureNumber} · {activeLecture.weekLabel} · {activeLecture.taughtDate}
                </span>

                <div className="print:hidden flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(activeLecture.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors inline-flex items-center gap-1.5 ${
                      isBookmarked
                        ? 'bg-brand-accent text-white border-brand-accent'
                        : 'bg-white text-brand-dark/75 border-brand-dark/15 hover:border-brand-dark/35'
                    }`}
                  >
                    <Bookmark size={13} className={isBookmarked ? 'fill-white' : ''} />
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleRevised(activeLecture.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors inline-flex items-center gap-1.5 ${
                      isRevised
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-brand-dark/75 border-brand-dark/15 hover:border-brand-dark/35'
                    }`}
                  >
                    <Check size={13} />
                    {isRevised ? 'Revised' : 'Mark revised'}
                  </button>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight leading-tight print:text-2xl print:text-neutral-900">
                {activeLecture.title}
              </h2>
            </div>

            {/* Guide Content */}
            <div className="p-7 sm:p-10 space-y-8 print:px-0 print:py-5 print:space-y-6">
              <p className="text-base text-brand-dark/75 leading-relaxed print:text-sm print:text-neutral-800">
                {activeLecture.summary}
              </p>

              {/* Classroom Highlight Callout */}
              <div className="pl-5 border-l-2 border-brand-accent py-1 print:border-neutral-800 print:break-inside-avoid">
                <div className="text-[11px] font-mono uppercase tracking-wider text-brand-accent font-semibold mb-1 inline-flex items-center gap-1.5 print:text-neutral-700">
                  <Sparkles size={12} /> Highlighted in Offline Class
                </div>
                <p className="text-sm font-medium text-brand-dark leading-relaxed print:text-neutral-900">
                  {activeLecture.classHighlight}
                </p>
              </div>

              {/* Key Concepts Architectural Ledger */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-brand-dark/45 mb-3 print:text-neutral-600">
                  Key Concepts &amp; Cheat Sheet
                </h3>
                <div className="border-t border-b border-brand-dark/10 divide-y divide-brand-dark/10 print:border-neutral-300 print:divide-neutral-200">
                  {activeLecture.keyPoints.map((kp) => (
                    <div
                      key={kp.term}
                      className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline print:py-2.5 print:break-inside-avoid"
                    >
                      <div className="sm:col-span-4 text-sm font-bold text-brand-dark print:text-neutral-900">
                        {kp.term}
                      </div>
                      <div className="sm:col-span-8 text-sm text-brand-dark/70 leading-relaxed print:text-neutral-800">
                        {kp.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference Snippet (High contrast on print regardless of background graphics toggle) */}
              <div className="bg-[#0A0B0E] text-white rounded-2xl p-6 overflow-x-auto print:bg-neutral-100 print:text-neutral-900 print:border print:border-neutral-300 print:rounded-lg print:p-4 print:break-inside-avoid">
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mb-3 print:text-neutral-600 print:font-bold">
                  {activeLecture.referenceSnippetTitle}
                </div>
                <pre className="text-xs sm:text-sm font-mono text-white/90 leading-relaxed whitespace-pre-wrap print:text-neutral-900">
                  {activeLecture.referenceSnippet}
                </pre>
              </div>

              {/* Interactive Personal Class Notepad (Screen Only) */}
              <div className="print:hidden bg-brand-cream/70 rounded-2xl p-6 border border-brand-dark/10">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <label
                    htmlFor="personal-note-box"
                    className="text-xs font-mono uppercase tracking-wider text-brand-dark/60 font-semibold"
                  >
                    My Personal Class Notes (Saved Automatically)
                  </label>
                  {savedNotice && (
                    <span className="text-xs font-semibold text-emerald-700">Saved</span>
                  )}
                </div>
                <textarea
                  id="personal-note-box"
                  rows={4}
                  value={personalNotes[activeLecture.id] || ''}
                  onChange={(e) => handleNoteChange(activeLecture.id, e.target.value)}
                  placeholder="Jot down examples from class, formulas, or questions for your mentor..."
                  className="w-full p-4 rounded-xl bg-white border border-brand-dark/10 text-sm text-brand-dark focus:outline-none focus:border-brand-accent leading-relaxed"
                />
              </div>

              {/* Print-Only Personal Notes (Rendered cleanly only when notes exist) */}
              {writtenPersonalNote && (
                <div className="hidden print:block pt-4 border-t border-neutral-300 print:break-inside-avoid">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-600 font-bold mb-2">
                    My Personal Class Notes
                  </div>
                  <p className="text-sm text-neutral-900 leading-relaxed whitespace-pre-wrap">
                    {writtenPersonalNote}
                  </p>
                </div>
              )}

              {/* Bottom Action Strip (Hidden on print) */}
              <div className="print:hidden pt-4 border-t border-brand-dark/10 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleDownloadGuide}
                  className="text-xs font-bold text-brand-dark/70 hover:text-brand-accent inline-flex items-center gap-1.5 transition-colors"
                >
                  <Download size={14} /> Download Study Sheet (.txt)
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  {onMessageMentor && (
                    <button
                      type="button"
                      onClick={() => onMessageMentor(lectureLabel)}
                      className="px-5 py-3 border border-brand-dark/15 text-brand-dark rounded-full text-xs font-bold hover:border-brand-accent hover:text-brand-accent transition-colors inline-flex items-center gap-2"
                    >
                      <MessageCircle size={14} /> Message Mentor Privately
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onAskDoubt(lectureLabel)}
                    className="px-6 py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
                  >
                    <MessageSquare size={14} /> Ask doubt in batch community
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </motion.div>
  );
};

export default NotesPage;
