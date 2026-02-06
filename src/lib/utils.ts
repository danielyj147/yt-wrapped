export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function parseDuration(iso8601: string): number {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export function funComparison(totalHours: number): string {
  const comparisons = [
    { threshold: 1000, text: (h: number) => `That's ${Math.round(h / 12)} flights from NYC to Tokyo` },
    { threshold: 500, text: (h: number) => `That's ${Math.round(h / 2)} movies worth of content` },
    { threshold: 200, text: (h: number) => `That's ${Math.round(h / 24)} full days of non-stop watching` },
    { threshold: 100, text: (h: number) => `That's like binging ${Math.round(h / 8)} full TV seasons` },
    { threshold: 50, text: (h: number) => `That's ${Math.round(h)} hours of YouTube — nearly ${Math.round(h / 24)} full days` },
    { threshold: 0, text: (h: number) => `That's ${Math.round(h)} hours — about ${Math.round(h * 60)} minutes of content` },
  ];

  for (const c of comparisons) {
    if (totalHours >= c.threshold) return c.text(totalHours);
  }
  return `${Math.round(totalHours)} hours of content`;
}

export function getGenrePersonality(topCategories: Array<{ name: string }>): string {
  const top = topCategories[0]?.name || "";
  const second = topCategories[1]?.name || "";

  const personalities: Record<string, string> = {
    "Music": "The Audiophile",
    "Gaming": "The Gamer",
    "Entertainment": "The Entertainment Buff",
    "Education": "The Lifelong Learner",
    "Science & Technology": "The Tech Enthusiast",
    "Comedy": "The Comedy Connoisseur",
    "News & Politics": "The Informed Citizen",
    "Sports": "The Sports Fanatic",
    "Howto & Style": "The DIY Master",
    "People & Blogs": "The Community Builder",
    "Film & Animation": "The Cinephile",
    "Pets & Animals": "The Animal Lover",
    "Travel & Events": "The Explorer",
    "Autos & Vehicles": "The Gearhead",
    "Nonprofits & Activism": "The Change Maker",
  };

  if (personalities[top]) return personalities[top];
  if (personalities[second]) return `The Eclectic ${personalities[second].split(" ").pop()}`;
  return "The YouTube Explorer";
}

export function isShort(video: { categoryId: string; durationSeconds: number }): boolean {
  return video.categoryId === "42" || video.durationSeconds <= 60;
}

export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
