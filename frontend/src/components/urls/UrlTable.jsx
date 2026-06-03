import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Copy, Trash2, ExternalLink, Edit2, ChevronDown, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

/**
 * UrlTable Component
 * Displays a responsive table of shortened URLs with actions
 * Features:
 * - Copy to clipboard
 * - Delete URL
 * - Edit alias
 * - Open in new tab
 * - Empty state handling
 */
const UrlTable = ({
  urls = [],
  onDelete = () => {},
  onEdit = () => {},
  loading = false,
}) => {
  const { isDark } = useTheme();
  const [expandedUrl, setExpandedUrl] = useState(null);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-2xl overflow-hidden border transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className={`p-8 text-center ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Loading URLs...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!urls || urls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden border transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className={`p-12 text-center ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isDark
              ? 'bg-slate-700'
              : 'bg-slate-100'
          }`}>
            <ExternalLink size={24} className={isDark ? 'text-slate-400' : 'text-slate-400'} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            No URLs yet
          </h3>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Create your first shortened URL using the form above to get started
          </p>
        </div>
      </motion.div>
    );
  }

  const copyUrl = (shortCode) => {
    const fullUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`rounded-3xl overflow-hidden border transition-all duration-300 ${
        isDark
          ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-500/5'
          : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
      }`}
    >
      {/* Table Header Section */}
      <div className={`p-8 border-b transition-colors duration-300 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Your Links
            </h2>
            <p className={`text-sm font-medium mt-1 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Manage and monitor all your active short links.
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-2xl font-black text-indigo-500">{urls.length}</span>
            <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-indigo-400/60' : 'text-indigo-600/60'}`}>Total Links</span>
          </div>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`transition-colors duration-300 ${
              isDark ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
              <th className={`text-left p-5 text-xs font-bold uppercase tracking-widest ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Destination & Short Link
              </th>
              <th className={`text-left p-5 text-xs font-bold uppercase tracking-widest ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Performance
              </th>
              <th className={`text-left p-5 text-xs font-bold uppercase tracking-widest ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Created
              </th>
              <th className={`text-right p-5 text-xs font-bold uppercase tracking-widest ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {urls.map((url, idx) => (
                <motion.tr
                  key={url._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`group transition-all duration-200 ${
                    isDark ? 'hover:bg-slate-800/40' : 'hover:bg-indigo-50/30'
                  }`}
                >
                  {/* Destination & Link Column */}
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5 max-w-md">
                      <div className={`text-sm font-bold truncate ${
                        isDark ? 'text-slate-200' : 'text-slate-900'
                      }`} title={url.originalUrl}>
                        {url.originalUrl}
                      </div>
                      <a
                        href={`${window.location.origin}/${url.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-600 font-bold text-sm w-fit transition-colors"
                      >
                        <span className="font-mono">/{url.shortCode}</span>
                        <ExternalLink size={12} className="opacity-50" />
                      </a>
                    </div>
                  </td>

                  {/* Performance Column */}
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        <MousePointerClick size={14} />
                      </div>
                      <span className={`text-sm font-black ${
                        isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}>
                        {url.totalClicks || 0}
                      </span>
                    </div>
                  </td>

                  {/* Date Column */}
                  <td className="p-5">
                    <span className={`text-xs font-bold ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                      {new Date(url.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyUrl(url.shortCode)}
                        className={`p-2.5 rounded-xl transition-colors ${
                          isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'
                        }`}
                        title="Copy Link"
                      >
                        <Copy size={16} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(url)}
                        className={`p-2.5 rounded-xl transition-colors ${
                          isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600'
                        }`}
                        title="Edit Alias"
                      >
                        <Edit2 size={16} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.1)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(url._id)}
                        className={`p-2.5 rounded-xl transition-colors ${
                          isDark ? 'text-slate-400 hover:text-rose-400' : 'text-slate-500 hover:text-rose-600'
                        }`}
                        title="Delete Link"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UrlTable;