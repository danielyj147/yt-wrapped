"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { useCountUp } from "@/hooks/useCountUp";
import { funComparison } from "@/lib/utils";

interface TotalTimeSlideProps {
  totalVideos: number;
  totalWatchTimeSeconds: number;
  shortsCount?: number;
}

export function TotalTimeSlide({
  totalVideos,
  totalWatchTimeSeconds,
  shortsCount = 0,
}: TotalTimeSlideProps) {
  const regularCount = totalVideos - shortsCount;
  const totalHours = Math.round(totalWatchTimeSeconds / 3600);
  const displayHours = useCountUp(totalHours, 2500);
  const displayVideos = useCountUp(totalVideos, 2000);
  const comparison = funComparison(totalHours);

  return (
    <SlideLayout gradient="from-[#1a0a2e] via-[#2d1b4e] to-[#0f0520]">
      <div className="text-center max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-6"
        >
          You watched
        </motion.p>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        >
          <span className="text-7xl md:text-9xl font-black bg-gradient-to-r from-coral to-pink bg-clip-text text-transparent">
            {displayVideos.toLocaleString()}
          </span>
          <p className="text-2xl md:text-3xl font-bold text-white/80 mt-2">
            videos
          </p>
          {shortsCount > 0 && (
            <p className="text-sm text-white/30 mt-1">
              {regularCount.toLocaleString()} regular + {shortsCount.toLocaleString()} shorts
            </p>
          )}
        </motion.div>

        {totalWatchTimeSeconds > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-10"
          >
            <p className="text-white/40 text-sm uppercase tracking-wider mb-2">
              Up to
            </p>
            <p className="text-4xl md:text-6xl font-black text-white">
              {displayHours.toLocaleString()}
              <span className="text-2xl md:text-3xl text-white/60 ml-2">
                hours
              </span>
            </p>
            <p className="text-xs text-white/25 mt-2">
              Based on full video durations
            </p>
          </motion.div>
        )}

        {totalWatchTimeSeconds > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-8 text-lg text-purple-300/70 italic"
          >
            {comparison}
          </motion.p>
        )}
      </div>
    </SlideLayout>
  );
}
