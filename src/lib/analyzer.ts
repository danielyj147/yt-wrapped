import { format, getHours, getDay } from "date-fns";
import type {
  EnrichedVideo,
  WrappedStats,
  ChannelStat,
  CategoryStat,
  HourDayStat,
  MonthlyStat,
  BingeSession,
} from "@/types";
import { getGenrePersonality } from "./utils";

export function analyzeWatchHistory(
  videos: EnrichedVideo[],
  year: number
): WrappedStats {
  const sorted = [...videos].sort(
    (a, b) => a.watchedAt.getTime() - b.watchedAt.getTime()
  );

  const totalVideos = sorted.length;
  const totalWatchTimeSeconds = sorted.reduce(
    (sum, v) => sum + v.durationSeconds,
    0
  );

  // Compute actual date span
  const firstVideo = sorted[0] || null;
  const lastVideo = sorted[sorted.length - 1] || null;
  let activeDays = 1;
  if (firstVideo && lastVideo) {
    const msSpan = lastVideo.watchedAt.getTime() - firstVideo.watchedAt.getTime();
    activeDays = Math.max(1, Math.ceil(msSpan / (1000 * 60 * 60 * 24)) + 1);
  }

  const topChannels = computeTopChannels(sorted);
  const topCategories = computeTopCategories(sorted);
  const watchingHeatmap = computeHeatmap(sorted);
  const monthlyTrends = computeMonthlyTrends(sorted, year);
  const longestDay = computeLongestDay(sorted);
  const mostRewatched = computeMostRewatched(sorted);
  const { lateNightCount, lateNightSeconds } = computeLateNightStats(sorted);
  const bingeSessions = computeBingeSessions(sorted);
  const genrePersonality = getGenrePersonality(topCategories);

  return {
    totalVideos,
    totalWatchTimeSeconds,
    activeDays,
    topChannels,
    topCategories,
    watchingHeatmap,
    monthlyTrends,
    longestDay,
    mostRewatched,
    lateNightCount,
    lateNightSeconds,
    bingeSessions,
    genrePersonality,
    firstVideo,
    lastVideo,
    year,
  };
}

function computeTopChannels(videos: EnrichedVideo[]): ChannelStat[] {
  const map = new Map<string, { watchCount: number; totalSeconds: number }>();
  for (const v of videos) {
    const existing = map.get(v.channelName) || {
      watchCount: 0,
      totalSeconds: 0,
    };
    existing.watchCount++;
    existing.totalSeconds += v.durationSeconds;
    map.set(v.channelName, existing);
  }

  return [...map.entries()]
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.watchCount - a.watchCount)
    .slice(0, 20);
}

function computeTopCategories(videos: EnrichedVideo[]): CategoryStat[] {
  const map = new Map<
    string,
    { categoryId: string; watchCount: number; totalSeconds: number }
  >();
  for (const v of videos) {
    const existing = map.get(v.categoryName) || {
      categoryId: v.categoryId,
      watchCount: 0,
      totalSeconds: 0,
    };
    existing.watchCount++;
    existing.totalSeconds += v.durationSeconds;
    map.set(v.categoryName, existing);
  }

  return [...map.entries()]
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.watchCount - a.watchCount)
    .slice(0, 10);
}

function computeHeatmap(videos: EnrichedVideo[]): HourDayStat[] {
  const grid: Record<string, number> = {};

  for (const v of videos) {
    const hour = getHours(v.watchedAt);
    const day = getDay(v.watchedAt);
    const key = `${hour}-${day}`;
    grid[key] = (grid[key] || 0) + 1;
  }

  const result: HourDayStat[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      result.push({ hour, day, count: grid[`${hour}-${day}`] || 0 });
    }
  }
  return result;
}

function computeMonthlyTrends(
  videos: EnrichedVideo[],
  year: number
): MonthlyStat[] {
  const months: MonthlyStat[] = [];
  for (let month = 0; month < 12; month++) {
    const monthVideos = videos.filter((v) => {
      const d = v.watchedAt;
      return d.getMonth() === month && d.getFullYear() === year;
    });
    months.push({
      month,
      year,
      label: format(new Date(year, month, 1), "MMM"),
      watchCount: monthVideos.length,
      totalSeconds: monthVideos.reduce((s, v) => s + v.durationSeconds, 0),
    });
  }
  return months;
}

function computeLongestDay(
  videos: EnrichedVideo[]
): { date: string; count: number; totalSeconds: number } {
  const dayMap = new Map<string, { count: number; totalSeconds: number }>();
  for (const v of videos) {
    const dateKey = format(v.watchedAt, "yyyy-MM-dd");
    const existing = dayMap.get(dateKey) || { count: 0, totalSeconds: 0 };
    existing.count++;
    existing.totalSeconds += v.durationSeconds;
    dayMap.set(dateKey, existing);
  }

  let maxDate = "";
  let maxData = { count: 0, totalSeconds: 0 };
  for (const [date, data] of dayMap) {
    if (data.count > maxData.count) {
      maxDate = date;
      maxData = data;
    }
  }

  return { date: maxDate, ...maxData };
}

function computeMostRewatched(
  videos: EnrichedVideo[]
): { videoId: string; title: string; channelName: string; count: number } {
  const countMap = new Map<
    string,
    { title: string; channelName: string; count: number }
  >();
  for (const v of videos) {
    const existing = countMap.get(v.videoId) || {
      title: v.title,
      channelName: v.channelName,
      count: 0,
    };
    existing.count++;
    countMap.set(v.videoId, existing);
  }

  let maxId = "";
  let maxData = { title: "", channelName: "", count: 0 };
  for (const [id, data] of countMap) {
    if (data.count > maxData.count) {
      maxId = id;
      maxData = data;
    }
  }

  return { videoId: maxId, ...maxData };
}

function computeLateNightStats(
  videos: EnrichedVideo[]
): { lateNightCount: number; lateNightSeconds: number } {
  let lateNightCount = 0;
  let lateNightSeconds = 0;

  for (const v of videos) {
    const hour = getHours(v.watchedAt);
    if (hour >= 0 && hour < 4) {
      lateNightCount++;
      lateNightSeconds += v.durationSeconds;
    }
  }

  return { lateNightCount, lateNightSeconds };
}

function computeBingeSessions(videos: EnrichedVideo[]): BingeSession[] {
  const sorted = [...videos].sort(
    (a, b) => a.watchedAt.getTime() - b.watchedAt.getTime()
  );

  const sessions: BingeSession[] = [];
  let currentChannel = "";
  let currentRun: EnrichedVideo[] = [];

  for (const v of sorted) {
    if (v.channelName === currentChannel) {
      currentRun.push(v);
    } else {
      if (currentRun.length >= 3) {
        sessions.push({
          channelName: currentChannel,
          videoCount: currentRun.length,
          videos: currentRun,
        });
      }
      currentChannel = v.channelName;
      currentRun = [v];
    }
  }

  if (currentRun.length >= 3) {
    sessions.push({
      channelName: currentChannel,
      videoCount: currentRun.length,
      videos: currentRun,
    });
  }

  return sessions.sort((a, b) => b.videoCount - a.videoCount).slice(0, 10);
}
