import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, CheckCircle2 } from 'lucide-react';
import {
  allTrackIds,
  getResolvedTrackData,
  LectureNote,
  LectureOverride,
  PortalSession,
  PortalTrackId,
  readStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../../../data/portal';

interface MentorNotesPageProps {
  session: PortalSession;
  onSelectTrack: (trackId: PortalTrackId) => void;
}

const MentorNotesPage: React.FC<MentorNotesPageProps> = ({ session, onSelectTrack }) => {
  const activeTrackId = session.trackId || 'ai-full-stack';
  const track = getResolvedTrackData(activeTrackId);
  const [selectedLectureId, setSelectedLectureId] = useState(track.lectures[0].id);
  const [summaryDraft, setSummaryDraft] = useState('');
  const [highlightDraft, setHighlightDraft] = useState('');
  const [savedFlag, setSavedFlag] = useState(false);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  useEffect(() => {
    const first = track.lectures[0];
    if (!track.lectures.some((l) => l.id === selectedLectureId)) {
      setSelectedLectureId(first.id);
    }
  }, [session.trackId]);

  const activeLecture =
    track.lectures.find((l) => l.id === selectedLectureId) || track.lectures[0];

  useEffect(() => {
    setSummaryDraft(activeLecture.summary);
    setHighlightDraft(activeLecture.classHighlight);
  }, [activeLecture.id, session.trackId]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = readStorage<Record<string, LectureOverride>>(
      STORAGE_KEYS.lectureOverrides,
      {}
    );
    writeStorage(STORAGE_KEYS.lectureOverrides, {
      ...existing,
      [activeLecture.id]: {
        summary: summaryDraft.trim() || activeLecture.summary,
        classHighlight: highlightDraft.trim() || activeLecture.classHighlight,
      },
    });
    setSavedFlag(true);
    window.setTimeout(() => setSavedFlag(false), 1800);
  };

  const handlePublishNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const existing = readStorage<Record<string, LectureNote[]>>(
      STORAGE_KEYS.customLectures,
      {}
    );
    const trackList = existing[activeTrackId] || [];
    const nextNum = String(track.lectures.length + 1).padStart(2, '0');
    const created: LectureNote = {
      id: `${activeTrackId}-custom-${Date.now()}`,
      lectureNumber: nextNum,
      weekLabel: `Week ${nextNum}`,
      title: newTitle.trim(),
      taughtDate: 'Published Today',
      status: 'taught',
      summary: newSummary.trim(),
      classHighlight:
        newHighlight.trim() || 'Key takeaways discussed during today’s offline session.',
      keyPoints: [
        {
          term: 'Classroom Focus',
          detail: newHighlight.trim() || newSummary.trim(),
        },
      ],
      referenceSnippetTitle: 'Mentor Quick Reference',
      referenceSnippet: `// ${newTitle.trim()}\n// Batch: ${track.batchCode}`,
    };

    writeStorage(STORAGE_KEYS.customLectures, {
      ...existing,
      [activeTrackId]: [...trackList, created],
    });
    setIsAddingNew(false);
    setSelectedLectureId(created.id);
    setNewTitle('');
    setNewSummary('');
    setNewHighlight('');
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
              Notes Studio · Syncs Live to Student Guides
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Course Study Guides.
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allTrackIds.map((id) => {
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
            <button
              type="button"
              onClick={() => setIsAddingNew((prev) => !prev)}
              className="px-4 py-2 rounded-full text-xs font-bold bg-brand-accent text-white inline-flex items-center gap-1.5"
            >
              <Plus size={14} /> New Lecture Guide
            </button>
          </div>
        </div>

        {isAddingNew && (
          <form
            onSubmit={handlePublishNew}
            className="mb-8 bg-white rounded-[1.75rem] border border-brand-accent/30 p-7 space-y-4 shadow-sm"
          >
            <h2 className="text-lg font-bold text-brand-dark">
              Publish New Offline Lecture Guide ({track.batchCode})
            </h2>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Lecture title (e.g., Lecture 05: System Integration & Deployment)"
              className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
            />
            <textarea
              rows={3}
              required
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="Concise summary of what was covered in today's classroom session..."
              className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
            />
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="Highlighted in Offline Class callout (key tip or common mistake)"
              className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors"
              >
                Publish to Student Notes
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-5 py-2.5 text-xs font-bold text-brand-dark/60"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Lecture List */}
          <aside className="lg:col-span-4 space-y-2.5">
            {track.lectures.map((lec) => {
              const isActive = lec.id === activeLecture.id;
              return (
                <button
                  key={lec.id}
                  type="button"
                  onClick={() => setSelectedLectureId(lec.id)}
                  className={`w-full text-left p-5 rounded-[1.5rem] border transition-all ${
                    isActive
                      ? 'bg-[#0A0B0E] text-white border-[#0A0B0E]'
                      : 'bg-white text-brand-dark border-brand-dark/10 hover:border-brand-dark/30'
                  }`}
                >
                  <div className="text-[11px] font-mono mb-1 text-brand-accent">
                    Lecture {lec.lectureNumber} · {lec.taughtDate}
                  </div>
                  <div className="text-sm font-bold leading-snug">{lec.title}</div>
                </button>
              );
            })}
          </aside>

          {/* Right Editor */}
          <form
            onSubmit={handleSaveEdit}
            className="lg:col-span-8 bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-9 space-y-6"
          >
            <div className="pb-5 border-b border-brand-dark/10">
              <span className="text-xs font-mono text-brand-accent font-semibold">
                Editing Lecture {activeLecture.lectureNumber} ({track.batchCode})
              </span>
              <h2 className="text-2xl font-bold text-brand-dark mt-1">{activeLecture.title}</h2>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                Lecture Summary
              </label>
              <textarea
                rows={4}
                value={summaryDraft}
                onChange={(e) => setSummaryDraft(e.target.value)}
                className="w-full p-4 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm text-brand-dark focus:outline-none focus:border-brand-accent leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                Highlighted in Offline Class Callout
              </label>
              <textarea
                rows={3}
                value={highlightDraft}
                onChange={(e) => setHighlightDraft(e.target.value)}
                className="w-full p-4 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm text-brand-dark focus:outline-none focus:border-brand-accent leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className="px-7 py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
              >
                <Save size={14} /> Save &amp; Sync to Students
              </button>

              {savedFlag && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={15} /> Updated live for {track.batchCode} students
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default MentorNotesPage;
