"use client";

import { motion } from "framer-motion";
import type { HourDayStat } from "@/types";

interface WatchingHeatmapProps {
  data: HourDayStat[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getColor(count: number, maxCount: number): string {
  if (count === 0) return "rgba(255,255,255,0.03)";
  const intensity = Math.min(count / maxCount, 1);

  if (intensity < 0.25) return `rgba(168, 85, 247, ${0.15 + intensity * 0.4})`;
  if (intensity < 0.5) return `rgba(168, 85, 247, ${0.3 + intensity * 0.5})`;
  if (intensity < 0.75) return `rgba(236, 72, 153, ${0.4 + intensity * 0.4})`;
  return `rgba(255, 45, 120, ${0.6 + intensity * 0.4})`;
}

export function WatchingHeatmap({ data }: WatchingHeatmapProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getCount = (hour: number, day: number) => {
    return data.find((d) => d.hour === hour && d.day === day)?.count || 0;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[480px]">
        {/* Hour labels */}
        <div className="flex gap-[2px] ml-10 mb-1">
          {HOURS.filter((_, i) => i % 3 === 0).map((h) => (
            <div
              key={h}
              className="text-[10px] text-white/30"
              style={{ width: `${(100 / 8)}%` }}
            >
              {h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`}
            </div>
          ))}
        </div>

        {/* Grid */}
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="flex items-center gap-1 mb-[2px]">
            <span className="text-[10px] text-white/30 w-8 text-right shrink-0">
              {day}
            </span>
            <div className="flex gap-[2px] flex-1">
              {HOURS.map((hour) => {
                const count = getCount(hour, dayIdx);
                return (
                  <motion.div
                    key={`${dayIdx}-${hour}`}
                    className="heatmap-cell flex-1 aspect-square rounded-[2px]"
                    style={{ background: getColor(count, maxCount) }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.3 + (dayIdx * 24 + hour) * 0.003,
                      duration: 0.2,
                    }}
                    title={`${day} ${hour}:00 — ${count} videos`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
