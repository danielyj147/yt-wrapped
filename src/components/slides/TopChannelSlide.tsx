"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { useCountUp } from "@/hooks/useCountUp";
import type { ChannelStat } from "@/types";

interface TopChannelSlideProps {
  channel: ChannelStat;
}

export function TopChannelSlide({ channel }: TopChannelSlideProps) {
  const count = useCountUp(channel.watchCount, 2000);

  return (
    <SlideLayout gradient="from-[#1a0520] via-[#3d1255] to-[#0a0a2e]">
      <div className="text-center max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-4"
        >
          Your #1 Channel
        </motion.p>

        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 blur-2xl opacity-50 rounded-full" />
          <div className="relative bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl px-10 py-8">
            <h2 className="text-4xl md:text-6xl font-black text-white break-words">
              {channel.name}
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10"
        >
          <span className="text-5xl md:text-7xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {count}
          </span>
          <p className="text-xl text-white/60 mt-2">videos watched</p>
        </motion.div>
      </div>
    </SlideLayout>
  );
}
