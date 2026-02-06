"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { useCountUp } from "@/hooks/useCountUp";
import { formatDuration } from "@/lib/utils";
import type { ShortsStats } from "@/types";

interface ShortsSlideProps {
  shortsStats: ShortsStats;
}

export function ShortsSlide({ shortsStats }: ShortsSlideProps) {
  const count = useCountUp(shortsStats.shortsCount, 2000);
  const percentage = Math.round(shortsStats.shortsPercentage);

  return (
    <SlideLayout gradient="from-[#2a0a0a] via-[#4e1b2d] to-[#1a0510]">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl mb-6"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto"
          >
            <rect x="6" y="3" width="12" height="18" rx="2" stroke="#ff4444" strokeWidth="2" />
            <polygon points="10,8 10,16 16,12" fill="#ff4444" />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-6"
        >
          Shorts Scrolled
        </motion.p>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
        >
          <span className="text-6xl md:text-8xl font-black bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            {count}
          </span>
          <p className="text-xl text-white/60 mt-2">
            YouTube Shorts
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-6 text-lg text-pink-300/60"
        >
          That&apos;s {percentage}% of everything you watched
        </motion.p>

        {shortsStats.shortsWatchTimeSeconds > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="mt-2 text-sm text-white/30"
          >
            {formatDuration(shortsStats.shortsWatchTimeSeconds)} of short-form content
          </motion.p>
        )}

        {shortsStats.topShortsChannels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.6 }}
            className="mt-8"
          >
            <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
              Top Shorts Channels
            </p>
            <div className="flex flex-col gap-2">
              {shortsStats.topShortsChannels.slice(0, 3).map((ch, i) => (
                <div
                  key={ch.name}
                  className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2 border border-white/5"
                >
                  <span className="text-sm text-white/70">
                    <span className="text-red-400 font-bold mr-2">{i + 1}</span>
                    {ch.name}
                  </span>
                  <span className="text-xs text-white/40">
                    {ch.watchCount} shorts
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </SlideLayout>
  );
}
