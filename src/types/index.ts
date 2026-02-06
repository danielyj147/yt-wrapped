export interface RawWatchEntry {
  header: string;
  title: string;
  titleUrl?: string;
  subtitles?: Array<{ name: string; url?: string }>;
  time: string;
  products?: string[];
  activityControls?: string[];
}

export interface ParsedWatchEntry {
  videoId: string;
  title: string;
  channelName: string;
  channelUrl?: string;
  watchedAt: Date;
}

export interface EnrichedVideo {
  videoId: string;
  title: string;
  channelName: string;
  channelId?: string;
  watchedAt: Date;
  durationSeconds: number;
  categoryId: string;
  categoryName: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
}

export interface ChannelStat {
  name: string;
  watchCount: number;
  totalSeconds: number;
}

export interface CategoryStat {
  name: string;
  categoryId: string;
  watchCount: number;
  totalSeconds: number;
}

export interface HourDayStat {
  hour: number;
  day: number;
  count: number;
}

export interface MonthlyStat {
  month: number;
  year: number;
  label: string;
  watchCount: number;
  totalSeconds: number;
}

export interface BingeSession {
  channelName: string;
  videoCount: number;
  videos: EnrichedVideo[];
}

export interface ShortsStats {
  shortsCount: number;
  shortsWatchTimeSeconds: number;
  shortsPercentage: number;
  topShortsChannels: ChannelStat[];
}

export interface WrappedStats {
  totalVideos: number;
  totalWatchTimeSeconds: number;
  activeDays: number;
  topChannels: ChannelStat[];
  topCategories: CategoryStat[];
  watchingHeatmap: HourDayStat[];
  monthlyTrends: MonthlyStat[];
  longestDay: { date: string; count: number; totalSeconds: number };
  mostRewatched: { videoId: string; title: string; channelName: string; count: number };
  lateNightCount: number;
  lateNightSeconds: number;
  bingeSessions: BingeSession[];
  genrePersonality: string;
  firstVideo: EnrichedVideo | null;
  lastVideo: EnrichedVideo | null;
  shortsStats: ShortsStats;
  year: number;
}

export type AppStage = "upload" | "parsing" | "enriching" | "analyzing" | "ready";

export const YOUTUBE_CATEGORIES: Record<string, string> = {
  "1": "Film & Animation",
  "2": "Autos & Vehicles",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "18": "Short Movies",
  "19": "Travel & Events",
  "20": "Gaming",
  "21": "Videoblogging",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
  "29": "Nonprofits & Activism",
  "30": "Movies",
  "31": "Anime/Animation",
  "32": "Action/Adventure",
  "33": "Classics",
  "34": "Comedy",
  "35": "Documentary",
  "36": "Drama",
  "37": "Family",
  "38": "Foreign",
  "39": "Horror",
  "40": "Sci-Fi/Fantasy",
  "41": "Thriller",
  "42": "Shorts",
  "43": "Shows",
  "44": "Trailers",
};
