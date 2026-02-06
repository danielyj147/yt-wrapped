"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useWrappedStore } from "@/stores/wrapped-store";
import { useSwipe } from "@/hooks/useSwipe";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { IntroSlide } from "@/components/slides/IntroSlide";
import { TotalTimeSlide } from "@/components/slides/TotalTimeSlide";
import { TopChannelSlide } from "@/components/slides/TopChannelSlide";
import { TopChannelsSlide } from "@/components/slides/TopChannelsSlide";
import { TopCategorySlide } from "@/components/slides/TopCategorySlide";
import { CategoryBreakdownSlide } from "@/components/slides/CategoryBreakdownSlide";
import { WatchingClockSlide } from "@/components/slides/WatchingClockSlide";
import { MonthlyJourneySlide } from "@/components/slides/MonthlyJourneySlide";
import { LateNightSlide } from "@/components/slides/LateNightSlide";
import { MostRewatchedSlide } from "@/components/slides/MostRewatchedSlide";
import { FunFactsSlide } from "@/components/slides/FunFactsSlide";
import { SummaryCardSlide } from "@/components/slides/SummaryCardSlide";

export default function WrappedPage() {
  const router = useRouter();
  const { stats, stage, reset } = useWrappedStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (stage !== "ready" || !stats) {
      router.push("/");
    }
  }, [stage, stats, router]);

  const slides = useMemo(() => {
    if (!stats) return [];

    const s: React.ReactNode[] = [
      <IntroSlide key="intro" year={stats.year} />,
      <TotalTimeSlide
        key="total"
        totalVideos={stats.totalVideos}
        totalWatchTimeSeconds={stats.totalWatchTimeSeconds}
      />,
    ];

    if (stats.topChannels[0]) {
      s.push(
        <TopChannelSlide key="top-channel" channel={stats.topChannels[0]} />
      );
    }

    if (stats.topChannels.length > 1) {
      s.push(
        <TopChannelsSlide key="top-channels" channels={stats.topChannels} />
      );
    }

    if (stats.topCategories[0]) {
      s.push(
        <TopCategorySlide
          key="top-category"
          category={stats.topCategories[0]}
          personality={stats.genrePersonality}
        />
      );
    }

    if (stats.topCategories.length > 1) {
      s.push(
        <CategoryBreakdownSlide
          key="categories"
          categories={stats.topCategories}
        />
      );
    }

    s.push(
      <WatchingClockSlide key="heatmap" heatmap={stats.watchingHeatmap} />
    );

    s.push(
      <MonthlyJourneySlide
        key="monthly"
        monthlyTrends={stats.monthlyTrends}
      />
    );

    if (stats.lateNightCount > 0) {
      s.push(
        <LateNightSlide
          key="late-night"
          lateNightCount={stats.lateNightCount}
          lateNightSeconds={stats.lateNightSeconds}
        />
      );
    }

    if (stats.mostRewatched.count > 1) {
      s.push(
        <MostRewatchedSlide
          key="rewatched"
          videoId={stats.mostRewatched.videoId}
          title={stats.mostRewatched.title}
          channelName={stats.mostRewatched.channelName}
          count={stats.mostRewatched.count}
        />
      );
    }

    s.push(<FunFactsSlide key="fun-facts" stats={stats} />);
    s.push(<SummaryCardSlide key="summary" stats={stats} />);

    return s;
  }, [stats]);

  const totalSlides = slides.length;

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const swipeHandlers = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  if (!stats) return null;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      {...swipeHandlers}
    >
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex gap-1 px-4 pt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className="flex-1 h-1 rounded-full transition-colors cursor-pointer"
            style={{
              background:
                i <= currentSlide
                  ? "rgba(255, 255, 255, 0.8)"
                  : "rgba(255, 255, 255, 0.15)",
            }}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-between items-center px-6">
        <button
          onClick={goPrev}
          disabled={currentSlide === 0}
          className="text-white/40 hover:text-white disabled:opacity-0 transition-all p-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span className="text-xs text-white/30">
          {currentSlide + 1} / {totalSlides}
        </span>

        {currentSlide === totalSlides - 1 ? (
          <button
            onClick={() => {
              reset();
              router.push("/");
            }}
            className="text-xs text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40"
          >
            Start Over
          </button>
        ) : (
          <button
            onClick={goNext}
            className="text-white/40 hover:text-white transition-all p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
