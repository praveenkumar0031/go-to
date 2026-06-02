import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link2, Shield, Calendar, QrCode, Copy, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { createShortUrl } from '../api/api';

const CreateUrl = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(null);
  const [customAlias, setCustomAlias] = useState('');
  
  // Success state
  const [createdUrl, setCreatedUrl] = useState(null);
  const [qrCodeData, setQrCodeData] = useState('');
  const [copied, setCopied] = useState(false);

  // Simple URL validation
  useEffect(() => {
    if (!url) {
      setIsValidUrl(null);
      return;
    }
    try {
      new URL(url);
      setIsValidUrl(true);
    } catch {
      setIsValidUrl(false);
    }
  }, [url]);

  const createMutation = useMutation({
    mutationFn: createShortUrl,
    onSuccess: async (data) => {
      setCreatedUrl(data);
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      toast.success('Short URL created!');
      
      // Generate QR Code
      try {
        const fullUrl = `${import.meta.env.VITE_REDIRECT_API || 'http://localhost:8000/goto'}/${data.shortCode}`;
        const qr = await QRCode.toDataURL(fullUrl, {
          width: 250,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        setQrCodeData(qr);
      } catch (err) {
        console.error('QR Gen error', err);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create URL');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidUrl) return toast.error('Please enter a valid URL');
    
    createMutation.mutate({
      originalUrl: url,
      customAlias: customAlias || undefined,
    });
  };

  const handleCopy = () => {
    if (!createdUrl) return;
    const fullUrl = `${import.meta.env.VITE_REDIRECT_API || 'http://localhost:8000/goto'}/${createdUrl.shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdUrl) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            URL Shortened Successfully!
          </h2>
          
          <div className={`mt-8 p-6 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-left flex-1 break-all">
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your Short URL</p>
              <a 
                href={`${import.meta.env.VITE_REDIRECT_API || 'http://localhost:8000/goto'}/${createdUrl.shortCode}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {`${import.meta.env.VITE_REDIRECT_API || 'http://localhost:8000/goto'}/${createdUrl.shortCode}`}
              </a>
              <p className={`text-xs mt-2 truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Redirects to: {createdUrl.originalUrl}
              </p>
            </div>
            
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${copied ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          {qrCodeData && (
            <div className="mt-8 flex flex-col items-center">
              <p className={`text-sm mb-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Scan QR Code</p>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 inline-block">
                <img src={qrCodeData} alt="QR Code" className="w-48 h-48" />
              </div>
              <a 
                href={qrCodeData} 
                download={`qrcode-${createdUrl.shortCode}.png`}
                className={`mt-4 text-sm font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
              >
                Download PNG
              </a>
            </div>
          )}

          <div className="mt-10 flex items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`px-6 py-2 rounded-lg font-medium border transition-colors ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => {
                setCreatedUrl(null);
                setUrl('');
                setCustomAlias('');
                setQrCodeData('');
              }}
              className="px-6 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Shorten Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create Short Link</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Enter your long URL to generate a trackable short link.</p>
      </div>

      <form onSubmit={handleSubmit} className={`p-6 rounded-xl border shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="space-y-6">
          {/* Long URL */}
          <div>
            <label htmlFor="originalUrl" className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              <Link2 size={16} /> Destination URL
            </label>
            <div className="relative">
              <input
                id="originalUrl"
                name="originalUrl"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/path"
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors pr-10 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                    : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                } ${isValidUrl === false ? 'border-red-500 focus:border-red-500' : ''}`}
                required
              />
              {url && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValidUrl ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
                </div>
              )}
            </div>
            {isValidUrl === false && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid URL including http:// or https://</p>
            )}
          </div>

          {/* Custom Alias */}
          <div>
            <label htmlFor="customAlias" className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              <Shield size={16} /> Custom Alias (Optional)
            </label>
            <div className={`flex items-center rounded-lg border overflow-hidden ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}>
              <span className={`px-4 py-3 text-sm font-mono border-r ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                goto.com/
              </span>
              <input
                id="customAlias"
                name="customAlias"
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-campaign"
                className={`w-full px-4 py-3 outline-none text-sm bg-transparent ${isDark ? 'text-white' : 'text-slate-900'}`}
                pattern="[a-zA-Z0-9-]+"
                title="Only letters, numbers, and hyphens are allowed"
              />
            </div>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Leave blank to automatically generate a random short code.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValidUrl || createMutation.isPending}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              {createMutation.isPending ? 'Shortening...' : 'Shorten URL'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUrl;