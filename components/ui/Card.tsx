import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm",
        className
      )}
      {...rest}
    />
  );
}
