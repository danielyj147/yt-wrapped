import type { RawWatchEntry, ParsedWatchEntry } from "@/types";

const VIDEO_URL_REGEX = /watch\?v=([a-zA-Z0-9_-]{11})/;

function extractVideoId(url: string): string | null {
  const match = url.match(VIDEO_URL_REGEX);
  return match ? match[1] : null;
}

function isValidEntry(entry: RawWatchEntry): boolean {
  if (!entry.titleUrl) return false;
  if (!entry.title || entry.title === "Watched a video that has been removed") return false;
  if (entry.header === "YouTube Music") return false;
  if (entry.title.startsWith("Visited ")) return false;
  if (entry.title.startsWith("Searched for ")) return false;
  // Filter YouTube Music URLs that slip through with header "YouTube"
  if (entry.titleUrl.includes("music.youtube.com")) return false;
  return true;
}

export function parseWatchHistory(
  data: RawWatchEntry[],
  year?: number
): ParsedWatchEntry[] {
  const targetYear = year || new Date().getFullYear();
  const seen = new Set<string>();
  const entries: ParsedWatchEntry[] = [];

  for (const entry of data) {
    if (!isValidEntry(entry)) continue;

    const videoId = extractVideoId(entry.titleUrl || "");
    if (!videoId) continue;

    const watchedAt = new Date(entry.time);
    if (isNaN(watchedAt.getTime())) continue;
    if (watchedAt.getFullYear() !== targetYear) continue;

    const dedupeKey = `${videoId}_${watchedAt.getTime()}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const channelName = entry.subtitles?.[0]?.name || "Unknown Channel";
    const channelUrl = entry.subtitles?.[0]?.url;

    const title = entry.title.replace(/^Watched\s+/, "");

    entries.push({
      videoId,
      title,
      channelName,
      channelUrl,
      watchedAt,
    });
  }

  return entries.sort((a, b) => a.watchedAt.getTime() - b.watchedAt.getTime());
}

export function detectYear(data: RawWatchEntry[]): number {
  const yearCounts: Record<number, number> = {};
  for (const entry of data) {
    if (!entry.time) continue;
    const date = new Date(entry.time);
    if (isNaN(date.getTime())) continue;
    const y = date.getFullYear();
    yearCounts[y] = (yearCounts[y] || 0) + 1;
  }

  let maxYear = new Date().getFullYear();
  let maxCount = 0;
  for (const [year, count] of Object.entries(yearCounts)) {
    if (count > maxCount) {
      maxCount = count;
      maxYear = parseInt(year, 10);
    }
  }
  return maxYear;
}
