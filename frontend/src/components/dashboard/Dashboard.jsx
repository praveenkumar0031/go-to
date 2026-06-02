import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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
 * - URL management table
 * - Responsive design
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
    // TODO: Implement edit modal
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