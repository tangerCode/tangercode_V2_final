"use client";

import { Link, Linkedin, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  direction?: "row" | "col";
}

declare global {
  interface Window {
    FB?: unknown;
    twttr?: unknown;
  }
}

export function ShareButtons({ url, title, direction = "row" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="social" style={{ flexDirection: direction === "col" ? "column" : "row" }}>
      <button
        className="icon-btn"
        onClick={copyLink}
        aria-label={copied ? "Lien copié" : "Copier le lien"}
        title={copied ? "Copié !" : "Copier le lien"}
      >
        {copied ? <Check className="h-4 w-4 text-success" /> : <Link className="h-4 w-4" />}
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        className="icon-btn"
        aria-label="Partager sur LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Linkedin className="h-4 w-4" />
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        className="icon-btn"
        aria-label="Partager sur WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.3.4-.1.7.1.3.7 1.1 1.4 1.8.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.2.1.7-.2 1.3z" />
        </svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        className="icon-btn"
        aria-label="Partager sur Facebook"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M14 9h3l.4-3H14V4.3c0-.9.3-1.5 1.6-1.5H17.5V.1C17.1.1 16 0 14.8 0 12.2 0 10.5 1.6 10.5 4v2H7.5v3h3v9h3.5V9z" />
        </svg>
      </a>
    </div>
  );
}
