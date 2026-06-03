import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Ghost,
  Search,
  AlertTriangle,
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-[85vh] flex items-center justify-center px-6 relative overflow-hidden ${
        isDark
          ? 'bg-slate-950 text-white'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Floating Background Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />

      <div
        className={`relative z-10 max-w-2xl w-full rounded-3xl border backdrop-blur-xl p-10 text-center shadow-2xl ${
          isDark
            ? 'bg-slate-900/70 border-slate-800'
            : 'bg-white/80 border-slate-200'
        }`}
      >
        {/* Funny Icon */}
        <div className="relative inline-flex mb-6">
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-30 rounded-full" />

          <div
            className={`relative w-28 h-28 rounded-full flex items-center justify-center border ${
              isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <Ghost
              size={58}
              className="text-indigo-500 animate-bounce"
            />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent leading-none">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-6 text-3xl md:text-4xl font-bold">
          This page went on vacation 🏖️
        </h2>

        {/* Funny Message */}
        <p
          className={`mt-5 text-lg leading-relaxed max-w-xl mx-auto ${
            isDark
              ? 'text-slate-400'
              : 'text-slate-600'
          }`}
        >
          We searched everywhere...
          under the server,
          behind the router,
          even inside the coffee machine ☕
          — but this page is officially missing.
        </p>

        {/* Funny Status Box */}
        <div
          className={`mt-8 rounded-2xl border px-5 py-4 flex items-center gap-3 justify-center ${
            isDark
              ? 'bg-slate-800/70 border-slate-700 text-slate-300'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <AlertTriangle
            size={20}
            className="text-yellow-500"
          />

          <span className="font-medium">
            Error Code: PAGE_NOT_COOKING 🍳
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/30 flex items-center gap-2"
          >
            <Home size={18} />
            Take Me Home
          </button>

          <button
            onClick={() => window.history.back()}
            className={`px-7 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            <Search size={18} />
            Keep Exploring
          </button>
        </div>

        {/* Footer Joke */}
        <p
          className={`mt-10 text-sm italic ${
            isDark
              ? 'text-slate-500'
              : 'text-slate-500'
          }`}
        >
          Meanwhile the backend says:
          “Works perfectly on my machine.” 😎
        </p>
      </div>
    </div>
  );
};

export default NotFound;