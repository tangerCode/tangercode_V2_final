import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--bg-base)] px-4">
      <span className="font-mono text-7xl font-bold text-cyan">404</span>
      <h1 className="font-display text-3xl font-extrabold text-[var(--text-primary)]">
        Page introuvable
      </h1>
      <p className="max-w-md text-center text-[var(--text-secondary)]">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/fr"
        className="rounded-full bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary-700"
      >
        Retour à l&rsquo;accueil
      </Link>
    </div>
  );
}
