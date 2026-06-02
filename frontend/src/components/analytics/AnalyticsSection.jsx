import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BarChart3, TrendingUp, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * AnalyticsCard Component
 * Displays analytics metrics with a placeholder for charts
 */
const AnalyticsCard = ({ title, value, icon: Icon, trend, description }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-6 border transition-colors duration-300 ${
        isDark
          ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-2 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {value}
          </p>
          {description && (
            <p className={`text-xs mt-1 ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}>
              {description}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          isDark
            ? 'bg-slate-800'
            : 'bg-slate-100'
        }`}>
          <Icon size={20} className={`${
            isDark ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-1 text-green-500 text-sm">
            <TrendingUp size={14} />
            <span>{trend}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/**
 * AnalyticsSection Component
 * Displays key metrics and chart placeholder areas
 */
const AnalyticsSection = ({ todayClicks = 0, lastVisited = null, urls = [] }) => {
  const { isDark } = useTheme();

  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + (url.totalClicks || 0), 0);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Links"
          value={totalLinks}
          icon={BarChart3}
          description={`${totalLinks} shortened URL${totalLinks !== 1 ? 's' : ''}`}
        />

        <AnalyticsCard
          title="Total Clicks"
          value={totalClicks.toLocaleString()}
          icon={TrendingUp}
          trend={`+${todayClicks} today`}
        />

        <AnalyticsCard
          title="Today's Clicks"
          value={todayClicks}
          icon={Clock}
          description="Clicks in the last 24 hours"
        />

        <AnalyticsCard
          title="Last Activity"
          value={lastVisited ? new Date(lastVisited).toLocaleDateString() : 'N/A'}
          icon={MapPin}
          description="Most recent link click"
        />
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Analytics Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-6 border transition-colors duration-300 ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Device Analytics
          </h3>
          <div className={`h-64 rounded-lg flex items-center justify-center border-2 border-dashed transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-slate-50 border-slate-300'
          }`}>
            <div className="text-center">
              <BarChart3 size={32} className={`mx-auto mb-2 ${
                isDark ? 'text-slate-600' : 'text-slate-400'
              }`} />
              <p className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Chart component placeholder
              </p>
              <p className={`text-xs mt-1 ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}>
                Ready for Recharts integration
              </p>
            </div>
          </div>
        </motion.div>

        {/* Geographic Analytics Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl p-6 border transition-colors duration-300 ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Geographic Data
          </h3>
          <div className={`h-64 rounded-lg flex items-center justify-center border-2 border-dashed transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-slate-50 border-slate-300'
          }`}>
            <div className="text-center">
              <MapPin size={32} className={`mx-auto mb-2 ${
                isDark ? 'text-slate-600' : 'text-slate-400'
              }`} />
              <p className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Map visualization placeholder
              </p>
              <p className={`text-xs mt-1 ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}>
                Ready for geographic charting
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* OS Analytics Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-xl p-6 border transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Operating System Analytics
        </h3>
        <div className={`h-48 rounded-lg flex items-center justify-center border-2 border-dashed transition-colors duration-300 ${
          isDark
            ? 'bg-slate-800/50 border-slate-700'
            : 'bg-slate-50 border-slate-300'
        }`}>
          <div className="text-center">
            <BarChart3 size={32} className={`mx-auto mb-2 ${
              isDark ? 'text-slate-600' : 'text-slate-400'
            }`} />
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              OS distribution chart placeholder
            </p>
            <p className={`text-xs mt-1 ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}>
              Ready for chart integration
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsSection;
