import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Clock, PlusCircle, MousePointerClick, Filter, Activity, 
  Link as LinkIcon, Edit3, Monitor, Smartphone, Laptop, Tablet, Globe,
  ChevronDown, UploadCloud, Download, Plus, Search, X
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getAllUrls, getAllLogs } from '../api/api';
import BulkUploadModal from '../components/dashboard/BulkUploadModal';

const History = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);
  
  const [filterType, setFilterType] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: urlsData, isLoading: loadingUrls } = useQuery({
    queryKey: ['urls'],
    queryFn: getAllUrls,
  });

  const { data: logsData, isLoading: loadingLogs } = useQuery({
    queryKey: ['logs'],
    queryFn: getAllLogs,
  });

  const isLoading = loadingUrls || loadingLogs;

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

  const timelineEvents = useMemo(() => {
    if (isLoading) return [];
    
    const events = [];
    
    // 1. Add URL creations
    if (urlsData?.urls) {
      urlsData.urls.forEach(url => {
        // Creation Event
        events.push({
          id: `create-${url._id}`,
          type: 'create',
          shortCode: url.shortCode,
          timestamp: new Date(url.createdAt),
          label: 'Created link',
          details: url.originalUrl
        });
      });
    }

    // 2. Add Mixed Logs (Clicks & Updates) from backend
    if (logsData?.logs) {
      logsData.logs.forEach((log, index) => {
        events.push({
          id: `${log.eventType}-${index}`,
          type: log.eventType || 'click',
          shortCode: log.shortCode,
          timestamp: new Date(log.visitedAt),
          label: log.eventType === 'update' ? 'Link Updated' : 'Link clicked',
          details: log.description || `${log.browser || log.deviceType || 'Device'} on ${log.os || 'Unknown OS'}`,
          // Map real analytics keys for clicks
          browser: log.browser,
          os: log.os,
          deviceType: log.deviceType,
          country: log.country,
          ip: log.ipAddress
        });
      });
    }

    // 3. Global Chronological Sort (descending)
    return events.sort((a, b) => b.timestamp - a.timestamp);
  }, [urlsData, logsData, isLoading]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return timelineEvents;
    return timelineEvents.filter(e => e.type === filterType);
  }, [timelineEvents, filterType]);

  const filterOptions = [
    { value: 'all', label: 'All Activities', icon: Activity },
    { value: 'create', label: 'Link Creations', icon: PlusCircle },
    { value: 'click', label: 'Recent Clicks', icon: MousePointerClick },
    { value: 'update', label: 'Link Updates', icon: Edit3 },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Section with Action Cluster */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h1>
          <p className={`text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Timeline of all link creations, updates and clicks</p>
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

      {/* Filter Row */}
      <div className="flex justify-end">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border font-bold text-sm transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
          >
            <Filter size={16} className="text-indigo-500" />
            <span>{filterOptions.find(o => o.value === filterType)?.label}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFilterOpen && (
            <div className={`absolute right-0 mt-2 w-56 rounded-xl border z-50 shadow-2xl overflow-hidden p-1.5 transition-all duration-200 origin-top-right ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFilterType(opt.value);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${filterType === opt.value ? 'bg-indigo-600 text-white' : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                  <opt.icon size={16} />
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`p-8 md:p-12 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-500/5' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <Clock size={40} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No activity recorded</h3>
            <p className={`text-sm font-medium max-w-xs mx-auto ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Start by creating a new link and sharing it with your audience.</p>
          </div>
        ) : (
          <div className="relative border-l-4 ml-4 md:ml-8 space-y-10 pb-4" style={{ borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
            {filteredEvents.map((event, idx) => {
              // --- Dynamic Icon & Color Mapping ---
              let Icon = MousePointerClick;
              let iconBg = 'bg-emerald-500';
              let cardBg = isDark ? 'bg-slate-800/40' : 'bg-slate-50/50';
              let accentColor = 'text-emerald-400';

              if (event.type === 'create') {
                Icon = PlusCircle;
                iconBg = 'bg-indigo-600';
                accentColor = 'text-indigo-400';
              } else if (event.type === 'update') {
                Icon = Edit3;
                iconBg = 'bg-amber-500';
                accentColor = 'text-amber-400';
              } else if (event.type === 'click') {
                const device = event.deviceType?.toLowerCase() || '';
                if (device.includes('mobile')) Icon = Smartphone;
                else if (device.includes('tablet')) Icon = Tablet;
                else if (device.includes('laptop')) Icon = Laptop;
                else Icon = Monitor;
              }

              return (
                <div key={event.id} className="relative pl-10 md:pl-14">
                  {/* Timeline Node Icon */}
                  <div className={`absolute -left-[22px] top-0 w-10 h-10 rounded-2xl flex items-center justify-center border-4 transition-transform duration-300 hover:scale-110 ${isDark ? 'border-slate-900' : 'border-white'} ${iconBg} text-white shadow-lg shadow-black/10`}>
                    <Icon size={18} />
                  </div>

                  <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${isDark ? 'border-slate-700/50 hover:border-slate-600' : 'border-slate-100 hover:border-slate-200'} ${cardBg}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {event.type === 'update' ? 'Link Updated' : event.label}
                        </span>
                        <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-widest uppercase ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                          /{event.shortCode}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs font-bold tracking-tight px-3 py-1.5 rounded-lg ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-400 border border-slate-100'}`}>
                        <Clock size={14} />
                        {format(event.timestamp, 'MMM dd, yyyy • HH:mm')}
                      </div>
                    </div>

                    <div className={`flex items-start gap-4 p-4 rounded-xl ${isDark ? 'bg-slate-900/50' : 'bg-white shadow-sm'}`}>
                      <div className={`mt-1 flex-shrink-0 ${accentColor}`}>
                        {event.type === 'click' ? (
                          <div className="flex flex-col items-center gap-2">
                            <Icon size={16} />
                            {event.country && (
                              <div className="flex items-center gap-1 text-[10px] font-bold uppercase opacity-80">
                                <Globe size={10} /> {event.country}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Activity size={14} />
                        )}
                      </div>
                      
                      <div className="space-y-1 overflow-hidden">
                        <p className={`text-sm font-medium leading-relaxed break-all ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {event.details}
                        </p>
                        {event.ip && (
                          <p className="text-[10px] font-mono font-bold text-slate-500 tracking-tighter">
                            NODE_IP: {event.ip}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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

export default History;