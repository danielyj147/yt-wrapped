"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileUpload } from "@/components/upload/FileUpload";
import { ProgressBar } from "@/components/upload/ProgressBar";
import { useWrappedStore } from "@/stores/wrapped-store";

export default function HomePage() {
  const router = useRouter();
  const { stage, error, enrichProgress, processFile, loadDemo, reset } =
    useWrappedStore();

  useEffect(() => {
    if (stage === "ready") {
      router.push("/wrapped");
    }
  }, [stage, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            YouTube
            <br />
            Wrapped
          </h1>
          <p className="mt-4 text-lg text-white/50">
            Your year on YouTube, beautifully wrapped.
          </p>
        </motion.div>

        {stage === "upload" && (
          <>
            <FileUpload onFileSelect={processFile} />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-3 text-white/30 text-sm">
                <span className="h-px w-8 bg-white/15" />
                or
                <span className="h-px w-8 bg-white/15" />
              </div>
              <button
                onClick={loadDemo}
                className="text-sm text-white/50 hover:text-white transition-colors px-5 py-2 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5"
              >
                Try with sample data
              </button>
            </motion.div>

          </>
        )}

        {stage === "parsing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-8 h-8 border-2 border-white/30 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-white/60">Parsing your watch history...</p>
          </motion.div>
        )}

        {stage === "enriching" && (
          <ProgressBar
            label="Enriching video data..."
            progress={enrichProgress.fetched}
            total={enrichProgress.total}
          />
        )}

        {stage === "analyzing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-8 h-8 border-2 border-white/30 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-white/60">Crunching the numbers...</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={reset}
              className="text-sm text-white/60 underline hover:text-white transition-colors"
            >
              Try again
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
