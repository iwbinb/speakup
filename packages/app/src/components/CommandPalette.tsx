'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '../lib/auth';
import { useActiveChain } from '../lib/chain-context';
import { useMeetings } from '../hooks/useMeetings';

type Command = {
  id: string;
  title: string;
  hint?: string;
  category: 'Navigate' | 'Identity' | 'Chain' | 'Meeting';
  run: () => void;
};

/**
 * Cmd+K (or Ctrl+K) command palette. Provides keyboard-first navigation
 * to every meaningful action: switch identity, switch chain, jump to a
 * meeting, open about, etc.
 */
export function CommandPalette() {
  const router = useRouter();
  const auth = useAuth();
  const chain = useActiveChain();
  const meetings = useMeetings();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const cmds: Command[] = [
      {
        id: 'nav-home',
        title: 'Go to holdings',
        hint: '/',
        category: 'Navigate',
        run: () => router.push('/'),
      },
      {
        id: 'nav-about',
        title: 'About SpeakUp',
        hint: '/about',
        category: 'Navigate',
        run: () => router.push('/about'),
      },
      {
        id: 'identity-demo',
        title: 'Switch to demo wallet',
        category: 'Identity',
        run: () => auth.setDemoMode(),
      },
      {
        id: 'identity-disconnect',
        title: 'Disconnect wallet',
        category: 'Identity',
        run: () => auth.logout(),
      },
    ];
    for (const c of chain.chains) {
      cmds.push({
        id: `chain-${c.id}`,
        title: `Switch to ${c.name}`,
        hint: `chain id ${c.id}`,
        category: 'Chain',
        run: () => chain.setActiveChainId(c.id as typeof chain.activeChainId),
      });
    }
    for (const m of meetings) {
      cmds.push({
        id: `meeting-${m.id}`,
        title: m.title,
        hint: `${m.proposalCount} proposals · ${m.date}`,
        category: 'Meeting',
        run: () => router.push(`/meeting/${m.id}` as never),
      });
    }
    return cmds;
  }, [auth, chain, meetings, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Group by category for display
  const grouped = useMemo(() => {
    const g = new Map<Command['category'], Command[]>();
    for (const c of filtered) {
      const arr = g.get(c.category) ?? [];
      arr.push(c);
      g.set(c.category, arr);
    }
    return g;
  }, [filtered]);

  function run(c: Command) {
    c.run();
    setOpen(false);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const c = filtered[activeIdx];
      if (c) run(c);
    }
  }

  if (!open) return null;

  let runningIdx = 0;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[80] animate-fade-in"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal
        className="fixed left-1/2 top-[15%] -translate-x-1/2 z-[81] w-[560px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-card-lg overflow-hidden animate-scale-in"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-100">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-ink-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={onKey}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder-ink-400"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 bg-ink-100 rounded text-ink-500 font-mono">
            Esc
          </kbd>
        </div>
        <div className="max-h-[400px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-ink-400 py-8">
              No commands match &ldquo;{query}&rdquo;
            </p>
          ) : (
            Array.from(grouped.entries()).map(([category, cmds]) => (
              <div key={category} className="mb-1">
                <p className="px-4 py-1 text-[10px] uppercase tracking-wider font-semibold text-ink-400">
                  {category}
                </p>
                {cmds.map((c) => {
                  const idx = runningIdx++;
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => run(c)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={`w-full text-left px-4 py-2 flex items-center justify-between gap-3 ${
                        isActive ? 'bg-brand/10' : 'hover:bg-ink-50'
                      }`}
                    >
                      <span className="text-sm text-ink-900 truncate">
                        {c.title}
                      </span>
                      {c.hint && (
                        <span className="text-[11px] text-ink-400 shrink-0 font-mono">
                          {c.hint}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-between text-[11px] text-ink-400">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-ink-100 rounded font-mono">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-ink-100 rounded font-mono">⏎</kbd>
              select
            </span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-ink-100 rounded font-mono">⌘K</kbd>
            toggle
          </span>
        </div>
      </div>
    </>
  );
}
