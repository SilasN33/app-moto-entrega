"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster: string;
  className?: string;
};

/**
 * Vídeo full-bleed cujo currentTime é direcionado pelo scroll da página.
 * Em mobile (touch) cai pra autoplay loop — Safari iOS não respeita currentTime
 * direto e o scrub fica travado. Reduced-motion mostra só o poster.
 */
export function ScrollVideo({ src, poster, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Só consideramos touch device se o pointer principal é coarse.
    // navigator.maxTouchPoints > 0 dá falso positivo em Macs/laptops Windows.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    video.pause();

    let rafId: number | null = null;
    let currentTime = 0;

    const update = () => {
      rafId = null;
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;

      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollMax > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollMax)) : 0;
      const target = progress * duration;

      currentTime += (target - currentTime) * 0.32;
      if (Math.abs(target - currentTime) < 0.005) currentTime = target;

      try {
        video.currentTime = currentTime;
      } catch {
        /* alguns frames ainda não bufferizados */
      }

      if (Math.abs(target - currentTime) > 0.001) {
        rafId = requestAnimationFrame(update);
      }
    };

    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(update);
    };

    const onReady = () => {
      currentTime = 0;
      update();
    };

    if (video.readyState >= 1) onReady();
    else video.addEventListener("loadedmetadata", onReady);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      aria-hidden
      className={className}
    />
  );
}
