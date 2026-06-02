import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'lucide-react';
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
      className={`rounded-2xl p-8 border transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'
          : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'
      }`}
    >
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Shorten Your URL
        </h2>
        <p className={`text-sm ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Paste your long URL below to create a short, shareable link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Long URL
          </label>
          <div className="flex gap-3">
            <div className={`flex-1 relative rounded-lg border transition-colors duration-200 ${
              isDark
                ? 'bg-slate-800 border-slate-700 focus-within:border-indigo-500'
                : 'bg-white border-slate-300 focus-within:border-indigo-500'
            }`}>
              <Link size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`} />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className={`w-full pl-10 pr-4 py-3 bg-transparent border-0 outline-none text-sm ${
                  isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                }`}
                disabled={loading}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                'Shorten'
              )}
            </motion.button>
          </div>
        </div>

        {/* Custom Code Toggle */}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className={`text-sm font-medium transition-colors duration-200 ${
            isDark
              ? 'text-indigo-400 hover:text-indigo-300'
              : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          {showCustom ? '✓ Using custom code' : '+ Use custom short code'}
        </button>

        {/* Custom Code Input */}
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className={`block text-sm font-semibold mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Custom Short Code (Optional)
            </label>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              placeholder="E.g., MYCODE"
              maxLength="12"
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 text-sm ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              } outline-none focus:border-indigo-500`}
              disabled={loading}
            />
            <p className={`text-xs mt-1 ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}>
              Leave empty for auto-generated code
            </p>
          </motion.div>
        )}
      </form>

      {/* Info Box */}
      <div className={`mt-6 p-4 rounded-lg border ${
        isDark
          ? 'bg-slate-800/50 border-slate-700'
          : 'bg-blue-50 border-blue-200'
      }`}>
        <p className={`text-xs font-medium ${
          isDark
            ? 'text-blue-300'
            : 'text-blue-700'
        }`}>
          💡 Tip: Your shortened links will be ready to share instantly. Track clicks and analytics in real-time.
        </p>
      </div>
    </motion.div>
  );
};

export default UrlInputForm;
