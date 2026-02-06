"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { MonthlyStat } from "@/types";

interface MonthlyChartProps {
  data: MonthlyStat[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(10, 10, 30, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "12px",
          }}
          formatter={(value) => [`${value} videos`, "Watched"]}
        />
        <Area
          type="monotone"
          dataKey="watchCount"
          stroke="#06b6d4"
          strokeWidth={2}
          fill="url(#monthlyGradient)"
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
