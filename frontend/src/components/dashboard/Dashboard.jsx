import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import DashboardLayout from '../layouts/DashboardLayout';
import UrlInputForm from './UrlInputForm';
import UrlTable from '../urls/UrlTable';
import AnalyticsSection from '../analytics/AnalyticsSection';

import {
  getUserApi,
  getAllUrls,
  getTodayLogs,
  createShortUrl,
  deleteShortUrl,
} from '../../api/api';

/**
 * Dashboard Component
 * Main dashboard view with:
 * - URL shortener input form
 * - Analytics section with metrics
 * - Data visualization charts
 * - URL management table
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState([]);
  const [todayLogs, setTodayLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const userData = await getUserApi();
      const urlsData = await getAllUrls();
      const logsData = await getTodayLogs();

      setUser(userData);
      setUrls(urlsData.urls || []);
      setTodayLogs(logsData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // 1. Data Processing: Health Status Data
  const healthData = useMemo(() => {
    const now = new Date();
    const stats = {
      Active: 0,
      'Expiring Soon': 0,
      Expired: 0,
    };

    urls.forEach((url) => {
      if (!url.expiresAt) {
        stats.Active++;
      } else {
        const expiryDate = new Date(url.expiresAt);
        if (expiryDate < now) {
          stats.Expired++;
        } else {
          stats['Expiring Soon']++;
        }
      }
    });

    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [urls]);

  // 1. Data Processing: Creation Timeline Data
  const timelineData = useMemo(() => {
    const groups = {};
    
    // Sort urls by date first to ensure timeline is chronological
    const sortedUrls = [...urls].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    sortedUrls.forEach((url) => {
      const date = new Date(url.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      });
      groups[date] = (groups[date] || 0) + 1;
    });

    return Object.entries(groups).map(([date, count]) => ({
      date,
      links: count,
    }));
  }, [urls]);

  const HEALTH_COLORS = {
    Active: '#4f46e5',        // Indigo-600
    'Expiring Soon': '#3b82f6', // Blue-500
    Expired: '#ef4444',       // Red-500
  };

  const handleShortenUrl = async (data) => {
    try {
      setSubmitting(true);
      const newUrl = await createShortUrl(data);
      setUrls([newUrl, ...urls]);
      toast.success('URL shortened successfully!');
      await loadDashboard(); // Refresh to get updated analytics
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
      console.error('Error shortening URL:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUrl = async (urlId) => {
    try {
      if (window.confirm('Are you sure you want to delete this link?')) {
        await deleteShortUrl(urlId);
        setUrls(urls.filter(u => u._id !== urlId));
        toast.success('Link deleted successfully');
        await loadDashboard();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete URL');
      console.error('Error deleting URL:', error);
    }
  };

  const handleEditUrl = (url) => {
    toast.info('Edit functionality coming soon');
  };

  if (loading) {
    return (
      <DashboardLayout user={null}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Loading dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalClicks = todayLogs?.todayClicks || 0;
  const lastVisited = todayLogs?.lastVisited || null;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className={`text-4xl font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Welcome back, {user?.name || user?.email}
          </h1>
          <p className={`text-lg ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Manage your shortened links and track performance
          </p>
        </motion.div>

        {/* URL Shortener Input */}
        <UrlInputForm onSubmit={handleShortenUrl} loading={submitting} />

        {/* Analytics Section */}
        <AnalyticsSection
          todayClicks={totalClicks}
          lastVisited={lastVisited}
          urls={urls}
        />

        {/* 2. UI Layout: Health Checks & Data Logs Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Chart 1: URL Health */}
          <div className={`p-6 rounded-xl border transition-colors duration-300 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              URL Health Status
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={HEALTH_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1e293b' : '#fff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#fff' : '#000'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Growth Timeline */}
          <div className={`p-6 rounded-xl border transition-colors duration-300 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Link Creation Growth
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorLinks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1e293b' : '#fff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#fff' : '#000'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="links" 
                    stroke="#4f46e5" 
                    fillOpacity={1} 
                    fill="url(#colorLinks)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* URL Management Table */}
        <UrlTable
          urls={urls}
          loading={loading}
          onDelete={handleDeleteUrl}
          onEdit={handleEditUrl}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;