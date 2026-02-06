"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { WatchingHeatmap } from "@/components/charts/WatchingHeatmap";
import type { HourDayStat } from "@/types";

interface WatchingClockSlideProps {
  heatmap: HourDayStat[];
}

export function WatchingClockSlide({ heatmap }: WatchingClockSlideProps) {
  return (
    <SlideLayout gradient="from-[#0a0a28] via-[#151540] to-[#050510]">
      <div className="w-full max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-8 text-center"
        >
          When You Watch
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <WatchingHeatmap data={heatmap} />
        </motion.div>
      </div>
    </SlideLayout>
  );
}
