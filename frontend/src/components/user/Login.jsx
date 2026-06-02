import React, { useState, useEffect } from 'react';
import { MdOutlineVisibility, MdOutlineVisibilityOff, MdAlternateEmail, MdLockOutline } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';
import { loginapi, verifyGoogleCode, getUserApi } from '../../api/api';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (code) => {
    setLoading(true);
    try {
      const data = await verifyGoogleCode(code);
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('email', data.user.email);
        }
        
        try {
          const userData = await getUserApi();
          login(data.token, userData);
          toast.success('Login successful!');
          navigate('/dashboard', { replace: true });
        } catch (err) {
          toast.error('Failed to load user data');
          localStorage.removeItem('token');
          window.hasProcessed = false;
        }
      }
    } catch (err) {
      toast.error('Google authentication failed');
      window.hasProcessed = false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code && !window.hasProcessed) {
      window.hasProcessed = true;
      handleGoogleLogin(code);
      window.history.replaceState({}, document.title, '/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/login`,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginapi(credentials);
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', credentials.email);
        
        try {
          const userData = await getUserApi();
          login(res.token, userData);
          toast.success('Login successful!');
          navigate('/dashboard');
        } catch (err) {
          toast.error('Failed to load user data');
          localStorage.removeItem('token');
        }
      } else {
        toast.error(res.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
    <AuthLayout title="Sign In" subtitle="Enter your credentials to access your account">
      <form onSubmit={handleSubmit} className="space-y-4">
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
              value={credentials.email}
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
              value={credentials.password}
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

        <div className="flex justify-end">
          <Link
            to="/forget"
            className={`text-sm font-medium transition-colors duration-200 ${
              isDark
                ? 'text-indigo-400 hover:text-indigo-300'
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            Forgot password?
          </Link>
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
              <span>Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </motion.button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          OR
        </span>
        <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
      </div>

      <motion.button
        type="button"
        onClick={() => googleLogin()}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center gap-3 font-semibold ${
          isDark
            ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white'
            : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-900'
        } disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        <FcGoogle size={20} />
        <span>Continue with Google</span>
      </motion.button>

      <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Don't have an account?{' '}
        <Link
          to="/signup"
          className={`font-semibold transition-colors duration-200 ${
            isDark
              ? 'text-indigo-400 hover:text-indigo-300'
              : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;