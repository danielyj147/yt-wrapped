"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { formatDuration } from "@/lib/utils";
import { format } from "date-fns";
import type { WrappedStats } from "@/types";

interface FunFactsSlideProps {
  stats: WrappedStats;
}

export function FunFactsSlide({ stats }: FunFactsSlideProps) {
  const facts: Array<{ emoji: string; text: string }> = [];

  if (stats.longestDay.count > 0) {
    facts.push({
      emoji: "📅",
      text: `Your biggest binge day was ${format(new Date(stats.longestDay.date), "MMMM d")} — ${stats.longestDay.count} videos${stats.longestDay.totalSeconds > 0 ? ` (${formatDuration(stats.longestDay.totalSeconds)})` : ""}`,
    });
  }

  if (stats.bingeSessions.length > 0) {
    const top = stats.bingeSessions[0];
    facts.push({
      emoji: "🔥",
      text: `Longest binge: ${top.videoCount} ${top.channelName} videos in a row`,
    });
  }

  if (stats.firstVideo) {
    facts.push({
      emoji: "🎬",
      text: `First video of ${stats.year}: "${stats.firstVideo.title}"`,
    });
  }

  if (stats.lastVideo) {
    facts.push({
      emoji: "🏁",
      text: `Last video of ${stats.year}: "${stats.lastVideo.title}"`,
    });
  }

  const avgPerDay = Math.round(stats.totalVideos / stats.activeDays);
  if (avgPerDay > 0) {
    facts.push({
      emoji: "📊",
      text: `You averaged ${avgPerDay} video${avgPerDay !== 1 ? "s" : ""} per day${stats.activeDays < 365 ? ` (over ${stats.activeDays} days of data)` : ""}`,
    });
  }

  return (
    <SlideLayout gradient="from-[#0a1a0a] via-[#1a2d1a] to-[#050510]">
      <div className="w-full max-w-md">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-8 text-center"
        >
          Fun Facts
        </motion.p>

        <div className="flex flex-col gap-5">
          {facts.slice(0, 5).map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.2, duration: 0.5 }}
              className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/5"
            >
              <span className="text-2xl shrink-0">{fact.emoji}</span>
              <p className="text-sm md:text-base text-white/80">{fact.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}
