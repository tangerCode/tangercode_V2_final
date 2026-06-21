"use client";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+212600000000";
const MESSAGE = encodeURIComponent("Bonjour TANGER CODE ! Je souhaite discuter d'un projet.");

function trackGA4() {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "whatsapp_button_clicked", {
      event_category: "engagement",
      event_label: "WhatsApp",
    });
  }
}

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}?text=${MESSAGE}`}
      className="fab-wa animate-pulse"
      style={{ animationDuration: "3s" }}
      aria-label="WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackGA4}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.3.4-.1.7.1.3.7 1.1 1.4 1.8.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.2.1.7-.2 1.3z" />
      </svg>
    </a>
  );
}
