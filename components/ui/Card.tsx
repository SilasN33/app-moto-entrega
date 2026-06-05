import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  tone?: "paper" | "raised";
}

export function Card({
  className,
  interactive,
  tone = "paper",
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line p-4",
        tone === "paper" ? "bg-paper" : "bg-paper-2",
        interactive &&
          "transition-colors hover:border-line-strong hover:bg-paper-2 active:scale-[0.997]",
        className,
      )}
      {...rest}
    />
  );
}

export function CardDivider({ className }: { className?: string }) {
  return <hr className={cn("divider-dashed -mx-4 my-3", className)} />;
}
