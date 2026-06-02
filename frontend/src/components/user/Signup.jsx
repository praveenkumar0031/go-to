import React, { useState } from 'react';
import { MdOutlineVisibility, MdOutlineVisibilityOff, MdAlternateEmail, MdLockOutline, MdPersonOutline } from 'react-icons/md';
import { signupapi } from '../../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';

const Signup = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signupapi(formData);
      if (res) {
        toast.success('Account created successfully! 🎉');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (isDark) => ({
    container: `flex items-center border rounded-lg transition-all duration-200 ${
      isDark
        ? 'bg-slate-800 border-slate-700 focus-within:border-indigo-500'
        : 'bg-white border-slate-300 focus-within:border-indigo-500'
    }`,
    icon: `ml-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`,
    input: `flex-1 px-4 py-3 bg-transparent border-0 outline-none text-sm ${
      isDark
        ? 'text-white placeholder-slate-500'
        : 'text-slate-900 placeholder-slate-400'
    }`,
  });

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Goto to start shortening and tracking your links"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Username
          </label>
          <div className={inputClasses(isDark).container}>
            <MdPersonOutline className={`${inputClasses(isDark).icon} text-lg`} />
            <input
              id="username"
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              className={inputClasses(isDark).input}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Email Address
          </label>
          <div className={inputClasses(isDark).container}>
            <MdAlternateEmail className={`${inputClasses(isDark).icon} text-lg`} />
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClasses(isDark).input}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Password
          </label>
          <div className={inputClasses(isDark).container}>
            <MdLockOutline className={`${inputClasses(isDark).icon} text-lg`} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClasses(isDark).input}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`mr-3 transition-colors duration-200 ${
                isDark
                  ? 'text-slate-500 hover:text-slate-400'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {showPassword ? (
                <MdOutlineVisibilityOff size={20} />
              ) : (
                <MdOutlineVisibility size={20} />
              )}
            </button>
          </div>
        </div>

        <div className={`text-xs space-y-1 p-3 rounded-lg ${
          isDark
            ? 'bg-slate-800/50 text-slate-400'
            : 'bg-slate-100 text-slate-600'
        }`}>
          <p className="font-semibold">Password requirements:</p>
          <ul className="space-y-0.5 ml-4">
            <li>• At least 8 characters</li>
            <li>• Mix of uppercase and lowercase</li>
          </ul>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            'Create Account'
          )}
        </motion.button>
      </form>

      <p className={`text-center text-xs mt-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
        By signing up, you agree to our{' '}
        <button className={`font-medium transition-colors duration-200 ${
          isDark
            ? 'text-indigo-400 hover:text-indigo-300'
            : 'text-indigo-600 hover:text-indigo-700'
        }`}>
          Terms of Service
        </button>
        {' '}and{' '}
        <button className={`font-medium transition-colors duration-200 ${
          isDark
            ? 'text-indigo-400 hover:text-indigo-300'
            : 'text-indigo-600 hover:text-indigo-700'
        }`}>
          Privacy Policy
        </button>
      </p>

      <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Already have an account?{' '}
        <Link
          to="/login"
          className={`font-semibold transition-colors duration-200 ${
            isDark
              ? 'text-indigo-400 hover:text-indigo-300'
              : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;