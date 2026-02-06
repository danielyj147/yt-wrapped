import type { EnrichedVideo } from "@/types";

const DEMO_YEAR = 2025;

const CHANNELS = [
  { name: "Fireship", id: "UCsBjURrPoezykLs9EqgamOA" },
  { name: "Veritasium", id: "UCHnyfMqiRRG1u-2MsSQLbXA" },
  { name: "Marques Brownlee", id: "UCBcRF18a7Qf58cCRy5xuWwQ" },
  { name: "3Blue1Brown", id: "UCYO_jab_esuFRV4b17AJtAw" },
  { name: "Kurzgesagt", id: "UCsXVk37bltHxD1rDPwtNM8Q" },
  { name: "Linus Tech Tips", id: "UCXuqSBlHAE6Xw-yeJA0Tunw" },
  { name: "MrBeast", id: "UCX6OQ3DkcsbYNE6H8uQQuVA" },
  { name: "Lofi Girl", id: "UCSJ4gkVC6NrvII8umztf0Ow" },
  { name: "Mark Rober", id: "UCY1kMZp36IQSyNx_9h4mpCg" },
  { name: "Vsauce", id: "UC6nSFpj9HTCZ5t-N3Rm3-HA" },
  { name: "Corridor Crew", id: "UCSpFnDQr88xCZ80N-X7t0nQ" },
  { name: "Tom Scott", id: "UCBa659QWEk1AI4Tg--mrJ2A" },
  { name: "Stuff Made Here", id: "UCj1VqrHhDte54oLgPG4xpuQ" },
  { name: "penguinz0", id: "UCq6VFHwMzcMXbuKyG7SQYIg" },
  { name: "The Coding Train", id: "UCvjgXvBlbQE59zffy7A7LAA" },
];

const CATEGORIES: Array<{ id: string; name: string; weight: number }> = [
  { id: "28", name: "Science & Technology", weight: 30 },
  { id: "27", name: "Education", weight: 20 },
  { id: "24", name: "Entertainment", weight: 18 },
  { id: "10", name: "Music", weight: 10 },
  { id: "20", name: "Gaming", weight: 8 },
  { id: "22", name: "People & Blogs", weight: 6 },
  { id: "1", name: "Film & Animation", weight: 4 },
  { id: "23", name: "Comedy", weight: 4 },
];

const VIDEO_TITLES = [
  "How This Algorithm Changed the Internet",
  "I Built a Robot That Solves Any Puzzle",
  "The Most Misunderstood Concept in Physics",
  "Why This CPU Design Is Revolutionary",
  "Building a Full Stack App in 10 Minutes",
  "The Future of AI Is Here",
  "I Tested Every Smartphone Camera",
  "The Math Behind Machine Learning",
  "How GPS Actually Works",
  "Why Do Prime Numbers Make Encryption Possible?",
  "I Made a Mass Spectrometer in My Garage",
  "The Simplest Math Problem No One Can Solve",
  "This New Battery Tech Changes Everything",
  "What Happens Inside a Black Hole?",
  "I Built the World's Largest Nerf Gun",
  "How to Learn Any Language in 6 Months",
  "The Engineering Behind the James Webb Telescope",
  "Why Typography Matters More Than You Think",
  "React Server Components Explained",
  "The Most Dangerous Computer Virus in History",
  "How Spotify's Algorithm Knows You So Well",
  "I Survived 24 Hours in VR",
  "The Science of Dreaming",
  "How This Bridge Was Built Over the Ocean",
  "Building a Neural Network from Scratch",
  "Why Japan's Trains Are Never Late",
  "The Hidden Cost of Free Apps",
  "How Video Compression Works",
  "I Ate Only Gas Station Food for 24 Hours",
  "The Most Efficient Way to Sort Anything",
  "Why We Can't Go Faster Than Light",
  "The Dark Side of Social Media Algorithms",
  "How to Build a Mechanical Keyboard",
  "This Simple Trick Doubles Battery Life",
  "The Real Reason Planes Are White",
  "Building an Operating System from Zero",
  "Why Does Hot Water Freeze Faster?",
  "The Insane Engineering of Formula 1",
  "How Shazam Identifies Songs in Seconds",
  "The World's Most Dangerous Hiking Trail",
];

