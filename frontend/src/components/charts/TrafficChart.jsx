import React from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { motion } from "framer-motion";

const TrafficChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
    >
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        
        <div>
          <h2 className="text-2xl font-bold text-white">
            Traffic Overview
          </h2>

          <p className="text-slate-400 mt-1">
            Hourly click analytics
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          Live
        </div>
      </div>

      {/* CHART */}
      <div className="h-[350px]">
        
        <ResponsiveContainer width="100%" height="100%">
          
          <AreaChart data={data}>
            
            <defs>
              <linearGradient
                id="trafficGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#06b6d4"
                  stopOpacity={0.7}
                />

                <stop
                  offset="95%"
                  stopColor="#10b981"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="hour"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
            />

            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "16px",
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#06b6d4"
              strokeWidth={3}
              fill="url(#trafficGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>
    </motion.div>
  );
};

export default TrafficChart;