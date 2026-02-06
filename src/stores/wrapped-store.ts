import { create } from "zustand";
import type {
  ParsedWatchEntry,
  EnrichedVideo,
  WrappedStats,
  AppStage,
  RawWatchEntry,
} from "@/types";
import { parseWatchHistory, detectYear } from "@/lib/parser";
import { enrichWatchHistory, createEnrichedFromParsed } from "@/lib/enricher";
import { analyzeWatchHistory } from "@/lib/analyzer";
import { generateDemoData } from "@/lib/demo-data";
import { cleanExpiredCache } from "@/lib/youtube-api";

interface WrappedStore {
  stage: AppStage;
  error: string | null;
  year: number;
  parsedEntries: ParsedWatchEntry[];
  enrichedVideos: EnrichedVideo[];
  stats: WrappedStats | null;
  enrichProgress: { fetched: number; total: number };

  processFile: (file: File) => Promise<void>;
  loadDemo: () => void;
  reset: () => void;
}

// Clean expired cache entries on module load
if (typeof window !== "undefined") {
  cleanExpiredCache();
}

export const useWrappedStore = create<WrappedStore>((set, get) => ({
  stage: "upload",
  error: null,
  year: new Date().getFullYear(),
  parsedEntries: [],
  enrichedVideos: [],
  stats: null,
  enrichProgress: { fetched: 0, total: 0 },

  processFile: async (file: File) => {
    try {
      set({ stage: "parsing", error: null });

      const text = await file.text();
      const rawData: RawWatchEntry[] = JSON.parse(text);

      const year = detectYear(rawData);
      const parsed = parseWatchHistory(rawData, year);

      if (parsed.length === 0) {
        set({ error: "No watch history found for the detected year. Make sure you uploaded the correct file.", stage: "upload" });
        return;
      }

      set({ parsedEntries: parsed, year, stage: "enriching" });

      let enriched: EnrichedVideo[];

      try {
        enriched = await enrichWatchHistory(
          parsed,
          (fetched, total) => {
            set({ enrichProgress: { fetched, total } });
          }
        );
      } catch {
        // API route unavailable or no API key configured — fall back to parsed data
        enriched = createEnrichedFromParsed(parsed);
      }

      // If enrichment returned nothing (e.g. all API calls failed), fall back
      if (enriched.length === 0) {
        enriched = createEnrichedFromParsed(parsed);
      }

      set({ enrichedVideos: enriched, stage: "analyzing" });

      const stats = analyzeWatchHistory(enriched, year);
      set({ stats, stage: "ready" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process file";
      set({ error: message, stage: "upload" });
    }
  },

  loadDemo: () => {
    const demoVideos = generateDemoData();
    const year = 2025;
    const stats = analyzeWatchHistory(demoVideos, year);
    set({ enrichedVideos: demoVideos, stats, year, stage: "ready" });
  },

  reset: () => {
    set({
      stage: "upload",
      error: null,
      parsedEntries: [],
      enrichedVideos: [],
      stats: null,
      enrichProgress: { fetched: 0, total: 0 },
    });
  },
}));
