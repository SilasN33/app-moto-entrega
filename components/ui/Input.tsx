import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, hint, error, id, ...rest },
  ref,
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-4",
          "transition-colors focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10",
          error && "border-ember focus:border-ember focus:ring-ember/15",
          className,
        )}
        {...rest}
      />
      {error ? (
        <p className="text-xs text-ember">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-4">{hint}</p>
      ) : null}
    </div>
  );
});
