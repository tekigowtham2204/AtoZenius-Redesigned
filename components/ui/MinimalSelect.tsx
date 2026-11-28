import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, X } from 'lucide-react';

export interface MinimalSelectOption<T extends string = string> {
  value: T;
  label: string;
  meta?: string;
}

interface MinimalSelectProps<T extends string = string> {
  value: T;
  options: MinimalSelectOption<T>[];
  onChange: (value: T) => void;
  tone?: 'light' | 'cream' | 'dark';
  size?: 'sm' | 'md';
  align?: 'left' | 'right';
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

interface MenuCoords {
  top?: number;
  bottom?: number;
  left: number;
  minWidth: number;
  maxWidth: number;
  openUpward: boolean;
}

function MinimalSelect<T extends string = string>({
  value,
  options,
  onChange,
  tone = 'cream',
  size = 'md',
  align = 'left',
  placeholder = 'Select an option',
  ariaLabel,
  className = '',
}: MinimalSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 12;
    const maxWidth = Math.min(380, vw - margin * 2);
    const estimatedMenuHeight = Math.min(264, options.length * 44 + 16);
    const spaceBelow = vh - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const openUpward = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

    const minWidth = Math.min(rect.width, maxWidth);
    let left = align === 'right' ? rect.right - minWidth : rect.left;
    if (left + minWidth > vw - margin) {
      left = vw - margin - minWidth;
    }
    if (left < margin) {
      left = margin;
    }

    setCoords({
      top: openUpward ? undefined : rect.bottom + 8,
      bottom: openUpward ? vh - rect.top + 8 : undefined,
      left,
      minWidth,
      maxWidth,
      openUpward,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, options.length, align]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current &&
        !rootRef.current.contains(target) &&
        (!desktopMenuRef.current || !desktopMenuRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const handleReposition = () => updatePosition();

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [open]);

  const selected = options.find((opt) => opt.value === value);
  const isDark = tone === 'dark';

  const triggerToneClass = isDark
    ? open
      ? 'bg-white/[0.12] border-white/30 text-white'
      : 'bg-white/[0.07] border-white/15 text-white hover:bg-white/[0.1] hover:border-white/25'
    : tone === 'light'
    ? open
      ? 'bg-white border-brand-dark/35 text-brand-dark shadow-sm'
      : 'bg-white border-brand-dark/12 text-brand-dark hover:border-brand-dark/25'
    : open
    ? 'bg-white border-brand-dark/35 text-brand-dark shadow-sm'
    : 'bg-brand-cream border-brand-dark/10 text-brand-dark hover:border-brand-dark/25';

  const sizeClass =
    size === 'sm'
      ? 'px-3.5 py-2 rounded-xl text-xs gap-2'
      : 'px-4 py-3 rounded-xl text-sm gap-3';

  const menuToneClass = isDark
    ? 'bg-[#12141A]/95 border-white/12 text-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)]'
    : 'bg-white/95 border-brand-dark/10 text-brand-dark shadow-[0_20px_50px_-12px_rgba(10,11,14,0.18)]';

  const sheetToneClass = isDark
    ? 'bg-[#12141A] border-white/12 text-white'
    : 'bg-white border-brand-dark/10 text-brand-dark';

  const menuNode =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Mobile Bottom Sheet (< 640px) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  onClick={() => setOpen(false)}
                  className="sm:hidden fixed inset-0 z-[9999] bg-[#0A0B0E]/40 backdrop-blur-[2px] flex flex-col justify-end p-3"
                >
                  <motion.div
                    role="listbox"
                    initial={{ y: 24, opacity: 0.8 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 24, opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full rounded-[1.5rem] border shadow-2xl overflow-hidden ${sheetToneClass}`}
                  >
                    <div className="pt-2.5 pb-2 px-4 flex items-center justify-between border-b border-current/10">
                      <div className="min-w-0">
                        <div className="w-8 h-1 rounded-full bg-current/20 mb-2 sm:hidden" />
                        <span className="block text-[10px] font-mono uppercase tracking-wider opacity-55 truncate">
                          {ariaLabel || placeholder}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close options"
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isDark
                            ? 'bg-white/10 text-white/70 hover:text-white'
                            : 'bg-brand-cream text-brand-dark/60 hover:text-brand-dark'
                        }`}
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="max-h-[55dvh] overflow-y-auto p-2 space-y-1">
                      {options.map((opt) => {
                        const active = opt.value === value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              onChange(opt.value);
                              setOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                              isDark
                                ? active
                                  ? 'bg-white/[0.1] text-white'
                                  : 'text-white/80 active:bg-white/[0.06]'
                                : active
                                ? 'bg-brand-dark/[0.05] text-brand-dark'
                                : 'text-brand-dark/80 active:bg-brand-cream'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 transition-opacity ${
                                  active ? 'bg-brand-accent opacity-100' : 'opacity-0'
                                }`}
                              />
                              <div className="min-w-0">
                                <div
                                  className={`text-sm tracking-tight leading-snug ${
                                    active ? 'font-bold' : 'font-medium'
                                  }`}
                                >
                                  {opt.label}
                                </div>
                                {opt.meta && (
                                  <div
                                    className={`text-[11px] font-mono uppercase tracking-wider mt-0.5 leading-snug ${
                                      isDark ? 'text-white/50' : 'text-brand-dark/50'
                                    }`}
                                  >
                                    {opt.meta}
                                  </div>
                                )}
                              </div>
                            </div>

                            {active && (
                              <Check
                                size={16}
                                className={`shrink-0 ${
                                  isDark ? 'text-[#60A5FA]' : 'text-brand-accent'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Desktop Floating Popover (>= 640px, unchanged) */}
                {coords && (
                  <motion.div
                    ref={desktopMenuRef}
                    role="listbox"
                    initial={{ opacity: 0, y: coords.openUpward ? 4 : -4, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: coords.openUpward ? 4 : -4, scale: 0.985 }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: 'fixed',
                      top: coords.top,
                      bottom: coords.bottom,
                      left: coords.left,
                      minWidth: coords.minWidth,
                      maxWidth: coords.maxWidth,
                      zIndex: 9999,
                    }}
                    className={`hidden sm:block rounded-2xl border backdrop-blur-xl p-1.5 ${menuToneClass}`}
                  >
                    <div className="max-h-64 overflow-y-auto space-y-0.5">
                      {options.map((opt) => {
                        const active = opt.value === value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              onChange(opt.value);
                              setOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors duration-100 ${
                              isDark
                                ? active
                                  ? 'bg-white/[0.1] text-white'
                                  : 'text-white/75 hover:bg-white/[0.06] hover:text-white'
                                : active
                                ? 'bg-brand-dark/[0.05] text-brand-dark'
                                : 'text-brand-dark/75 hover:bg-brand-cream hover:text-brand-dark'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${
                                  active ? 'bg-brand-accent opacity-100' : 'opacity-0'
                                }`}
                              />
                              <span
                                className={`text-xs sm:text-[13px] tracking-tight truncate ${
                                  active ? 'font-bold' : 'font-medium'
                                }`}
                              >
                                {opt.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 max-w-[48%]">
                              {opt.meta && (
                                <span
                                  className={`text-[10px] font-mono uppercase tracking-wider truncate ${
                                    isDark ? 'text-white/45' : 'text-brand-dark/45'
                                  }`}
                                >
                                  {opt.meta}
                                </span>
                              )}
                              {active && (
                                <Check
                                  size={14}
                                  className={`shrink-0 ${
                                    isDark ? 'text-[#60A5FA]' : 'text-brand-accent'
                                  }`}
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <div ref={rootRef} className={`relative min-w-0 max-w-full ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full min-w-0 max-w-full flex items-center justify-between border font-medium tracking-tight transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/35 ${sizeClass} ${triggerToneClass}`}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">
          <span
            className={`truncate ${
              selected?.meta ? 'shrink-0 max-w-[68%] font-semibold' : ''
            }`}
          >
            {selected ? selected.label : placeholder}
          </span>
          {selected?.meta && (
            <span
              className={`flex-1 min-w-0 truncate text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md text-left ${
                isDark ? 'bg-white/10 text-white/60' : 'bg-brand-dark/[0.05] text-brand-dark/50'
              }`}
            >
              {selected.meta}
            </span>
          )}
        </span>
        <ChevronDown
          size={size === 'sm' ? 14 : 15}
          className={`shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          } ${isDark ? 'text-white/50' : 'text-brand-dark/45'}`}
        />
      </button>

      {menuNode}
    </div>
  );
}

export default MinimalSelect;
