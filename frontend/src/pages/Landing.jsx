import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

import {
  ArrowRight,
  Link2,
  BarChart3,
  ShieldCheck,
  Globe,
  Sparkles,
  Zap,
  QrCode,
  MousePointerClick,
  Users,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

import GotoLogo from '../components/common/GotoLogo';

const Landing = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const features = [
    {
      icon: Link2,
      title: 'Smart URL Shortening',
      desc: 'Generate clean, memorable links instantly with custom aliases.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      desc: 'Track clicks, devices, browsers, countries, and traffic trends.',
    },
    {
      icon: QrCode,
      title: 'QR Code Generation',
      desc: 'Create downloadable QR codes automatically for every short link.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Reliable',
      desc: 'Built with modern infrastructure for fast and secure redirects.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      desc: 'Monitor visitors from around the world in real-time.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      desc: 'Optimized redirects and blazing fast dashboard experience.',
    },
  ];

  const stats = [
    { icon: MousePointerClick, value: '10M+', label: 'Tracked Clicks' },
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: TrendingUp, value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div
      className={`relative overflow-hidden min-h-screen ${
        isDark
          ? 'bg-slate-950 text-white'
          : 'bg-white text-slate-900'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div
          className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${
            isDark
              ? 'bg-indigo-600'
              : 'bg-indigo-300'
          }`}
        />

        <div
          className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${
            isDark
              ? 'bg-cyan-600'
              : 'bg-cyan-300'
          }`}
        />

        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      {/* Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <GotoLogo size="xl" />

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              isDark
                ? 'bg-slate-900 border border-slate-800 hover:bg-slate-800'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Login
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg shadow-indigo-500/20"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Sparkles size={16} className="text-indigo-500" />
              Smart Link Management Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
              Short Links.
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Bigger Reach.
              </span>
            </h1>

            <p
              className={`mt-8 text-xl leading-relaxed max-w-xl ${
                isDark
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              Create branded short URLs, monitor analytics,
              generate QR codes, and track engagement in real-time —
              all from one beautifully designed dashboard.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold shadow-2xl shadow-indigo-500/30 flex items-center gap-3"
              >
                Start Free
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </motion.button>

              <div
                className={`flex items-center gap-2 text-sm ${
                  isDark
                    ? 'text-slate-500'
                    : 'text-slate-500'
                }`}
              >
                <CheckCircle2 size={16} className="text-emerald-500" />
                No credit card required
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon
                      size={18}
                      className="text-indigo-500"
                    />
                    <span
                      className={`text-3xl font-black ${
                        isDark
                          ? 'text-white'
                          : 'text-slate-900'
                      }`}
                    >
                      {stat.value}
                    </span>
                  </div>

                  <p
                    className={`text-sm ${
                      isDark
                        ? 'text-slate-500'
                        : 'text-slate-500'
                    }`}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div
              className={`rounded-3xl border backdrop-blur-xl overflow-hidden shadow-2xl ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-white/80 border-slate-200'
              }`}
            >
              {/* Fake Topbar */}
              <div
                className={`px-6 py-4 border-b flex items-center justify-between ${
                  isDark
                    ? 'border-slate-800'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>

                <div
                  className={`text-xs font-medium ${
                    isDark
                      ? 'text-slate-500'
                      : 'text-slate-400'
                  }`}
                >
                  goto analytics dashboard
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'Total Clicks',
                    'Visitors',
                    'QR Scans',
                    'Conversion',
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl ${
                        isDark
                          ? 'bg-slate-800'
                          : 'bg-slate-100'
                      }`}
                    >
                      <p
                        className={`text-xs mb-2 ${
                          isDark
                            ? 'text-slate-500'
                            : 'text-slate-500'
                        }`}
                      >
                        {item}
                      </p>

                      <div className="h-7 w-24 rounded bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-90" />
                    </div>
                  ))}
                </div>

                {/* Fake Chart */}
                <div
                  className={`p-6 rounded-2xl ${
                    isDark
                      ? 'bg-slate-800'
                      : 'bg-slate-100'
                  }`}
                >
                  <div className="flex items-end gap-3 h-44">
                    {[40, 90, 60, 120, 80, 150, 100].map(
                      (h, idx) => (
                        <div
                          key={idx}
                          className="flex-1 rounded-t-xl bg-gradient-to-t from-indigo-500 to-cyan-400"
                          style={{ height: `${h}px` }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="space-y-3">
                  {[1, 2, 3].map((row) => (
                    <div
                      key={row}
                      className={`p-4 rounded-xl flex items-center justify-between ${
                        isDark
                          ? 'bg-slate-800'
                          : 'bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20" />

                        <div className="space-y-2">
                          <div className="w-32 h-3 rounded bg-slate-400/40" />
                          <div className="w-20 h-2 rounded bg-slate-400/20" />
                        </div>
                      </div>

                      <div className="w-16 h-8 rounded-lg bg-emerald-500/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 hidden lg:block">
              <div
                className={`p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-white/90 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <TrendingUp size={24} />
                  </div>

                  <div>
                    <p
                      className={`text-xs ${
                        isDark
                          ? 'text-slate-500'
                          : 'text-slate-500'
                      }`}
                    >
                      Engagement Growth
                    </p>

                    <h4 className="text-2xl font-black text-emerald-500">
                      +248%
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black">
            Everything You Need
          </h2>

          <p
            className={`mt-4 text-lg ${
              isDark
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            Powerful tools to manage and optimize your links.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className={`p-8 rounded-3xl border transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center text-indigo-500 mb-6">
                <feature.icon size={26} />
              </div>

              <h3 className="text-xl font-bold mb-3">
                {feature.title}
              </h3>

              <p
                className={`leading-relaxed ${
                  isDark
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <div
          className={`rounded-[2rem] p-12 text-center border relative overflow-hidden ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-blue-500/10" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Start shortening smarter today.
            </h2>

            <p
              className={`mt-5 text-lg max-w-2xl mx-auto ${
                isDark
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              Join thousands of creators, marketers, and businesses
              using Goto to manage and track links effortlessly.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="mt-10 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xl shadow-indigo-500/30 inline-flex items-center gap-3"
            >
              Continue to Login
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;