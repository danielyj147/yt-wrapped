"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  label: string;
  progress: number;
  total: number;
}

export function ProgressBar({ label, progress, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="flex justify-between text-sm text-white/70 mb-2">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-white/40 mt-1 text-center">
        {progress.toLocaleString()} / {total.toLocaleString()} videos
      </p>
    </motion.div>
  );
}
