"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Mail,
  BarChart3,
  LayoutGrid,
  Package,
  FileText,
  Tag,
  Star,
  HelpCircle,
  Users,
  Settings,
  Sparkles,
  Database,
  LogOut,
  Globe,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  {
    group: "GÉNÉRAL",
    items: [
      {
        href: "/admin",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        href: "/admin/messages",
        icon: Mail,
        label: "Messages",
        badge: 4,
      },
      {
        href: "/admin/analytics",
        icon: BarChart3,
        label: "Analytics",
      },
    ],
  },
  {
    group: "CONTENU",
    items: [
      {
        href: "/admin/portfolio",
        icon: LayoutGrid,
        label: "Portfolio",
      },
      {
        href: "/admin/services",
        icon: Package,
        label: "Services",
      },
      {
        href: "/admin/blog",
        icon: FileText,
        label: "Blog",
      },
      {
        href: "/admin/pricing",
        icon: Tag,
        label: "Tarifs",
      },
      {
        href: "/admin/testimonials",
        icon: Star,
        label: "Temoignages",
      },
      {
        href: "/admin/faq",
        icon: HelpCircle,
        label: "FAQ",
      },
    ],
  },
  {
    group: "SYSTÈME",
    items: [
      {
        href: "/admin/users",
        icon: Users,
        label: "Utilisateurs",
      },
      {
        href: "/admin/settings",
        icon: Settings,
        label: "Configuration",
      },
      {
        href: "/admin/ai",
        icon: Sparkles,
        label: "IA & Traduction",
      },
      {
        href: "/admin/backups",
        icon: Database,
        label: "Sauvegardes",
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/clear-cookie", { method: "POST" });
    } catch {
      // ignore
    }
    logout();
    router.push("/admin/login");
  };

  const toggleSidebar = () => {
    const side = document.getElementById("admin-side");
    if (side) {
      side.classList.toggle("open");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const side = document.getElementById("admin-side");
      const burger = document.getElementById("admin-burger");
      if (
        side?.classList.contains("open") &&
        !side.contains(e.target as Node) &&
        burger &&
        !burger.contains(e.target as Node)
      ) {
        side.classList.remove("open");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user
    ? `${user.first_name} ${user.last_name}`
    : "Admin";
  const displayEmail = user?.email || "admin@tangercode.ma";
  const initials = user
    ? (user.first_name?.[0] || "") + (user.last_name?.[0] || "")
    : "A";

  return (
    <aside className="admin-side" id="admin-side">
      <Link href="/" className="logo">
        <span className="bracket">&lt;</span>
        <span className="word">TANGER&nbsp;CODE</span>
        <span className="bracket">/&gt;</span>
      </Link>

      <nav className="admin-nav">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            <div className="grp">{group.group}</div>
            {group.items.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? "active" : ""}
                  onClick={toggleSidebar}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="grp" style={{ marginTop: 4 }}>PUBLIC</div>
        <a
          href="/fr"
          target="_blank"
          rel="noopener noreferrer"
          onClick={toggleSidebar}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "9px 12px",
            borderRadius: 10,
            color: "var(--text-secondary)",
            fontSize: ".9rem",
            fontWeight: 500,
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-elevated)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <Globe size={18} />
          <span>Voir le site</span>
        </a>
      </nav>

      <div className="admin-user">
        <div className="ph av" data-label={initials} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: ".88rem" }}>
            {displayName}
          </div>
          <div
            style={{
              fontSize: ".75rem",
              color: "var(--text-muted)",
            }}
          >
            {displayEmail}
          </div>
        </div>
        <button
          className="icon-btn"
          style={{ width: 32, height: 32 }}
          aria-label="Deconnexion"
          onClick={handleLogout}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
