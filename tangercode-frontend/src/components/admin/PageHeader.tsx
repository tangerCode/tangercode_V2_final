import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div
      className="row-between"
      style={{ marginBottom: 24, alignItems: "flex-start" }}
    >
      <div>
        <h2 style={{ fontSize: "1.5rem" }}>{title}</h2>
        {subtitle && (
          <p
            style={{
              fontSize: ".9rem",
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 10 }}>{actions}</div>
      )}
    </div>
  );
}
