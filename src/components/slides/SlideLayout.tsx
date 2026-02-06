"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface SlideLayoutProps {
  children: ReactNode;
  gradient?: string;
}

export function SlideLayout({
  children,
  gradient = "from-[#0a0a2e] via-[#1a0a3e] to-[#050510]",
}: SlideLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br ${gradient} relative overflow-hidden`}
    >
      {children}
    </motion.div>
  );
}
