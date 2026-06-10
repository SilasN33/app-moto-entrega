import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  full?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink-2 active:bg-ink-2 disabled:bg-ink/40 disabled:cursor-not-allowed",
  secondary:
    "bg-paper-2 text-ink hover:bg-paper-3 active:bg-paper-3 disabled:opacity-60",
  danger:
    "bg-ember text-paper hover:bg-ember-soft active:bg-ember-soft disabled:opacity-60",
  ghost:
    "bg-transparent text-ink-2 hover:bg-paper-2 active:bg-paper-3",
  outline:
    "bg-transparent text-ink ring-1 ring-inset ring-line hover:bg-paper-2 active:bg-paper-3",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[13px]",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading,
    full,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tightish transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        full && "w-full",
        sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span
          className={cn(
            "h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent",
            variant === "primary" || variant === "danger"
              ? "border-paper"
              : "border-ink",
          )}
        />
      ) : null}
      {children}
    </button>
  );
});
