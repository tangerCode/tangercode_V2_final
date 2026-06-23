"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const BREADCRUMB_LABELS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/messages": "Messages",
  "/admin/analytics": "Analytics",
  "/admin/portfolio": "Portfolio",
  "/admin/services": "Services",
  "/admin/blog": "Blog",
  "/admin/pricing": "Tarifs",
  "/admin/testimonials": "Temoignages",
  "/admin/faq": "FAQ",
  "/admin/users": "Utilisateurs",
  "/admin/settings": "Configuration",
  "/admin/ai": "IA & Traduction",
  "/admin/backups": "Sauvegardes",
};

function getBreadcrumbLabel(pathname: string): string {
  if (BREADCRUMB_LABELS[pathname]) return BREADCRUMB_LABELS[pathname];

  for (const [prefix, label] of Object.entries(BREADCRUMB_LABELS)) {
    if (pathname.startsWith(`${prefix}/`)) return label;
  }

  return "Dashboard";
}

export function AdminHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const currentLabel = getBreadcrumbLabel(pathname);

  const toggleSidebar = () => {
    const side = document.getElementById("admin-side");
    if (side) {
      side.classList.toggle("open");
    }
  };

  const initials = user
    ? (user.first_name?.[0] || "") + (user.last_name?.[0] || "")
    : "A";

  return (
    <header className="admin-top">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          className="icon-btn admin-burger"
          id="admin-burger"
          aria-label="Menu"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".72rem",
              color: "var(--text-muted)",
            }}
          >
            TANGER CODE / Admin
          </div>
          <h3 style={{ fontSize: "1.15rem" }}>{currentLabel}</h3>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <ThemeToggle />
        <div
          className="ph av"
          data-label={initials}
          style={{ width: 36, height: 36, borderRadius: "50%" }}
        />
      </div>
    </header>
  );
}
