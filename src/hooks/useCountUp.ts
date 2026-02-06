"use client";

import { useState, useEffect, useRef } from "react";

export function useCountUp(
  end: number,
  duration: number = 2000,
  start: number = 0,
  enabled: boolean = true
): number {
  const [value, setValue] = useState(start);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setValue(start);
      return;
    }

    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (end - start) * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration, start, enabled]);

  return value;
}
