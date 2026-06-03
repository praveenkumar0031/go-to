import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, Clock, Calendar, Users, Monitor, Smartphone, Globe, Activity, Link as LinkIcon } from 'lucide-react';
import { format, subDays, eachDayOfInterval, startOfDay, isSameDay } from 'date-fns';
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', shortCode],
    queryFn: () => getUrlAnalytics(shortCode),
  });

  useEffect(() => {
    if (data) {
      console.log("API Response Data:", data);
    }
  }, [data]);

  const { dailyData, hourlyData, uniqueVisitors } = useMemo(() => {
    if (!data?.recentVisits) return { dailyData: [], hourlyData: [], uniqueVisitors: 0 };

    const visits = data.recentVisits;
    
    // Unique Visitors
    const ips = new Set(visits.map(v => v.ipAddress));
    const uniqueVisitorsCount = ips.size;

    // Daily Data (last 30 days)
    const end = startOfDay(new Date());
    const start = subDays(end, 29);
    const days = eachDayOfInterval({ start, end });
    
    const dailyMap = new Map(days.map(day => [format(day, 'MMM dd'), 0]));
    
    // Hourly Data (0-23)
    const hourlyArray = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      clicks: 0
    }));

    visits.forEach(visit => {
      const date = new Date(visit.createdAt);
      if (date >= start && date <= new Date()) {
        const dayStr = format(date, 'MMM dd');
        if (dailyMap.has(dayStr)) {
          dailyMap.set(dayStr, dailyMap.get(dayStr) + 1);
        }
      }
      
      const hour = date.getHours();
      hourlyArray[hour].clicks += 1;
    });

    const dailyArray = Array.from(dailyMap, ([date, clicks]) => ({ date, clicks }));

    return { dailyData: dailyArray, hourlyData: hourlyArray, uniqueVisitors: uniqueVisitorsCount };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-20">
        <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Analytics not found</h2>
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>The link might have been deleted or the short code is invalid.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-indigo-600 font-medium">Back to Dashboard</button>
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    color: isDark ? '#f8fafc' : '#0f172a'
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate('/dashboard')}
            className={`p-3 rounded-2xl transition-all duration-200 border ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 shadow-sm'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-1">
            <h1 className={`text-3xl font-extrabold tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Analytics for <span className="text-indigo-500 font-mono tracking-tighter">/{data.shortCode}</span>
            </h1>
            <a 
              href={data.originalUrl} 
              target="_blank" 
              rel="noreferrer" 
              className={`text-sm font-medium hover:underline truncate max-w-lg block ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
              title={data.originalUrl}
            >
              {data.originalUrl}
            </a>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Clicks', value: (data.totalClicks || 0).toLocaleString(), icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Unique Visitors', value: uniqueVisitors.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Created On', value: format(new Date(data.createdAt), 'MMM dd, yyyy'), icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Last Activity', value: data.lastVisitedAt ? format(new Date(data.lastVisitedAt), 'MMM dd, HH:mm') : 'Never', icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/10' }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
                <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border border-current border-opacity-10`}>
                <stat.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Traffic Card */}
        <div className={`p-8 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Traffic (Last 30 Days)</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>Historical</div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  dataKey="date" 
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
                />
                <Tooltip 
                  cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                  contentStyle={tooltipStyle} 
                  itemStyle={{ color: '#6366f1', fontWeight: 700 }}
                  labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: '4px', fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  dot={false} 
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#6366f1' }} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Distribution Card */}
        <div className={`p-8 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Hourly Distribution</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>Today</div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
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
                />
                <Tooltip 
                  contentStyle={tooltipStyle} 
                  cursor={{ fill: isDark ? '#1e293b' : '#f8fafc', radius: [8, 8, 0, 0] }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 700 }}
                  labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: '4px', fontWeight: 600 }}
                />
                <Bar 
                  dataKey="clicks" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]} 
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table Card */}
      <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-500/5' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
        <div className={`p-8 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Visitors</h3>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <Users size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            </div>
          </div>
        </div>
        
        {(!data.recentVisits || !Array.isArray(data.recentVisits) || data.recentVisits.length === 0) ? (
          <div className="p-20 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <Users size={36} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
            </div>
            <h4 className={`text-lg font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>No activity yet</h4>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Share your link to start tracking visitor data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-black uppercase tracking-widest ${isDark ? 'border-slate-800 text-slate-500 bg-slate-800/20' : 'border-slate-100 text-slate-400 bg-slate-50/50'}`}>
                  <th className="p-6">Timestamp</th>
                  <th className="p-6">Device & System</th>
                  <th className="p-6">Origin</th>
                  <th className="p-6">Network Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(Array.isArray(data.recentVisits) ? data.recentVisits : []).map((visit, i) => {
                  const isMobile = visit.deviceType?.toLowerCase().includes('mobile') || visit.os?.toLowerCase().includes('android') || visit.os?.toLowerCase().includes('ios');
                  return (
                    <tr key={visit._id || i} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all duration-200`}>
                      <td className="p-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                            <Clock size={14} />
                          </div>
                          <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {format(new Date(visit.createdAt), 'MMM dd, HH:mm')}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 font-bold text-sm">
                            {isMobile ? <Smartphone size={16} className="text-blue-500" /> : <Monitor size={16} className="text-indigo-500" />}
                            <span className={isDark ? 'text-slate-200' : 'text-slate-900'}>{visit.browser || 'Unknown Browser'}</span>
                          </div>
                          <span className={`text-[11px] font-bold tracking-tight ml-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {visit.os || 'Unknown OS'} {visit.deviceType ? `• ${visit.deviceType}` : ''}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <Globe size={16} className={isDark ? 'text-emerald-500/70' : 'text-emerald-500'} />
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{visit.country || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                          {visit.ipAddress || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;