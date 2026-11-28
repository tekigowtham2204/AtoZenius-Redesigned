import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
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

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between border font-medium tracking-tight transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/35 ${sizeClass} ${triggerToneClass}`}
      >
        <span className="truncate flex items-center gap-2 min-w-0">
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          {selected?.meta && (
            <span
              className={`shrink-0 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
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

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -4, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.985 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-50 mt-2 min-w-full w-max max-w-[min(26rem,calc(100vw-2.5rem))] rounded-2xl border backdrop-blur-xl p-1.5 ${
              align === 'right' ? 'right-0' : 'left-0'
            } ${menuToneClass}`}
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

                    <div className="flex items-center gap-2 shrink-0">
                      {opt.meta && (
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider ${
                            isDark ? 'text-white/45' : 'text-brand-dark/45'
                          }`}
                        >
                          {opt.meta}
                        </span>
                      )}
                      {active && (
                        <Check
                          size={14}
                          className={isDark ? 'text-[#60A5FA]' : 'text-brand-accent'}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MinimalSelect;
