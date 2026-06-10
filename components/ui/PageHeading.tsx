import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeadingProps {
  eyebrow?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeading({
  eyebrow,
  title,
  hint,
  action,
  className,
}: PageHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-3 pb-1",
        className,
      )}
    >
      <div className="space-y-1">
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ember">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[22px] font-semibold tracking-tighter2 text-ink">
          {title}
        </h1>
        {hint && <p className="text-[13px] text-ink-3">{hint}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function SectionHeading({
  children,
  hint,
  action,
}: {
  children: ReactNode;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-[14px] font-medium uppercase tracking-[0.12em] text-ink-3">
          {children}
        </h2>
        {hint && <p className="text-[12px] text-ink-4">{hint}</p>}
      </div>
      {action}
    </div>
  );
}
