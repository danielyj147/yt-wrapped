"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import type { CategoryStat } from "@/types";

interface CategoryBreakdownSlideProps {
  categories: CategoryStat[];
}

export function CategoryBreakdownSlide({
  categories,
}: CategoryBreakdownSlideProps) {
  return (
    <SlideLayout gradient="from-[#1a0a28] via-[#2a1a40] to-[#0a0a2e]">
      <div className="w-full max-w-md">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-8 text-center"
        >
          Category Breakdown
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <CategoryPieChart categories={categories} />
        </motion.div>
      </div>
    </SlideLayout>
  );
}
