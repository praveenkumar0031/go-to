import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Link2,
  Shield,
  Copy,
  CheckCircle,
  XCircle,
  CalendarDays,
} from 'lucide-react';

import QRCode from 'qrcode';
import toast from 'react-hot-toast';

import { useTheme } from '../context/ThemeContext';
import { createShortUrl } from '../api/api';

const CreateUrl = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();

  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const [isValidUrl, setIsValidUrl] = useState(null);

  const [createdUrl, setCreatedUrl] = useState(null);
  const [qrCodeData, setQrCodeData] = useState('');
  const [copied, setCopied] = useState(false);

  // URL Validation
  useEffect(() => {
    if (!url.trim()) {
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

  // Generate Full URL
  const getShortUrl = (code) => {
    const base =
      import.meta.env.VITE_REDIRECT_API ||
      'http://localhost:8000/goto';

    return `${base}/${code}`;
  };

  // Mutation
  const createMutation = useMutation({
    mutationFn: createShortUrl,

    onSuccess: async (data) => {
      if (!data?.shortCode) {
        toast.error('Invalid response from server');
        return;
      }

      setCreatedUrl(data);

      queryClient.invalidateQueries({
        queryKey: ['urls'],
      });

      toast.success('Short URL created successfully');

      try {
        const shortUrl = getShortUrl(data.shortCode);

        const qr = await QRCode.toDataURL(shortUrl, {
          width: 250,
          margin: 2,
        });

        setQrCodeData(qr);
      } catch (err) {
        console.error(err);
      }
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          'Failed to create short URL'
      );
    },
  });

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    const payload = {
      originalUrl: url,
    };

    if (customAlias) payload.customAlias = customAlias;
    if (expiresAt) payload.expiresAt = expiresAt;

    createMutation.mutate(payload);
  };

  // Copy
  const handleCopy = async () => {
    if (!createdUrl?.shortCode) return;

    try {
      await navigator.clipboard.writeText(
        getShortUrl(createdUrl.shortCode)
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  // SUCCESS SCREEN
  if (createdUrl) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div
          className={`rounded-3xl border p-8 text-center shadow-xl ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>

          <h2
            className={`text-3xl font-black mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            URL Created Successfully
          </h2>

          <p
            className={`mb-8 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Your shortened link is ready to share.
          </p>

          <div
            className={`rounded-2xl border p-6 flex flex-col md:flex-row gap-6 items-center justify-between ${
              isDark
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex-1 text-left break-all">
              <p
                className={`text-sm mb-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Short URL
              </p>

              <a
                href={getShortUrl(createdUrl.shortCode)}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 text-xl font-bold hover:underline"
              >
                {getShortUrl(createdUrl.shortCode)}
              </a>

              <p
                className={`text-xs mt-3 truncate ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Redirects to: {createdUrl.originalUrl}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className={`px-5 py-3 rounded-xl text-white font-medium flex items-center gap-2 transition-all ${
                copied
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {copied ? (
                <CheckCircle size={18} />
              ) : (
                <Copy size={18} />
              )}

              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {qrCodeData && (
            <div className="mt-10 flex flex-col items-center">
              <p
                className={`mb-4 text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                QR Code
              </p>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <img
                  src={qrCodeData}
                  alt="QR Code"
                  className="w-52 h-52"
                />
              </div>

              <a
                href={qrCodeData}
                download={`qr-${createdUrl.shortCode}.png`}
                className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Download QR Code
              </a>
            </div>
          )}

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-6 py-2.5 rounded-xl border font-medium transition-colors ${
                isDark
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                setCreatedUrl(null);
                setUrl('');
                setCustomAlias('');
                setExpiresAt('');
                setQrCodeData('');
              }}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FORM
  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="mb-8">
        <h1
          className={`text-3xl font-black ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Create Short URL
        </h1>

        <p
          className={`mt-2 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Transform long links into beautiful and trackable short URLs.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`rounded-3xl border p-6 shadow-xl ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="space-y-7">
          {/* URL */}
          <div>
            <label
              className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              <Link2 size={16} />
              Destination URL
            </label>

            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className={`w-full px-4 py-3 rounded-xl border pr-10 outline-none transition-all duration-200 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                } ${
                  isValidUrl === false
                    ? 'border-red-500 focus:border-red-500'
                    : ''
                }`}
              />

              {url && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValidUrl ? (
                    <CheckCircle
                      size={18}
                      className="text-green-500"
                    />
                  ) : (
                    <XCircle
                      size={18}
                      className="text-red-500"
                    />
                  )}
                </div>
              )}
            </div>

            {isValidUrl === false && (
              <p className="text-red-500 text-xs mt-2">
                Please enter a valid URL including https://
              </p>
            )}
          </div>

          {/* Alias */}
          <div>
            <label
              className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              <Shield size={16} />
              Custom Alias
            </label>

            <div
              className={`flex rounded-xl border overflow-hidden ${
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-300'
              }`}
            >
              <span
                className={`px-4 py-3 border-r text-sm font-mono ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                goto/
              </span>

              <input
                type="text"
                value={customAlias}
                onChange={(e) =>
                  setCustomAlias(e.target.value)
                }
                placeholder="my-link"
                pattern="[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*"
                title="Only letters, numbers, and hyphens allowed"
                className={`flex-1 px-4 py-3 bg-transparent outline-none ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label
              className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              <CalendarDays size={16} />
              Expiry Date (Optional)
            </label>

            <div>
  <input
    type="datetime-local"
    value={expiresAt}
    min={new Date().toISOString().slice(0, 16)}
    onChange={(e) => setExpiresAt(e.target.value)}
    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 ${
      isDark
        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
    }`}
  />
</div>

            <p
              className={`text-xs mt-2 ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}
            >
              The short URL will expire automatically.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="pt-5  border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${
                isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !isValidUrl || createMutation.isPending
              }
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all"
            >
              {createMutation.isPending
                ? 'Creating...'
                : 'Shorten URL'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUrl;