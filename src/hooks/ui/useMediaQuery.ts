"use client";
import { useState, useEffect } from "react";

/**
 * Hook for responsive design with CSS media queries
 *
 * @param {string} query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns {boolean} Whether the media query matches current viewport
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)");
 * const isPortrait = useMediaQuery("(orientation: portrait)");
 *
 * if (isMobile) {
 *   return <MobileLayout />;
 * }
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
