"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import type { ChannelStat } from "@/types";

interface TopChannelsSlideProps {
  channels: ChannelStat[];
}

export function TopChannelsSlide({ channels }: TopChannelsSlideProps) {
  const top5 = channels.slice(0, 5);
  const maxCount = top5[0]?.watchCount || 1;

  return (
    <SlideLayout gradient="from-[#0a1628] via-[#1a2545] to-[#0a0a2e]">
      <div className="w-full max-w-md">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-white/50 uppercase tracking-widest mb-8 text-center"
        >
          Your Top 5 Channels
        </motion.p>

        <div className="flex flex-col gap-4">
          {top5.map((channel, i) => (
            <motion.div
              key={channel.name}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <span className="text-2xl font-black text-white/30 w-8 text-right shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm md:text-base font-semibold text-white truncate">
                    {channel.name}
                  </span>
                  <span className="text-xs text-white/40 ml-2 shrink-0">
                    {channel.watchCount}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${
                        ["#ff2d78", "#a855f7", "#06b6d4", "#ff6b6b", "#f59e0b"][i]
                      }, ${
                        ["#a855f7", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"][i]
                      })`,
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(channel.watchCount / maxCount) * 100}%`,
                    }}
                    transition={{
                      delay: 0.6 + i * 0.15,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}
