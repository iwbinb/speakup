/**
 * Branded loading spinner. Brand-color ring with transparent gap.
 * Sized via CSS class so callers can drop it inline anywhere.
 */
export function Spinner({
  size = 16,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-brand/30 border-t-brand ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-500">
      <Spinner size={14} />
      {label}
    </span>
  );
}
