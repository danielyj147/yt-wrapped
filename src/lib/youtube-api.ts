import axios from "axios";
import { parseDuration } from "./utils";
import { YOUTUBE_CATEGORIES } from "@/types";

interface YouTubeVideoSnippet {
  title: string;
  channelTitle: string;
  channelId: string;
  categoryId: string;
  tags?: string[];
}

interface YouTubeVideoStats {
  viewCount?: string;
  likeCount?: string;
}

interface YouTubeVideoContentDetails {
  duration: string;
}

interface YouTubeVideoItem {
  id: string;
  snippet: YouTubeVideoSnippet;
  contentDetails: YouTubeVideoContentDetails;
  statistics: YouTubeVideoStats;
}

interface YouTubeVideoResponse {
  items: YouTubeVideoItem[];
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  channelName: string;
  channelId: string;
  durationSeconds: number;
  categoryId: string;
  categoryName: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
}

const CACHE_PREFIX = "yt-wrapped-cache-";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  data: VideoMetadata;
  ts: number;
}

function getCached(videoId: string): VideoMetadata | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${videoId}`);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry | VideoMetadata;
    // Handle both old format (raw data) and new format (with timestamp)
    if ("ts" in entry && "data" in entry) {
      if (Date.now() - entry.ts > CACHE_TTL_MS) {
        localStorage.removeItem(`${CACHE_PREFIX}${videoId}`);
        return null;
      }
      return entry.data;
    }
    // Old format without timestamp — treat as valid but migrate on next write
    return entry as VideoMetadata;
  } catch {
    // ignore
  }
  return null;
}

function setCache(videoId: string, data: VideoMetadata): void {
  try {
    const entry: CacheEntry = { data, ts: Date.now() };
    localStorage.setItem(`${CACHE_PREFIX}${videoId}`, JSON.stringify(entry));
  } catch {
    // storage full, ignore
  }
}

export function cleanExpiredCache(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(CACHE_PREFIX)) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const entry = JSON.parse(raw);
        if ("ts" in entry && Date.now() - entry.ts > CACHE_TTL_MS) {
          keysToRemove.push(key);
        }
      } catch {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export async function fetchVideoMetadata(
  videoIds: string[],
  apiKey: string
): Promise<VideoMetadata[]> {
  const url = "https://www.googleapis.com/youtube/v3/videos";
  const response = await axios.get<YouTubeVideoResponse>(url, {
    params: {
      part: "snippet,contentDetails,statistics",
      id: videoIds.join(","),
      key: apiKey,
    },
  });

  return response.data.items.map((item) => ({
    videoId: item.id,
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    durationSeconds: parseDuration(item.contentDetails.duration),
    categoryId: item.snippet.categoryId,
    categoryName: YOUTUBE_CATEGORIES[item.snippet.categoryId] || "Other",
    tags: item.snippet.tags || [],
    viewCount: parseInt(item.statistics.viewCount || "0", 10),
    likeCount: parseInt(item.statistics.likeCount || "0", 10),
  }));
}

export async function fetchVideoMetadataBatch(
  videoIds: string[],
  apiKey: string,
  onProgress?: (fetched: number, total: number) => void
): Promise<Map<string, VideoMetadata>> {
  const result = new Map<string, VideoMetadata>();
  const uncachedIds: string[] = [];

  for (const id of videoIds) {
    const cached = getCached(id);
    if (cached) {
      result.set(id, cached);
    } else {
      uncachedIds.push(id);
    }
  }

  const BATCH_SIZE = 50;
  let fetched = result.size;
  onProgress?.(fetched, videoIds.length);

  for (let i = 0; i < uncachedIds.length; i += BATCH_SIZE) {
    const batch = uncachedIds.slice(i, i + BATCH_SIZE);
    try {
      const metadata = await fetchVideoMetadata(batch, apiKey);
      for (const m of metadata) {
        result.set(m.videoId, m);
        setCache(m.videoId, m);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        throw new Error("YouTube API quota exceeded. Try again tomorrow or use a different API key.");
      }
      // skip failed batch silently for other errors
    }
    fetched += batch.length;
    onProgress?.(Math.min(fetched, videoIds.length), videoIds.length);
  }

  return result;
}
