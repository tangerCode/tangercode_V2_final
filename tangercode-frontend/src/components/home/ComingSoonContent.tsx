"use client";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface Props {
  title: string;
  subtitle: string;
  comingSoon: string;
}

export function ComingSoonContent({ title, subtitle, comingSoon }: Props) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[60vw] max-h-[720px] w-[60vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.22),rgba(0,82,204,0.1)_45%,transparent_70%)] blur-[40px]" />
      </div>

      {/* Toolbar */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <p className="eyebrow mb-6">DEVELOPPEMENT WEB &amp; MOBILE</p>

        {/* Logo */}
        <div className="mb-4 text-center">
          <span className="font-mono text-sm tracking-[0.2em] text-cyan">
            &lt;
            <span className="font-display text-2xl font-extrabold text-white">
              TANGER&nbsp;CODE
            </span>
            /&gt;
          </span>
        </div>

        {/* Title */}
        <h1
          className="h-hero mx-auto mb-6 max-w-[14ch]"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.75rem)",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto mb-10 max-w-[56ch] text-secondary"
          style={{
            fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
          }}
        >
          {subtitle}
        </p>

        {/* Coming Soon badge */}
        <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[var(--bg-surface)] px-6 py-3">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-success" />
          <span className="font-mono text-sm text-muted">{comingSoon}</span>
        </div>
      </div>
    </main>
  );
}
