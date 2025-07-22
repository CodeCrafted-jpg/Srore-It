"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { convertFileSize } from "@/lib/utils";

interface StoragePieChartProps {
  used: number; // bytes
  total: number; // bytes
}

const StoragePieChart = ({ used, total }: StoragePieChartProps) => {
  const free = total - used;
  const data = [
    { name: "Used", value: used },
    { name: "Free", value: free > 0 ? free : 0 },
  ];

  const COLORS = ["#6366F1", '#A5B4FC',];

  return (
    <div className="w-full max-w-xs mx-auto text-center">
      <h3 className="text-lg font-bold mb-4 text-brand">
        Storage Usage
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              convertFileSize(value),
              name,
            ]}
            contentStyle={{ backgroundColor: "#1F2937", border: "none", color: "#fff" }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4">
        <p className="text-sm text-gray-400">
          {convertFileSize(used)} used of {convertFileSize(total)}
        </p>
      </div>
    </div>
  );
};

export default StoragePieChart;
