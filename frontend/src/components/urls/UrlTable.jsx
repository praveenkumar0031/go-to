import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Copy, Trash2, ExternalLink, Edit2, ChevronDown } from 'lucide-react';
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
      className={`rounded-2xl overflow-hidden border transition-colors duration-300 ${
        isDark
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Header */}
      <div className={`p-6 border-b transition-colors duration-300 ${
        isDark
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Your Links
            </h2>
            <p className={`text-sm mt-1 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Manage all {urls.length} shortened URL{urls.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className={`text-right`}>
            <p className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent`}>
              {urls.length}
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Total Links
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800/50'
              : 'bg-slate-50'
          }`}>
            <tr>
              <th className={`text-left p-4 text-sm font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Original URL
              </th>
              <th className={`text-left p-4 text-sm font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Short Code
              </th>
              <th className={`text-left p-4 text-sm font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Clicks
              </th>
              <th className={`text-left p-4 text-sm font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Created
              </th>
              <th className={`text-right p-4 text-sm font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {urls.map((url, idx) => (
                <motion.tr
                  key={url._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-t transition-colors duration-200 ${
                    isDark
                      ? 'border-slate-800 hover:bg-slate-800/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {/* Original URL */}
                  <td className="p-4">
                    <div className={`max-w-xs truncate text-sm ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {url.originalUrl}
                    </div>
                  </td>

                  {/* Short Code */}
                  <td className="p-4">
                    <a
                      href={`${window.location.origin}/${url.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      <code className="text-sm font-mono">{url.shortCode}</code>
                      <ExternalLink size={14} className="opacity-60" />
                    </a>
                  </td>

                  {/* Clicks */}
                  <td className="p-4">
                    <span className={`text-sm font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {url.totalClicks || 0}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="p-4">
                    <span className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {new Date(url.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyUrl(url.shortCode)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isDark
                            ? 'hover:bg-slate-700 text-slate-400 hover:text-indigo-400'
                            : 'hover:bg-slate-100 text-slate-600 hover:text-indigo-600'
                        }`}
                        title="Copy link"
                      >
                        <Copy size={16} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(url)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isDark
                            ? 'hover:bg-slate-700 text-slate-400 hover:text-blue-400'
                            : 'hover:bg-slate-100 text-slate-600 hover:text-blue-600'
                        }`}
                        title="Edit alias"
                      >
                        <Edit2 size={16} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(url._id)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isDark
                            ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400'
                            : 'hover:bg-slate-100 text-slate-600 hover:text-red-600'
                        }`}
                        title="Delete link"
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