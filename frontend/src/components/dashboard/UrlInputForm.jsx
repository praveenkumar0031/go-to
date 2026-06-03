import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link, Check, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

/**
 * UrlInputForm Component
 * Premium URL shortener input form with:
 * - Prominent input field
 * - Loading state animation
 * - Success/error notifications
 * - Copy-to-clipboard functionality
 */
const UrlInputForm = ({ onSubmit = () => {}, loading = false }) => {
  const { isDark } = useTheme();
  const [urlInput, setUrlInput] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(urlInput);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    await onSubmit({
      originalUrl: urlInput,
      customCode: customCode.trim() || undefined,
    });

    setUrlInput('');
    setCustomCode('');
    setShowCustom(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-8 border transition-all duration-300 ${
        isDark
          ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-500/5'
          : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
      }`}
    >
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-2 tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Shorten Your URL
        </h2>
        <p className={`text-sm font-medium ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Create a sleek, shareable link in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label className={`block text-sm font-bold tracking-wide uppercase px-1 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Long URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className={`flex-1 relative rounded-2xl border transition-all duration-200 group ${
              isDark
                ? 'bg-slate-800 border-slate-700 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10'
                : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10'
            }`}>
              <Link size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-500'
              }`} />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className={`w-full pl-12 pr-4 py-4 bg-transparent border-0 outline-none text-sm font-medium ${
                  isDark ? 'text-white placeholder-slate-600' : 'text-slate-900 placeholder-slate-400'
                }`}
                disabled={loading}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                'Shorten Now'
              )}
            </motion.button>
          </div>
        </div>

        {/* Custom Code Section */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            className={`flex items-center gap-2 text-sm font-bold transition-colors duration-200 px-1 ${
              isDark
                ? 'text-indigo-400 hover:text-indigo-300'
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            {showCustom ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <Check size={14} />
                </div>
                Using custom code
              </span>
            ) : '+ Add custom short code'}
          </button>

          {showCustom && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <label className={`block text-sm font-bold tracking-wide uppercase px-1 ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Custom Alias
              </label>
              <div className="max-w-xs relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>/</span>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  placeholder="MY-LINK"
                  maxLength="12"
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border transition-all duration-200 text-sm font-bold tracking-wider ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                  } outline-none`}
                  disabled={loading}
                />
              </div>
              <p className={`text-xs font-medium px-1 ${
                isDark ? 'text-slate-600' : 'text-slate-500'
              }`}>
                Optional: Leave empty for an auto-generated ID.
              </p>
            </motion.div>
          )}
        </div>
      </form>

      {/* Info Tip */}
      <div className={`mt-8 p-4 rounded-2xl border flex items-start gap-3 ${
        isDark
          ? 'bg-indigo-500/5 border-indigo-500/10'
          : 'bg-indigo-50 border-indigo-100'
      }`}>
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
          <Activity size={16} />
        </div>
        <p className={`text-xs font-semibold leading-relaxed ${
          isDark
            ? 'text-indigo-300'
            : 'text-indigo-800'
        }`}>
          Pro Tip: Use descriptive aliases for your marketing campaigns to improve click-through rates.
        </p>
      </div>
    </motion.div>
  );
};

export default UrlInputForm;
