"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--bg-base)] px-4">
      <h1 className="font-display text-4xl font-extrabold text-[var(--text-primary)]">
        Une erreur est survenue
      </h1>
      <p className="text-[var(--text-secondary)]">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-full bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary-700"
      >
        Réessayer
      </button>
    </div>
  );
}
