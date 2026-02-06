"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryStat } from "@/types";

interface CategoryPieChartProps {
  categories: CategoryStat[];
}

const COLORS = [
  "#ff2d78",
  "#a855f7",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export function CategoryPieChart({ categories }: CategoryPieChartProps) {
  const data = categories.slice(0, 6).map((c) => ({
    name: c.name,
    value: c.watchCount,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(10, 10, 30, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value} videos`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs text-white/60">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
