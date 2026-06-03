import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, BarChart2, Trash2, Copy, Check, MousePointerClick, Link as LinkIcon, Activity, X, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import QRCodePackage from 'react-qr-code';
import { useTheme } from '../context/ThemeContext';
import { getAllUrls, deleteShortUrl, updateShortUrl } from '../api/api';

const QRCode = QRCodePackage.default || QRCodePackage;

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAlias, setEditAlias] = useState('');

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
      toast.success('URL alias updated');
      // Update selected URL to show new alias in modal without closing
      setSelectedUrl(prev => ({ ...prev, shortCode: data.shortCode || editAlias }));
      setIsEditMode(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update alias');
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

  const handleCopy = (shortCode, e) => {
    if (e) e.stopPropagation();
    const fullUrl = `${import.meta.env.VITE_REDIRECT_API || 'http://localhost:8000/goto'}/${shortCode}`;
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
    setEditAlias(url.shortCode);
  };

  const closeModal = () => {
    setSelectedUrl(null);
    setIsEditMode(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editAlias || editAlias === selectedUrl.shortCode) {
      setIsEditMode(false);
      return;
    }
    updateMutation.mutate({ shortCode: selectedUrl.shortCode, data: { customAlias: editAlias } });
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
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>My Links</h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage and track your shortened URLs</p>
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
          {filteredUrls.map((url) => (
            <div 
              key={url.shortCode}
              onClick={() => openModal(url)}
              className={`p-5 rounded-xl border cursor-pointer hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md ${isDark ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-500/30'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`px-2 py-1 rounded text-xs font-mono font-semibold ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
                  /{url.shortCode}
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
          ))}
        </div>
      )}

      {/* Modal / Slide-over Panel */}
      {selectedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Link Details</h3>
              <button onClick={closeModal} className={`p-1 rounded-md transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
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
                    <label htmlFor="editAlias" className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Edit Alias</label>
                    <div className="flex gap-2">
                      <input
                        id="editAlias"
                        type="text"
                        value={editAlias}
                        onChange={(e) => setEditAlias(e.target.value)}
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
              <div className="space-y-4 mb-8">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Destination</p>
                  <a href={selectedUrl.originalUrl} target="_blank" rel="noreferrer" className={`text-sm break-all hover:underline ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setIsEditMode(true)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-blue-400' : 'bg-slate-100 hover:bg-slate-200 text-blue-600'}`}
                >
                  <Edit3 size={18} />
                  <span className="text-xs font-medium">Edit Alias</span>
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
    </div>
  );
};

export default Dashboard;