import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  tone?: "ink" | "paper";
  showWordmark?: boolean;
}

/**
 * Marca "Brasa" — mark é uma linha de rota que termina em pin brasa.
 * O "·" no fim do wordmark é o ponto de chegada (anchor visual).
 */
export function Logo({
  className,
  tone = "ink",
  showWordmark = true,
}: LogoProps) {
  const textColor = tone === "ink" ? "text-ink" : "text-paper";
  const markStroke = tone === "ink" ? "#0A0A0A" : "#FAFAF7";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-sans tracking-tighter2",
        textColor,
        className,
      )}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M3 20 C 7 20, 8 4, 14 4"
          stroke={markStroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="14" cy="4" r="3" fill="#E5481C" />
      </svg>
      {showWordmark && (
        <span className="text-[15px] font-semibold leading-none">
          Brasa<span className="text-ember">·</span>
        </span>
      )}
    </span>
  );
}
