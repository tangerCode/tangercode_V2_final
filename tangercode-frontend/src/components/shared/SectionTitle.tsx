import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
  reveal?: boolean;
  className?: string;
}

export function SectionTitle({ eyebrow, title, description, center, reveal, className }: SectionTitleProps) {
  return (
    <div className={cn("section-head", center && "center", reveal && "reveal", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
