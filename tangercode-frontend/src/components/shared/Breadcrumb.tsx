import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  align?: "center" | "left";
  className?: string;
}

export function Breadcrumb({ items, align = "center", className }: BreadcrumbProps) {
  return (
    <nav className={cn("breadcrumb", align === "left" && "left", className)} aria-label="Fil d'Ariane">
      {items.map((item, i) => (
        <span key={item.href}>
          {i < items.length - 1 ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            item.label
          )}
          {i < items.length - 1 && <span>/</span>}
        </span>
      ))}
    </nav>
  );
}
