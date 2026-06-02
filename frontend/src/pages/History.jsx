import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, PlusCircle, MousePointerClick, Filter } from 'lucide-react';
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Activity History</h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Timeline of all link creations and clicks</p>
        </div>
        
        <div className={`flex items-center gap-2 p-1 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <Filter size={16} className={`ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`bg-transparent outline-none text-sm px-2 py-1 ${isDark ? 'text-white' : 'text-slate-900'}`}
          >
            <option value="all">All Events</option>
            <option value="create">Creations</option>
            <option value="click">Clicks</option>
          </select>
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10">
            <Clock size={48} className={`mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
            <h3 className={`text-lg font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>No activity yet</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Create links and share them to see activity here.</p>
          </div>
        ) : (
          <div className="relative border-l-2 ml-4 md:ml-6 space-y-8 pb-4" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative pl-8 md:pl-10">
                {/* Timeline Icon */}
                <div className={`absolute -left-3.5 md:-left-4 top-1 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-4 ${isDark ? 'border-slate-900' : 'border-white'} ${event.type === 'create' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {event.type === 'create' ? <PlusCircle size={14} /> : <MousePointerClick size={14} />}
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.label}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${isDark ? 'bg-slate-700 text-indigo-400' : 'bg-slate-200 text-indigo-700'}`}>
                        {event.shortCode}
                      </span>
                    </div>
                    <div className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Clock size={12} />
                      {format(event.timestamp, 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                  <p className={`text-sm truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {event.details}
                  </p>
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