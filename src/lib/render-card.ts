import type { WrappedStats } from "@/types";
import { formatNumber } from "./utils";

const CARD_WIDTH = 760;
const CARD_HEIGHT = 1000;
const DPR = 2;

function createGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stops: Array<[number, string]>
): CanvasGradient {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [offset, color] of stops) {
    gradient.addColorStop(offset, color);
  }
  return gradient;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function renderSummaryCard(stats: WrappedStats): string {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH * DPR;
  canvas.height = CARD_HEIGHT * DPR;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(DPR, DPR);

  // Background
  const bg = createGradient(ctx, 0, 0, CARD_WIDTH, CARD_HEIGHT, [
    [0, "#0a0a28"],
    [0.5, "#1a1040"],
    [1, "#050510"],
  ]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Card area
  const cardX = 60;
  const cardY = 60;
  const cardW = CARD_WIDTH - 120;
  const cardH = CARD_HEIGHT - 120;

  // Card background with gradient border
  const borderGrad = createGradient(ctx, cardX, cardY, cardX + cardW, cardY + cardH, [
    [0, "#ec4899"],
    [0.5, "#a855f7"],
    [1, "#06b6d4"],
  ]);
  roundRect(ctx, cardX - 2, cardY - 2, cardW + 4, cardH + 4, 24);
  ctx.fillStyle = borderGrad;
  ctx.fill();

  // Card inner bg
  const cardBg = createGradient(ctx, cardX, cardY, cardX + cardW, cardY + cardH, [
    [0, "#1a1040"],
    [1, "#0a0a28"],
  ]);
  roundRect(ctx, cardX, cardY, cardW, cardH, 22);
  ctx.fillStyle = cardBg;
  ctx.fill();

  // Holographic shimmer overlay
  const shimmer = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  shimmer.addColorStop(0, "rgba(255, 119, 115, 0.08)");
  shimmer.addColorStop(0.2, "rgba(255, 237, 95, 0.05)");
  shimmer.addColorStop(0.4, "rgba(168, 255, 95, 0.05)");
  shimmer.addColorStop(0.6, "rgba(131, 255, 247, 0.08)");
  shimmer.addColorStop(0.8, "rgba(120, 148, 255, 0.05)");
  shimmer.addColorStop(1, "rgba(216, 117, 255, 0.08)");
  roundRect(ctx, cardX, cardY, cardW, cardH, 22);
  ctx.fillStyle = shimmer;
  ctx.fill();

  const cx = CARD_WIDTH / 2;
  let y = cardY + 70;

  // Title
  ctx.textAlign = "center";
  ctx.font = "900 44px Inter, system-ui, sans-serif";
  const titleGrad = createGradient(ctx, cx - 150, y, cx + 150, y, [
    [0, "#ec4899"],
    [0.5, "#c084fc"],
    [1, "#22d3ee"],
  ]);
  ctx.fillStyle = titleGrad;
  ctx.fillText(`YouTube ${stats.year}`, cx, y);

  y += 30;
  ctx.font = "600 14px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.letterSpacing = "6px";
  ctx.fillText("WRAPPED", cx, y);
  ctx.letterSpacing = "0px";

  // Divider
  y += 40;
  const divGrad = createGradient(ctx, cx - 100, y, cx + 100, y, [
    [0, "rgba(255,255,255,0)"],
    [0.5, "rgba(255,255,255,0.15)"],
    [1, "rgba(255,255,255,0)"],
  ]);
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 120, y);
  ctx.lineTo(cx + 120, y);
  ctx.stroke();

  // Stats grid
  y += 50;
  const totalHours = Math.round(stats.totalWatchTimeSeconds / 3600);

  const statPairs = [
    { label: "VIDEOS", value: formatNumber(stats.totalVideos) },
    { label: "HOURS", value: totalHours > 0 ? formatNumber(totalHours) : "—" },
  ];

  // Draw stat pair - row 1
  for (let i = 0; i < statPairs.length; i++) {
    const sx = cardX + cardW * (i === 0 ? 0.25 : 0.75);
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.letterSpacing = "2px";
    ctx.fillText(statPairs[i].label, sx, y);
    ctx.letterSpacing = "0px";

    ctx.font = "800 40px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(statPairs[i].value, sx, y + 45);
  }

  // Row 2
  y += 110;
  const statPairs2 = [
    { label: "TOP CHANNEL", value: stats.topChannels[0]?.name || "—" },
    { label: "TOP GENRE", value: stats.topCategories[0]?.name || "—" },
  ];

  for (let i = 0; i < statPairs2.length; i++) {
    const sx = cardX + cardW * (i === 0 ? 0.25 : 0.75);
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.letterSpacing = "2px";
    ctx.fillText(statPairs2[i].label, sx, y);
    ctx.letterSpacing = "0px";

    ctx.font = "700 20px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    // Truncate long names
    const txt = statPairs2[i].value.length > 18
      ? statPairs2[i].value.slice(0, 17) + "..."
      : statPairs2[i].value;
    ctx.fillText(txt, sx, y + 30);
  }

  // Divider
  y += 70;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, y);
  ctx.lineTo(cardX + cardW - 40, y);
  ctx.stroke();

  // Personality
  y += 40;
  ctx.font = "10px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.letterSpacing = "2px";
  ctx.fillText("PERSONALITY", cx, y);
  ctx.letterSpacing = "0px";

  y += 35;
  ctx.font = "800 28px Inter, system-ui, sans-serif";
  const persGrad = createGradient(ctx, cx - 120, y, cx + 120, y, [
    [0, "#fde047"],
    [0.5, "#f472b6"],
    [1, "#a855f7"],
  ]);
  ctx.fillStyle = persGrad;
  ctx.fillText(stats.genrePersonality, cx, y);

  // Night owl badge
  if (stats.lateNightCount > 20) {
    y += 50;
    const badgeW = 280;
    const badgeH = 32;
    roundRect(ctx, cx - badgeW / 2, y - 18, badgeW, badgeH, 16);
    ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = "500 12px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#a5b4fc";
    ctx.fillText(`Night Owl — ${stats.lateNightCount} late-night videos`, cx, y + 1);
  }

  // Shorts scroller badge
  if (stats.shortsStats.shortsCount > 10) {
    y += 42;
    const badgeW = 280;
    const badgeH = 32;
    roundRect(ctx, cx - badgeW / 2, y - 18, badgeW, badgeH, 16);
    ctx.fillStyle = "rgba(236, 72, 153, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "rgba(236, 72, 153, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = "500 12px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#f9a8d4";
    ctx.fillText(`Shorts Scroller — ${stats.shortsStats.shortsCount} shorts watched`, cx, y + 1);
  }

  // Footer
  ctx.font = "500 12px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  ctx.fillText("YouTube Wrapped", cx, CARD_HEIGHT - 80);

  return canvas.toDataURL("image/png");
}

export function downloadCardImage(dataUrl: string, year: number) {
  const link = document.createElement("a");
  link.download = `youtube-wrapped-${year}.png`;
  link.href = dataUrl;
  link.click();
}
