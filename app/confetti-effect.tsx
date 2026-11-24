"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Loaded on demand so react-confetti stays out of the initial JS bundle.
const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

export default function ConfettiEffect() {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Never sets dimensions, so the confetti chunk is never even downloaded.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;
    function updateSize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setDimensions({ width: window.innerWidth, height: window.innerHeight }),
      );
    }
    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  if (done || !dimensions) {
    return null;
  }

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={400}
      // Unmount the canvas once the animation ends to free memory and listeners.
      onConfettiComplete={() => setDone(true)}
    />
  );
}
