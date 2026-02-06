"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import type { CategoryStat } from "@/types";

interface TopCategorySlideProps {
  category: CategoryStat;
  personality: string;
}

export function TopCategorySlide({
  category,
  personality,
}: TopCategorySlideProps) {
  return (
    <SlideLayout gradient="from-[#0a2818] via-[#1a3d2a] to-[#050510]">
      <div className="text-center max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-6"
        >
          Your top genre
        </motion.p>

        <motion.h2
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
        >
          {category.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-4 text-xl text-white/60"
        >
          {category.watchCount} {category.name} videos
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-10"
        >
          <p className="text-sm text-white/40 uppercase tracking-wider mb-2">
            That makes you
          </p>
          <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent">
            {personality}
          </p>
        </motion.div>
      </div>
    </SlideLayout>
  );
}
