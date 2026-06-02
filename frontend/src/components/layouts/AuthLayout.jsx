import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import GotoLogo from '../common/GotoLogo';

/**
 * AuthLayout Component
 * A minimalist, distraction-free layout for authentication pages (login/signup)
 * Features:
 * - Split-screen design with branding on left
 * - Centered form on right
 * - Dark/Light mode toggle in top-right
 * - Premium gradient background
 */
const AuthLayout = ({ children, title = 'Welcome Back', subtitle = 'Sign in to your account' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${
      isDark
        ? 'bg-slate-950'
        : 'bg-white'
    }`}>
      {/* Theme Toggle - Top Right */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-2.5 rounded-lg transition-all duration-200 ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-700 text-yellow-300'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="flex min-h-screen">
        {/* Left Section - Branding */}
        <div
          className={`hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 to-slate-950'
              : 'bg-gradient-to-br from-indigo-50 to-blue-50'
          }`}
        >
          {/* Decorative Background Elements */}
          <div
            className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-40 ${
              isDark
                ? 'bg-indigo-500/20'
                : 'bg-indigo-200/30'
            }`}
          />
          <div
            className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-40 ${
              isDark
                ? 'bg-blue-500/20'
                : 'bg-blue-200/30'
            }`}
          />

          {/* Branding Content */}
          <div className="relative z-10 text-center max-w-md">
            <div className="mb-8 flex justify-center">
              <div className={`p-4 rounded-2xl backdrop-blur-xl ${
                isDark
                  ? 'bg-slate-800/50 border border-slate-700/50'
                  : 'bg-white/50 border border-white/50'
              }`}>
                <GotoLogo size="lg" />
              </div>
            </div>

            <h1 className={`text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Premium URL<br />Shortening
            </h1>

            <p className={`text-lg mb-8 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Track, manage, and optimize your links with advanced analytics and seamless integration.
            </p>

            {/* Feature List */}
            <div className="space-y-4 text-left">
              {[
                { icon: '✓', text: 'Real-time Analytics' },
                { icon: '✓', text: 'Custom Short Codes' },
                { icon: '✓', text: 'Geographic Tracking' },
              ].map((feature) => (
                <div key={feature.text} className="flex items-center gap-3">
                  <span className={`font-bold text-lg ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>
                    {feature.icon}
                  </span>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className={`flex-1 flex items-center justify-center p-8 sm:p-12 ${
          isDark ? 'bg-slate-950' : 'bg-white'
        }`}>
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 flex items-center gap-2">
              <GotoLogo size="md" />
            </div>

            <div className="mb-8">
              <h2 className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {title}
              </h2>
              <p className={`mt-2 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {subtitle}
              </p>
            </div>

            {/* Form Content */}
            <div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
