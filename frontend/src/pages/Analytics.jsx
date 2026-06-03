import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
  ArrowLeft,
  TrendingUp,
  Clock,
  Calendar,
  Users,
  Monitor,
  Smartphone,
  Globe,
} from 'lucide-react';

import {
  format,
  subDays,
  eachDayOfInterval,
  startOfDay,
} from 'date-fns';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useTheme } from '../context/ThemeContext';
import { getUrlAnalytics } from '../api/api';

const Analytics = () => {
  const { id: shortCode } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['analytics', shortCode],
    queryFn: () => getUrlAnalytics(shortCode),
    enabled: !!shortCode,
  });

  // Process Analytics Data
  const {
    dailyData,
    hourlyData,
    uniqueVisitors,
  } = useMemo(() => {
    if (!data?.recentVisits) {
      return {
        dailyData: [],
        hourlyData: [],
        uniqueVisitors: 0,
      };
    }

    const visits = Array.isArray(data.recentVisits)
      ? data.recentVisits
      : [];

    // Unique Visitors
    const uniqueIPs = new Set(
      visits.map((v) => v.ipAddress).filter(Boolean)
    );

    // Daily Data
    const end = startOfDay(new Date());
    const start = subDays(end, 29);

    const days = eachDayOfInterval({
      start,
      end,
    });

    const dailyMap = new Map(
      days.map((day) => [format(day, 'MMM dd'), 0])
    );

    // Hourly Data
    const hourlyArray = Array.from(
      { length: 24 },
      (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        clicks: 0,
      })
    );

    visits.forEach((visit) => {
      if (!visit?.createdAt) return;

      const date = new Date(visit.createdAt);

      // Daily
      const dayKey = format(date, 'MMM dd');

      if (dailyMap.has(dayKey)) {
        dailyMap.set(
          dayKey,
          dailyMap.get(dayKey) + 1
        );
      }

      // Hourly
      const hour = date.getHours();

      if (hourlyArray[hour]) {
        hourlyArray[hour].clicks += 1;
      }
    });

    const dailyArray = Array.from(
      dailyMap,
      ([date, clicks]) => ({
        date,
        clicks,
      })
    );

    return {
      dailyData: dailyArray,
      hourlyData: hourlyArray,
      uniqueVisitors: uniqueIPs.size,
    };
  }, [data]);

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Error
  if (isError || !data) {
    return (
      <div className="text-center py-24">
        <h2
          className={`text-2xl font-bold mb-3 ${
            isDark
              ? 'text-white'
              : 'text-slate-900'
          }`}
        >
          Analytics not found
        </h2>

        <p
          className={
            isDark
              ? 'text-slate-400'
              : 'text-slate-500'
          }
        >
          Invalid short code or deleted link.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: isDark
      ? '#0f172a'
      : '#ffffff',
    border: `1px solid ${
      isDark ? '#1e293b' : '#e2e8f0'
    }`,
    borderRadius: '12px',
    color: isDark ? '#fff' : '#000',
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <button
            onClick={() =>
              navigate('/dashboard')
            }
            className={`p-3 rounded-2xl border transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1
              className={`text-3xl font-black ${
                isDark
                  ? 'text-white'
                  : 'text-slate-900'
              }`}
            >
              Analytics
            </h1>

            <p
              className={`mt-2 text-sm break-all ${
                isDark
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              /{data.shortCode}
            </p>

            <a
              href={data.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 hover:underline text-sm break-all"
            >
              {data.originalUrl}
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          {
            title: 'Total Clicks',
            value: (
              data.totalClicks || 0
            ).toLocaleString(),
            icon: TrendingUp,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
          },
          {
            title: 'Unique Visitors',
            value:
              uniqueVisitors.toLocaleString(),
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
          },
          {
            title: 'Created',
            value: data.createdAt
              ? format(
                  new Date(data.createdAt),
                  'MMM dd, yyyy'
                )
              : '-',
            icon: Calendar,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            title: 'Last Visit',
            value: data.lastVisitedAt
              ? format(
                  new Date(data.lastVisitedAt),
                  'MMM dd, HH:mm'
                )
              : 'Never',
            icon: Clock,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`p-6 rounded-3xl border transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p
                  className={`text-xs uppercase font-bold tracking-wider ${
                    isDark
                      ? 'text-slate-500'
                      : 'text-slate-400'
                  }`}
                >
                  {item.title}
                </p>

                <h3
                  className={`mt-2 text-3xl font-black ${
                    isDark
                      ? 'text-white'
                      : 'text-slate-900'
                  }`}
                >
                  {item.value}
                </h3>
              </div>

              <div
                className={`p-3 rounded-2xl ${item.bg} ${item.color}`}
              >
                <item.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Traffic */}
        <div
          className={`p-6 rounded-3xl border ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <h3
            className={`text-xl font-bold mb-6 ${
              isDark
                ? 'text-white'
                : 'text-slate-900'
            }`}
          >
            Traffic (30 Days)
          </h3>

          <div className="h-[320px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={dailyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={
                    isDark
                      ? '#1e293b'
                      : '#e2e8f0'
                  }
                />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  stroke={
                    isDark
                      ? '#64748b'
                      : '#94a3b8'
                  }
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke={
                    isDark
                      ? '#64748b'
                      : '#94a3b8'
                  }
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                />

                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366f1"
                  strokeWidth={4}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly */}
        <div
          className={`p-6 rounded-3xl border ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <h3
            className={`text-xl font-bold mb-6 ${
              isDark
                ? 'text-white'
                : 'text-slate-900'
            }`}
          >
            Hourly Distribution
          </h3>

          <div className="h-[320px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={hourlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={
                    isDark
                      ? '#1e293b'
                      : '#e2e8f0'
                  }
                />

                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  stroke={
                    isDark
                      ? '#64748b'
                      : '#94a3b8'
                  }
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke={
                    isDark
                      ? '#64748b'
                      : '#94a3b8'
                  }
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                />

                <Bar
                  dataKey="clicks"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Visitors Table */}
      <div
        className={`rounded-3xl border overflow-hidden ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div
          className={`p-6 border-b ${
            isDark
              ? 'border-slate-800'
              : 'border-slate-200'
          }`}
        >
          <h3
            className={`text-xl font-bold ${
              isDark
                ? 'text-white'
                : 'text-slate-900'
            }`}
          >
            Recent Visitors
          </h3>
        </div>

        {!data.recentVisits?.length ? (
          <div className="py-20 text-center">
            <Users
              size={48}
              className="mx-auto text-slate-400 mb-4"
            />

            <p
              className={`font-medium ${
                isDark
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              No visitors yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr
                  className={`text-left text-xs uppercase tracking-wider ${
                    isDark
                      ? 'bg-slate-800/50 text-slate-500'
                      : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  <th className="p-5">
                    Timestamp
                  </th>
                  <th className="p-5">
                    Device
                  </th>
                  <th className="p-5">
                    Country
                  </th>
                  <th className="p-5">
                    IP Address
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.recentVisits.map(
                  (visit, i) => {
                    const isMobile =
                      visit.deviceType
                        ?.toLowerCase()
                        .includes('mobile');

                    return (
                      <tr
                        key={
                          visit._id || i
                        }
                        className={`border-t ${
                          isDark
                            ? 'border-slate-800 hover:bg-slate-800/40'
                            : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <Clock
                              size={14}
                              className="text-slate-400"
                            />

                            <span
                              className={`text-sm font-medium ${
                                isDark
                                  ? 'text-slate-300'
                                  : 'text-slate-700'
                              }`}
                            >
                              {visit.createdAt
                                ? format(
                                    new Date(
                                      visit.createdAt
                                    ),
                                    'MMM dd, HH:mm'
                                  )
                                : '-'}
                            </span>
                          </div>
                        </td>

                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            {isMobile ? (
                              <Smartphone
                                size={16}
                                className="text-blue-500"
                              />
                            ) : (
                              <Monitor
                                size={16}
                                className="text-indigo-500"
                              />
                            )}

                            <span
                              className={`text-sm font-medium ${
                                isDark
                                  ? 'text-slate-300'
                                  : 'text-slate-700'
                              }`}
                            >
                              {visit.browser ||
                                'Unknown'}
                            </span>
                          </div>
                        </td>

                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <Globe
                              size={16}
                              className="text-emerald-500"
                            />

                            <span
                              className={`text-sm font-medium ${
                                isDark
                                  ? 'text-slate-300'
                                  : 'text-slate-700'
                              }`}
                            >
                              {visit.country ||
                                'Unknown'}
                            </span>
                          </div>
                        </td>

                        <td className="p-5">
                          <span
                            className={`px-3 py-1 rounded-lg font-mono text-xs ${
                              isDark
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {visit.ipAddress ||
                              'Unknown'}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;