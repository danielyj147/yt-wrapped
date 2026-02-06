import type { ParsedWatchEntry, EnrichedVideo } from "@/types";
import { fetchVideoMetadataBatch, type VideoMetadata } from "./youtube-api";

export async function enrichWatchHistory(
  entries: ParsedWatchEntry[],
  onProgress?: (fetched: number, total: number) => void
): Promise<EnrichedVideo[]> {
  const uniqueIds = [...new Set(entries.map((e) => e.videoId))];

  const metadataMap = await fetchVideoMetadataBatch(uniqueIds, onProgress);

  const enriched: EnrichedVideo[] = [];

  for (const entry of entries) {
    const meta = metadataMap.get(entry.videoId);
    if (!meta) continue;

    enriched.push({
      videoId: entry.videoId,
      title: meta.title || entry.title,
      channelName: meta.channelName || entry.channelName,
      channelId: meta.channelId,
      watchedAt: entry.watchedAt,
      durationSeconds: meta.durationSeconds,
      categoryId: meta.categoryId,
      categoryName: meta.categoryName,
      tags: meta.tags,
      viewCount: meta.viewCount,
      likeCount: meta.likeCount,
    });
  }

  return enriched;
}

export function createEnrichedFromParsed(entries: ParsedWatchEntry[]): EnrichedVideo[] {
  return entries.map((entry) => ({
    videoId: entry.videoId,
    title: entry.title,
    channelName: entry.channelName,
    watchedAt: entry.watchedAt,
    durationSeconds: 0,
    categoryId: "0",
    categoryName: "Unknown",
    tags: [],
    viewCount: 0,
    likeCount: 0,
  }));
}
