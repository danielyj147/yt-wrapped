import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { parseDuration } from "@/lib/utils";
import { YOUTUBE_CATEGORIES } from "@/types";

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    categoryId: string;
    tags?: string[];
  };
  contentDetails: { duration: string };
  statistics: { viewCount?: string; likeCount?: string };
}

const BATCH_SIZE = 50;

export async function POST(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API key not configured on the server." },
      { status: 500 }
    );
  }

  let body: { ids: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { ids } = body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No video IDs provided." }, { status: 400 });
  }

  // Cap at 200 IDs per request to prevent abuse
  const videoIds = ids.slice(0, 200);

  try {
    const results: Record<string, unknown>[] = [];

    for (let i = 0; i < videoIds.length; i += BATCH_SIZE) {
      const batch = videoIds.slice(i, i + BATCH_SIZE);
      const response = await axios.get<{ items: YouTubeVideoItem[] }>(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet,contentDetails,statistics",
            id: batch.join(","),
            key: apiKey,
          },
        }
      );

      for (const item of response.data.items) {
        results.push({
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
        });
      }
    }

    return NextResponse.json({ data: results });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return NextResponse.json(
        { error: "YouTube API quota exceeded. Try again tomorrow." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch video metadata." },
      { status: 502 }
    );
  }
}
