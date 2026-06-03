import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const TrafficChart = ({ data }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-3xl p-8 transition-all duration-300 ${
        isDark ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-500/5' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
      }`}
    >
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Traffic Overview
          </h2>
          <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Real-time click analytics for this link
          </p>
        </div>

        <div className={`px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 border animate-pulse ${
          isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Live
        </div>
      </div>

      {/* CHART */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
            />

            <XAxis
              dataKey="hour"
              stroke={isDark ? '#475569' : '#94a3b8'}
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            <YAxis
              stroke={isDark ? '#475569' : '#94a3b8'}
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />

            <Tooltip
              cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
              contentStyle={{
                background: isDark ? "#0f172a" : "#fff",
                border: "1px solid " + (isDark ? "#1e293b" : "#e2e8f0"),
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                padding: '12px'
              }}
              itemStyle={{ color: '#6366f1', fontWeight: 700 }}
              labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: '4px', fontWeight: 600 }}
            />

            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#6366f1"
              strokeWidth={4}
              fill="url(#trafficGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TrafficChart;