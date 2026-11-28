import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  CheckCircle2,
  Download,
  Printer,
  MessageSquare,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  portalTracks,
  readStorage,
  STORAGE_KEYS,
  StudentSession,
  writeStorage,
} from '../../data/portal';

interface NotesPageProps {
  session: StudentSession;
  initialLectureId?: string | null;
  onAskDoubt: (lectureLabel: string) => void;
}

const NotesPage: React.FC<NotesPageProps> = ({
  session,
  initialLectureId,
  onAskDoubt,
}) => {
  const track = portalTracks[session.trackId];
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
          <article className="lg:col-span-8 print:col-span-12 bg-white rounded-[1.75rem] border border-brand-dark/10 overflow-hidden shadow-sm">
            {/* Editorial Header Plate */}
            <div className="px-7 sm:px-10 pt-7 pb-8 bg-[#F7F4EE] border-b border-brand-dark/10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <span className="text-xs font-mono font-semibold text-brand-accent">
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

              <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight leading-tight">
                {activeLecture.title}
              </h2>
            </div>

            {/* Guide Content */}
            <div className="p-7 sm:p-10 space-y-8">
              <p className="text-base text-brand-dark/75 leading-relaxed">
                {activeLecture.summary}
              </p>

              {/* Classroom Highlight Callout */}
              <div className="pl-5 border-l-2 border-brand-accent py-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-brand-accent font-semibold mb-1 inline-flex items-center gap-1.5">
                  <Sparkles size={12} /> Highlighted in Offline Class
                </div>
                <p className="text-sm font-medium text-brand-dark leading-relaxed">
                  {activeLecture.classHighlight}
                </p>
              </div>

              {/* Key Concepts Architectural Ledger */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-brand-dark/45 mb-3">
                  Key Concepts &amp; Cheat Sheet
                </h3>
                <div className="border-t border-b border-brand-dark/10 divide-y divide-brand-dark/10">
                  {activeLecture.keyPoints.map((kp) => (
                    <div
                      key={kp.term}
                      className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline"
                    >
                      <div className="sm:col-span-4 text-sm font-bold text-brand-dark">
                        {kp.term}
                      </div>
                      <div className="sm:col-span-8 text-sm text-brand-dark/70 leading-relaxed">
                        {kp.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference Snippet */}
              <div className="bg-[#0A0B0E] text-white rounded-2xl p-6 overflow-x-auto">
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mb-3">
                  {activeLecture.referenceSnippetTitle}
                </div>
                <pre className="text-xs sm:text-sm font-mono text-white/90 leading-relaxed whitespace-pre-wrap">
                  {activeLecture.referenceSnippet}
                </pre>
              </div>

              {/* Personal Class Notepad */}
              <div className="bg-brand-cream/70 rounded-2xl p-6 border border-brand-dark/10">
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

              {/* Bottom Action Strip */}
              <div className="print:hidden pt-4 border-t border-brand-dark/10 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleDownloadGuide}
                  className="text-xs font-bold text-brand-dark/70 hover:text-brand-accent inline-flex items-center gap-1.5 transition-colors"
                >
                  <Download size={14} /> Download Study Sheet (.txt)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onAskDoubt(`Lecture ${activeLecture.lectureNumber} · ${activeLecture.title}`)
                  }
                  className="px-6 py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
                >
                  <MessageSquare size={14} /> Ask doubt in batch community
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </motion.div>
  );
};

export default NotesPage;
