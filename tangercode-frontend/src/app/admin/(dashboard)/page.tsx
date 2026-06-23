"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardStats } from "@/lib/api/admin";

interface KpiData {
  visitors: number;
  sessions: number;
  messages: number;
  articles: number;
}

const PLACEHOLDER: KpiData = {
  visitors: 1248,
  sessions: 3902,
  messages: 4,
  articles: 27,
};

const MESSAGES = [
  {
    initial: "Y",
    name: "Yasmine Bennani",
    subject: "Demande de devis e-commerce",
    time: "il y a 12 min",
    color: "#0052CC",
  },
  {
    initial: "K",
    name: "Karim El Fassi",
    subject: "Question sur l&apos;ERP industriel",
    time: "il y a 1 h",
    color: "#FF6B35",
  },
  {
    initial: "S",
    name: "Sofia Alaoui",
    subject: "Refonte application mobile",
    time: "il y a 3 h",
    color: "#00D4FF",
  },
  {
    initial: "M",
    name: "Mehdi Tazi",
    subject: "Demande de partenariat",
    time: "il y a 5 h",
    color: "#10B981",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<KpiData>(PLACEHOLDER);

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        if (res.data) {
          const d = res.data as Record<string, unknown>;
          setStats({
            visitors: (d.visitors as number) ?? PLACEHOLDER.visitors,
            sessions: (d.sessions as number) ?? PLACEHOLDER.sessions,
            messages: (d.messages as number) ?? PLACEHOLDER.messages,
            articles: (d.articles as number) ?? PLACEHOLDER.articles,
          });
        }
      })
      .catch(() => {
        // keep placeholder
      });
  }, []);

  const greeting = user?.first_name
    ? `Bonjour, ${user.first_name}`
    : "Bonjour";

  return (
    <>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: ".72rem",
          color: "var(--text-muted)",
          marginBottom: 4,
        }}
      >
        {greeting}
      </p>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card kpi">
          <div className="k-top">
            <span className="k-label">Visiteurs aujourd&apos;hui</span>
          </div>
          <div className="k-val">{stats.visitors.toLocaleString("fr")}</div>
          <div className="k-delta up">+12.4% vs hier</div>
        </div>
        <div className="card kpi">
          <div className="k-top">
            <span className="k-label">Sessions</span>
          </div>
          <div className="k-val">{stats.sessions.toLocaleString("fr")}</div>
          <div className="k-delta up">+8.1% vs hier</div>
        </div>
        <div className="card kpi">
          <div className="k-top">
            <span className="k-label">Messages</span>
          </div>
          <div className="k-val">{stats.messages}</div>
          <div className="k-delta up">+2 vs hier</div>
        </div>
        <div className="card kpi">
          <div className="k-top">
            <span className="k-label">Articles publies</span>
          </div>
          <div className="k-val">{stats.articles}</div>
          <div className="k-delta down">-1 vs hier</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div className="card">
          <div
            className="row-between"
            style={{ marginBottom: 18, alignItems: "center" }}
          >
            <h4 style={{ fontSize: "1.05rem" }}>
              Trafic — 7 derniers jours
            </h4>
            <div className="pills">
              <button className="pill active btn-sm">7j</button>
              <button className="pill btn-sm">30j</button>
              <button className="pill btn-sm">90j</button>
            </div>
          </div>
          <div className="chart-ph">
            <svg
              viewBox="0 0 600 220"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#00D4FF" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#00D4FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,170 C60,150 90,90 150,110 C210,130 240,60 300,80 C360,100 390,40 450,55 C510,70 540,30 600,45 L600,220 L0,220 Z"
                fill="url(#g)"
              />
              <path
                d="M0,170 C60,150 90,90 150,110 C210,130 240,60 300,80 C360,100 390,40 450,55 C510,70 540,30 600,45"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        <div className="card">
          <div
            className="row-between"
            style={{ marginBottom: 8, alignItems: "center" }}
          >
            <h4 style={{ fontSize: "1.05rem" }}>Derniers messages</h4>
            <Link
              href="/admin/messages"
              className="link-arrow"
              style={{ fontSize: ".85rem" }}
            >
              Tous →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {MESSAGES.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom:
                    i < MESSAGES.length - 1
                      ? "1px solid var(--border-soft)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: msg.color,
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: ".8rem",
                  }}
                >
                  {msg.initial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: ".88rem" }}>
                    {msg.name}
                  </div>
                  <div
                    style={{
                      fontSize: ".8rem",
                      color: "var(--text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {msg.subject}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: ".72rem",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {msg.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h4 style={{ fontSize: "1.05rem", marginBottom: 16 }}>
          Actions rapides
        </h4>
        <div className="flex gap" style={{ flexWrap: "wrap" }}>
          <Link href="/admin/blog" className="btn btn-primary">
            + Nouvel article
          </Link>
          <Link href="/admin/portfolio" className="btn btn-ghost">
            + Ajouter un projet
          </Link>
          <Link href="/admin/testimonials" className="btn btn-ghost">
            + Temoignage
          </Link>
          <Link href="/admin/pricing" className="btn btn-ghost">
            Modifier les tarifs
          </Link>
          <Link href="/admin/settings" className="btn btn-ghost">
            Configuration
          </Link>
        </div>
      </div>
    </>
  );
}
