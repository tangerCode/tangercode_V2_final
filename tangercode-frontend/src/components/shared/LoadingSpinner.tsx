interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ message, className }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className ?? ""}`}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[rgba(255,255,255,0.05)] border-t-[var(--cyan)]" />
      {message && <p className="font-mono text-sm text-[var(--text-secondary)]">{message}</p>}
    </div>
  );
}
