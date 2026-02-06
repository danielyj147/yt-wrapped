"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { HoloCard } from "@/components/ui/HoloCard";
import { formatDuration, formatNumber } from "@/lib/utils";
import { renderSummaryCard, downloadCardImage } from "@/lib/render-card";
import type { WrappedStats } from "@/types";

interface SummaryCardSlideProps {
  stats: WrappedStats;
}

export function SummaryCardSlide({ stats }: SummaryCardSlideProps) {
  const totalHours = Math.round(stats.totalWatchTimeSeconds / 3600);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(() => {
    setDownloading(true);
    try {
      const dataUrl = renderSummaryCard(stats);
      downloadCardImage(dataUrl, stats.year);
    } finally {
      setDownloading(false);
    }
  }, [stats]);

  return (
    <SlideLayout gradient="from-[#0a0a28] via-[#1a1040] to-[#050510]">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg text-white/50 uppercase tracking-widest mb-6 text-center"
      >
        Your {stats.year} Card
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ delay: 0.4, duration: 1, type: "spring" }}
      >
        <HoloCard className="w-[320px] md:w-[380px]">
          <div className="bg-gradient-to-br from-[#1a1040]/95 to-[#0a0a28]/95 p-6 md:p-8 backdrop-blur-sm">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                YouTube {stats.year}
              </h2>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">
                Wrapped
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatBlock
                label="Videos"
                value={formatNumber(stats.totalVideos)}
              />
              {stats.totalWatchTimeSeconds > 0 && (
                <StatBlock
                  label="Hours"
                  value={totalHours > 0 ? formatNumber(totalHours) : "—"}
                />
              )}
              <StatBlock
                label="Top Channel"
                value={stats.topChannels[0]?.name || "—"}
                small
              />
              <StatBlock
                label="Top Genre"
                value={stats.topCategories[0]?.name || "—"}
                small
              />
            </div>

            {/* Personality */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                Personality
              </p>
              <p className="text-lg font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                {stats.genrePersonality}
              </p>
            </div>

            {/* Badges */}
            <div className="mt-4 flex flex-col items-center gap-2">
              {stats.lateNightCount > 20 && (
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30">
                  🌙 Night Owl — {stats.lateNightCount} late-night videos
                </span>
              )}
              {stats.shortsStats.shortsCount > 10 && (
                <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full border border-pink-500/30">
                  📱 Shorts Scroller — {stats.shortsStats.shortsCount} shorts watched
                </span>
              )}
            </div>
          </div>
        </HoloCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors px-5 py-2.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {downloading ? "Saving..." : "Save Card"}
        </button>
        <p className="text-xs text-white/25">
          Hover the card for the holographic effect
        </p>
      </motion.div>
    </SlideLayout>
  );
}

function StatBlock({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p
        className={`font-bold text-white ${
          small ? "text-sm truncate" : "text-2xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
