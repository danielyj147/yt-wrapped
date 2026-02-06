"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { useCountUp } from "@/hooks/useCountUp";
import { formatDuration } from "@/lib/utils";

interface LateNightSlideProps {
  lateNightCount: number;
  lateNightSeconds: number;
}

export function LateNightSlide({
  lateNightCount,
  lateNightSeconds,
}: LateNightSlideProps) {
  const count = useCountUp(lateNightCount, 2000);

  return (
    <SlideLayout gradient="from-[#05050f] via-[#0a0a28] to-[#050510]">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl mb-6"
        >
          🌙
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-6"
        >
          Night Owl Mode
        </motion.p>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
        >
          <span className="text-6xl md:text-8xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {count}
          </span>
          <p className="text-xl text-white/60 mt-2">
            videos between midnight and 4 AM
          </p>
        </motion.div>

        {lateNightSeconds > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-6 text-lg text-indigo-300/60"
          >
            That&apos;s {formatDuration(lateNightSeconds)} of late-night watching
          </motion.p>
        )}
      </div>
    </SlideLayout>
  );
}
