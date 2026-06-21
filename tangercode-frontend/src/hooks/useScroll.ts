"use client";

import { useState, useEffect, useCallback } from "react";

interface ScrollState {
  scrollY: number;
  scrollDirection: "up" | "down";
  isScrolled: boolean;
  isAtTop: boolean;
}

export function useScroll(threshold = 10): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: "up",
    isScrolled: false,
    isAtTop: true,
  });

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setState((prev) => ({
      scrollY: currentY,
      scrollDirection: currentY > prev.scrollY ? "down" : "up",
      isScrolled: currentY > threshold,
      isAtTop: currentY === 0,
    }));
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return state;
}
