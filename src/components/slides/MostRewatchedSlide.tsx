"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";

interface MostRewatchedSlideProps {
  videoId: string;
  title: string;
  channelName: string;
  count: number;
}

export function MostRewatchedSlide({
  videoId,
  title,
  channelName,
  count,
}: MostRewatchedSlideProps) {
  return (
    <SlideLayout gradient="from-[#28100a] via-[#3d1a10] to-[#0a0a2e]">
      <div className="text-center max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-6"
        >
          Most Rewatched
        </motion.p>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-video w-full max-w-sm mx-auto rounded-xl overflow-hidden bg-black/50 border border-white/10">
            <img
              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-6"
        >
          <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-2">
            {title}
          </h3>
          <p className="text-white/50 mt-1">{channelName}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-6"
        >
          <span className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            {count}x
          </span>
          <p className="text-sm text-white/40 mt-1">times watched</p>
        </motion.div>
      </div>
    </SlideLayout>
  );
}
