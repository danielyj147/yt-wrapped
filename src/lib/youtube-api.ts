import axios from "axios";

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

const API_BATCH_SIZE = 200; // max IDs per request to our API route

async function fetchFromApi(videoIds: string[]): Promise<VideoMetadata[]> {
  const response = await axios.post<{ data: VideoMetadata[]; error?: string }>(
    "/api/enrich",
    { ids: videoIds }
  );

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data.data;
}

export async function fetchVideoMetadataBatch(
  videoIds: string[],
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

  let fetched = result.size;
  onProgress?.(fetched, videoIds.length);

  for (let i = 0; i < uncachedIds.length; i += API_BATCH_SIZE) {
    const batch = uncachedIds.slice(i, i + API_BATCH_SIZE);
    try {
      const metadata = await fetchFromApi(batch);
      for (const m of metadata) {
        result.set(m.videoId, m);
        setCache(m.videoId, m);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        throw new Error("YouTube API quota exceeded. Try again tomorrow or use a different API key.");
      }
      // skip failed batch silently for other errors
    }
    fetched += batch.length;
    onProgress?.(Math.min(fetched, videoIds.length), videoIds.length);
  }

  return result;
}
