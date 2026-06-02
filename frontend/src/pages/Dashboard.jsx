import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, ExternalLink, BarChart2, Trash2, Copy, Check, MousePointerClick, Link as LinkIcon, Activity } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { getAllUrls, deleteShortUrl } from '../api/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const { data: urlsData, isLoading } = useQuery({
    queryKey: ['urls'],
    queryFn: getAllUrls,
  });

  useEffect(() => {
    if (urlsData) {
      console.log("API Response Data:", urlsData);
    }
  }, [urlsData]);

  const deleteMutation = useMutation({
    mutationFn: deleteShortUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      toast.success('URL deleted');
    },
    onError: () => {
      toast.error('Failed to delete URL');
    }
  });

  const urls = urlsData?.urls || [];

  const filteredUrls = useMemo(() => {
    const searchLower = (searchTerm || '').toLowerCase();
    return urls.filter(url => 
      (url.originalUrl || '').toLowerCase().includes(searchLower) || 
      (url.shortCode || '').toLowerCase().includes(searchLower)
    );
  }, [urls, searchTerm]);

  const totalClicks = urls.reduce((sum, url) => sum + (url.totalClicks || 0), 0);
  const activeLinks = urls.length;

  const handleCopy = (shortCode, id) => {
    const fullUrl = `${import.meta.env.VITE_REDIRECT_API || 'http://localhost:8000/goto'}/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (shortCode) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      deleteMutation.mutate(shortCode);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Dashboard</h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Overview of your links and performance</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/create')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Create Link
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Links', value: urls.length, icon: LinkIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Total Clicks', value: totalClicks, icon: MousePointerClick, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Active Links', value: activeLinks, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* URL List Section */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Your Links</h2>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} w-full sm:w-64`}>
            <Search size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
            <input
              id="searchLinks"
              name="searchLinks"
              aria-label="Search links"
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`bg-transparent border-none outline-none text-sm w-full ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
            />
          </div>
        </div>

        {filteredUrls.length === 0 ? (
          <div className="p-8 text-center">
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-sm ${isDark ? 'border-slate-800 text-slate-400 bg-slate-800/50' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                  <th className="p-4 font-medium">Original URL</th>
                  <th className="p-4 font-medium">Short Link</th>
                  <th className="p-4 font-medium">Created Date</th>
                  <th className="p-4 font-medium text-right">Clicks</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUrls.map((url) => (
                  <tr key={url.shortCode} className={`border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <td className="p-4 max-w-[200px] truncate">
                      <a href={url.originalUrl} target="_blank" rel="noreferrer" className={`hover:underline ${isDark ? 'text-slate-300' : 'text-slate-700'}`} title={url.originalUrl}>
                        {url.originalUrl}
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{url.shortCode}</span>
                        <button 
                          onClick={() => handleCopy(url.shortCode, url.shortCode)}
                          className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                        >
                          {copiedId === url.shortCode ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {url.createdAt ? format(new Date(url.createdAt), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className={`p-4 text-right font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {url.totalClicks || 0}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/analytics/${url.shortCode}`)}
                          className={`p-1.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-500 transition-colors`}
                          title="Analytics"
                        >
                          <BarChart2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(url.shortCode)}
                          className={`p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors`}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

export default Dashboard;