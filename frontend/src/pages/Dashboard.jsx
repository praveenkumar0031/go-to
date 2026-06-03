import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Search, BarChart2, Trash2, Copy, Check, MousePointerClick, 
  Link as LinkIcon, Activity, X, Edit3, UploadCloud, Download, 
  FileJson, FileSpreadsheet, User
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import QRCodePackage from 'react-qr-code';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getAllUrls, deleteShortUrl, updateShortUrl, exportFullUrlData } from '../api/api';
import BulkUploadModal from '../components/dashboard/BulkUploadModal';

const QRCode = QRCodePackage.default || QRCodePackage;

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const { data: urlsData, isLoading } = useQuery({
    queryKey: ['urls'],
    queryFn: getAllUrls,
  });

  const urls = urlsData?.urls || [];

  // --- Module 2: Data Processing for Charts ---
  const growthData = useMemo(() => {
    const counts = {};
    // Sort URLs by createdAt first to ensure chronological counting
    const sortedUrls = [...urls].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    sortedUrls.forEach(url => {
      const date = format(new Date(url.createdAt), 'dd MMM');
      counts[date] = (counts[date] || 0) + 1;
    });
    
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [urls]);

  const healthData = useMemo(() => {
    let live = 0;
    let expired = 0;
    const now = new Date();

    urls.forEach(url => {
      if (!url.expiresAt || new Date(url.expiresAt) > now) {
        live++;
      } else {
        expired++;
      }
    });

    return [
      { name: 'Live', value: live, color: '#6366f1' }, // indigo-500
      { name: 'Expired', value: expired, color: '#f43f5e' } // rose-500
    ];
  }, [urls]);

  // --- Module 4: CSV Template Downloader ---
  const handleDownloadTemplate = () => {
    const csvContent = "originalUrl,expiresAt\nhttps://example.com,2026-12-31T23:59:59.000Z";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'goto_bulk_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  // --- Module 5: Data Exporter (Deep Fetch) ---
  const handleExportJSON = async (data) => {
    try {
      const toastId = toast.loading('Preparing full data package...');
      
      // 1. Fetch full data from backend (Meta + Tracking Logs)
      const fullData = await exportFullUrlData(data.shortCode);

      // 2. Trigger Download
      const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `goto_export_${data.shortCode}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Full data package exported!', { id: toastId });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export full data package.');
    }
  };

  const handleExportCSV = (data) => {
    const headers = "_id,originalUrl,shortCode,totalClicks,createdAt\n";
    const row = `${data._id},${data.originalUrl},${data.shortCode},${data.totalClicks || 0},${data.createdAt}\n`;
    const blob = new Blob([headers + row], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.shortCode}_analytics.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const deleteMutation = useMutation({
    mutationFn: deleteShortUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      toast.success('URL deleted');
      setSelectedUrl(null);
    },
    onError: () => {
      toast.error('Failed to delete URL');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ shortCode, data }) => updateShortUrl(shortCode, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      toast.success('Destination URL updated');
      setSelectedUrl(prev => ({ ...prev, originalUrl: data.originalUrl || editUrl }));
      setIsEditMode(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update destination');
    }
  });

  const filteredUrls = useMemo(() => {
    const searchLower = (searchTerm || '').toLowerCase();
    return urls.filter(url => 
      (url.originalUrl || '').toLowerCase().includes(searchLower) || 
      (url.shortCode || '').toLowerCase().includes(searchLower)
    );
  }, [urls, searchTerm]);

  const totalClicks = urls.reduce((sum, url) => sum + (url.totalClicks || 0), 0);
  const activeLinks = urls.filter(url => {
    if (!url.expiresAt) return true;
    return new Date(url.expiresAt) > new Date();
  }).length;

  const handleCopy = (shortCode, e) => {
    if (e) e.stopPropagation();
    const fullUrl = `${import.meta.env.VITE_REDIRECT_API}/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(shortCode);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  const handleDelete = (shortCode, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this URL?')) {
      deleteMutation.mutate(shortCode);
    }
  };

  const openModal = (url) => {
    setSelectedUrl(url);
    setIsEditMode(false);
    setEditUrl(url.originalUrl);
  };

  const closeModal = () => {
    setSelectedUrl(null);
    setIsEditMode(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editUrl || editUrl === selectedUrl.originalUrl) {
      setIsEditMode(false);
      return;
    }
    updateMutation.mutate({ shortCode: selectedUrl.shortCode, data: { originalUrl: editUrl } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome back, {user?.username || 'User'}
          </h1>
          <p className={`text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Here's what's happening with your links today.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-200 border ${isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}`}
            >
              <UploadCloud size={18} className="text-indigo-500" /> Bulk Upload
            </button>
            <button 
              onClick={handleDownloadTemplate}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 px-1"
            >
              <Download size={12} /> CSV Template
            </button>
          </div>

          <button
            onClick={() => navigate('/dashboard/create')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-95 h-[48px]"
          >
            <Plus size={20} /> Create Link
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Links', value: urls.length, icon: LinkIcon, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: MousePointerClick, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
          { label: 'Active Links', value: activeLinks, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} ${stat.border} border`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
                <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* URL Growth Timeline Card */}
        <div className={`p-8 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Link Creation Growth</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>Last 30 Days</div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid vertical={false} stroke={isDark ? '#222d3f' : '#e2e8f0'} strokeDasharray="0" />
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
                  allowDecimals={false}
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#fff', 
                    border: '1px solid ' + (isDark ? '#1e293b' : '#e2e8f0'), 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ color: '#6366f1', fontWeight: 700, fontSize: '12px' }}
                  labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: '2px', fontWeight: 600, fontSize: '11px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#60a5fa" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 1, fill: isDark ? '#0f172a' : '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#60a5fa' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Link Status Health Card */}
        <div className={`p-8 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Link Status Health</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={105}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#fff', 
                    border: '1px solid ' + (isDark ? '#1e293b' : '#e2e8f0'), 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle" 
                  iconSize={10}
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span className={`text-sm font-bold ml-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} w-full sm:w-80`}>
          <Search size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
          <input
            id="searchLinks"
            name="searchLinks"
            aria-label="Search links"
            type="text"
            placeholder="Search original URL or short code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`bg-transparent border-none outline-none text-sm w-full ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
          />
        </div>
      </div>

      {/* Grid View */}
      {filteredUrls.length === 0 ? (
        <div className={`p-12 text-center rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <LinkIcon size={24} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
          </div>
          <h3 className={`text-lg font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>No links found</h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {searchTerm ? "We couldn't find any links matching your search." : "You haven't created any links yet."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/dashboard/create')}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Create your first link
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUrls.map((url) => {
            // Module 3: Health Logic
            const isLive = !url.expiresAt || new Date(url.expiresAt) > new Date();
            
            return (
              <div 
                key={url.shortCode}
                onClick={() => openModal(url)}
                className={`p-5 rounded-xl border cursor-pointer hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md ${isDark ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-500/30'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-mono font-semibold ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
                      /{url.shortCode}
                    </div>
                    {/* Module 3: Health Badge */}
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${isLive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      <span>●</span> {isLive ? 'Live' : 'Expired'}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleCopy(url.shortCode, e)}
                    className={`p-1.5 rounded-md transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                  >
                    {copiedId === url.shortCode ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className={`text-sm truncate mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} title={url.originalUrl}>
                    {url.originalUrl}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Created {url.createdAt ? format(new Date(url.createdAt), 'MMM d, yyyy') : 'N/A'}
                  </p>
                </div>
                
                <div className={`flex items-center gap-2 text-sm font-medium pt-3 border-t ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                  <MousePointerClick size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                  {url.totalClicks || 0} Clicks
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Slide-over Panel */}
      {selectedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Link Details</h3>
              <button onClick={closeModal} className={`p-1 rounded-md transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {/* QR Code Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 mb-3">
                  <QRCode 
                    value={`${import.meta.env.VITE_REDIRECT_API || 'http://localhost:8000/goto'}/${selectedUrl.shortCode}`} 
                    size={160} 
                  />
                </div>
                
                {isEditMode ? (
                  <form onSubmit={handleEditSubmit} className="w-full mt-2">
                    <label htmlFor="editUrl" className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Edit Destination URL</label>
                    <div className="flex gap-2">
                      <input
                        id="editUrl"
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="https://example.com"
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'}`}
                      />
                      <button type="submit" disabled={updateMutation.isPending} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                    <button type="button" onClick={() => setIsEditMode(false)} className={`mt-2 text-xs font-medium ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleCopy(selectedUrl.shortCode)}>
                    <a href={`${import.meta.env.VITE_REDIRECT_API || 'http://localhost:8000/goto'}/${selectedUrl.shortCode}`} target="_blank" rel="noreferrer" className={`text-lg font-bold font-mono hover:underline ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} onClick={(e) => e.stopPropagation()}>
                      goto.com/{selectedUrl.shortCode}
                    </a>
                    {copiedId === selectedUrl.shortCode ? <Check size={16} className="text-green-500" /> : <Copy size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />}
                  </div>
                )}
              </div>

              {/* Data Section */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Destination</p>
                  <a 
                    href={selectedUrl.originalUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    title={selectedUrl.originalUrl}
                    className={`text-sm line-clamp-2 hover:underline ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                  >
                    {selectedUrl.originalUrl}
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total Clicks</p>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedUrl.totalClicks || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Created On</p>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {selectedUrl.createdAt ? format(new Date(selectedUrl.createdAt), 'MMM dd, yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Module 5: Targeted Data Exporter */}
              <div className={`mb-6 p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Export Link Data</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleExportJSON(selectedUrl)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-indigo-400' : 'bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200'}`}
                  >
                    <FileJson size={14} /> JSON
                  </button>
                  <button 
                    onClick={() => handleExportCSV(selectedUrl)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-emerald-400' : 'bg-white hover:bg-slate-100 text-emerald-600 border border-slate-200'}`}
                  >
                    <FileSpreadsheet size={14} /> CSV
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setIsEditMode(true)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-blue-400' : 'bg-slate-100 hover:bg-slate-200 text-blue-600'}`}
                >
                  <Edit3 size={18} />
                  <span className="text-xs font-medium">Edit URL</span>
                </button>
                <button
                  onClick={() => navigate(`/analytics/${selectedUrl.shortCode}`)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-colors ${isDark ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'}`}
                >
                  <BarChart2 size={18} />
                  <span className="text-xs font-medium">Analytics</span>
                </button>
                <button
                  onClick={() => handleDelete(selectedUrl.shortCode)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-colors ${isDark ? 'bg-slate-800 hover:bg-red-500/10 text-red-400' : 'bg-slate-100 hover:bg-red-50 text-red-600'}`}
                >
                  <Trash2 size={18} />
                  <span className="text-xs font-medium">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBulkModalOpen && (
        <BulkUploadModal 
          isOpen={isBulkModalOpen} 
          onClose={() => setIsBulkModalOpen(false)} 
          onUploadSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['urls'] });
            setIsBulkModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;