// Seeded random for deterministic output
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pickRandom<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickWeightedCategory(rand: () => number): (typeof CATEGORIES)[number] {
  const totalWeight = CATEGORIES.reduce((s, c) => s + c.weight, 0);
  let r = rand() * totalWeight;
  for (const cat of CATEGORIES) {
    r -= cat.weight;
    if (r <= 0) return cat;
  }
  return CATEGORIES[0];
}

function generateVideoId(rand: () => number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  let id = "";
  for (let i = 0; i < 11; i++) {
    id += chars[Math.floor(rand() * chars.length)];
  }
  return id;
}

export function generateDemoData(): EnrichedVideo[] {
  const rand = seededRandom(42);
  const videos: EnrichedVideo[] = [];
  const videoIdPool: string[] = [];

  // Pre-generate a pool of video IDs (some will be reused for "rewatched" effect)
  for (let i = 0; i < 200; i++) {
    videoIdPool.push(generateVideoId(rand));
  }

  // Generate ~2800 watch entries spread across the year
  const totalEntries = 2800;

  for (let i = 0; i < totalEntries; i++) {
    // Pick a random day of the year with some seasonal variation
    // More watching in winter months (Jan, Feb, Nov, Dec) and summer (Jul, Aug)
    const month = Math.floor(rand() * 12);
    const seasonBoost =
      month <= 1 || month >= 10 ? 1.3 : month === 6 || month === 7 ? 1.2 : 1.0;

    if (rand() > seasonBoost / 1.3) continue;

    const day = Math.floor(rand() * 28) + 1;

    // Hour distribution: peaks at 9-11 PM, dip at 4-7 AM
    let hour: number;
    const hourRand = rand();
    if (hourRand < 0.05) {
      hour = Math.floor(rand() * 4); // midnight-4am (late night)
    } else if (hourRand < 0.15) {
      hour = 4 + Math.floor(rand() * 4); // 4-8am
    } else if (hourRand < 0.35) {
      hour = 8 + Math.floor(rand() * 4); // 8am-noon
    } else if (hourRand < 0.55) {
      hour = 12 + Math.floor(rand() * 5); // noon-5pm
    } else {
      hour = 17 + Math.floor(rand() * 7); // 5pm-midnight (peak)
    }

    const minute = Math.floor(rand() * 60);
    const watchedAt = new Date(DEMO_YEAR, month, day, hour, minute);

    // Pick channel (weighted toward top channels)
    const channelRand = rand();
    let channelIdx: number;
    if (channelRand < 0.3) {
      channelIdx = Math.floor(rand() * 3); // top 3 channels
    } else if (channelRand < 0.6) {
      channelIdx = 3 + Math.floor(rand() * 4);
    } else {
      channelIdx = Math.floor(rand() * CHANNELS.length);
    }
    const channel = CHANNELS[channelIdx];

    const cat = pickWeightedCategory(rand);

    // Some videos get rewatched (use from pool)
    let videoId: string;
    if (rand() < 0.15) {
      videoId = videoIdPool[Math.floor(rand() * 30)]; // rewatch from top 30
    } else {
      videoId = pickRandom(videoIdPool, rand);
    }

    // Duration: 3-45 min for most, some shorts (<1min), some long (>1hr)
    let durationSeconds: number;
    const durRand = rand();
    if (durRand < 0.1) {
      durationSeconds = 15 + Math.floor(rand() * 45); // shorts
    } else if (durRand < 0.85) {
      durationSeconds = 180 + Math.floor(rand() * 2520); // 3-45 min
    } else {
      durationSeconds = 2700 + Math.floor(rand() * 5400); // 45-135 min
    }

    videos.push({
      videoId,
      title: pickRandom(VIDEO_TITLES, rand),
      channelName: channel.name,
      channelId: channel.id,
      watchedAt,
      durationSeconds,
      categoryId: cat.id,
      categoryName: cat.name,
      tags: [],
      viewCount: Math.floor(rand() * 10_000_000),
      likeCount: Math.floor(rand() * 500_000),
    });
  }

  return videos.sort((a, b) => a.watchedAt.getTime() - b.watchedAt.getTime());
}
