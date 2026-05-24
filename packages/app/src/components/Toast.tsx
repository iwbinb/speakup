'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type ToastKind = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  kind: ToastKind;
  title: string;
  body?: string;
};

type Ctx = {
  push: (t: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [counter, setCounter] = useState(0);

  const push = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = counter + 1;
      setCounter((c) => c + 1);
      setToasts((curr) => [...curr, { ...t, id }]);
      // auto-dismiss after 4s
      setTimeout(() => {
        setToasts((curr) => curr.filter((x) => x.id !== id));
      }, 4000);
    },
    [counter],
  );

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastView
            key={t.id}
            toast={t}
            onClose={() =>
              setToasts((curr) => curr.filter((x) => x.id !== t.id))
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastView({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const palette =
    toast.kind === 'success'
      ? 'bg-brand text-white border-brand'
      : toast.kind === 'error'
        ? 'bg-red-600 text-white border-red-600'
        : 'bg-ink-900 text-white border-ink-900';
  return (
    <div
      role="status"
      className={`pointer-events-auto min-w-[260px] max-w-[360px] rounded-2xl border px-4 py-3 shadow-card-lg animate-scale-in ${palette}`}
    >
      <div className="flex items-start gap-3">
        <Icon kind={toast.kind} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug">{toast.title}</p>
          {toast.body && (
            <p className="text-xs opacity-80 mt-0.5 leading-relaxed break-words">
              {toast.body}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="opacity-70 hover:opacity-100 text-lg leading-none -mt-1 shrink-0"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function Icon({ kind }: { kind: ToastKind }) {
  if (kind === 'success') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 7" />
      </svg>
    );
  }
  if (kind === 'error') {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16v.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16v.5" />
    </svg>
  );
}

/** Self-removing keydown effect helper for components that want to dismiss the
 *  most-recent toast on Esc. Not used by ToastProvider directly; left for
 *  consumers that want it. */
export function useEscapeDismiss(onDismiss: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDismiss]);
}
