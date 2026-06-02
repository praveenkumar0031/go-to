import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, Clock, Calendar, Users } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Analytics for <span className="text-indigo-500 font-mono text-xl">{data.shortCode}</span>
          </h1>
          <a href={data.originalUrl} target="_blank" rel="noreferrer" className={`text-sm hover:underline truncate max-w-md block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {data.originalUrl}
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Clicks</p>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.totalClicks || 0}</h3>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><TrendingUp size={20} /></div>
          </div>
        </div>
        
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Unique Visitors</p>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{uniqueVisitors}</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Users size={20} /></div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Created On</p>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{format(new Date(data.createdAt), 'MMM dd, yyyy')}</h3>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Calendar size={20} /></div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Last Visited</p>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {data.lastVisitedAt ? format(new Date(data.lastVisitedAt), 'MMM dd, yyyy') : 'Never'}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500"><Clock size={20} /></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Clicks over last 30 days</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Clicks by Hour of Day</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="hour" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }} />
                <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Visits</h3>
        </div>
        
        {(!data.recentVisits || !Array.isArray(data.recentVisits) || data.recentVisits.length === 0) ? (
          <div className="p-8 text-center">
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>No visits recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-sm ${isDark ? 'border-slate-800 text-slate-400 bg-slate-800/50' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                  <th className="p-4 font-medium">Timestamp</th>
                  <th className="p-4 font-medium">Device / Browser</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {(Array.isArray(data.recentVisits) ? data.recentVisits : []).map((visit, i) => (
                  <tr key={visit._id || i} className={`border-b last:border-0 ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                    <td className="p-4">
                      {format(new Date(visit.createdAt || visit.timestamp), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="p-4">
                      {visit.deviceType || 'Unknown'} / {visit.browser || 'Unknown'}
                    </td>
                    <td className="p-4">
                      {visit.country || 'Unknown'}
                    </td>
                    <td className="p-4 font-mono text-xs">
                      {visit.ipAddress || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;