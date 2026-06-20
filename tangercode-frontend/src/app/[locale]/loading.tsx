export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--border-soft)] border-t-primary" />
        <p className="font-mono text-sm text-[var(--text-secondary)]">Loading...</p>
      </div>
    </div>
  );
}
