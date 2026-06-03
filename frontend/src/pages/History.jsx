import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, PlusCircle, MousePointerClick, Filter, Activity, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { getAllUrls, getAllLogs } from '../api/api';

const History = () => {
  const { isDark } = useTheme();
  
  const [filterType, setFilterType] = useState('all');

  const { data: urlsData, isLoading: loadingUrls } = useQuery({
    queryKey: ['urls'],
    queryFn: getAllUrls,
  });

  const { data: logsData, isLoading: loadingLogs } = useQuery({
    queryKey: ['logs'],
    queryFn: getAllLogs,
  });

  useEffect(() => {
    if (urlsData) {
      console.log("API Response Data (URLs):", urlsData);
    }
    if (logsData) {
      console.log("API Response Data (Logs):", logsData);
    }
  }, [urlsData, logsData]);

  const isLoading = loadingUrls || loadingLogs;

  const timelineEvents = useMemo(() => {
    if (isLoading) return [];
    
    const events = [];
    
    // Add URL creations
    if (urlsData?.urls) {
      urlsData.urls.forEach(url => {
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

    // Add Clicks
    if (logsData?.logs) {
      logsData.logs.forEach((log, index) => {
        events.push({
          id: `click-${index}`,
          type: 'click',
          shortCode: log.shortCode,
          timestamp: new Date(log.visitedAt),
          label: 'Link clicked',
          details: `${log.deviceType || 'Unknown Device'} from ${log.country || 'Unknown Location'}`
        });
      });
    }

    // Sort descending by timestamp
    return events.sort((a, b) => b.timestamp - a.timestamp);
  }, [urlsData, logsData, isLoading]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return timelineEvents;
    return timelineEvents.filter(e => e.type === filterType);
  }, [timelineEvents, filterType]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Activity History</h1>
          <p className={`text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Timeline of all link creations and clicks</p>
        </div>
        
        <div className={`flex items-center gap-3 p-2 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className={`p-2 rounded-xl ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400'}`}>
            <Filter size={18} />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`bg-transparent outline-none text-sm font-bold pr-4 cursor-pointer ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
          >
            <option value="all">All Activities</option>
            <option value="create">Link Creations</option>
            <option value="click">Recent Clicks</option>
          </select>
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
            {filteredEvents.map((event, idx) => (
              <div key={event.id} className="relative pl-10 md:pl-14">
                {/* Timeline Node Icon */}
                <div className={`absolute -left-[22px] top-0 w-10 h-10 rounded-2xl flex items-center justify-center border-4 transition-transform duration-300 hover:scale-110 ${isDark ? 'border-slate-900' : 'border-white'} ${event.type === 'create' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'}`}>
                  {event.type === 'create' ? <PlusCircle size={18} /> : <MousePointerClick size={18} />}
                </div>

                <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.label}</span>
                      <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-widest uppercase ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        /{event.shortCode}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-bold tracking-tight px-3 py-1.5 rounded-lg ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-400 border border-slate-100'}`}>
                      <Clock size={14} />
                      {format(event.timestamp, 'MMM dd, yyyy • HH:mm')}
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-slate-900/50' : 'bg-white shadow-sm'}`}>
                    <div className={`mt-1 flex-shrink-0 ${event.type === 'create' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                      {event.type === 'create' ? <LinkIcon size={14} /> : <Activity size={14} />}
                    </div>
                    <p className={`text-sm font-medium leading-relaxed break-all ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {event.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;