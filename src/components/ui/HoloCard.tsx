"use client";

import { useRef, type ReactNode } from "react";
import { useHoloTilt } from "@/hooks/useHoloTilt";

interface HoloCardProps {
  children: ReactNode;
  className?: string;
}

export function HoloCard({ children, className = "" }: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { style, handlers } = useHoloTilt(cardRef);

  return (
    <div
      ref={cardRef}
      className={`holo-card relative rounded-2xl overflow-hidden ${className}`}
      style={style as React.CSSProperties}
      {...handlers}
    >
      {/* Card content */}
      <div className="relative z-10">{children}</div>

      {/* Holographic shine overlay */}
      <div className="holo-shine rounded-2xl" />
    </div>
  );
}
