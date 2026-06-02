import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import GotoLogo from '../components/common/GotoLogo';

/**
 * Landing Page Component
 * B2B SaaS-style hero section for Goto
 * - Value proposition
 * - Call-to-action button to Dashboard
 * - Professional design
 */
const Landing = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-16 ${
        isDark ? 'bg-slate-950' : 'bg-white'
      }`}
    >
      {/* Hero Content */}
      <div className="max-w-3xl text-center space-y-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <GotoLogo size="lg" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h1 className={`text-5xl md:text-6xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Shorten Your Links,{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
              Amplify Your Reach
            </span>
          </h1>
          <p className={`text-xl ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Create short, memorable links and track every click in real-time. Perfect for marketing, social media, and beyond.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
        >
          {[
            { title: 'Instant Links', desc: 'Create shortened URLs in seconds' },
            { title: 'Real-time Analytics', desc: 'Track clicks, devices, and locations' },
            { title: 'Custom Aliases', desc: 'Create memorable short codes' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-lg border transition-colors duration-300 ${
                isDark
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <h3 className={`font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {feature.title}
              </h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get Started
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
        >
          Free to use. No credit card required. Unlimited links.
        </motion.p>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-10 ${
          isDark ? 'bg-indigo-500' : 'bg-indigo-200'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10 ${
          isDark ? 'bg-blue-500' : 'bg-blue-200'
        }`} />
      </div>
    </motion.div>
  );
};

export default Landing;
