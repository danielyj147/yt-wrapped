"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { MonthlyChart } from "@/components/charts/MonthlyChart";
import type { MonthlyStat } from "@/types";

interface MonthlyJourneySlideProps {
  monthlyTrends: MonthlyStat[];
}

export function MonthlyJourneySlide({
  monthlyTrends,
}: MonthlyJourneySlideProps) {
  const peakMonth = monthlyTrends.reduce((max, m) =>
    m.watchCount > max.watchCount ? m : max
  , monthlyTrends[0]);

  return (
    <SlideLayout gradient="from-[#0a1a28] via-[#102a45] to-[#050510]">
      <div className="w-full max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-2 text-center"
        >
          Your Monthly Journey
        </motion.p>

        {peakMonth && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-sm text-cyan-300/60 text-center mb-6"
          >
            Peak month: {peakMonth.label} with {peakMonth.watchCount.toLocaleString()} videos
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <MonthlyChart data={monthlyTrends} />
        </motion.div>
      </div>
    </SlideLayout>
  );
}
